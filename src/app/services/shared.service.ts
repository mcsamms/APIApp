import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';

/**
 * Shared operations for all services
 */
@Injectable()
export class SharedService {

    /**
     * Inject the http for making and accessing AJAX Requests
     * @param http 
     */
    constructor(public http: HttpClient) { }

    /**
     * Created a shared error handler for all seervices to use| denotes overload
     * @param error 
     */
    public handleError (errorResponse: HttpErrorResponse | any) : any {    
        let err:string;
        
        if(errorResponse instanceof ErrorEvent){
            err = errorResponse.error.message;
            console.error('Clide Side Error: ',errorResponse.error.message);
        } else {
            err = errorResponse.error            
            console.error('Clide Side Error: ',errorResponse);
        }

        return throwError(err);
    }

    /**
     * Set our headers to use json as the content type
     */
    public httpOptions():any {
        let httpOptions = {
            headers: new HttpHeaders({
                'Content-Type':  'application/json', //The content type we are sending. We serialize of objects as JSON
                'Accept': 'application/json' //We are expecting JSON from the Web API
                })
            };

        return httpOptions;
    }
}
