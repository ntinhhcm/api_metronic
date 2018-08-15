<?php

namespace App;

use Illuminate\Auth\Authenticatable;
use Laravel\Lumen\Auth\Authorizable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Contracts\Auth\Authenticatable as AuthenticatableContract;
use Illuminate\Contracts\Auth\Access\Authorizable as AuthorizableContract;
use DB;

class Member extends Model implements AuthenticatableContract, AuthorizableContract
{
    use Authenticatable, Authorizable;

    protected $table = 'member';
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'badge_id', 'member_name'
    ];

    public function __contructor() {
    }

    public static function getList($condition = [], $order = [], $limit = -1, $offset = -1) {
        $query = DB::table('member')
        ->join('plan', 'member.id', '=', 'plan.member_id')
        ->select(['member.id', 'badge_id', 'member_name'])
        ->groupBy('member.id');

        if (isset($condition['project'])) {
            $query->join('project_member', 'project_member.member_id', '=', 'member.id')
                ->join('project', 'project.id', '=', 'project_member.project_id')
                ->whereIn('project_name', $condition['project']);
        }

        if (isset($condition['badge_id'])) {
            $query->whereIn('badge_id', $condition['badge_id']);
        }

        if (isset($condition['member_email'])) {
            $query->whereIn('member_email', $condition['member_email']);
        }

        $query->where('plan.year', '=', $condition['plan_year']);

        if (isset($order['field']) && isset($order['type'])) {
            $query->orderBy($order['field'], $order['type']);
        }

        if ($limit != -1) {
            $query->limit($limit);
        }

        if ($offset != -1) {
            $query->offset($offset);
        }

        return $query->get();
    }

    public static function calMemberTotalWithAssign($year, $month = 0, $week = 0) {
        $query = SELF::join('plan', 'member.id', '=', 'plan.member_id')
            ->join('plan_detail', 'plan.id', '=', 'plan_detail.plan_id')
            ->where('plan_detail.value2', '>=', '0');
        if ($year && $month & $week) {
            $query->where('plan.year', '=', $year);
            $query->where('plan.month', '=', $month);
            $query->where('plan_detail.week', '=', $week);
            $query->select([DB::raw('count(member.id) as member_total'), DB::raw('sum(value2) as assigns')]);
        } else if ($year && $month) {
            $query->where('plan.year', '=', $year);
            $query->where('plan.month', '=', $month);
            $query->select([DB::raw('count(member.id) as member_total'), DB::raw('sum(value2) as assigns'), 'week']);
            $query->groupBy('week');
        } else {
            $query->where('plan.year', '=', $year);
            $query->select([DB::raw('count(member.id) as member_total'), DB::raw('sum(value2) as assigns'), 'month', 'week']);
            $query->groupBy('month', 'week');
        }
        return $query->get();
    }
}
