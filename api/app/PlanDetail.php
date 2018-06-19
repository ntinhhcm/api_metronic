<?php

namespace App;

use Illuminate\Auth\Authenticatable;
use Laravel\Lumen\Auth\Authorizable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Contracts\Auth\Authenticatable as AuthenticatableContract;
use Illuminate\Contracts\Auth\Access\Authorizable as AuthorizableContract;
use DB;

class PlanDetail extends Model implements AuthenticatableContract, AuthorizableContract
{
    use Authenticatable, Authorizable;

    protected $table = 'plan_detail';
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'plan_id', 'value', 'value2', 'week', 'note_project'
    ];

    public function __contructor() {
    }

    public static function deletePlanDetail($member_id) {
        return DB::table('plan_detail')
            ->leftJoin('plan', 'plan.id', '=', 'plan_detail.plan_id')
            ->where('plan.member_id', '=', $member_id)
            ->delete();
    }
}
