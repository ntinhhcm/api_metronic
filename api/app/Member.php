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
        $query = DB::table('member')->select(['member.id', 'badge_id', 'member_name']);

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
}
