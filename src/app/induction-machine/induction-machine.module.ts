import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { InductionMachineComponent } from './induction-machine.component';
import { InductionMachineRoutingModule } from './induction-machine.routing.module';


@NgModule({
    imports: [
        InductionMachineRoutingModule
     ],
    declarations: [
        InductionMachineComponent
    ],
    bootstrap:  [
        InductionMachineComponent
    ]
})

export class InductionMachineModule { }
