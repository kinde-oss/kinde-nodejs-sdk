export default class PKCE {
  /**
   * Function to get the authorization URL
   * @param {Object} client - Kinde client instance
   * @param {Object} options - Object containing options to include in the authorization URL
   * @property {String} options.start_page - Start page for authorization
   * @property {String} options.state - Optional parameter used to pass a value to the authorization server
   * @property {Boolean} options.is_create_org - Flag to indicate if the user wants to create an organization
   * @property {String} options.org_code - Organization code
   * @property {String} options.org_name - Organization name
   * @param {String} codeChallenge - Code challenge used in the PKCE flow.
   * @returns {String} url - The authorization URL to redirect the user to
   */
  generateAuthorizationURL(client, options, codeChallenge) {
    const {
      start_page,
      state,
      is_create_org,
      org_code,
      org_name,
    } = options;

    const searchParams = {
      client_id: client.clientId,
      response_type: 'code',
      scope: client.scope,
      state,
      start_page,
      redirect_uri: client.redirectUri,
      code_challenge: codeChallenge,
      code_challenge_method: 'S256',
      ...(!!client.audience && { audience: client.audience }),
      ...(!!is_create_org && { is_create_org, org_name }),
      ...(!!org_code && { org_code }),
    };

    return `${client.authorizationEndpoint}?${new URLSearchParams(searchParams).toString()}`;
  }

  /**
   * Function to get token from authorization code
   * @param {Object} client - KindeClient instance
   * @param {String} code - Authorization code obtained from authorization server
   * @param {String} codeVerifier - Code verifier generated during authorization request
   * @returns {Object} JSON object with token information like access_token, refresh_token, expires_in etc.
   */
  async getToken(client, code, codeVerifier) {
    const searchParams = {
      grant_type: 'authorization_code',
      client_id: client.clientId,
      client_secret: client.clientSecret,
      redirect_uri: client.redirectUri,
      code,
      code_verifier: codeVerifier,
    };

    const res = await fetch(client.tokenEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams(searchParams),
    });
    const token = await res.json();
    return token;
  }
}
