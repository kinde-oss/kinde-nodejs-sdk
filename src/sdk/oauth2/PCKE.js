import { pkceChallengeFromVerifier, randomString } from "../utils/Utils";

export default class PKCE {
  /**
   * It generates a code challenge and code verifier, stores the code verifier in the cache, and
   * redirects the user to the authorization endpoint with the code challenge and other parameters
   * 
   * @param string clientId The client ID of your application.
   * @param string clientSecret The client secret of your application.
   * @param string redirectUri The redirect URI that you specified in the app settings.
   * @param string authorizationEndpoint The URL of the authorization endpoint.
   * @param string scope The scopes you want to request.
   * @param string state This is an optional parameter that you can use to pass a value to the
   * authorization server. The authorization server will return this value to you in the response.
   * 
   * @return A redirect to the authorization endpoint with the parameters needed to start the
   * authorization process.
   */
  async getAuthorizeURL(client, options) {
    const {
      audience,
      start_page,
      state = randomString(),
      scope = 'openid profile email offline',
      is_create_org = false,
      org_id,
      org_name = '',
      org_code
    } = options;
    const codeVerifier = randomString();
    const codeChallenge = await pkceChallengeFromVerifier(codeVerifier);

    client.session.setItem('kindle.oauthState', state)
    client.session.setItem('kindle.oauthCodeVerifier', codeVerifier)

    let searchParams = {
      client_id: client.clientId,
      client_secret: client.clientSecret,
      response_type: 'code',
      grant_type : 'authorization_code',
      scope,
      state,
      start_page,
      redirect_uri: client.redirectUri,
      code_challenge: codeChallenge,
      code_challenge_method: 'S256',
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

    if (org_id) {
      searchParams.org_id = org_id;
    }

    return `${client.authorizationEndpoint}?${new URLSearchParams(searchParams).toString()}`;
  }

  async getToken(client, code, codeVerifier) {
    try {
      let searchParams = {
        grant_type: client.grantType,
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

      client.saveDataToSession(token);
      return token;
    } catch (e) {
      throw Error(e);
    }
  }
}
