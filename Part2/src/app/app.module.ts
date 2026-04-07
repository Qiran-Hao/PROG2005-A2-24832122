import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { InventoryManageComponent } from './pages/inventory-manage/inventory-manage.component';
import { SearchFilterComponent } from './pages/search-filter/search-filter.component';
import { PrivacySecurityComponent } from './pages/privacy-security/privacy-security.component';
import { HelpFaqComponent } from './pages/help-faq/help-faq.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    InventoryManageComponent,
    SearchFilterComponent,
    PrivacySecurityComponent,
    HelpFaqComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
