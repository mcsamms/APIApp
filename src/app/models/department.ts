/**
 * Model of Department. Matches the Department model from the AdventtureWorks Web API
 * the camelCase in ASP.NET Web API is set in Global.asax
 * See protected void Application_Start() in Global.asax.cs where camel casing is set
 *  GlobalConfiguration.Configuration
              .Formatters
              .JsonFormatter
              .SerializerSettings              
              .ContractResolver = new CamelCasePropertyNamesContractResolver();
 */
export class Department {     
    public departmentId : number;
    public groupName : string;
    public modifiedDate: Date;
    public name : string;

    constructor(){ }
}