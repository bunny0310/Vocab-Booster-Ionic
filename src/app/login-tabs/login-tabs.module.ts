import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LoginTabsPageRoutingModule } from './login-tabs-routing.module';

import { LoginTabsPage } from './login-tabs.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LoginTabsPageRoutingModule
  ],
  declarations: [LoginTabsPage]
})
export class LoginTabsPageModule {}
