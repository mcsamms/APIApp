import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DepartmentService } from './services/department.service';
import { HttpClientModule } from '@angular/common/http';
import { DepartmentComponent } from './department/department.component'
import { HttpModule } from '@angular/http';
import { DepartmentDetailsComponent } from './departmentdetails/departmentdetails.component';
import { LocationComponent } from './location/location.component';
import { LocationDetailsComponent } from './locationdetails/locationdetails.component';
import { LocationService } from './services/location.service';

@NgModule({
  declarations: [
    AppComponent,
    DepartmentComponent,
    DepartmentDetailsComponent,
    LocationComponent,
    LocationDetailsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    HttpModule
  ],
  providers: [DepartmentService,LocationService],
  bootstrap: [AppComponent]
})
export class AppModule { }
/**
 * If not on Angular 7
 * npm install --save-dev @angular/cli@latest

npm install @angular/core@latest

ng update @angular/core --next --force

 */
