<?php

namespace App\Http\Controllers;

use Validator;
use Exception;
use App\User;
use Firebase\JWT\JWT;
use Illuminate\Http\Request;
use Firebase\JWT\ExpiredException;
use Illuminate\Support\Facades\Hash;
use App\Http\Controllers\Common\Utils;

class AuthController extends Controller
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
     * Generate token string
     * 
     * @param  App\User $user
     * @return string
     */
    protected function jwt(User $user) {
        $token = [
            "iss" => "",
            "aud" => $user->user_name,
            "iat" => time(),
            "exp" => time() + 60 * 60 * 3
        ];

        return JWT::encode($token, env('JWT_SECRET'));
    }

    /**
     * Authenicate user login
     *
     * @param  User   $user
     * @return mixed
     */
    protected function authenticate(User $user) {
        return response()->json([
            'success' => true,
            'error_code' => 0,
            'message' => '',
            'user' => [
                'id' => $user->id,
                'username' => $user->user_name,
                'email' => $user->user_email,
                'token' => $this->jwt($user),
            ]
        ], 200);
    }

    public function login() {
         try {
            $validate = Validator::make($this->request->all(), [
                'username'    => 'required',
                'password' => 'required'
            ]);

            if ($validate->fails()) {
                throw new Exception('Validation fail!');
            }

            $username = $this->request->input('username');
            $password = $this->request->input('password');

            // Login to server TMA
            $ldap = ldap_connect(config('rptm.tma_login.host'));
            // When login fail
            if (!ldap_bind($ldap, 'uid=' . $username . ',' . config('rptm.tma_login.dn'), $password)) {
                throw new Exception('Login fail!');
            }
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'error_code' => config('rptm.error.auth.login_invalid.code'),
                'message' => config('rptm.error.auth.login_invalid.message'),
            ], 400);
        }

        $user = User::where(['user_name' => $username, 'del_flg' => 0])->first();

        if (!$user) {
            return response()->json([
                'success' => false,
                'error_code' => config('rptm.error.auth.login_invalid.code'),
                'message' => config('rptm.error.auth.login_invalid.message'),
            ], 400);
        }

        return $this->authenticate($user);
    }

    public function verify() {
        $token = $this->request->header('Authorization');
        $check = Utils::JWTCheck($token);
        if ($check == 0) {
            return response()->json([
                'success' => true,
                'error_code' => 0,
                'message' => '',
            ], 200);
        }
        if ($check == config('rptm.error.auth.token_expired.code')) {
            return response()->json([
                'success' => false,
                'error_code' => config('rptm.error.auth.token_expired.code'),
                'message' => config('rptm.error.auth.token_expired.message'),
            ], 401);
        }
        if ($check == config('rptm.error.auth.token_invalid.code')) {
            return response()->json([
                'success' => false,
                'error_code' => config('rptm.error.auth.token_invalid.code'),
                'message' => config('rptm.error.auth.token_invalid.message'),
            ], 401);
        }
    }
}