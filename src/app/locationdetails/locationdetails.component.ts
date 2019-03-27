import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LocationService } from '../services/location.service';
import { Location } from '../models/location';

@Component({
  selector: 'app-locationdetails',
  templateUrl: './locationdetails.component.html',
  styleUrls: ['./locationdetails.component.css']
})
export class LocationDetailsComponent implements OnInit {

   //The location property. Two-way binding is in place between this property and the HTML view
   location : Location;

   /**
    * A message property for display informtion to the user on communications with the REST service, displaying errors... Two-way binding is set in the HTML view 
    */
   message : string;

   /**
    * The following loc properties are helpers for the view and what to show in different modes
    * also helpers with the spinners
    */
   locLoaded :boolean = true;
   locSaving : boolean = false;
   locDeleting : boolean = false;
   locDeleted : boolean = false;    
   
   /**
    * Inject the locationService to access Web Service
    * Inject the ActiveRoute to access the url for the querystring params
    * @param locationService the locationService dependency
    * @param route the route dependency
    */
   constructor(public locationService:LocationService, private route :ActivatedRoute) { 
           
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
               this.getLocation(id);
           }
       );	  

       //If we ever change routes laoding the details component, clear the message property
       this.route.url.subscribe(url =>{
           this.message = "";
       })
   }

   /**
    * Get an individual location
    * @param id The id of the location to get from the AdventureWorks Web API
    */
   getLocation(id:number) : void {
       if(!isNaN(id) && id != 0){
           //Turn on the loading spinner indicator
           this.locLoaded = false;

           //Subscribe to the location Service getlocation method observable
           this.locationService.getLocation(id).subscribe(loc => {     
               
               //loc is my variable to hold returned location from the observable. Check if it is defined
               if(loc !== undefined){  
                   //Set the component location property from the return location from the observable
                   this.location = loc; 
               } else {
                   this.setRetrieveError();
               }      

               //Turn off the loading spinner indicator
               this.locLoaded = true;
           }, error => {
               //Set the message property to display in the HTML template
               this.message=`The location: ${id} is not valid`;
               
               //Write the error object to the console
               console.log(error);

               //Turn of the loading spinner indicator
               this.locLoaded = true;
           });
       } else {
           //Creation mode   
           console.log("Creation mode");

           //Because of two-way binding, if I am in creation mode, I want the HTML controls to clear. Simply set the location property to a new instance of location
           this.location = new Location();

           //Turn of the loading spinner indicator
           this.locLoaded = true;
       }
   }

   /**
    * Set the retrieving error. This is refactored out as this error must be settable if the id is not in proper format as well as when the
    * call comes back from the service observable
    */
   setRetrieveError(){    
       //Set an error about a failed retrieve of a location
       this.locationService.errors.push("This location does not exist");

       //Because of two-way binding, if I am in creation mode, I want the HTML controls to clear. Simply set the location property to a new instance of location
       this.location = new Location();    
   }

   /**
    * Create a location. Our location property of this component is two-way bound so the location properties are set from the values in the form controls
    * 
    */
   createLocation():void{
       //Turn on the spinner indiciator
       this.locSaving = true; 

       //Clear any content in my message property
       this.message = "";

       //Call the location Service createlocation method. This also returns an Observable of type any. It could be a location or an error
       //The Web API returns the newly created location with the newly created locationId (Primary key from the SQL Server database)
       //The create method
       this.locationService.createLocation(this.location).subscribe(
           //The observable returned from the create method will be required to be cast as the return type is Any. Lets set the type
           //of the returned observable
           (loc:Location) => {   
           //Set the message to state the created location and show the primary key that was returned from SQL Server      
           this.message = `The location ${loc.name} was created. locationId: ${loc.locationId}`;

           //Two way binding to the HTML view is in place, Lets set the location to a new instance of location to clear the HTML view
           this.location = new Location();      
       },error => {
           //We may have an error returned from the location service. Lets write to the console
           console.log(error);   
           //Hide the spinner indicator on error as processing with REST call is complete
           this.locSaving = false;     
       },complete => {
           //Once the processing is complete, hide the spinner indicator
           this.locSaving = false;
       });
   }

   /**
    * Saving changes. Our location property of this component is two-way bound so the location properties are set from the values in the form controls
    */
   saveLocation():void{
       //Turn on the spinner indicator for the user to have visual feedback
       this.locSaving = true;

       //Clear any message in the HTML view
       this.message = "";

       //Call the location Service savelocation method. This also returns an Observable of type any. It could be a location or an error
       //The Web API returns the updated location. Most notably, an updated modficiation date. This is stamped on the SQL Server SPROC
       this.locationService.saveLocation(this.location).subscribe(
           //The observable returned from the save method will be 
           //required to be cast as the return type is Any. Lets set the type
           (loc:Location) => {
           //Display a success message to the user        
           this.message = `The location ${loc.name} was saved.`;
           
           //Two way binding to the HTML view is in place, Lets update the view to the latest state of our location object
           this.location = loc;   
       },error=>{
           //We may have an error returned from the location service. Lets write to the console
           console.log(error);   
           
           //Hide the spinner indicator on error as processing with REST call is complete
           this.locSaving = false;     
       },complete=>{
           //Once the processing is complete, hide the spinner indicator
           this.locSaving = false;
       });
   }

   /**
    * Delete the location. Our location property of this component is two-way bound so the location properties are set from the values in the form controls
    */
   deleteLocation():void{
       //Clear any messages in the HTML view
       this.message = "";

       //Turn on the spinner indicator for the user to have visual feedback
       this.locSaving = true;

       //Call the location Service deletelocation method. This also returns a HTTP 200 response (ok) from the Web API upon successful deletion
       this.locationService.deleteLocation(this.location).subscribe(response => {
           //The response returned is a true for successful deletion or false for not successful
           console.log(response);

           //Turn off the spinner indiciator
           this.locLoaded = false;
                
           //Hide the spinner indicator on error as processing with REST call is complete
           this.locSaving = false;

           //Set the flag for deletion view. This hides all form controls
           this.locDeleted = true;

           //Set the message to show successful deletion
           this.message = "The location has been deleted";
       }, error => {         
           //Push the error into the location service collection of errors
           this.locationService.errors.push(error);

           //Hide the spinner indicator on error as processing with REST call is complete
           this.locSaving = false;     
       }, complete=>{

           //Hide the spinner indicator processing with REST call is complete
           this.locSaving = false;
       });
   }

}
