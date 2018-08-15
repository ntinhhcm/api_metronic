<?php

namespace App;

use Illuminate\Auth\Authenticatable;
use Laravel\Lumen\Auth\Authorizable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Contracts\Auth\Authenticatable as AuthenticatableContract;
use Illuminate\Contracts\Auth\Access\Authorizable as AuthorizableContract;
use DB;
use App\Http\Controllers\Common\Utils;

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

    public static function setTracking($year, $month = 0, $week = 0) {
        try {
            $cals = Member::calMemberTotalWithAssign($year, $month, $week);
            $insertList = [];
            if ($week) {
                SELF::where('year', '=', $year)
                ->where('month', '=', $month)
                ->where('week', '=', $week)
                ->delete();

                $member_total = $cals[0]->member_total;
                $assigns = $cals[0]->assigns;
                $assign_backup = Utils::calculateBackup($member_total, $assigns);

                $insertList = [
                    'year' => $year,
				    'month' => $month,
				    'week' => $week,
				    'member_total' => $member_total,
				    'assign_backup' => $assign_backup,
                ];
            } else if ($month) {
                SELF::where('year', '=', $year)
                ->where('month', '=', $month)
                ->delete();

                foreach ($cals as $cal) {
                    $member_total = $cal->member_total;
                    $assigns = $cal->assigns;
                    $assign_backup = Utils::calculateBackup($member_total, $assigns);
                    array_push($insertList, [
                        'year' => $year,
                        'month' => $month,
                        'week' => $cal->week,
                        'member_total' => $member_total,
				        'assign_backup' => $assign_backup,
                    ]);
                }
            } else {
                SELF::where('year', '=', $year)
                ->delete();

                foreach ($cals as $cal) {
                    $member_total = $cal->member_total;
                    $assigns = $cal->assigns;
                    $assign_backup = Utils::calculateBackup($member_total, $assigns);
                    array_push($insertList, [
                        'year' => $year,
                        'month' => $cal->month,
                        'week' => $cal->week,
                        'member_total' => $member_total,
				        'assign_backup' => $assign_backup,
                    ]);
                }
            }
            SELF::insert($insertList);
            return true;
        } catch(Exception $e) {
            return false;
        }
    }
}
