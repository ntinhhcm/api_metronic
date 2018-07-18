import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse  } from '@angular/common/http';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PlanService} from '../services/plan.service';

// declare function loadData(data: string): any;
declare function PlanDetail(data: string): any;

@Component({
	selector: 'app-plan',
	templateUrl: './plan.component.html',
	styleUrls: ['./plan.component.css'],
	encapsulation: ViewEncapsulation.None
})
export class PlanComponent implements OnInit {

	public plan = {};
	data: string;

	searchForm: FormGroup;

	constructor(
		private router: Router,
		private fb: FormBuilder,
		private planService: PlanService,
		private http: HttpClient
		) {this.createForm() }

	ngOnInit() {

		this.loadData();
	}

	searchApi(formData) {
		this.plan['badge_id'] = formData.badge_id;
		this.plan['member_name'] = formData.member_name;
		if (formData.type == 'credit') {
			this.plan['value'] = formData.type;
		} else {
			this.plan['value2'] = formData.type;
		}
		this.plan['created_at'] = formData.created_at;
		this.plan['updated_at'] = formData.enddate;

		this.planService.search(this.plan).then((res: any) => {
		});
	}

	loadData() {
		this.planService.getPlan().then((res: any) => {
				PlanDetail(JSON.stringify(res.items));
		});
	}

	createForm(){
		this.searchForm = this.fb.group({
			badge_id:[null,Validators.required],
			member_name:['', Validators.required],
			created_at:['', Validators.required],
			enddate:['', Validators.required],
			type:['', Validators.required],
		});
	}
}
