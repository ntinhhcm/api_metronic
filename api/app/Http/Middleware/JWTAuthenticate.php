<?php

namespace App\Http\Middleware;

use Closure;
use Exception;
use App\User;
use Firebase\JWT\JWT;
use Firebase\JWT\ExpiredException;

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

        try {
            $credenticals = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        } catch (ExpiredException $e) {
            list($header, $payload, $signature) = explode(".", $token);
            $expired_info = json_decode(base64_decode($payload));

            return response()->json([
                'success' => false,
                'error_code' => config('rptm.error.auth.token_expired.code'),
                'message' => config('rptm.error.auth.token_expired.message'),
            ], 400);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'error_code' => config('rptm.error.auth.token_invalid.code'),
                'message' => config('rptm.error.auth.token_invalid.message'),
            ], 400);
        }

        $user = User::where(['user_name' => $credenticals->aud, 'del_flg' => 0])->first();
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
