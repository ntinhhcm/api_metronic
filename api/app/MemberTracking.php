<?php

namespace App;

use Illuminate\Auth\Authenticatable;
use Laravel\Lumen\Auth\Authorizable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Contracts\Auth\Authenticatable as AuthenticatableContract;
use Illuminate\Contracts\Auth\Access\Authorizable as AuthorizableContract;
use DB;

class MemberTracking extends Model implements AuthenticatableContract, AuthorizableContract
{
    use Authenticatable, Authorizable;

    protected $table = 'member_tracking';
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'member_total', 'member_come_total, member_leave_total'
    ];

    public function __contructor() {
    }

    public static function getTracking($cond, $type = 'month') {
        $year = $cond['year'];
        $month = $cond['month'];
        $c_year = $cond['c_year'];
        $c_month = $cond['c_month'];

        $query = DB::table('member_tracking');
        if ($type == 'week') {
            $query->where([
                ['month', '=', $month],
                ['year', '=', $year],
            ])->orWhere([
                ['month', '=', $c_month],
                ['year', '=', $c_year],
            ])->select(['year', 'month', 'week', 'member_total', 'assign_backup']);
        } else {
            $query->whereIn('year', [$year, $c_year])
                ->select(['year', 'month', DB::raw('avg(member_total) as member_total'), DB::raw('avg(assign_backup) as assign_backup')])
                ->groupBy('year', 'month');
        }
        return  $query->get();
    }
}
