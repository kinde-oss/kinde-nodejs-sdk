export default class ClientCredentials {
  async getToken(client, options) {
    const {
      audience,    
      scope = 'openid profile email offline'
    } = options;
    try {
      let searchParams = {
        grant_type: client.grantType,
        client_id: client.clientId,
        client_secret: client.clientSecret,
        scope
      }
      if (audience) {
        searchParams.audience = audience;
      }

      const res = await fetch(client.tokenEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',          
        },
        body: new URLSearchParams(searchParams),
      });
      const token = await res.json();
      client.saveDataToSession(token);
      return token;
    } catch (e) {
      throw Error(e);
    }
  }
}