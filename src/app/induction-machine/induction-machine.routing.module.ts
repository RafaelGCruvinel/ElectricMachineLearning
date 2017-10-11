import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InductionMachineComponent } from './induction-machine.component';

const routes: Routes = [
  { path: '', component: InductionMachineComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class InductionMachineRoutingModule { }
