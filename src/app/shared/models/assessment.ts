//BEGIN LICENSE BLOCK 
//Interneuron Terminus

//Copyright(C) 2023  Interneuron Holdings Ltd

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

export class Assessment {
    _createdby?: string;
    _createddate?: string;
    _createdtimestamp?: string;
    _recordstatus?: number;
    _row_id?: string;
    assessment_id?: string;
    assessmenttype_id?: string;
    encounter_id?: string;
    formtype_id?: string;
    isamended?: boolean
    isdraft?: boolean
    observationevent_id?: string;
    person_id?: string;
    versionid?: number
    assessmenttypename?: string;
    assessmenttypedisplayname?: string;
    formtypename?: string;
    formtypeheadertext?: string;
    status?: string;
    taskformsectionid?: string;
    canShowTask?: boolean = false;
    sourceofinvocation?: string;
    reasonfordelete?: string;
    completedtaskcnt?: number;
    totaltaskcnt?: number;
  }