<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Exception;
use App\Plan;
use App\PlanDetail;
use App\Member;
use App\MemberTracking;
use DB;
use App\Http\Controllers\Common\Utils;

class PlanController extends Controller
{
    private $request;

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct(Request $request)
    {
        $this->request = $request;
    }

    /**
     * Get all plans by year
     * @return mixed
     */
    public function list() {

        // Get condition to search
        $search_cond = [];
        if ($this->request->get('badge_id') != null && $this->request->get('badge_id') != '') {
            $search_cond['badge_id'] = explode(',', $this->request->get('badge_id'));
            array_walk($search_cond['badge_id'], function(&$value) {
                $value = trim($value);
            });
        }
        if ($this->request->get('project') != null && $this->request->get('project') != '') {
            $search_cond['project'] = explode(',', $this->request->get('project'));
            array_walk($search_cond['project'], function(&$value) {
                $value = trim($value);
            });
        }
        if ($this->request->get('member_email') != null && $this->request->get('member_email') != '') {
            $search_cond['member_email'] = explode(',', $this->request->get('member_email'));
            array_walk($search_cond['member_email'], function(&$value) {
                $value = trim($value);
                if (strpos($value, '@') == false) {
                    $value .= '@tma.com.vn';
                }
            });
        }

        // Pagination
        $limit = 30;
        if ( ! empty($this->request->get('pagination')['perpage'])) {
            $limit = $this->request->get('pagination')['perpage'];
        }
        $page = 1;
        if (! empty($this->request->get('pagination')['page'])) {
            $page = $this->request->get('pagination')['page'];
        }
        $offset = ($page - 1) * $limit;

        // Sort
        $sort['type'] = 'asc';
        if ( ! empty($this->request->get('sort')['sort'])) {
            $sort['type'] = $this->request->get('sort')['sort'];
        }
        $sort['field'] = 'badge_id';
        if ( ! empty($this->request->get('sort')['field'])) {
            $sort['field'] = $this->request->get('sort')['field'];
        }

        $search_cond['plan_year'] = Date('Y');
        if ( ! empty($this->request->get('plan_year'))) {
            $search_cond['plan_year'] = $this->request->get('plan_year');
        }

        // Get member list
        $members = Member::getList($search_cond, $sort, $limit, $offset);

        $member_ids = [];
        foreach ($members as $member) {
            $member_ids[] = $member->id;
        }
        $search_cond['member_id'] = $member_ids;

        $plans = Plan::list($search_cond);
        $results = [];

        $recordID = $offset;
        foreach ($members as $member) {
            $recordID++;
            $result = [
                'record_id' => $recordID,
                'member_id' => $member->id,
                'badge_id' => $member->badge_id,
                'member_name' => $member->member_name,
            ];

            // Init return value
            // Format reture value for credit and assign: [#color code][_][value|value2][_][project refer][_][plan detail id]
            for ($i = 1; $i <= 48; $i++) {
                $result['credit' . $i] = Plan::getStatusColor() . '_0__';
                $result['assign' . $i] = Plan::getStatusColor() . '_0__';
            }

            foreach ($plans as $key => $plan) {
                if ($plan->member_id == $member->id) {
                    $month = $plan->month;
                    $week = $plan->week;
                    $week_of_month = ($month - 1) * 4 + $week;
                    $result['credit' . $week_of_month] = Plan::getStatusColor($plan->value) . '_' . $plan->value . '_' . $plan->credit_project . '_' . $plan->plan_detail_id;
                    $result['assign' . $week_of_month] = Plan::getStatusColor($plan->value2) . '_' . $plan->value2 . '_' . $plan->assign_project . '_' . $plan->plan_detail_id;
                    unset($plans[$key]);
                }
            }
            $results[] = $result;
        }

        $total = count(Member::getList($search_cond));

        return response()->json([
            'meta' => [
                'page' => $page,
                'pages' => ceil($total / $limit),
                'perpage' => $limit,
                'total' => $total,
                'sort' => $sort['type'],
                'field' => $sort['field'],
                'year' => $search_cond['plan_year'],
            ],
            'data' => $results,
        ]);
    }

    /**
     * Edit plan of member (For GET and POST method)
     * @param GET String $member_id
     * @param POST plan[yyyy][m][plan_id][value, value2]
     *             member_id
     *             year
     * @return mixed
     */
    public function edit($member_id) {
        $year = $this->request->get('year');
        $plan_year = date("Y");
        if( ! empty($year) && is_numeric($year))
        {
            $plan_year = $year;
        }
        if ($this->request->isMethod('get')) {
            $plan_list = Plan::getPlan($member_id, $plan_year);
            return response()->json([
                'success' => 'true',
                'message' => '',
                'total_items' => count($plan_list),
                'items' => $plan_list
            ]);
        }

        $plans = $this->request->get('plans');
        $member_id = $this->request->get('member_id');

        // Checking member exists
        $member = Member::where(['id' => $member_id, 'del_flg' => 0])->first();
        if ( ! $member) {
            return response()->json([
                'success' => false,
                'message' => '',
            ]);
        }

        try {
            if($plans) {
                DB::transaction(function() use ($plans) {
                    foreach ($plans as $plan_detail) {
                        $id = $plan_detail['id'];
                        $assign = $plan_detail['assign'];
                        $credit = $plan_detail['credit'];
                        $assign_project = $plan_detail['assign_project'];
                        $credit_project = $plan_detail['credit_project'];

                        PlanDetail::where('id', '=', $id)
                            ->update([
                                'value' => $credit,
                                'value2' => $assign,
                                'assign_project' => $assign_project,
                                'credit_project' => $credit_project,
                            ]);
                    }
                });
                DB::commit();
            }
        } catch (Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ]);
        }
        return response()->json([
            'success' => true,
            'message' => '',
        ]);
    }

    /**
     * Delete planning item (include plan and plan detail) with member_id
     * @param  Integer $member_id
     * @return mixed
     */
    public function delete($member_id) {
        $member_id = $this->request->get('member_id');
        $year = $this->request->get('year');
        $plan_year = Date('Y');
        if ( ! empty($year) && is_numeric($year)) {
            $plan_year = $year;
        }
        DB::beginTransaction();
        try {
            $del_detail = PlanDetail::deletePlanDetail($member_id, $plan_year);
            $del_plan = Plan::deletePlan($member_id, $plan_year);
            if ( ! $del_detail || ! $del_plan) {
                throw new Exception('Cannot delete!');
            }
        } catch (Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => '',
            ]);
        }
        DB::commit();
        return response()->json([
            'success' => true,
            'message' => '',
        ]);
    }

    /**
     * Export excel file
     * @return file
     */
    public function export() {
        echo $this->request->get('id');
    }

    public function update() {
        if($this->request->isMethod('get')) {
            $project_list = Plan::getProject();
            return response()->json([
                'success' => true,
                'message' => '',
                'total_items' =>count($project_list),
                'items' => $project_list,
            ]);
        }

        DB::beginTransaction();
        try {
            $plan_detail_id = $this->request->get('plan_detail_id');
            $project = $this->request->get('select_project');
            $type = $this->request->get('p_type');

            if ((is_null($plan_detail_id) || empty($plan_detail_id))) {
                throw new Exception("Member id is empty!");
            }
            if ((is_null($project) || empty($project))) {
                throw new Exception("Project is empty!");
            }

            $project_field = 'credit_project';
            if ($type == 'assign') {
                $project_field = 'assign_project';
            }

            $plan_detail = PlanDetail::find($plan_detail_id);
            $plan_detail->$project_field = implode(',', $project);
            $plan_detail->save();

        } catch (Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ]);
        }
        DB::commit();
        return response()->json([
            'success' => true,
            'message' => '',
        ]);
    }

    /**
     * Calculating the number of backup member in month or year - unit is week
     * @return mix
     */
    public function assignCount() {
        $type = 'week';
        $cond = [];
        // Init year and month if empty
        $cond['year'] = Date('Y');
        $cond['month'] = Date('n');
        $cond['c_year'] = Date('Y');
        $cond['c_month'] = Date('n');

        // View by month and year
        if ( ! empty($this->request->get('month'))) {
            $cond['month'] = $this->request->get('month');
        }
        if ( ! empty($this->request->get('year'))) {
            $cond['year'] = $this->request->get('year');
        }
        if ( ! empty($this->request->get('c_month'))) {
            $cond['c_month'] = $this->request->get('c_month');
        }
        if ( ! empty($this->request->get('c_year'))) {
            $cond['c_year'] = $this->request->get('c_year');
        }

        // View by year
        if (empty($this->request->get('month')) && ! empty($this->request->get('year'))) {
            $type = 'month';
            $cond['month'] = '';
            $cond['c_month'] = '';
        }

        // Count available member
        $member_counts = MemberTracking::getTracking($cond, $type);

        // Init results
        if ($type == 'week') {
            for ($i = 1; $i <= 4; $i++ ) {
                $results[$i] = ['week' => $i, 'quantity1' => 0, 'quantity2' => 0, 'backup1' => 0, 'backup2' => 0];
            }
        } else {
            for ($i = 1; $i <= 12; $i++ ) {
                $results[$i] = ['month' => $i, 'quantity1' => 0, 'quantity2' => 0, 'backup1' => 0, 'backup2' => 0];
            }
        }

        $max_quantity = 0;
        $max_backup = 0;
        if ($type == 'week') {
            foreach ($member_counts as $member_count) {
                if ($member_count->member_total > $max_quantity) {
                    $max_quantity = $member_count->member_total;
                }
                if ($member_count->assign_backup > $max_backup) {
                    $max_backup = $member_count->assign_backup;
                }
                if ($member_count->year == $cond['year'] && $member_count->month == $cond['month']) {
                    $results[$member_count->week]['quantity1'] = $member_count->member_total;
                    $results[$member_count->week]['backup1'] = $member_count->assign_backup;
                } else {
                    $results[$member_count->week]['quantity2'] = $member_count->member_total;
                    $results[$member_count->week]['backup2'] = $member_count->assign_backup;
                }
            }
        } else {
            foreach ($member_counts as $member_count) {
                if ($member_count->member_total > $max_quantity) {
                    $max_quantity = $member_count->member_total;
                }
                if ($member_count->assign_backup > $max_backup) {
                    $max_backup = $member_count->assign_backup;
                }
                if ($member_count->year == $cond['year']) {
                    $results[$member_count->month]['quantity1'] = $member_count->member_total;
                    $results[$member_count->month]['backup1'] = $member_count->assign_backup; 
                } else {
                    $results[$member_count->month]['quantity2'] = $member_count->member_total;
                    $results[$member_count->month]['backup2'] = $member_count->assign_backup;
                }
            }
        }

        return response()->json([
            'success' => true,
            'message' => '',
            'type' => $type,
            'max_quantity' => $max_quantity,
            'max_backup' => $max_backup,
            'year' => $cond['year'],
            'c_year' => $cond['c_year'],
            'items' => array_values($results)
        ]);
    }

    /**
     * Generate plans for all members
     * (Execute 1 time for 1 years or Excute when update plan for new member just joined)
     * 
     * @return mix
     */
    public function generatePlanForAll() {
        $year = $this->request->get('year');
        if ($year == null || $year == '') {
            $year = Date('Y');
        }
        $members = Member::select(['id', 'created_at'])->where('del_flg', '=', 0)
            ->whereNotIn('id', function($_query) use ($year) {
                $_query->select(['member_id'])->from(with(new Plan)->getTable())->where('year', '=', $year);
            })->get();

        DB::beginTransaction();
        try {
            foreach($members as $member) {
                $join_month = $member->created_at->month;
                $join_week = Utils::calculateWeek($member->created_at->day);

                for ($month = 1; $month <= 12; $month++) {
                    $id = Plan::insertGetId([
                        'member_id' => $member->id,
                        'year' => $year,
                        'month' => $month
                    ]);
                    if($id) {
                        $plan_detail_ins = [];
                        for ($week = 1; $week <= 4; $week++) {
                            $assign = -1;
                            if ($month > $join_month || ($month == $join_month && $week >= $join_week)) {
                                $assign = 0;
                            }
                            $plan_week = [
                                'plan_id' => $id,
                                'week' => $week,
                                'value' => 0,
                                'value2' => $assign
                            ];
                            array_push($plan_detail_ins, $plan_week);
                        }
                        PlanDetail::insert($plan_detail_ins);
                    }
                }
            }
        } catch (Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Can not generate plan!'
            ]);
        }
        DB::commit();
        return response()->json([
            'success' => true,
            'message' => ''
        ]);
    }

    public function calculateAssignBackup() {
        $result = false;
        $type = $this->request->get('type');
        $year = Date('Y');
        $month = Date('m');
        $week = Utils::calculateWeek(Date('d'));
        if ($type == 'week') {
            $result = MemberTracking::setTracking($year, $month, $week);
        } else if($type == 'month') {
            $result = MemberTracking::setTracking($year, $month);
        } else {
            $result = MemberTracking::setTracking($year);
        }
        if ($result) {
            return response()->json([
                'success' => true,
                'message' => ''
            ]);
        } else {
            return response()->json([
                'success' => false,
                'message' => 'Can not calculate and insert to database'
            ]);
        }
    }
}
