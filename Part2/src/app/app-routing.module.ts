import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { InventoryManageComponent } from './pages/inventory-manage/inventory-manage.component';
import { SearchFilterComponent } from './pages/search-filter/search-filter.component';
import { PrivacySecurityComponent } from './pages/privacy-security/privacy-security.component';
import { HelpFaqComponent } from './pages/help-faq/help-faq.component';

const routes: Routes = [
  { path: '', component: HomeComponent, title: 'Home | Inventory System' },
  { path: 'manage', component: InventoryManageComponent, title: 'Manage Inventory' },
  { path: 'search', component: SearchFilterComponent, title: 'Search Items' },
  { path: 'privacy', component: PrivacySecurityComponent, title: 'Privacy & Security' },
  { path: 'help', component: HelpFaqComponent, title: 'Help & FAQ' },
  { path: '**', redirectTo: '', pathMatch: 'full' }    // Wildcard routing, redirection to the home page
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }