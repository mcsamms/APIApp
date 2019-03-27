import {Injectable }from '@angular/core'; 
import {SharedService }from './shared.service'; 
import {environment }from 'src/environments/environment'; 
import {HttpClient, HttpHeaders, HttpErrorResponse }from '@angular/common/http'; 
import {Observable, of }from 'rxjs'; 
import {Department }from '../models/department'; 
import {map, catchError }from 'rxjs/operators'; 
import {throwError }from 'rxjs'; 

/**
 * The AdventureWorks Angular Application requires the following repositories for hosting the required ASP.NET Web API
 * See Chris Cusack for access to the private GitHub repos
 * 
 * https://github.com/chrisecusack/nbcc-adventureworks
 * https://github.com/chrisecusack/nbcc-core
 *  
 */

/**
 * Constant for our Web API url
 */
const API_URL = environment.apiUrl; 

/**
 * The Department Service class that interacts with the AdventureWorks Web API
 */
@Injectable()
export class DepartmentService extends SharedService {

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
     * Get departments from AdventureWorks Web API
     */
    public getDepartments():Observable < Department[] >  {
        //Set the API Url for getting the departments        
        let api = `${API_URL}api/Department`; 

        try {
            //Access the AdventureWorks ASP.NET Web API using the HttpClient get method using the type parameter of an array of departments
            //The Web API returns the departments as a stateful collection. The get method accepts the api url variable
            //Get method returns observable of the type supplied in the Type parameter
            //Deserializing of the JSON message is not requried in Angular v7. This is now handled with the http get method and type parameter
            return this.http.get<Department[]>(api); 
        }catch(err) {
            console.log(err); 
            return throwError("Cannot retrieve departments"); 
        }
    }

    /**
     * Get a department from the AdventureWorks Web API
     * @param id The departmentId to retrieve from the Web API
     */
    public getDepartment(id:number):Observable < Department >  {
        //Set the API Url for getting the department. The Web API allows access to an individual department at http://[address:port]/api/Department/[Id of department] 
        let api = `${API_URL}api/Department/${id}`; 
        try {
            //Access the AdventureWorks ASP.NET Web API using the HttpClient get method using the type parameter of a department
            //The Web API returns the requested department as a stateful object. The get method accepts the api url variable
            //Get method returns observable of the type supplied in the Type parameter
            //Deserializing of the JSON message is not requried in Angular v7. This is now handled with the http get method and type parameter
            return this.http.get<Department>(api); 
        }catch(err) {
            console.log(err); 
            return throwError(`Cannot retrieve department:${id}`); 
        }
    }

    /**
     * Create a department using the AdventureWorks Web API
     * @param department The department to create
     */
    createDepartment(department:Department):any {
        //Set the url to the create method in the ASP.NET Web API
        let api = `${API_URL}api/Department/Create`; 

        if (this.validateDepartment(department)) {
            //The HttpClient post method requires the api url to send the request. 
            //The second argument to the HttpClient post method is the body. In our case, it is the department object. Serialization of the dpeartment object to JSON is not required. This is defined in the  third argument httpOptions
            //The third argument to the HttpClient post method options. We state we are sending content as JSON and also we expect to receive JSON back from this Http Post as the response
            //Deserializing of the returned JSON message is not requried in Angular v7. 
            return this.http
                .post<Department>(api, department, super.httpOptions())
                .pipe(catchError(this.handleError)); 
        } else {
            return throwError("The department is missing required fields"); 
        }
    }

    /**
     * Saving a department using AdventureWorks Web API
     * @param department a department to save
     */
    saveDepartment(department:Department):any {
        //Set the url to the save method in the ASP.NET Web API
        let api = `${API_URL}api/Department/Save`; 

        if (this.validateDepartment(department) &&  ! isNaN(department.departmentId)) {
            //The HttpClient post method requires the api url to send the request. 
            //The second argument to the HttpClient post method is the body. In our case, it is the department object. Serialization of the dpeartment object to JSON is not required. This is defined in the  third argument httpOptions
            //The third argument to the HttpClient post method options. We state we are sending content as JSON and also we expect to receive JSON back from this Http Post as the response
            //Deserializing of the returned JSON message is not requried in Angular v7. 
            return this.http
                .post<Department>(api, department, super.httpOptions())
                .pipe(catchError(this.handleError)); //Pipe used to stitch together functional operators into a chain.
        } else {
            return throwError("The department is missing required fields"); 
        }
    }

    /**
     * Delete a department AdventureWorks Web API
     * @param department the department to delete
     */
    deleteDepartment(department:Department):any {
        this.clearErrors(); 

        //Set the url to the save method in the ASP.NET Web API
        let api = `${API_URL}api/Department/Delete`; 

        if (department.departmentId != 0) {
            //The HttpClient post method requires the api url to send the request. 
            //The second argument to the HttpClient post method is the body. In our case, it is the department object. Serialization of the dpeartment object to JSON is not required. This is defined in the  third argument httpOptions
            //The third argument to the HttpClient post method options. We state we are sending content as JSON and also we expect to receive JSON back from this Http Post as the response
            //Deserializing of the returned JSON message is not requried in Angular v7. 
            return this.http
                .post(api, department, super.httpOptions())
                .pipe(catchError(this.handleError)); //Pipe used to stitch together functional operators into a chain.
        }else {
            return throwError("The department id is required for deletion"); 
        }
    }

    /**
     * Clear the errors
     */
    clearErrors():void {
        this.errors = []; 
    }

    /**
     * Validate a department
     * @param department a department to validate
     */
    validateDepartment(department:Department):boolean {
        this.clearErrors(); 

        if (department.name === undefined || department.name == "") {
        this.errors.push("Name is required"); 
        }

        if (department.groupName === undefined || department.groupName == "") {
        this.errors.push("Group name is required"); 
        }

        return this.errors.length == 0; 
    }
}
