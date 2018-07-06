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
            $search_cond['badge_id'] = $this->request->get('badge_id');
        }
        if ($this->request->get('member_name') != null && $this->request->get('member_name') != '') {
            $search_cond['member_name'] = explode(',', $this->request->get('member_name'));
            array_walk($search_cond['member_name'], function(&$value) {
                $value = trim($value);
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
                $result['credit_c' . $i] = Plan::getStatusColor();
                $result['assign_c' . $i] = Plan::getStatusColor();
                $result['credit_' . $i] = 0;
                $result['assign_' . $i] = 0;
            }

            foreach ($plans as $key => $plan) {
                if ($plan->member_id == $member->id) {
                    $month = $plan->month;
                    $week = $plan->week;
                    $week_of_month = ($month - 1) * 4 + $week;
                    $result['credit_c' . $week_of_month] = Plan::getStatusColor($plan->value);
                    $result['assign_c' . $week_of_month] = Plan::getStatusColor($plan->value2);
                    $result['credit_' . $week_of_month] = $plan->value;
                    $result['assign_' . $week_of_month] = $plan->value2;
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
}
