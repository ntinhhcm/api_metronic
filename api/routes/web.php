<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It is a breeze. Simply tell Lumen the URIs it should respond to
| and give it the Closure to call when that URI is requested.
|
*/

$router->get('/', function () use ($router) {
    return $router->app->version();
});

$router->post('/api/login', ['uses' => 'AuthController@login']);

$router->group(['prefix' => '/api/v1', 'middleware' => 'jwt.auth'], function() use ($router) {
	$router->get('/plan', ['uses' => 'PlanController@list']);
	$router->get('/plan/{member_id}', ['uses' => 'PlanController@edit']);
	$router->post('/plan/{member_id}', ['uses' => 'PlanController@edit']);
	$router->post('/plan/{member_id}/delete', ['uses' => 'PlanController@delete']);
    $router->get('/plan/export', ['uses' => 'PlanController@export']);
});