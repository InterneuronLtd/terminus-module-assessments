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
// export const APP_MODULE_CONFIG = {
//     infra: {
//         showLogInConsole: false,
//         showErrorInConsole: true
//     },
//     messages: {
//         delete_assessment_confirmation: 'Are you sure you want to delete?',
//         generic_save_error: 'Error saving data',
//         generic_save_success: 'Successfully saved data',
//     },
//     app_service: {
//         base_uri: "SYNAPSE_DYNAMIC_URI"
//     },
//     identity_service: { 
//         base_uri: "SYNAPSE_IDENTITY_URI" 
//     }
// };

export class AssessmentsModuleConfig {
    infra: {
        showLogInConsole: boolean, 
        showErrorInConsole: boolean 
    };
    messages: {
        delete_assessment_confirmation: string,
        generic_save_error: string,
        generic_save_success: string,
    };
    app_service: {
        base_uri: string
    };
    identity_service: { 
        base_uri: string
    }

};

export class AssessmentsModuleConfigData {
    static Config: AssessmentsModuleConfig = null;
}

