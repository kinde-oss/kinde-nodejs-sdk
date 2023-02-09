import { pkceChallengeFromVerifier, randomString } from "../utils/Utils";

export default class PKCE {
  /**
   * Function to get the authorization URL and state, codeVerifier to save in req.session
   * 
   * @param {Object} client - Object containing client details like clientId, callbackUri, and authorizationEndpoint
   * @param {Object} options - Object containing options to include in the authorization URL
   * @param {string} options.start_page - Start page for authorization
   * @param {string} options.state - Optional parameter used to pass a value to the authorization server
   * @param {bool} options.is_create_org - Flag to indicate if the user wants to create an organization
   * @param {string} options.org_code - Organization code
   * @param {string} options.org_name - Organization code
   * 
   * @returns {Object} Object with state, codeVerifier, and url properties
   * @property {string} state - The value of the state parameter
   * @property {string} codeVerifier - Code verifier for Proof Key for Code Exchange (PKCE)
   * @property {string} url - The authorization URL to redirect the user to
   */
  async generateAuthorizationURL(client, options) {
    const {
      start_page,
      state = randomString(),
      scope = 'openid profile email offline',
      is_create_org = false,
      org_code,
      org_name
    } = options;
    const codeVerifier = randomString();
    const codeChallenge = await pkceChallengeFromVerifier(codeVerifier);

    let searchParams = {
      client_id: client.clientId,
      response_type: 'code',
      scope: client.scope,
      state,
      start_page,
      redirect_uri: client.redirectUri,
      code_challenge: codeChallenge,
      code_challenge_method: 'S256',
      // ...(!!audience && { audience }),
      ...(!!client.audience && { audience : client.audience }),
      ...(!!is_create_org && { is_create_org }),
      ...(!!org_code && { org_code }),
      ...(!!org_name && { org_name }),
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
    let searchParams = {
      grant_type: 'authorization_code',
      client_id: client.clientId,
      client_secret: client.clientSecret,
      redirect_uri: client.redirectUri,
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