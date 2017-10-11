import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ContinuousChainMachineComponent } from './continuous-chain-machine.component';

const routes: Routes = [
  { path: '', component: ContinuousChainMachineComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class ContinuousChainMachineRoutingModule { }
