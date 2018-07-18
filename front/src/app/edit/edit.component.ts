import { Component, OnInit, ViewEncapsulation, ViewChild, ViewChildren } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { PlanService} from '../services/plan.service';
import { FormGroup, FormBuilder ,FormControl } from '@angular/forms';

declare function loadForm(data: any);

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class EditComponent implements OnInit {

  limitMonth: number = 12;
  limitWeek: number = 4;
  member: string = '';
  badge: string = '';
  year : number;

  @ViewChildren('allInput') allInput;

  constructor(
    private planService: PlanService,
    private http: HttpClient) {}

  ngOnInit() {
    this.editPlan();
  }
  editPlan() {
    this.planService.getApiEdit().then((res: any) => {
      let dataList = res.items;
      this.createMonth();
      dataList.forEach(element => {
        this.year = element.year;
        this.member = element.member_name;
        this.badge = element.badge_id;
        let month = element.month;
        let week = element.week;
        let value = element.value;
        let value2 = element.value2;
        let found: Month = this.showData.find(function(data: Month ) {
          return data.numOfMonth === month;
        });
        if (found.weekOfMonth[week-1] ) {
          found.weekOfMonth[week-1].assign = value;
          found.weekOfMonth[week-1].credit = value2;
        }
      });
    });
  }

  onSubmit()
  {
    let nameInput;
    let month_form;
    let week_form;
    let value_input; 
    var plan_member:Array<Month> = [];

    this.allInput.forEach((element) => {
      nameInput = element.nativeElement.name;
      value_input = element.nativeElement.value;

      if (value_input != '') {
        let newMonth = new Month();
        let weeks = new Week();

        nameInput = nameInput.split("-");
        month_form = nameInput[1];
        week_form = nameInput[2];

        newMonth.numOfMonth = month_form;
        weeks.week = week_form;

        if(nameInput[0] == 'assign') {
          weeks.assign = value_input;
        }
        if(nameInput[0] == 'credit') {
          weeks.credit = value_input;
        }

        newMonth.weekOfMonth.push(weeks);
        plan_member.push(newMonth);
       }
    });
      console.log(JSON.stringify(plan_member));
  }
  showData:Array<Month> = [];
  createMonth() {
    for(let i = 1; i<= this.limitMonth; i ++) {
      let newMonth = new Month();
      newMonth.numOfMonth = i;
      this.createWeek(newMonth);
      this.showData.push(newMonth);
    }
  }
  createWeek(month: Month) {
    for(let i = 1; i<= this.limitWeek; i ++) {
      let newWeek = new Week();
      newWeek.week = i;
      month.weekOfMonth.push(newWeek);
    }
  }
}
class Week {
    week: number;
    assign: string;
    credit: string;
}
class Month {
  numOfMonth: number;
  weekOfMonth: Array<Week> = [];
}
