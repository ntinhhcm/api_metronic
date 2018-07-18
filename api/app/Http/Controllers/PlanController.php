<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Exception;
use App\Plan;
use App\PlanDetail;
use App\Member;
use DB;

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
     * Get all planning list
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

        // Get member list
        $members = Member::getList($search_cond, $sort, $limit, $offset);

        $member_ids = [];
        foreach ($members as $member) {
            $member_ids[] = $member->id;
        }
        $search_cond['member_id'] = $member_ids;

        $search_cond['plan_year'] = Date('Y');
        if ( ! empty($this->request->get('plan_year'))) {
            $search_cond['plan_year'] = $this->request->get('plan_year');
        }

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

            for ($i = 1; $i <= 48; $i++) {
                $result['credit' . $i] = Plan::getStatusColor() . '_0_';
                $result['assign' . $i] = Plan::getStatusColor() . '_0_';
            }

            foreach ($plans as $key => $plan) {
                if ($plan->member_id == $member->id) {
                    $month = $plan->month;
                    $week = $plan->week;
                    $week_of_month = ($month - 1) * 4 + $week;
                    $result['credit' . $week_of_month] = Plan::getStatusColor($plan->value) . '_' . $plan->value . '_' . $plan->credit_project;
                    $result['assign' . $week_of_month] = Plan::getStatusColor($plan->value2) . '_' . $plan->value2 . '_' . $plan->assign_project;
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

        $plan = $this->request->get('plan');
        $member_id = $this->request->get('member_id');

        // Checking member exists
        $member = Member::where(['id' => $member_id, 'del_flg' => 0])->first();
        if ( ! $member) {
            return response()->json([
                'success' => false,
                'message' => '',
            ]);
        }

        // Delete all plan and plan detail before insert or update
        $this->delete($member_id);

        DB::beginTransaction();

        try {
            $month_check = [];
            if($plan) {
                foreach ($plan as $array) {
                    $month = $array['month'];
                    $weeks = $array['weeks'];

                     $id = Plan::insertGetId([
                        'member_id' => $member_id,
                        'year' => $plan_year,
                        'month' => $month,
                    ]);
                    if($id) {
                        $plan_detail_ins = [];
                        foreach ($weeks as $item) {
                            $plan_week = [];
                            $plan_week['plan_id'] = $id;
                            $plan_week['week'] = $item['week'];
                            $plan_week['value'] = 0;
                            $plan_week['value2'] = 0;
                            if (isset($item['assign'])) {
                                $plan_week['value2'] = $item['assign'];
                            }
                            if (isset($item['credit'])) {
                                $plan_week['value'] = $item['credit'];
                            }
                            $plan_week['assign_project'] = $item['assign_project'];
                            $plan_week['credit_project'] = $item['credit_project'];
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
            $member_id = $this->request->get('p_member_id');
            $year = $this->request->get('p_year');
            $month = $this->request->get('p_month');
            $week = $this->request->get('p_week');
            $project = $this->request->get('select_project');
            $type = $this->request->get('p_type');

            if ($type != 'credit' && $type != 'assign') {
                $type = 'credit';
            }

            if ((is_null($member_id) || empty($member_id))) {
                throw new Exception("Member id is empty!");
            }
            if ((is_null($project) || empty($project))) {
                throw new Exception("Project is empty!");
            }

            $plan_id = Plan::select('id')->where(['member_id' => $member_id, 'year' => $year, 'month' => $month])->get();
            $id = '';
            if ($plan_id->count() == 1) {
                $id = $plan_id[0]['id'];
            } else {
                throw new Exception("Cannot create plan for member " + $member_id);
            }

            $project_field = $type . '_project';
            $project_value = implode(',', $project);
            $update_status = PlanDetail::where('plan_id', '=', $id)->where('week', '=', $week)->update([$project_field => $project_value]);

            if ($update_status == 0) {
                throw new Exception("Add project fail");
            }
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

        // View by month and year
        if ( ! empty($this->request->get('month'))) {
            $cond['month'] = $this->request->get('month');
        }
        if ( ! empty($this->request->get('year'))) {
            $cond['year'] = $this->request->get('year');
        }

        // View by year
        if (empty($this->request->get('month')) && ! empty($this->request->get('year'))) {
            $type = 'month';
            $cond['month'] = '';
        }

        // Count available member
        $member_count = Member::where('available', '=', 1)->count();
        // Get assgin count
        $assigns = Plan::assignCount($cond, $type);
        $results = [];

        // Init results
        if ($type == 'week') {
            for ($i = 1; $i <= 4; $i++ ) {
                $results[$i] = ['week' => $i, 'assign' => 100];
            }
        } else {
            for ($i = 1; $i <= 12; $i++ ) {
                $results[$i] = ['month' => $i, 'assign' => 100];
            }
        }

        // Calculate backup
        if($assigns->count() > 0) {
            foreach ($assigns as $assign) {
                $result = [];
                if ($type == 'week') {
                    $backup = ($member_count - $assign->assign) * 100 / $member_count;
                    $results[$assign->week]['assign'] = round($backup, 2);
                } else {
                    $backup = ($member_count - $assign->assign / 4) * 100 / $member_count;
                    $results[$assign->month]['assign'] = round($backup, 2);
                }
            }
        }

        return response()->json([
            'success' => true,
            'message' => '',
            'type' => $type,
            'items' => array_values($results)
        ]);
    }
}
