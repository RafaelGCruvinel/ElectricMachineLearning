import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ContinuousChainMachineComponent } from './continuous-chain-machine.component';
import { ContinuousChainMachineRoutingModule } from './continuous-chain-machine.routing.module';

@NgModule({
    imports: [
        ContinuousChainMachineRoutingModule
    ],
    declarations: [
        ContinuousChainMachineComponent
    ],
    bootstrap:    [
        ContinuousChainMachineComponent
    ]
})

export class ContinuousChainMachineModule { }