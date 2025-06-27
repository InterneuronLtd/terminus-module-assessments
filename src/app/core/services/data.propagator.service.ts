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
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Assessment } from 'src/app/shared/models/assessment';
import { LoggerService } from './logger.service';

@Injectable({
    providedIn: 'root'
})
export class DataPropagtorService {
    encounterChange = new Subject();
    personIdChange = new Subject();
    pageLoaded = new Subject<boolean>();
    loadAssessmentModule = new Subject<{assessment?: Assessment, action: 'new'| 'edit'|'view'|'amend'|'viewhistory' | 'showtasks', actionType?: string}>();
    refreshAssessmentList = new Subject();

    constructor(private loggerService: LoggerService){
        this.loggerService.log('Constructing DataPropagtorService');
    }

    reset () {
        // this.encounterChange.complete();
        // this.personIdChange.complete();
        // this.pageLoaded.complete();
        // this.loadAssessmentModule.complete();
        // this.refreshAssessmentList.complete();
    }
}