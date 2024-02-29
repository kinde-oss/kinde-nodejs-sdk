export default class AuthorizationCode {
  /**
   * Function to get the authorization URL and state to save in req.session
   * @param {Object} client - Kinde client instance
   * @param {Object} options - Additional options for the authorization process
   * @property {String} options.start_page - URL of the page that will initiate the authorization
   * @property {String} options.state - Optional parameter used to pass a value to the authorization server
   * @property {Boolean} options.is_create_org - Flag indicating if the user is creating a new organization
   * @property {String} options.org_code - Organization code
   * @property {String} options.org_name - Organization name
   * @property {String} options.lang - language to display for page
   * @property {String} options.login_hint - email or phone-number to pre-fill page
   * @property {String} options.connection_id - connection id string corresponding to social sign in
   * @returns {String} The authorization URL to redirect the user to
   */
  generateAuthorizationURL(client, options) {
    const {
      start_page,
      state,
      is_create_org,
      org_code,
      org_name,
      lang,
      login_hint,
      connection_id,
    } = options;

    const searchParams = {
      client_id: client.clientId,
      response_type: 'code',
      scope: client.scope,
      state,
      start_page,
      redirect_uri: client.redirectUri,
      ...(!!client.audience && { audience: client.audience }),
      ...(!!is_create_org && { is_create_org, org_name }),
      ...(!!org_code && { org_code }),
      ...(!!lang && { lang }),
      ...(!!login_hint && { login_hint }),
      ...(!!connection_id && { connection_id }),
    };

    return `${client.authorizationEndpoint}?${new URLSearchParams(searchParams).toString()}`;
  }

  /**
   * Function to get token from authorization code
   * @param {Object} client - KindeClient instance
   * @param {String} code - Authorization code obtained from authorization server
   * @returns {Object} JSON object with token information like access_token, refresh_token, expires_in etc.
   */
  async getToken(client, code) {
    const searchParams = {
      grant_type: 'authorization_code',
      client_id: client.clientId,
      client_secret: client.clientSecret,
      code,
      redirect_uri: client.redirectUri,
    };

    const res = await fetch(client.tokenEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Kinde-SDK': `${client.kindeSdkLanguage}/${client.kindeSdkLanguageVersion}`,
      },
      body: new URLSearchParams(searchParams),
    });
    const token = await res.json();
    return token;
  }
}
