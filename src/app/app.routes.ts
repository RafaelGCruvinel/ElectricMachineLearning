import { NgModule, ModuleWithProviders } from '@angular/core';
import { PreloadAllModules, Routes, RouterModule } from '@angular/router';
import { ContinuousChainMachineComponent } from './continuous-chain-machine/continuous-chain-machine.component';
import { InductionMachineComponent } from './induction-machine/induction-machine.component';
import { SynchronousMachineComponent } from './synchronous-machine/synchronous-machine.component';
import { HomeComponent } from './home/home.component';

const appRoutes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  { path: 'home', component: HomeComponent },
  { path: 'maquina-corrente-continua', component: ContinuousChainMachineComponent },
  { path: 'maquina-inducao', component: InductionMachineComponent },
  { path: 'maquina-sincrona', component: SynchronousMachineComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes, { preloadingStrategy: PreloadAllModules,  useHash: true })],
  exports: [RouterModule]
})

// Export modulo de rotas do angular.
export class AppRoutingModule { }

// export Components from Router Module
export const routableComponents = [
  ContinuousChainMachineComponent,
  InductionMachineComponent,
  HomeComponent,
  SynchronousMachineComponent
];
