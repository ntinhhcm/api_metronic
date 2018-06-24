<?php

/*
|--------------------------------------------------------------------------
| Model Factories
|--------------------------------------------------------------------------
|
| Here you may define all of your model factories. Model factories give
| you a convenient way to create models for testing and seeding your
| database. Just tell the factory how a default model should look.
|
*/

$factory->define(App\User::class, function (Faker\Generator $faker) {
    return [
        'user_name' => $faker->username,
        'user_email' => $faker->email,
        'role' => ['admin', 'user'][rand(0,1)]
    ];
});

$factory->define(App\Member::class, function (Faker\Generator $faker) {
    return [
        'badge_id' => rand(123400, 124000),
        'member_name' => $faker->name,
    ];
});

$factory->define(App\Plan::class, function (Faker\Generator $faker) {
    return [
        'member_id' => rand(1,30),
        'year' => 2018,
        'month' => $faker->month,
    ];
});

$factory->define(App\PlanDetail::class, function (Faker\Generator $faker) {
    return [
        'plan_id' => 27,
        'value' => rand(-1,2),
        'value2' => rand(-1,2),
        'week' => rand(1,4),
    ];
});