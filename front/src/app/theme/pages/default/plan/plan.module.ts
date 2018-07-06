import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { PlanComponent } from './plan.component';
import { LayoutModule } from '../../../layouts/layout.module';
import { DefaultComponent } from '../default.component';

const routes: Routes = [
    {
        "path": "",
        "component": DefaultComponent,
        "children": [
            {
                "path": "",
                "component": PlanComponent
            }
        ]
    }
];
@NgModule({imports: [
    CommonModule,RouterModule.forChild(routes),
    LayoutModule
],exports: [
    RouterModule
],declarations: [
    PlanComponent
]})
export class PlanModule  {
}