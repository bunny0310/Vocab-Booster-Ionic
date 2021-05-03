import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViewWordPage } from './view-word.page';

const routes: Routes = [
  {
    path: '',
    component: ViewWordPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViewWordPageRoutingModule {}
