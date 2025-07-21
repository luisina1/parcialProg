import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { ResetPasswordComponent } from './components/reset-password.component';
import { ChangePasswordComponent } from './components/change-password.component';
import { CharactersComponent } from './characters/characters.component';

import { ProfileComponent } from './profile/profile.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'change-password', component: ChangePasswordComponent },
  { path: 'characters', component: CharactersComponent },
  { path: 'profile', component: ProfileComponent },  
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
