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
        $search_cond = [];
        if ($this->request->get('badge_id')) {
            $search_cond['badge_id'] = $this->request->get('badge_id');
        }
        if ($this->request->get('member_name')) {
            $search_cond['member_name'] = $this->request->get('member_name');
        }
        if ($this->request->get('type') == 'credit') {
            $search_cond['value'] = $this->request->get('value');
        } else if ($this->request->get('type') == 'assign') {
            $search_cond['value2'] = $this->request->get('value');
        }
        $members = Member::select('id', 'badge_id', 'member_name')->get();
        $plans = Plan::list($search_cond);
        $results = [];

        foreach ($members as $member) {
            $result = [
                'member_id' => $member->id,
                'badge_id' => $member->badge_id,
                'member_name' => $member->member_name,
            ];
            foreach ($plans as $plan) {
                if ($plan->member_id == $member->id) {
                    $result['plans'][] = [
                        'year' => $plan->year,
                        'month' => $plan->month,
                        'value' => $plan->value,
                        'value2' => $plan->value2,
                    ];
                }
            }
            $results[] = $result;
        }
        return response()->json([
            'success' => 'true',
            'message' => '',
            'total_items' => count($results),
            'items' => $results
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
        if ($this->request->isMethod('get')) {
            $plan_list = Plan::getPlan($badge_id);
            return response()->json([
                'success' => 'true',
                'message' => '',
                'total_items' => count($plan_list),
                'items' => $plan_list
            ]);
        }


        $plan = $this->request->get('plan');
        $year = $this->request->get('year');
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
            foreach ($plan[$year] as $month => $value) {
                // Insert plan and get Id
                $id = Plan::insertGetId([
                    'member_id' => $member_id,
                    'year' => $year,
                    'month' => $month,
                ]);
                if ($id) {
                    $plan_detail_ins = [];
                    foreach ($value as $week => $plan_detail) {
                        $plan_detail_ins[] = [
                            'plan_id' => $id,
                            'week'    => $week,
                            'value'   => $plan_detail['value'],
                            'value2'   => $plan_detail['value2'],
                        ];
                    }
                    PlanDetail::insert($plan_detail_ins);
                }
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
     * Delete planning item (include plan and plan detail) with member_id
     * @param  Integer $member_id
     * @return mixed
     */
    public function delete($member_id) {
        DB::beginTransaction();
        try {
            $del_detail = PlanDetail::deletePlanDetail($member_id);
            $del_plan = Plan::deletePlan($member_id);
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
