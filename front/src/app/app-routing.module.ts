import { NgModule } from '@angular/core';
import { RouterModule, Routes, CanActivate } from '@angular/router';
import { AuthService as Auth } from './services/auth.service';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { PlanComponent } from './plan/plan.component';
import { EditComponent } from './edit/edit.component';
import { NotfoundComponent } from './error/notfound/notfound.component';

const routes: Routes = [
	{ path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'edit', component: EditComponent },
	{ path: 'login', component: LoginComponent },
	{ path: 'home', component: HomeComponent, canActivate: [Auth] },
  { path: 'plan', component: PlanComponent, canActivate: [Auth] },
  { path: 'notfound', component: NotfoundComponent },
	{ path: '**', redirectTo: '/notfound' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {useHash: true})
  ],
  exports: [ RouterModule ],
  providers: [ Auth],
  declarations: []
})
export class AppRoutingModule { }
