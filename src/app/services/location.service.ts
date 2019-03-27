import { Injectable } from '@angular/core';
import { SharedService } from './shared.service';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import {Observable, of }from 'rxjs'; 
import {Location }from '../models/Location'; 
import {map, catchError }from 'rxjs/operators'; 
import {throwError }from 'rxjs'; 

/**
 * Constant for our Web API url
 */
const API_URL = environment.apiUrl; 

@Injectable()
export class LocationService extends SharedService{

    /**
     * String array property for holding
     */
    errors : string[]; 

    /**
     * Require Http for AJAX requests
     * @param http 
     */
    constructor(public http:HttpClient) {
        super(http); 
    }

     /**
     * Get locations from AdventureWorks Web API
     */
    public getLocations():Observable <Location[]>  {
        //Set the API Url for getting the Locations        
        let api = `${API_URL}api/Location`; 

        try {
            //Access the AdventureWorks ASP.NET Web API using the HttpClient get method using the type parameter of an array of Locations
            //The Web API returns the Locations as a stateful collection. The get method accepts the api url variable
            //Get method returns observable of the type supplied in the Type parameter
            //Deserializing of the JSON message is not requried in Angular v7. This is now handled with the http get method and type parameter
            return this.http.get<Location[]>(api); 
        }catch(err) {
            console.log(err); 
            return throwError("Cannot retrieve Locations"); 
        }
    }

    /**
     * Get a Location from the AdventureWorks Web API
     * @param id The LocationId to retrieve from the Web API
     */
    public getLocation(id:number):Observable<Location>  {
        //Set the API Url for getting the Location. The Web API allows access to an individual Location at http://[address:port]/api/Location/[Id of Location] 
        let api = `${API_URL}api/Location/${id}`; 
        try {
            //Access the AdventureWorks ASP.NET Web API using the HttpClient get method using the type parameter of a Location
            //The Web API returns the requested Location as a stateful object. The get method accepts the api url variable
            //Get method returns observable of the type supplied in the Type parameter
            //Deserializing of the JSON message is not requried in Angular v7. This is now handled with the http get method and type parameter
            return this.http.get<Location>(api); 
        }catch(err) {
            console.log(err); 
            return throwError(`Cannot retrieve Location:${id}`); 
        }
    }

    /**
     * Create a Location using the AdventureWorks Web API
     * @param Location The Location to create
     */
    createLocation(Location:Location):any {
        //Set the url to the create method in the ASP.NET Web API
        let api = `${API_URL}api/Location/Create`; 

        if (this.validateLocation(Location)) {
            //The HttpClient post method requires the api url to send the request. 
            //The second argument to the HttpClient post method is the body. In our case, it is the Location object. Serialization of the dpeartment object to JSON is not required. This is defined in the  third argument httpOptions
            //The third argument to the HttpClient post method options. We state we are sending content as JSON and also we expect to receive JSON back from this Http Post as the response
            //Deserializing of the returned JSON message is not requried in Angular v7. 
            return this.http
                .post<Location>(api, Location, super.httpOptions())
                .pipe(catchError(this.handleError)); 
        } else {
            return throwError("The Location is missing required fields"); 
        }
    }

    /**
     * Saving a Location using AdventureWorks Web API
     * @param location a Location to save
     */
    saveLocation(location:Location):any {
        //Set the url to the save method in the ASP.NET Web API
        let api = `${API_URL}api/Location/Save`; 

        if (this.validateLocation(location) &&  ! isNaN(location.locationId)) {
            //The HttpClient post method requires the api url to send the request. 
            //The second argument to the HttpClient post method is the body. In our case, it is the Location object. Serialization of the dpeartment object to JSON is not required. This is defined in the  third argument httpOptions
            //The third argument to the HttpClient post method options. We state we are sending content as JSON and also we expect to receive JSON back from this Http Post as the response
            //Deserializing of the returned JSON message is not requried in Angular v7. 
            return this.http
                .post<Location>(api, Location, super.httpOptions())
                .pipe(catchError(this.handleError)); //Pipe used to stitch together functional operators into a chain.
        } else {
            return throwError("The Location is missing required fields"); 
        }
    }

    /**
     * Delete a Location AdventureWorks Web API
     * @param Location the Location to delete
     */
    deleteLocation(location:Location):any {
        this.clearErrors(); 

        //Set the url to the save method in the ASP.NET Web API
        let api = `${API_URL}api/Location/Delete`; 

        if (location.locationId != 0) {
            //The HttpClient post method requires the api url to send the request. 
            //The second argument to the HttpClient post method is the body. In our case, it is the Location object. Serialization of the dpeartment object to JSON is not required. This is defined in the  third argument httpOptions
            //The third argument to the HttpClient post method options. We state we are sending content as JSON and also we expect to receive JSON back from this Http Post as the response
            //Deserializing of the returned JSON message is not requried in Angular v7. 
            return this.http
                .post(api, location, super.httpOptions())
                .pipe(catchError(this.handleError)); //Pipe used to stitch together functional operators into a chain.
        }else {
            return throwError("The Location id is required for deletion"); 
        }
    }

    /**
     * Clear the errors
     */
    clearErrors():void {
        this.errors = []; 
    }

    /**
     * Validate a Location
     * @param location a Location to validate
     */
    validateLocation(location:Location):boolean {
        this.clearErrors(); 

        if (location.name === undefined || location.name == "") {
            this.errors.push("Name is required"); 
        }

        if(location.costRate === undefined){
            this.errors.push("Cost rate is required");
        }

        if (location.availability === undefined) {
            this.errors.push("Availability is required"); 
        }

        return this.errors.length == 0; 
    }
}
