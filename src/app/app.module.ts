import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { AppComponent } from './app.component';

import { AppRoutingModule, routableComponents } from './app.routes';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { MatButtonModule } from '@angular/material';
import { MatMenuModule } from '@angular/material';
import { MatTabsModule } from '@angular/material';

import { NvD3Module } from 'ng2-nvd3';

@NgModule({
  declarations: [
    AppComponent,
    routableComponents
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpModule,
    MatMenuModule,
    MatButtonModule,
    MatTabsModule,
    AppRoutingModule,
    NvD3Module,
    NgbModule.forRoot(),
    MDBBootstrapModule.forRoot()
  ],
  providers: [],
  bootstrap: [
    AppComponent
  ]
})

export class AppModule { }
