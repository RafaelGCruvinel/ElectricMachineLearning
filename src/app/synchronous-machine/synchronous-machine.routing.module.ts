import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SynchronousMachineComponent } from './synchronous-machine.component';

const routes: Routes = [
  { path: '', component: SynchronousMachineComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class SynchronousMachineRoutingModule { }
