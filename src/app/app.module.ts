import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { CharactersComponent } from './characters/characters.component';

@NgModule({
  declarations: [
    AppComponent,
    CharactersComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,         // <-- necesario para [(ngModel)]
    HttpClientModule     // <-- necesario para HttpClient
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
