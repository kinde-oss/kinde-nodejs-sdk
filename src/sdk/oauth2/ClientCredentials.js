export default class ClientCredentials {
  /**
   * getToken function to obtain an access token from the authorization server.
   * 
   * @param {Object} client - OAuth client object
   * @param {Object} options - Options for the authentication process
   * @param {string} options.audience - Identifier of the target resource server
   * @param {string} options.scope - Space-separated list of scopes requested for access token
   * 
   * @returns {Object} JSON object with token information like access_token, refresh_token, expires_in etc.
   */
  async getToken(client, options) {
    const {
      audience,    
      scope = 'openid profile email offline'
    } = options;

    const searchParams = {
      grant_type: client.grantType,
      client_id: client.clientId,
      client_secret: client.clientSecret,
      scope,
      ...(!!audience && { audience })
    }

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