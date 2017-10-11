import { NgModule, ModuleWithProviders } from '@angular/core';
import { PreloadAllModules, Routes, RouterModule } from '@angular/router';

const appRoutes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'maquina-corrente-continua' },
  {
    path: 'maquina-corrente-continua',
    loadChildren: 'app/continuous-chain-machine/continuous-chain-machine.module#ContinuousChainMachineModule'
  },
  {
    path: 'maquina-inducao',
    loadChildren: 'app/induction-machine/induction-machine.module#InductionMachineModule'
  },
  {
    path: 'maquina-sincrona',
    loadChildren: 'app/synchronous-machine/synchronous-machine.module#SynchronousMachineModule'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})

// Export modulo de rotas do angular.
export class AppRoutingModule { }

// export Components from Router Module
export const routableComponents = [];
