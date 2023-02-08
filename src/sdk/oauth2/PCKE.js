import { pkceChallengeFromVerifier, randomString } from "../utils/Utils";

export default class PKCE {
  /**
   * Function to get the authorization URL to redirect the user to the authorization server and data to save in req.session
   * 
   * @param {Object} client - Object containing client details like clientId, callbackUri, and authorizationEndpoint
   * @param {Object} options - Object containing options to include in the authorization URL
   * @param {String} [options.audience] - Identifier for the resource server that you want to access
   * @param {String} [options.start_page] - Start page for authorization
   * @param {String} [options.state=randomString()] - Optional parameter used to pass a value to the authorization server
   * @param {String} [options.scope='openid profile email offline'] - The scopes you want to request
   * @param {Boolean} [options.is_create_org=false] - Flag to indicate if the user wants to create an organization
   * @param {String} [options.org_code] - Organization code
   * 
   * @returns {Object} Object with state, codeVerifier, and url properties
   * @property {String} state - The value of the state parameter
   * @property {String} codeVerifier - Code verifier for Proof Key for Code Exchange (PKCE)
   * @property {String} url - The authorization URL to redirect the user to
   */
  async getAuthorizeURL(client, options) {
    const {
      audience,
      start_page,
      state = randomString(),
      scope = 'openid profile email offline',
      is_create_org = false,
      org_code
    } = options;
    const codeVerifier = randomString();
    const codeChallenge = await pkceChallengeFromVerifier(codeVerifier);

    const searchParams = {
      client_id: client.clientId,
      response_type: 'code',
      scope,
      state,
      start_page,
      redirect_uri: client.callbackUri,
      code_challenge: codeChallenge,
      code_challenge_method: 'S256',
      ...(!!audience && { audience }),
      ...(!!is_create_org && { is_create_org }),
      ...(!!org_code && { org_code }),
    };

    return {
      state,
      codeVerifier,
      url: `${client.authorizationEndpoint}?${new URLSearchParams(searchParams).toString()}`
    }
  }

  /**
   * Function to get token from authorization code
   * @param {Object} client - KindeClient instance
   * @param {string} code - Authorization code obtained from authorization server
   * @param {string} codeVerifier - Code verifier generated during authorization request
   * 
   * @returns {Object} JSON object with token information like access_token, refresh_token, expires_in etc.
   */
  async getToken(client, code, codeVerifier) {
    const searchParams = {
      grant_type: 'authorization_code',
      client_id: client.clientId,
      client_secret: client.clientSecret,
      redirect_uri: client.callbackUri,
      code,
      code_verifier: codeVerifier,
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