# Terminus - Assessments Module

Assessment module replace traditional paper based assessments and forms allowing users to enter patient data and answer specific patient related questions. In addition, calculate scores deterred by data entered and repopulate forms where data is already available in the platform. 

Specific assessment forms will be used to capture the details for the specific assessment types e.g. Sepsis assessment forms will be used to capture details of the Sepsis Assessment.

## Prerequisites

**Development**

```
1. Visual Studio Community / Visual Studio Code
2. Angular CLI
3. Synapse Identity Server
4. Synapse Dynamic API
```

**Deployment** [windows]

```
1. IIS 7 or higher
2. Terminus Framework 
3. Synapse Identity Sever
4. Synapse Dynamic API
```

## Configure

#### Install Angular CLI and install packages

1. Download and install Node package manager on this link [NPM](https://www.npmjs.com/get-npm)

2. Follow the instructions on this link to install [Angular CLI](https://angular.io/cli)

3. Open the solution in Visual Studio and right click on the solution and open command prompt

4. Run npm install to install all dependencies.

   ```
   npm install
   ```



#### Load Master Data

Create the required master data with the details mentioned in the 'Seed_Data.md'



#### Application Development and Deployment

This module is packaged as an Angular Element [a web component] to deploy into Terminus framework.

To run and debug the application in development mode these settings needs to be done

##### Develop and debug in Visual studio

These settings needs to be done before the application could be locally run via angular cli.



**Configuration:**

Change the below configurations appropriately in assets/config/assessments_config.json

```
 app_service: {
   base_uri: "SYNAPSE_DYNAMIC_URI" 
 }
 
 identity_service: { 
   base_uri: "SYNAPSE_IDENTITY_URI" 
 }
    
  infra: {
        showLogInConsole: true,
        showErrorInConsole: true
    },
```

**1. Patient Identifier in appcomponent.ts**

 Open appcomponent.ts and un-comment below lines. When hosted on Terminus, the framework provides a personid to the module.

```
  ngOnInit() {
    //Testing only - un-comment the below line
    //let val = { personId: 'c8c654c5-9272-4324-b3f0-2cf8be9a9576', apiService: null };
    this.showLoadingIndicator = true;
  }
```



**2. Getting an auth. token from Synapse Identity Server - apirequest.service.ts**

Comment out the below lines in core/services/in.appbase.service.ts

```
 //return from(this.appService.apiService.getRequest(uri));

 //return from(this.appService.apiService.postRequest(uri, body));

 //return from(this.appService.apiService.deleteRequest(uri));
```

Uncomment the below lines in core/services/in.appbase.service.ts

```
this.restClient = new RestClient(this.httpClient, this.authService);
return this.restClient.get(url, { params: params, headers: headers });

this.restClient = new RestClient(this.httpClient, this.authService);
return this.restClient.post(url, body, { params: params, headers: headers });

return this.restClient.delete(url, { params: params, headers: headers });
```
 **3. In the app.config.service.ts:
 Use the 'httpClient' instead of 'apiBaseService' in the 'load' method


**4. Bootsrapping a component in appmodule.ts**

The bootstrap array should contain the AppComponent.

```
  bootstrap: [AppComponent],
```

**5. Run the app via angular cli**

In Visual Studio right click on the solution and open developer command prompt. Run the below commands and then navigate to [http://localhost:4200](http://localhost:4200/) in google chrome.

```
ng serve
```

##### Publish to Terminus Framework

These settings needs to be done before the application can be packaged as a web component and hosted on Terminus Framework.

**Configuration:**

Change the below configurations appropriately in config/app,module.config.ts

```
 app_service: {
   base_uri: "SYNAPSE_DYNAMIC_URI" 
 }
 
 identity_service: { 
        base_uri: "SYNAPSE_IDENTITY_URI" 
 }
    
  infra: {
        showLogInConsole: false,
        showErrorInConsole: true
    },
```



**1. Patient Identifier in appcomponent.ts**

 Open appcomponent.ts and comment below lines. When hosted on Terminus, the framework provides a personid to the module.

```
 ngOnInit() {
    //Testing only - un-comment the below line
    //this.datacontract = {personId: '17775da9-8e71-4a3f-9042-4cdcbf97efec'};
    this.showLoadingIndicator = true;
  }
```

**2. Getting an auth. token from Terminus Framework - apirequest.service.ts**

***Comment*** the below lines in core/services/in.appbase.service.ts

```
        return from(this.apiClientFromFW.getRequest(url));

        return from(this.apiClientFromFW.postRequest(url, body));

        return from(this.apiClientFromFW.deleteRequest(url));
```

***Uncomment*** the below lines in core/services/in.appbase.service.ts

```
this.restClient = new RestClient(this.httpClient, this.authService);
return this.restClient.get(url, { params: params, headers: headers });

this.restClient = new RestClient(this.httpClient, this.authService);
return this.restClient.post(url, body, { params: params, headers: headers });

return this.restClient.delete(url, { params: params, headers: headers });
```

**3. Bootsrapping a component in appmodule.ts**

The bootstrap array should be empty.

```
  bootstrap: [],
```

**4. Package the app to host on Terminus**

In Visual Studio right click on the solution and open developer command prompt. Run the below commands.

```
npm run prod-build
```

open the root folder of the solution and then open the dist folder. Find main.js which is the packaged application.

5. Schema migration:

   In the Synapse studio application, export the schema for the below entities and views using the 'Schema Migration' option.

   **Entities**:

   - assessment
   - assessmentdetail
   - assessmenttask
   - assessmenttype
   - formsection
   - formsectionquestion
   - formtype
   - sepsistask

   **Views**:

   - allassessmentdetails
   - allassessments
   - allassessmentwithredandamber
   - alllatestassessmentdetails
   - alllatestassessments
   - alllatestassessmentstasks
   - alltopversionassessments
   - assessments
   - redandamberreadjson
   - alltopversionassessmentswithtaskcount

   

#### Publish and Install

If you have not already created Interneuron sites in IIS, pls follow the below procedure to create the sites

1. Locate and copy the Interneuron-AppPools.xml and Interneuron-Sites.xml from Sample/IISSettings folder to a local folder.
2. Open command prompt in administrator mode and execute the below commands

```
   %windir%\system32\inetsrv\appcmd add apppool /in < "path to Interneuron-AppPools.xml"
   
   %windir%\system32\inetsrv\appcmd add site /in < "path to  Interneuron-Sites.xml"
```

1. Please follow the instructions on the Terminus - Framework Readme to deploy Terminus Framework.
2. Package the application using the instructions in the above section **4. Package the app to host on Terminus**
3. Rename **main.js** to ***assessments.js*** and copy into the **assessments** folder in **terminusmoduleloader** site folder in c:\inetpub\wwwroot.
4. Copy and paste the assessments_config.json to **assets/config** folder.
5. Import the schema migrated as mentioned above, using the 'Schema Migration' option in Synapse Studio.

## Author

- GitHub: [Interneuron CIC](https://github.com/InterneuronCIC)

------

## 📝 License

Interneuron Terminus Copyright(C) 2019 Interneuron CIC

This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by The Free Software Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.

See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with this program. If not, see http://www.gnu.org/licenses/.