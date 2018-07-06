<?php

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        //$this->call('UserTableSeeder');
        //$this->call('MemberTableSeeder');
        //$this->call('PlanTableSeeder');
        $this->call('PlanDetailTableSeeder');
    }
}

class UserTableSeeder extends Seeder
{
    public function run()
    {
        factory(App\User::class, 10)->create();
    }
}

class MemberTableSeeder extends Seeder
{
    public function run()
    {
        factory(App\Member::class, 30)->create();
    }
}

class PlanTableSeeder extends Seeder
{
    public function run()
    {
        factory(App\Plan::class, 600)->create();
    }
}

class PlanDetailTableSeeder extends Seeder
{
    public function run()
    {
        factory(App\PlanDetail::class, 4)->create();
    }
}