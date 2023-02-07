import { randomString } from "../utils/Utils";

export default class AuthorizationCode {
  getAuthorizeURL(client, options) {
    const {
      audience,
      start_page,
      state = randomString(),      
      scope = 'openid profile email offline',
      is_create_org = false,
      org_name = '',
      org_code
    } = options;

    client.session.kinde_oauth_state = state;

    let searchParams = {
      client_id: client.clientId,
      client_secret: client.clientSecret,
      response_type: 'code',
      grant_type : 'authorization_code',
      scope,
      state,
      start_page,
      redirect_uri: client.callbackUri,
    };

    if (audience) {
      searchParams.audience = audience;
    }

    if (org_code) {
      searchParams.org_code = org_code;
    }

    if (is_create_org) {
      searchParams.is_create_org = is_create_org;
      searchParams.org_name = org_name;
    }

    return `${client.authorizationEndpoint}?${new URLSearchParams(searchParams).toString()}`;
  }

  async getToken(client, code, scope = 'openid profile email offline') {
    let searchParams = {
      grant_type: client.grantType,
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
    client.saveDataToSession(token);
    return token;

  }
}
