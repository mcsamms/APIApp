import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DepartmentDetailsComponent } from './departmentdetails/departmentdetails.component';
import { DepartmentComponent } from './department/department.component';
import { LocationDetailsComponent } from './locationdetails/locationdetails.component';
import { LocationComponent } from './location/location.component';

const routes: Routes = [
  {path:'department/:id',component:DepartmentDetailsComponent},
  {path:'department/create',component:DepartmentDetailsComponent},
  {path:'departments',component:DepartmentComponent},
  {path:'location/:id',component:LocationDetailsComponent},
  {path:'location/create',component:LocationDetailsComponent},
  {path:'locations',component:LocationComponent},
  {path:'',redirectTo:'/departments',pathMatch:'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
