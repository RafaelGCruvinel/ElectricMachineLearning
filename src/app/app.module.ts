import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { AppComponent } from './app.component';

import { AppRoutingModule, routableComponents } from './app.routes';

import { MatMenuModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material';
import { MDBBootstrapModule } from 'angular-bootstrap-md';

import { NvD3Module } from 'ng2-nvd3';

@NgModule({
  declarations: [
    AppComponent,
    routableComponents
  ],
  imports: [
    BrowserModule,
    HttpModule,
    MatMenuModule,
    MatButtonModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    NvD3Module,
    MDBBootstrapModule.forRoot()
,
  ],
  providers: [],
  bootstrap: [
    AppComponent
  ]
})

export class AppModule { }