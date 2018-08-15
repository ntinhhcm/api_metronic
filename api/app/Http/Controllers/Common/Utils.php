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
            $secret_key = env('JWT_SECRET');
            if ( ! $secret_key) {
                return "Error";
            }
            $credenticals = JWT::decode($token, $secret_key, ['HS256']);
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

    public static function calculateWeek($day) {
		$week = 1;
		if (in_array($day, range(8, 14))) {
			$week = 2;
		} else if (in_array($day, range(15, 21))) {
			$week = 3;
		} else if ($day > 21) {
			$week = 4;
        }
        return $week;
    }

    public static function calculateBackup($member_total, $assigns) {
        if ($member_total == 0) {
            return 0;
        }
        return ($member_total - $assigns) * 100 / $member_total;
    }
}