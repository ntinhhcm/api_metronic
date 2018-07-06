<?php

namespace App\Http\Middleware;

use Closure;
use Exception;
use App\User;
use App\Http\Controllers\Common\Utils;

class JWTAuthenticate
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @param  string|null  $guard
     * @return mixed
     */
    public function handle($request, Closure $next, $guard = null)
    {
        $token = $request->header('Authorization');

        if ( ! $token) {
            return response()->json([
                'success' => false,
                'error_code' => config('rptm.error.auth.token_invalid.code'),
                'message' => config('rptm.error.auth.token_invalid.message'),
            ], 400);
        }

        $check = Utils::JWTCheck($token);
        if ($check == config('rptm.error.auth.token_expired.code')) {
            return response()->json([
                'success' => false,
                'error_code' => config('rptm.error.auth.token_expired.code'),
                'message' => config('rptm.error.auth.token_expired.message'),
            ], 401);
        } else if ($check == config('rptm.error.auth.token_invalid.code')) {
            return response()->json([
                'success' => false,
                'error_code' => config('rptm.error.auth.token_invalid.code'),
                'message' => config('rptm.error.auth.token_invalid.message'),
            ], 401);
        }

        $user = User::where(['user_name' => $check, 'del_flg' => 0])->first();
        if (!$user) {
            return response()->json([
                'success' => false,
                'error_code' => config('rptm.error.auth.login_invalid.code'),
                'message' => config('rptm.error.auth.login_invalid.message'),
            ], 400);
        }

        $request->auth = $user;

        return $next($request);
    }
}
