<?php
 
namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Member;
use App\MemberTracking;
use App\Plan;
 
class MemberCountTrackingCommand extends Command {
	protected $signature = 'member:count_tracking {date=0}';

	protected $description = 'Counting member every weeks';

	public function __construct() {
		parent::__construct();
	}

	public function handle() {
		$current_day = Date('d');
		$current_month = Date('n');
		$current_year = Date('Y');

		$check_date = date_parse($this->argument('date'));
		if ($check_date['error_count'] == 0 && $check_date['warning_count'] == 0) {
			$current_day = $check_date['day'];
			$current_month = $check_date['month'];
			$current_year = $check_date['year'];
		}

		$current_week = 1;
		if (in_array($current_day, range(8, 14))) {
			$current_week = 2;
		} else if (in_array($current_day, range(15, 21))) {
			$current_week = 3;
		} else if ($current_day > 21) {
			$current_week = 4;
		}

		// Update assign backup value to previous week
		$insert_week = $current_week;
		$insert_month = $current_month;
		$insert_year = $current_year;
		if ($current_week == 1) {
			$insert_week = 4;
			$insert_month -= 1;
			if ($current_month == 1) {
				$insert_month = 12;
				$insert_year -= 1;
			}
		}

		$assigns = Plan::assignCount(['year' => $insert_year, 'month' => $insert_month, 'week' => $insert_week]);
		$member_total = Member::count();

		$member_tracking = MemberTracking::select('id')->where([
			['year', '=', $current_year],
			['month', '=', $current_month],
			['week', '=', $current_week]
		])->first();

		if ($member_tracking != null) {
			$model_save = MemberTracking::find($member_tracking->id);
			$model_save->member_total = $member_total;
			$model_save->assign_backup = ($member_total - $assigns) * 100 / $member_total;
			$model_save->save();
		} else {
			MemberTracking::insert([
				'year' => $insert_year,
				'month' => $insert_month,
				'week' => $insert_week,
				'member_total' => $member_total,
				'assign_backup' => ($member_total - $assigns) * 100 / $member_total,
			]);
		}
	}
}