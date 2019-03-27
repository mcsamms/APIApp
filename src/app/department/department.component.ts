import { Component, OnInit } from '@angular/core';
import { Department } from '../models/department';
import { DepartmentService } from '../services/department.service';

@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.css']
})
export class DepartmentComponent implements OnInit {

  departments : Department[] = [];
  selectedDepartment : Department;
  /**
   * dep helpers for losing spnners
   */
  depLoaded :boolean = false;
  depRetrieveLoaded :boolean = true;
  width : number;
  length : number;
  product : number;
  message : string;

  /**
   * Inject the department service dependency
   * @param departService 
   */
  constructor(public departService : DepartmentService) { }

  /**
   * Component initialization. Executes once when the directive is instantiated and data-bound properties have been checked
   */
  ngOnInit() {
    this.getDepartments();
  }

  /**
   * Get the Departments from AdventureWorks
   */
  getDepartments() : void{
    //Subscribe to the Observable in the Department Service
    this.departService.getDepartments()
    .subscribe(
    //Assign incoming data from the observable to the variable departs    
    departs => {
      this.departments = departs;//Set the component Department property. The HTML view has two-way binding to this property
      this.depLoaded = true; //Turn off the loading indicator
      //this.message = "************NOW THEY ARE HERE. YAY for async comms!!!!****************";
    });
   
    //Demonstration of how we execute this line of code in a synchronous manner and the 
    //above subscription change this property in an asynchronous manner
    //this.message = "I have called the get departments. Where are they?"
    
  }

  /**
   * Place a multiply method to show how we can do other operations while waiting for
   * the observable to return
   */
  multiply():void{
    this.product = this.length * this.width;
  }

  /**
   * Get a Department Id to retrieve a department from the Department Service getDepartment method. Subscribe to the observable
   * @param id The department Id to retrieve from AdventureWorks Web API
   */
  getDepartment(id:number){    
    if(id != 0){
      this.depRetrieveLoaded = false;//Display the loading spinner indicator for an individual department retrieve

      //Subscribe to getDepartment service Observable
      this.departService.getDepartment(id)
      .subscribe(dept => {
        this.selectedDepartment = dept; //Set the property of the selected Department using the returned department from the service observable        
        this.depRetrieveLoaded = true; //Hide the spinner indicator
        //this.message = "***The department has now arrived***";
      });
     
      //this.message = "I asked for a department. Where is it?";
    }
    else{
      console.log('no department Id has been selected');
    }     
  }
}
