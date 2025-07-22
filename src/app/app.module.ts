import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';


import { ReactiveFormsModule, FormsModule } from '@angular/forms';


import { HttpClientModule } from '@angular/common/http';


import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component'; 
import { CharacterDetailComponent } from './character-detail/character-detail.component';
import { CharactersComponent } from './characters/characters.component';
import { FavoritesComponent } from './favorites/favorites.component';
import { ResetPasswordComponent } from './components/reset-password.component';
import { ChangePasswordComponent } from './components/change-password.component';
import { ProfileComponent } from './profile/profile.component';


import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';

import { environment } from '../environments/environment';


import { AppRoutingModule } from './app-routing.module';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    CharacterDetailComponent,
    CharactersComponent,
    FavoritesComponent,  
    ResetPasswordComponent,
    ChangePasswordComponent,
    ProfileComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,          
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
