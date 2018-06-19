<?php

return [
    'tma_login' => [
        'host'          => 'ldap://192.168.1.234',
        'dn'            => 'ou=users,dc=tma,dc=com,dc=vn'
    ],

    'error' => [
        'auth' => [
            'token_invalid' => [
                'message' => 'Invalid token!',
                'code' => 1
            ],
            'login_invalid' => [
                'message' => 'Username or Password is incorrect!',
                'code' => 2
            ],
            'path_invalid' => [
                'message' => 'Invalid path',
                'code' => 3
            ],
            'token_expired' => [
                'message' => 'Token has expired!',
                'code' => 4
            ],
        ]
    ]
];