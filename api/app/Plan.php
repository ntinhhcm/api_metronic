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

    public $timestamps = false;

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
                ->leftJoin('plan_detail', 'plan.id', '=', 'plan_detail.plan_id')
                ->select(['plan.member_id as member_id', 'plan.id as plan_id', 'plan.year', 'plan.month', 'plan_detail.week', 'plan_detail.value', 'plan_detail.value2']);

        if (isset($search['value'])) {
            $cond = '=';
            if ($search['value'] > 0) {
                $cond = '>';
                $search['value'] = 0;
            } else if ($search['value'] < 0) {
                $cond = '<';
                $search['value'] = 0;
            }
            $query->where('plan_detail.value', $cond, $search['value']);
        }

        $year = date('Y');
        if (isset($search['plan_year'])) {
            $year =$search['plan_year'];
        }
        $query->where('plan.year', '=', $year);

        if (isset($search['member_id'])) {
            $query->whereIn('plan.member_id', $search['member_id']);
        }
        return $query->get();
    }

    /**
     * Get all plan of member from badge_id
     * @param  String $badge_id
     * @return array
     */
    public static function getPlan($member_id, $year) {
        return DB::table('plan')
                ->leftJoin('member', 'member.id', '=', 'plan.member_id')
                ->leftJoin('plan_detail', 'plan.id', '=', 'plan_detail.plan_id')
                ->select([
                    'member.id as member_id',
                    'member.badge_id',
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
                ->where('plan.year', '=', $year)
                ->get();
    }

    public static function savePlan($plans) {

    }

    public static function deletePlan($member_id, $year) {
        return DB::table('plan')
            ->leftJoin('member', 'member.id', '=', 'plan.member_id')
            ->where('member.id', '=', $member_id)
            ->where('plan.year', '=', $year)
            ->delete();
    }

    public static function getStatusColor($value = 0) {
        if ($value < 0) {
            return '#8e8e8e';
        } else if ($value == 0) {
            return '#ff0000';

        } else if ($value > 0) {
            return '#4eff04';
        }
    }
}
