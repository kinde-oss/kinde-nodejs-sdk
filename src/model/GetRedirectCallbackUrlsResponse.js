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

import ApiClient from '../ApiClient';
import RedirectCallbackUrls from './RedirectCallbackUrls';

/**
 * The GetRedirectCallbackUrlsResponse model module.
 * @module model/GetRedirectCallbackUrlsResponse
 * @version 1
 */
class GetRedirectCallbackUrlsResponse {
    /**
     * Constructs a new <code>GetRedirectCallbackUrlsResponse</code>.
     * @alias module:model/GetRedirectCallbackUrlsResponse
     */
    constructor() { 
        
        GetRedirectCallbackUrlsResponse.initialize(this);
    }

    /**
     * Initializes the fields of this object.
     * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
     * Only for internal use.
     */
    static initialize(obj) { 
    }

    /**
     * Constructs a <code>GetRedirectCallbackUrlsResponse</code> from a plain JavaScript object, optionally creating a new instance.
     * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @param {module:model/GetRedirectCallbackUrlsResponse} obj Optional instance to populate.
     * @return {module:model/GetRedirectCallbackUrlsResponse} The populated <code>GetRedirectCallbackUrlsResponse</code> instance.
     */
    static constructFromObject(data, obj) {
        if (data) {
            obj = obj || new GetRedirectCallbackUrlsResponse();

            if (data.hasOwnProperty('redirect_urls')) {
                obj['redirect_urls'] = ApiClient.convertToType(data['redirect_urls'], [RedirectCallbackUrls]);
            }
        }
        return obj;
    }

    /**
     * Validates the JSON data with respect to <code>GetRedirectCallbackUrlsResponse</code>.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @return {boolean} to indicate whether the JSON data is valid with respect to <code>GetRedirectCallbackUrlsResponse</code>.
     */
    static validateJSON(data) {
        if (data['redirect_urls']) { // data not null
            // ensure the json data is an array
            if (!Array.isArray(data['redirect_urls'])) {
                throw new Error("Expected the field `redirect_urls` to be an array in the JSON data but got " + data['redirect_urls']);
            }
            // validate the optional field `redirect_urls` (array)
            for (const item of data['redirect_urls']) {
                RedirectCallbackUrls.validateJsonObject(item);
            };
        }

        return true;
    }


}



/**
 * An application's redirect callback URLs.
 * @member {Array.<module:model/RedirectCallbackUrls>} redirect_urls
 */
GetRedirectCallbackUrlsResponse.prototype['redirect_urls'] = undefined;






export default GetRedirectCallbackUrlsResponse;

