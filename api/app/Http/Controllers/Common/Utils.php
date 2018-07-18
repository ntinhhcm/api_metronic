<?php
namespace App\Http\Controllers\Common;

use Firebase\JWT\JWT;
use Firebase\JWT\ExpiredException;
use Firebase\JWT\InvalidArgumentException;

Class Utils {

	public function __construct() {
	}

	public static function JWTCheck($token) {
        try {
            $credenticals = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        } catch (ExpiredException $e) {
            list($header, $payload, $signature) = explode(".", $token);
            $expired_info = json_decode(base64_decode($payload));

            return config('rptm.error.auth.token_expired.code');
        } catch (InvalidArgumentException $e) {
            return config('rptm.error.auth.token_expired.code');
        } catch (Exception $e) {
        	return config('rptm.error.auth.token_invalid.code');
        }
        return $credenticals->aud;
	}
}