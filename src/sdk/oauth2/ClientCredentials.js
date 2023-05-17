export default class ClientCredentials {
  /**
   * getToken function to obtain an access token from the authorization server.
   * @param {Object} client - Kinde client instance
   * @returns {Object} JSON object with token information like access_token, refresh_token, expires_in etc.
   */
  async getToken(client) {
    const searchParams = {
      grant_type: client.grantType,
      client_id: client.clientId,
      client_secret: client.clientSecret,
      scope: client.scope,
      ...(!!client.audience && { audience: client.audience }),
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
