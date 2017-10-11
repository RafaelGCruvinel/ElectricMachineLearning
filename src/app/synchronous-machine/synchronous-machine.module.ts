import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { SynchronousMachineComponent } from './synchronous-machine.component';
import { SynchronousMachineRoutingModule } from './synchronous-machine.routing.module';

@NgModule({
    imports: [
        SynchronousMachineRoutingModule
     ],
    declarations: [
        SynchronousMachineComponent
    ],
    bootstrap:    [
        SynchronousMachineComponent
    ]
})

export class SynchronousMachineModule { }
