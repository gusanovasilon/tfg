import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { NoticiasComponent } from './components/noticias/noticias';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import {LoginComponent } from './components/login/login';

@NgModule({
  declarations: [
    App,
    NoticiasComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [
    provideBrowserGlobalErrorListeners()
  ],
  bootstrap: [App]
})
export class AppModule { }
