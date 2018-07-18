import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule }    from '@angular/forms';
import { HttpClientModule }    from '@angular/common/http';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { PlanComponent } from './plan/plan.component';
import { AppRoutingModule } from './app-routing.module';
import { EditComponent } from './edit/edit.component';
import { NotfoundComponent } from './error/notfound/notfound.component';

@NgModule({
	imports: [
		BrowserModule,
		FormsModule,
		HttpClientModule,
		AppRoutingModule,
		ReactiveFormsModule
	],
	declarations: [
		AppComponent,
		LoginComponent,
		HomeComponent,
		PlanComponent,
		NotfoundComponent,
		EditComponent
	],
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule { }