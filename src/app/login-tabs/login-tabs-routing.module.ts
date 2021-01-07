import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginTabsPage } from './login-tabs.page';

const routes: Routes = [
  {
    path: '',
    component: LoginTabsPage,
    children: [
      {
        path: 'login',
        loadChildren: () => import('../login/login.module').then(m => m.LoginPageModule)
      },
      {
        path: 'register',
        loadChildren: () => import('../register/register.module').then(m => m.RegisterPageModule)
      },
      {
        path: '',
        redirectTo: '/login-tabs/login',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/login-tabs/login',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LoginTabsPageRoutingModule {}
