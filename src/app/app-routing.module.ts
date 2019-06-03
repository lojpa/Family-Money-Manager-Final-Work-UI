import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { TransactionComponent } from './transaction/transaction.component';
import { AccountComponent } from './account/account.component';
import { ShoppingListComponent } from './shopping-list/shopping-list.component';
import { ReportsComponent } from './reports/reports.component';
import { SettingsComponent } from './settings/settings.component';
import { RegistrationComponent } from './registration/registration.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/login' },
  { path: 'registration', pathMatch: 'full', component: RegistrationComponent },
  { path: 'login', pathMatch: 'full', component: LoginComponent },
  { path: 'home', pathMatch: 'full', component: HomeComponent },
  { path: 'transaction', pathMatch: 'full', component: TransactionComponent },
  { path: 'account', pathMatch: 'full', component: AccountComponent },
  { path: 'shopping-list', pathMatch: 'full', component: ShoppingListComponent },
  { path: 'reports', pathMatch: 'full', component: ReportsComponent },
  { path: 'setting', pathMatch: 'full', component: SettingsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
