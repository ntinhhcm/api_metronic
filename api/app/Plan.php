<?php

namespace App;

use Illuminate\Auth\Authenticatable;
use Laravel\Lumen\Auth\Authorizable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Contracts\Auth\Authenticatable as AuthenticatableContract;
use Illuminate\Contracts\Auth\Access\Authorizable as AuthorizableContract;
use DB;

class Plan extends Model implements AuthenticatableContract, AuthorizableContract
{
    use Authenticatable, Authorizable;

    protected $table = 'plan';
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'member_id',
        'year',
        'month',
    ];

    public function __contructor() {
    }

    /**
     * Get plan list with search conditon
     * @param  array  $search Contain badge_id, member_name, value, value2
     * @return array
     */
    public static function list($search = []) {
        $query = DB::table('plan')
                ->leftJoin('member', 'member.id', '=', 'plan.member_id')
                ->leftJoin('plan_detail', 'plan.id', '=', 'plan_detail.plan_id')
                ->select(['member.id as member_id', 'plan.id as plan_id', 'plan.year', 'plan.month', 'plan_detail.week', 'plan_detail.value', 'plan_detail.value2']);

        if (isset($search['badge_id'])) {
            $query->where('member.badge_id', '=', $search['badge_id']);
        }
        if (isset($search['member_name'])) {
            $query->where('member.member_name', 'like', '%' . $search['member_name'] . '%');
        }
        if (isset($search['value'])) {
            $cond = '=';
            if ($search['value'] > 0) {
                $cond = '>';
                $search['value'] = 0;
            }
            $query->where('plan_detail.value', $cond, $search['value']);
        }
        if (isset($search['value2'])) {
            $cond = '=';
            if ($search['value2'] > 0) {
                $cond = '>';
                $search['value2'] = 0;
            }
            $query->where('plan_detail.value', $cond, $search['value2']);
        }
        return $query->get();
    }

    /**
     * Get all plan of member from badge_id
     * @param  String $badge_id
     * @return array
     */
    public static function getPlan($member_id) {
        return DB::table('plan')
                ->leftJoin('member', 'member.id', '=', 'plan.member_id')
                ->leftJoin('plan_detail', 'plan.id', '=', 'plan_detail.plan_id')
                ->select(['member.badge_id',
                    'member.member_name',
                    'plan.id',
                    'plan.year',
                    'plan.month',
                    'plan_detail.id',
                    'plan_detail.week',
                    'plan_detail.value',
                    'plan_detail.value2',
                ])
                ->where('member.id', '=', $member_id)
                ->get();
    }

    public static function savePlan($plans) {

    }

    public static function deletePlan($member_id) {
        return DB::table('plan')
            ->leftJoin('member', 'member.id', '=', 'plan.member_id')
            ->where('member.id', '=', $member_id)
            ->delete();
    }
}
