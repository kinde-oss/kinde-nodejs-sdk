/**
 * Kinde Management API
 * Provides endpoints to manage your Kinde Businesses
 *
 * The version of the OpenAPI document: 1
 * Contact: support@kinde.com
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 *
 */


import ApiClient from "../ApiClient";
import CreateRoleRequest from '../model/CreateRoleRequest';
import ErrorResponse from '../model/ErrorResponse';
import SuccessResponse from '../model/SuccessResponse';

/**
* Roles service.
* @module api/RolesApi
* @version 1
*/
export default class RolesApi {

    /**
    * Constructs a new RolesApi. 
    * @alias module:api/RolesApi
    * @class
    * @param {module:ApiClient} [apiClient] Optional API client implementation to use,
    * default to {@link module:ApiClient#instance} if unspecified.
    */
    constructor(apiClient) {
        this.apiClient = apiClient || ApiClient.instance;
    }


    /**
     * Callback function to receive the result of the createRole operation.
     * @callback module:api/RolesApi~createRoleCallback
     * @param {String} error Error message, if any.
     * @param {module:model/SuccessResponse} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Create a new role
     * Create role.
     * @param {Object} opts Optional parameters
     * @param {module:model/CreateRoleRequest} opts.createRoleRequest Role details.
     * @param {module:api/RolesApi~createRoleCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/SuccessResponse}
     */
    createRole(opts, callback) {
      opts = opts || {};
      let postBody = opts['createRoleRequest'];

      let pathParams = {
      };
      let queryParams = {
      };
      let headerParams = {
      };
      let formParams = {
      };

      let authNames = ['kindeBearerAuth'];
      let contentTypes = ['application/json'];
      let accepts = ['application/json; charset=utf-8'];
      let returnType = SuccessResponse;
      return this.apiClient.callApi(
        '/api/v1/role', 'POST',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, null, callback
      );
    }

    /**
     * Callback function to receive the result of the getRoles operation.
     * @callback module:api/RolesApi~getRolesCallback
     * @param {String} error Error message, if any.
     * @param {module:model/SuccessResponse} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * List Roles
     * The returned list can be sorted by role name or role ID in ascending or descending order. The number of records to return at a time can also be controlled using the `page_size` query string parameter. 
     * @param {Object} opts Optional parameters
     * @param {module:model/String} opts.sort Field and order to sort the result by.
     * @param {Number} opts.pageSize Number of results per page. Defaults to 10 if parameter not sent.
     * @param {String} opts.nextToken A string to get the next page of results if there are more results.
     * @param {module:api/RolesApi~getRolesCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/SuccessResponse}
     */
    getRoles(opts, callback) {
      opts = opts || {};
      let postBody = null;

      let pathParams = {
      };
      let queryParams = {
        'sort': opts['sort'],
        'page_size': opts['pageSize'],
        'next_token': opts['nextToken']
      };
      let headerParams = {
      };
      let formParams = {
      };

      let authNames = ['kindeBearerAuth'];
      let contentTypes = [];
      let accepts = ['application/json; charset=utf-8'];
      let returnType = SuccessResponse;
      return this.apiClient.callApi(
        '/api/v1/roles', 'GET',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, null, callback
      );
    }

    /**
     * Callback function to receive the result of the updateRoles operation.
     * @callback module:api/RolesApi~updateRolesCallback
     * @param {String} error Error message, if any.
     * @param {module:model/SuccessResponse} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Update a role
     * Update role
     * @param {Number} roleId The identifier for the role.
     * @param {Object} opts Optional parameters
     * @param {module:model/CreateRoleRequest} opts.createRoleRequest Role details.
     * @param {module:api/RolesApi~updateRolesCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/SuccessResponse}
     */
    updateRoles(roleId, opts, callback) {
      opts = opts || {};
      let postBody = opts['createRoleRequest'];
      // verify the required parameter 'roleId' is set
      if (roleId === undefined || roleId === null) {
        throw new Error("Missing the required parameter 'roleId' when calling updateRoles");
      }

      let pathParams = {
        'role_id': roleId
      };
      let queryParams = {
      };
      let headerParams = {
      };
      let formParams = {
      };

      let authNames = ['kindeBearerAuth'];
      let contentTypes = ['application/json'];
      let accepts = ['application/json; charset=utf-8'];
      let returnType = SuccessResponse;
      return this.apiClient.callApi(
        '/api/v1/roles/{role_id}', 'PATCH',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, null, callback
      );
    }


}
