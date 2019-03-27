import { Component, OnInit } from '@angular/core';
import { LocationService } from '../services/location.service';
import { Location } from '../models/location';

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.css']
})
export class LocationComponent implements OnInit {

    locations : Location[] = [];
    selectedLocation : Location;
    /**
     *  loc helpers for spinners and visuals
     */
    locLoaded :boolean = false;
    locRetrieveLoaded :boolean = true;   
    message : string;
  
    /**
     * Inject the location service dependancy
     * @param locationService 
     */
    constructor(public locationService:LocationService) { }

    /**
     * 
     */
    ngOnInit() {
        this.getLocations();
    }

    /**
     * Get the locations
     */
    getLocations():void{
        //Subscribe to the Observable in the Location Service
        this.locationService.getLocations()
        .subscribe(
            //Assign incoming data from the observable to the variable locs    
            locs => {
                this.locations = locs;//Set the component locations property. The HTML view has two-way binding to this property
                this.locLoaded = true; //Turn off the loading indicator                
            }
        );  
    }

    /**
   * Get a Location Id to retrieve a location from the location Service getlocation method. Subscribe to the observable
   * @param id The location Id to retrieve from AdventureWorks Web API
   */
  getLocation(id:number){    
    if(id != 0){
      this.locRetrieveLoaded = false;//Display the loading spinner indicator for an individual location retrieve

      //Subscribe to getLocation service Observable
      this.locationService.getLocation(id)
      .subscribe(loc => {
        this.selectedLocation = loc; //Set the property of the selected Location using the returned location from the service observable        
        this.locRetrieveLoaded = true; //Hide the spinner indicator
      });
    }
    else{
        console.log('no location Id has been selected');
    }     
  }
}
