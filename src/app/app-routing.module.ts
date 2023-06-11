import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth-guard.guard';

const routes: Routes = [
  {
    path:'',
    loadChildren: () => import('./pages/auth/auth-routing.module').then( m => m.AuthRoutingModule )
  },
  {
    path:'home',
    loadChildren: () => import('./pages/home/home-routing.module').then( m => m.HomeRoutingModule ),
    canActivate: [
      AuthGuard
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
