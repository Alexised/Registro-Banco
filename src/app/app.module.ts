import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { HttpModule } from '@angular/http';
import { Routes, Router, RouterModule } from '@angular/router';
import { CreditoComponent } from './credito/credito.component';
import { HomeComponent } from './home/home.component';
const appRoutes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'credito/:id', component: CreditoComponent },
  { path: '**', pathMatch: 'full', redirectTo: '/home', },
];
@NgModule({
  declarations: [
    AppComponent,
    CreditoComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(appRoutes),
// tslint:disable-next-line: deprecation
    HttpModule
  ],
  providers: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
