<?php
 
namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Http\Controllers\Common\Utils;
use App\MemberTracking;
 
class MemberCountTrackingCommand extends Command {
	protected $signature = 'member:count_tracking {date=0}';

	protected $description = 'Counting member every weeks';

	public function __construct() {
		parent::__construct();
	}

	public function handle() {
		if ($this->argument('date') != 1) {
			$current_day = Date('d');
			$current_month = Date('n');
			$current_year = Date('Y');
	
			$check_date = date_parse($this->argument('date'));
			if ($check_date['error_count'] == 0 && $check_date['warning_count'] == 0) {
				$current_day = $check_date['day'];
				$current_month = $check_date['month'];
				$current_year = $check_date['year'];
			}
	
			$current_week = Utils::calculateWeek($current_day);
	
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
			MemberTracking::setTracking($insert_year, $insert_month, $insert_week);
		} else {
			$current_year = Date('Y');
			for ($m = 1; $m <= 12; $m++) {
				for ($w = 1; $w <= 4; $w++) {
					MemberTracking::setTracking($current_year, $m, $w);
				}
			}
		}
	}
}