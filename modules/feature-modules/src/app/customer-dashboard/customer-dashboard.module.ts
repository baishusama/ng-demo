import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import the new component
import { CustomerDashboardComponent } from './customer-dashboard/customer-dashboard.component';


@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    CustomerDashboardComponent
  ],
  exports: [
    CustomerDashboardComponent
  ]
})


export class CustomerDashboardModule { }

