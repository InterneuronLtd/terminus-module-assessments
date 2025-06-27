//BEGIN LICENSE BLOCK 
//Interneuron Terminus

//Copyright(C) 2025  Interneuron Limited

//This program is free software: you can redistribute it and/or modify
//it under the terms of the GNU General Public License as published by
//the Free Software Foundation, either version 3 of the License, or
//(at your option) any later version.

//This program is distributed in the hope that it will be useful,
//but WITHOUT ANY WARRANTY; without even the implied warranty of
//MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.

//See the
//GNU General Public License for more details.

//You should have received a copy of the GNU General Public License
//along with this program.If not, see<http://www.gnu.org/licenses/>.
//END LICENSE BLOCK 
/* Interneuron Assessment App
Copyright(C) 2023  Interneuron Holdings Ltd
This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.
This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
See the
GNU General Public License for more details.
You should have received a copy of the GNU General Public License
along with this program.If not, see<http://www.gnu.org/licenses/>. */
import { HttpParams, HttpHeaders, HttpClient } from "@angular/common/http";
import { Observable, from } from 'rxjs';
import { RestClient } from './rest.client';
import { Injectable } from '@angular/core';
import { AuthenticationService } from './authentication.service';
import { LoggerService } from './logger.service';

@Injectable({
    providedIn: 'root'
})
export class InAppBaseApiService {

    defaultRequestOptions: any;
    restClient: RestClient;
    apiClientFromFW: any;

    constructor(protected httpClient: HttpClient, protected authService: AuthenticationService) {

        // this.restClient = new RestClient(httpClient, authService);

        // let defaultHeaders = new Headers();
        // defaultHeaders.append("Content-Type", 'application/json');
        // defaultHeaders.append("Accept", 'application/json');

        // this.defaultRequestOptions = {
        //     headers: defaultHeaders
        // }
    }

    reset() {
        this.defaultRequestOptions = null;
        this.restClient = null;
        this.apiClientFromFW = null;
    }

    get<T>(url: string, params?: HttpParams, headers?: HttpHeaders) {

        //Local test only
        // this.restClient = new RestClient(this.httpClient, this.authService);
        // return this.restClient.get(url, { params: params, headers: headers });

        //Prod code
        return from(this.apiClientFromFW.getRequest(url));

    }

    post<T>(url: string, body: any, params?: HttpParams, headers?: HttpHeaders) {
        // this.restClient = new RestClient(this.httpClient, this.authService);

        // return this.restClient.post(url, body, { params: params, headers: headers });

        //Prod code
        return from(this.apiClientFromFW.postRequest(url, body));
    }

    put<T>(url: string, body: any, params?: HttpParams, headers?: HttpHeaders) {
        // return this.restClient.put(url, body, { params: params, headers: headers });
        return null;
    }

    delete<T>(url: string, params?: HttpParams, headers?: HttpHeaders) {

        // return this.restClient.delete(url, { params: params, headers: headers });

        //Prod code
        return from(this.apiClientFromFW.deleteRequest(url));
    }
}