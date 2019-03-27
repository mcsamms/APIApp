import { Component, OnInit } from '@angular/core';
import { Department } from '../models/department';
import { DepartmentService } from '../services/department.service';
import {ActivatedRoute} from '@angular/router';

@Component({
    selector: 'app-departmentdetails',
    templateUrl: './departmentdetails.component.html',
    styleUrls: ['./departmentdetails.component.css']
})
export class DepartmentDetailsComponent implements OnInit {

    //The department property. Two-way binding is in place between this property and the HTML view
    department : Department;

    /**
     * A message property for display informtion to the user on communications with the REST service, displaying errors... Two-way binding is set in the HTML view 
     */
    message : string;

    /**
     * The following dep properties are helpers for the view and what to show in different modes
     * also helpers with the spinners
     */
    depLoaded :boolean = true;
    depSaving : boolean = false;
    depDeleting : boolean = false;
    depDeleted : boolean = false;    
    
    /**
     * Inject the DepartmentService to access Web Service
     * Inject the ActiveRoute to access the url for the querystring params
     * @param departmentService the DepartmentService dependency
     * @param route the route dependency
     */
    constructor(public departmentService:DepartmentService, private route :ActivatedRoute) { 
            
    }

    /**
     * Component initialization. Executes once when the directive is instantiated and data-bound properties have been checked
     */
    ngOnInit() {
        
        //Subscribe to the observable of route parameters
        this.route.params.subscribe(
            params => {
                //An alternative to accessing query string parameters
                const id = +params['id'];
                this.getDepartment(id);
            }
        );	  

        //If we ever change routes laoding the details component, clear the message property
        this.route.url.subscribe(url =>{
            this.message = "";
        })
    }

    /**
     * Get an individual department
     * @param id The id of the Department to get from the AdventureWorks Web API
     */
    getDepartment(id:number) : void {
        if(!isNaN(id) && id != 0){
            //Turn on the loading spinner indicator
            this.depLoaded = false;

            //Subscribe to the Department Service getDepartment method observable
            this.departmentService.getDepartment(id).subscribe(dept => {     
                
                //dept is my variable to hold returned department from the observable. Check if it is defined
                if(dept !== undefined){  
                    //Set the component department property from the return department from the observable
                    this.department = dept; 
                } else {
                    this.setRetrieveError();
                }      

                //Turn off the loading spinner indicator
                this.depLoaded = true;
            }, error => {
                //Set the message property to display in the HTML template
                this.message=`The department: ${id} is not valid`;
                
                //Write the error object to the console
                console.log(error);

                //Turn of the loading spinner indicator
                this.depLoaded = true;
            });
        } else {
            //Creation mode   
            console.log("Creation mode");

            //Because of two-way binding, if I am in creation mode, I want the HTML controls to clear. Simply set the Department property to a new instance of department
            this.department = new Department();

            //Turn of the loading spinner indicator
            this.depLoaded = true;
        }
    }

    /**
     * Set the retrieving error. This is refactored out as this error must be settable if the id is not in proper format as well as when the
     * call comes back from the service observable
     */
    setRetrieveError(){    
        //Set an error about a failed retrieve of a department
        this.departmentService.errors.push("This department does not exist");

        //Because of two-way binding, if I am in creation mode, I want the HTML controls to clear. Simply set the Department property to a new instance of department
        this.department = new Department();    
    }

    /**
     * Create a department. Our department property of this component is two-way bound so the department properties are set from the values in the form controls
     * 
     */
    createDepartment():void{
        //Turn on the spinner indiciator
        this.depSaving = true; 

        //Clear any content in my message property
        this.message = "";

        //Call the Department Service createDepartment method. This also returns an Observable of type any. It could be a department or an error
        //The Web API returns the newly created department with the newly created departmentId (Primary key from the SQL Server database)
        //The create method
        this.departmentService.createDepartment(this.department).subscribe(
            //The observable returned from the create method will be required to be cast as the return type is Any. Lets set the type
            //of the returned observable
            (dept:Department) => {   
            //Set the message to state the created department and show the primary key that was returned from SQL Server      
            this.message = `The department ${dept.name} was created. DepartmentId: ${dept.departmentId}`;

            //Two way binding to the HTML view is in place, Lets set the department to a new instance of Department to clear the HTML view
            this.department = new Department();      
        },error => {
            //We may have an error returned from the department service. Lets write to the console
            console.log(error);   
            //Hide the spinner indicator on error as processing with REST call is complete
            this.depSaving = false;     
        },complete => {
            //Once the processing is complete, hide the spinner indicator
            this.depSaving = false;
        });
    }

    /**
     * Saving changes. Our department property of this component is two-way bound so the department properties are set from the values in the form controls
     */
    saveDepartment():void{
        //Turn on the spinner indicator for the user to have visual feedback
        this.depSaving = true;

        //Clear any message in the HTML view
        this.message = "";

        //Call the Department Service saveDepartment method. This also returns an Observable of type any. It could be a department or an error
        //The Web API returns the updated department. Most notably, an updated modficiation date. This is stamped on the SQL Server SPROC
        this.departmentService.saveDepartment(this.department).subscribe(
            //The observable returned from the save method will be 
            //required to be cast as the return type is Any. Lets set the type
            (dept:Department) => {
            //Display a success message to the user        
            this.message = `The department ${dept.name} was saved.`;
            
            //Two way binding to the HTML view is in place, Lets update the view to the latest state of our department object
            this.department = dept;   
        },error=>{
            //We may have an error returned from the department service. Lets write to the console
            console.log(error);   
            
            //Hide the spinner indicator on error as processing with REST call is complete
            this.depSaving = false;     
        },complete=>{
            //Once the processing is complete, hide the spinner indicator
            this.depSaving = false;
        });
    }

    /**
     * Delete the department. Our department property of this component is two-way bound so the department properties are set from the values in the form controls
     */
    deleteDepartment():void{
        //Clear any messages in the HTML view
        this.message = "";

        //Turn on the spinner indicator for the user to have visual feedback
        this.depSaving = true;

        //Call the Department Service deleteDepartment method. This also returns a HTTP 200 response (ok) from the Web API upon successful deletion
        this.departmentService.deleteDepartment(this.department).subscribe(response => {
            //The response returned is a true for successful deletion or false for not successful
            console.log(response);

            //Turn off the spinner indiciator
            this.depLoaded = false;
                 
            //Hide the spinner indicator on error as processing with REST call is complete
            this.depSaving = false;

            //Set the flag for deletion view. This hides all form controls
            this.depDeleted = true;

            //Set the message to show successful deletion
            this.message = "The department has been deleted";
        }, error => {         
            //Push the error into the department service collection of errors
            this.departmentService.errors.push(error);

            //Hide the spinner indicator on error as processing with REST call is complete
            this.depSaving = false;     
        }, complete=>{

            //Hide the spinner indicator processing with REST call is complete
            this.depSaving = false;
        });
    }
}
