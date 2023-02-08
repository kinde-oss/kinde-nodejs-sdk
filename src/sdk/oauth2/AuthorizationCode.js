import { randomString } from "../utils/Utils";

export default class AuthorizationCode {
  /**
   * getAuthorizeURL function to obtain the authorization URL and data to save in req.session
   *
   * @param {Object} client - Object that holds client information
   * @param {Object} options - Additional options for the authorization process
   * 
   * @param {string} options.audience - Identifier of the intended audience of the token
   * @param {string} start_page - URL of the page that will initiate the authorization
   * @param {string} state - Optional parameter used to pass a value to the authorization server
   * @param {string} scope - The scopes to request
   * @param {bool} is_create_org - Flag indicating if the user is creating a new organization
   * @param {string} org_code - Organization code
   *
   * @returns {Object} Object containing the authorization URL and state
   * @property {string} state - The value of the state parameter
   * @property {string} url - The authorization URL to redirect the user to 
   */
  getAuthorizeURL(client, options) {
    const {
      audience,
      start_page,
      state = randomString(),      
      scope = 'openid profile email offline',
      is_create_org = false,
      org_code
    } = options;

    const searchParams = {
      client_id: client.clientId,
      response_type: 'code',      
      scope,
      state,
      start_page,
      redirect_uri: client.callbackUri,
      ...(!!audience && { audience }),
      ...(!!is_create_org && { is_create_org }),
      ...(!!org_code && { org_code }),
    }

    return {
      state: state,
      url: `${client.authorizationEndpoint}?${new URLSearchParams(searchParams).toString()}`
    } 
  }

  /**
   * Function to get token from authorization code
   * @param {Object} client - KindeClient instance
   * @param {string} code - Authorization code obtained from authorization server
   * @param {string} [scope='openid profile email offline'] - The scopes you want to request
   * 
   * @returns {Object} JSON object with token information like access_token, refresh_token, expires_in etc.
   */

  async getToken(client, code, scope = 'openid profile email offline') {
    const searchParams = {
      grant_type : 'authorization_code',
      client_id: client.clientId,
      client_secret: client.clientSecret,
      scope,
      code,
      redirect_uri: client.callbackUri,
    }

    const res = await fetch(client.tokenEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'          
      },
      body: new URLSearchParams(searchParams),
    });
    const token = await res.json();
    return token;
  }
}