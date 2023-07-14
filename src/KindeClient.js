import FlagDataTypeMap from "./sdk/constant/FlagDataTypeMap";
import RefreshToken from "./sdk/oauth2/RefreshToken";
import { ApiClient, GrantType, SessionStore } from "./index";
import AuthorizationCode from "./sdk/oauth2/AuthorizationCode";
import ClientCredentials from "./sdk/oauth2/ClientCredentials";
import PKCE from "./sdk/oauth2/PKCE";
import { getSessionId, parseJWT, pkceChallengeFromVerifier, randomString } from "./sdk/utils/Utils";
import CookieOptions from "./sdk/constant/CookieOptions";
import { SDK_VERSION } from "./sdk/utils/SDKVersion";

/**
 * KindeClient class for OAuth 2.0 authentication.
 * @class KindeClient
 * @param {Object} options - Options object
 * @property {String} options.domain - Base URL of the Kinde authorization server
 * @property {String} options.clientId - Client ID of the application
 * @property {String} options.clientSecret - Client secret of the application
 * @property {String} options.redirectUri - Redirection URI registered in the authorization server
 * @property {String} options.logoutRedirectUri - URI to redirect the user after logout
 * @property {String} options.grantType - Grant type for the authentication process (client_credentials, authorization_code or pkce)
 * @property {String} options.audience - API Identifier for the target API (Optional)
 * @property {String} options.scope - List of scopes requested by the application (default: 'openid profile email offline')
 * @property {String} options.kindeSdkLanguage - Kinde SDK language name (default: 'Javascript')
 * @property {String} options.kindeSdkLanguageVersion - Kinde SDK language version
 */
export default class KindeClient extends ApiClient {
  constructor(options) {
    const {
      domain,
      clientId,
      clientSecret,
      redirectUri,
      logoutRedirectUri,
      grantType,
      audience = '',
      scope = 'openid profile email offline',
      kindeSdkLanguage = 'JavaScript',
      kindeSdkLanguageVersion = SDK_VERSION,
    } = options;

    if (!domain || typeof domain !== 'string') {
      throw new Error('Please provide domain');
    }
    super(domain);
    this.domain = domain;

    if (!redirectUri || typeof redirectUri !== 'string') {
      throw new Error('Please provide redirectUri');
    }
    this.redirectUri = redirectUri;

    if (!clientSecret) {
      throw new Error('Please provide clientSecret');
    }
    this.clientSecret = clientSecret;

    if (!clientId) {
      throw new Error('Please provide clientId');
    }
    this.clientId = clientId;

    if (!grantType) {
      throw new Error('Please provide grantType');
    }

    if (![GrantType.CLIENT_CREDENTIALS, GrantType.AUTHORIZATION_CODE, GrantType.PKCE].includes(grantType)) {
      throw new Error('Please provide correct grantType');
    }
    this.grantType = grantType;

    if (!logoutRedirectUri || typeof logoutRedirectUri !== 'string') {
      throw new Error('Please provide logoutRedirectUri');
    }
    this.logoutRedirectUri = logoutRedirectUri;

    this.audience = audience;
    this.scope = scope;
    this.kindeSdkLanguage = kindeSdkLanguage;
    this.kindeSdkLanguageVersion = kindeSdkLanguageVersion;

    // other endpoint
    this.tokenEndpoint = `${domain}/oauth2/token`;
    this.logoutEndpoint = `${domain}/logout`;
    this.authorizationEndpoint = `${domain}/oauth2/auth`;
  }

  /**
   * Login middleware function to handle OAuth 2.0 authentication.
   * @returns {Function} Middleware function for handling the authorization response
   * @property {Object} request - The HTTP request object
   * @property {String} request.query.state - Optional parameter used to pass a value to the authorization server
   * @property {String} request.query.org_code - Organization code
   */
  login() {
    return async (req, res, next) => {
      const sessionId = getSessionId(req);
      const {
        state = randomString(),
        org_code,
      } = req.query;

      if (SessionStore.getDataByKey(sessionId, 'kindeAccessToken') && !this.isTokenExpired(sessionId)) {
        return next();
      }

      try {
        let auth, authorizationURL;
        switch (this.grantType) {
          case  GrantType.CLIENT_CREDENTIALS:
            auth = new ClientCredentials();
            const res_get_token = await auth.getToken(this);
            if (res_get_token?.error) {
              const msg = res_get_token?.error_description || res_get_token?.error;
              return next(new Error(msg));
            }
            this.saveToken(sessionId, res_get_token);
            return next();

          case GrantType.AUTHORIZATION_CODE:
            auth = new AuthorizationCode();
            authorizationURL = auth.generateAuthorizationURL(this, {
              state,
              org_code,
              start_page: 'login',
            });
            SessionStore.setDataByKey(sessionId, 'kindeOauthState', state);
            res.cookie('sessionId', sessionId, CookieOptions);
            return res.redirect(authorizationURL);

          case GrantType.PKCE:
            auth = new PKCE();
            const codeVerifier = randomString();
            const codeChallenge = pkceChallengeFromVerifier(codeVerifier);
            authorizationURL = auth.generateAuthorizationURL(this, {
              state,
              org_code,
              start_page: 'login',
            }, codeChallenge);
            SessionStore.setDataByKey(sessionId, 'kindeOauthState', state);
            SessionStore.setDataByKey(sessionId, 'kindeOauthCodeVerifier', codeVerifier);
            res.cookie('sessionId', sessionId, CookieOptions);
            return res.redirect(authorizationURL);
        }
      } catch (err) {
        return next(new Error(err));
      }
    };
  }

  /**
   * Register middleware function to handle OAuth 2.0 authentication.
   * @returns {Function} Middleware function for handling the authorization response
   * @property {Object} request - The HTTP request object
   * @property {String} request.query.state - Optional parameter used to pass a value to the authorization server
   * @property {String} request.query.org_code - Organization code
   */
  register() {
    return (req, res, next) => {
      const sessionId = getSessionId(req);
      const {
        state = randomString(),
        org_code,
      } = req.query;

      if (SessionStore.getDataByKey(sessionId, 'kindeAccessToken') && !this.isTokenExpired(sessionId)) {
        return next();
      }

      try {
        let auth, authorizationURL;
        switch (this.grantType) {
          case GrantType.AUTHORIZATION_CODE:
            auth = new AuthorizationCode();
            authorizationURL = auth.generateAuthorizationURL(this, {
              state,
              org_code,
              start_page: 'registration',
            });
            SessionStore.setDataByKey(sessionId, 'kindeOauthState', state);
            res.cookie('sessionId', sessionId, CookieOptions);
            return res.redirect(authorizationURL);

          case GrantType.PKCE:
            auth = new PKCE();
            const codeVerifier = randomString();
            const codeChallenge = pkceChallengeFromVerifier(codeVerifier);
            authorizationURL = auth.generateAuthorizationURL(this, {
              state,
              org_code,
              start_page: 'registration',
            }, codeChallenge);
            SessionStore.setDataByKey(sessionId, 'kindeOauthState', state);
            SessionStore.setDataByKey(sessionId, 'kindeOauthCodeVerifier', codeVerifier);
            res.cookie('sessionId', sessionId, CookieOptions);
            return res.redirect(authorizationURL);
        }
      } catch (err) {
        return next(new Error(err));
      }
    };
  }

  /**
   * Callback middleware function for Kinde OAuth 2.0 flow
   * This function is responsible for handling the response from the authorization server
   * and obtaining the access token.
   * @returns {Function} Middleware function for handling the authorization response
   */
  callback() {
    return async (req, res, next) => {
      const sessionId = getSessionId(req);
      try {
        if (SessionStore.getDataByKey(sessionId, 'kindeAccessToken') && !this.isTokenExpired(sessionId)) {
          return next();
        }

        const {
          code, state, error, error_description
        } = req.query;
        let auth, res_get_token;

        // Check if the authorization response contains error
        if (error) {
          const msg = error_description || error;
          return next(new Error(msg));
        }

        // Validate the state parameter
        if (!SessionStore.getDataByKey(sessionId, 'kindeOauthState') || state !== SessionStore.getDataByKey(sessionId, 'kindeOauthState')) {
          return next(new Error('Authentication failed because it tries to validate state'));
        }

        // Check if the authorization response contains code
        if (!code) {
          return next(new Error('Not found code param'));
        }

        // Determine the grant type and get the access token
        switch (this.grantType) {
          case GrantType.AUTHORIZATION_CODE:
            auth = new AuthorizationCode();
            res_get_token = await auth.getToken(this, code);
            if (res_get_token?.error) {
              const msg = res_get_token?.error_description || res_get_token?.error;
              return next(new Error(msg));
            }
            this.saveToken(sessionId, res_get_token);
            return next();

          case GrantType.PKCE:
            const codeVerifier = SessionStore.getDataByKey(sessionId, 'kindeOauthCodeVerifier');
            if (!codeVerifier) {
              return next(new Error('Not found code_verifier'));
            }
            auth = new PKCE();
            res_get_token = await auth.getToken(this, code, codeVerifier);
            if (res_get_token?.error) {
              const msg = res_get_token?.error_description || res_get_token?.error;
              return next(new Error(msg));
            }
            this.saveToken(sessionId, res_get_token);
            return next();
        }
      } catch (err) {
        this.clearSession(sessionId, res);
        return next(new Error(err));
      }
    };
  }

  /**
   * CreateOrg middleware functions allows an organization to be created.
   * @returns {Function} Middleware function for handling the authorization response
   * @property {Object} request - The HTTP request object
   * @property {String} request.query.state - Optional parameter used to pass a value to the authorization server
   * @property {Boolean} request.query.is_create_org - Flag indicating if the user is creating a new organization
   * @property {String} request.query.org_name - Organization name
   */
  createOrg() {
    return (req, res, next) => {
      const sessionId = getSessionId(req);
      if (SessionStore.getDataByKey(sessionId, 'kindeAccessToken') && !this.isTokenExpired(sessionId)) {
        return next();
      }

      const {
        state = randomString(),
        is_create_org = true,
        org_name = '',
      } = req.query;

      try {
        let auth, authorizationURL;
        switch (this.grantType) {
          case GrantType.AUTHORIZATION_CODE:
            auth = new AuthorizationCode();
            authorizationURL = auth.generateAuthorizationURL(this, {
              state,
              is_create_org,
              org_name,
              start_page: 'registration',
            });
            SessionStore.setDataByKey(sessionId, 'kindeOauthState', state);
            res.cookie('sessionId', sessionId, CookieOptions);
            return res.redirect(authorizationURL);

          case GrantType.PKCE:
            auth = new PKCE();
            const codeVerifier = randomString();
            const codeChallenge = pkceChallengeFromVerifier(codeVerifier);
            authorizationURL = auth.generateAuthorizationURL(this, {
              state,
              is_create_org,
              org_name,
              start_page: 'registration',
            }, codeChallenge);
            SessionStore.setDataByKey(sessionId, 'kindeOauthState', state);
            SessionStore.setDataByKey(sessionId, 'kindeOauthCodeVerifier', codeVerifier);
            res.cookie('sessionId', sessionId, CookieOptions);
            return res.redirect(authorizationURL);
        }
      } catch (err) {
        return next(new Error(err));
      }
    };
  }

  /**
   * It destroy the token from the req.session and redirects the user to the logout redirect uri
   * @returns {Response} - The HTTP response with redirect logout URL
   */
  logout() {
    return (req, res) => {
      const sessionId = getSessionId(req);
      this.clearSession(sessionId, res);
      return res.redirect(`${this.logoutEndpoint}?redirect=${encodeURIComponent(this.logoutRedirectUri)}`);
    };
  }

  /**
   * saveToken - saves the tokens and user information to the store and req.session.
   * @param {String} sessionId - sessionId
   * @param {Object} token - Token object containing access_token, id_token, expires_in, etc ...
   */
  saveToken(sessionId, token) {
    this.authentications.kindeBearerAuth.accessToken = token.access_token;
    SessionStore.setData(sessionId, {
      kindeAccessToken: token.access_token,
      kindeIdToken: token.id_token,
      kindeRefreshToken: token.refresh_token,
      kindeLoginTimeStamp: Date.now(),
      kindeExpiresIn: token.expires_in,
    });

    if (token.id_token) {
      const payloadIdToken = parseJWT(token.id_token);
      if (payloadIdToken) {
        const user = {
          id: payloadIdToken.sub,
          given_name: payloadIdToken.given_name,
          family_name: payloadIdToken.family_name,
          email: payloadIdToken.email,
          picture: payloadIdToken.picture,
        };
        SessionStore.setDataByKey(sessionId, 'kindeUser', user);
      }
    }
    if (token.access_token) {
      const payloadAccessToken = parseJWT(token.access_token);
      if (payloadAccessToken) {
        const { feature_flags } = payloadAccessToken;
        SessionStore.setDataByKey(sessionId, 'kindeFeatureFlags', feature_flags);
      }
    }
  }

  /**
   * Retrieves the refresh token for the specified session ID and updates the authentication token.
   * @param {String} sessionId - The sessionId.
   * @throws {Error} If the refresh token is invalid or expired.
   * @throws {Error} If the refresh token is missing.
   */
  async getRefreshToken(sessionId) {
    const auth = new RefreshToken();
    const kindeRefreshToken = SessionStore.getDataByKey(sessionId, 'kindeRefreshToken');
    if (kindeRefreshToken) {
      const res_get_token = await auth.getToken(this, kindeRefreshToken);
      if (res_get_token?.error) {
        SessionStore.removeData(sessionId);
        delete this.authentications.kindeBearerAuth.accessToken;
        throw new Error('Refresh token is invalid or expired');
      }
      this.saveToken(sessionId, res_get_token);
      return res_get_token;
    } else {
      throw new Error('Cannot get token - user is not authenticated');
    }
  }

  /**
   * Function return an access token from memory
   * @param {Object} request - The HTTP request object
   * @returns {String} - Returns the access token
   */
  async getToken(request) {
    const sessionId = getSessionId(request);
    try {
      if (SessionStore.getDataByKey(sessionId, 'kindeAccessToken') && !this.isTokenExpired(sessionId)) {
        return SessionStore.getDataByKey(sessionId, 'kindeAccessToken');
      }
      let auth, res_get_token;
      if (this.grantType === GrantType.CLIENT_CREDENTIALS) {
        auth = new ClientCredentials();
        res_get_token = await auth.getToken(this);
        if (res_get_token?.error) {
          SessionStore.removeData(sessionId);
          delete this.authentications.kindeBearerAuth.accessToken;
          const msg = res_get_token?.error_description || res_get_token?.error;
          throw new Error(msg);
        }
        this.saveToken(sessionId, res_get_token);
        return res_get_token.access_token;
      }
      if (this.grantType === GrantType.AUTHORIZATION_CODE || this.grantType === GrantType.PKCE) {
        res_get_token = await this.getRefreshToken(sessionId);
        return res_get_token.access_token;
      }
    } catch (err) {
      SessionStore.removeData(sessionId);
      delete this.authentications.kindeBearerAuth.accessToken;
      throw new Error(err);
    }
  }

  /**
   * Checks if the access token has expired
   * @param {Object} sessionId - sessionId
   * @return {Boolean} True if the access token is not expired, false otherwise
   */
  isTokenExpired(sessionId) {
    const currentTime = Date.now();
    const kindeLoginTimeStamp = SessionStore.getDataByKey(sessionId, 'kindeLoginTimeStamp');
    const kindeExpiresIn = SessionStore.getDataByKey(sessionId, 'kindeExpiresIn');
    if (!kindeLoginTimeStamp || !kindeExpiresIn || currentTime > kindeLoginTimeStamp + kindeExpiresIn * 1000) {
      delete this.authentications.kindeBearerAuth.accessToken;
      return true;
    }
    return false;
  }

  /**
   * Check if the user is authenticated.
   * @param {Object} request - The HTTP request object
   * @returns {Boolean} true if the user is authenticated, otherwise false.
   */
  async isAuthenticated(request) {
    const sessionId = getSessionId(request);
    if (SessionStore.getDataByKey(sessionId, 'kindeAccessToken')) {
      if (this.isTokenExpired(sessionId)) {
        await this.getRefreshToken(sessionId);
      }
      return true;
    }
    return false;
  }

  /**
   * Get a flag from the feature_flags claim of the access_token.
   * @param {Object} request - The HTTP request object
   * @param {String} code - The name of the flag.
   * @param {Object} [defaultValueObj] - A fallback value if the flag isn't found.
   * @param {'s'|'b'|'i'|undefined} [flagType] - The data type of the flag (integer / boolean / string).
   * @return {Object} Flag details.
   */
  getFlag(request, code, defaultValueObj, flagType) {
    if (!this.isAuthenticated(request)) {
      throw new Error('Request is missing required authentication credential');
    }
    const sessionId = getSessionId(request);
    const flags = SessionStore.getDataByKey(sessionId, 'kindeFeatureFlags');
    const flag = flags && flags[code] ? flags[code] : {};
    const defaultValue = defaultValueObj?.defaultValue;
    if (flag.v === undefined && defaultValue === undefined) {
      throw new Error(
        `Flag ${code} does not exist, and no default value has been provided`
      );
    }

    if (flagType && flag.t && flagType !== flag.t) {
      throw new Error(
        `Flag ${code} is of type ${FlagDataTypeMap[flag.t]} - requested type ${FlagDataTypeMap[flagType]}`
      );
    }
    return {
      code,
      type: FlagDataTypeMap[flag.t || flagType],
      value: flag.v == null ? defaultValue : flag.v,
      is_default: flag.v == null,
    };
  }

  /**
   * Get a boolean flag from the feature_flags claim of the access_token.
   * @param {Object} request - The HTTP request object
   * @param {String} code - The name of the flag.
   * @param {Boolean} [defaultValue] - A fallback value if the flag isn't found.
   * @return {Boolean}
   */
  getBooleanFlag(request, code, defaultValue) {
    const flag = this.getFlag(request, code, { defaultValue }, 'b');
    return flag.value;
  }

  /**
   * Get a string flag from the feature_flags claim of the access_token.
   * @param {Object} request - The HTTP request object
   * @param {String} code - The name of the flag.
   * @param {String} [defaultValue] - A fallback value if the flag isn't found.
   * @return {String}
   */
  getStringFlag(request, code, defaultValue) {
    const flag = this.getFlag(request, code, { defaultValue }, 's');
    return flag.value;
  }

  /**
   * Get an integer flag from the feature_flags claim of the access_token.
   * @param {String} code - The name of the flag.
   * @param {Integer} [defaultValue] - A fallback value if the flag isn't found.
   * @return {Integer}
   */
  getIntegerFlag(request, code, defaultValue) {
    const flag = this.getFlag(request, code, { defaultValue }, 'i');
    return flag.value;
  }

  /**
   * clearSession - Function is used to destroy the current session and remove related data from store.
   * @param {String} sessionId - sessionId
   * @param {Object} response - Response object
   */
  clearSession(sessionId, response) {
    SessionStore.removeData(sessionId);
    delete this.authentications.kindeBearerAuth.accessToken;
    response.clearCookie('sessionId');
  }

  /**
   * It returns user's information after successful authentication
   * @param {Object} request - The HTTP request object
   * @return {Object} The response is a object containing id, given_name, family_name and email.
   */
  getUserDetails(request) {
    if (!this.isAuthenticated(request)) {
      throw new Error('Request is missing required authentication credential');
    }
    const sessionId = getSessionId(request);
    return SessionStore.getDataByKey(sessionId, 'kindeUser');
  }

  /**
   * Accept a key for a token and returns the claim value.
   * Optional argument to define which token to check - defaults to Access token  - e.g.
   * @param {Object} request - The HTTP request object
   * @param {String} tokenType Optional argument to define which token to check.
   * @return any The response is a data in token.
   */
  getClaims(request, tokenType = 'access_token') {
    if (!['access_token', 'id_token'].includes(tokenType)) {
      throw new Error('Please provide valid token (access_token or id_token) to get claim');
    }
    const sessionId = getSessionId(request);
    const tokenTypeParse = tokenType === 'access_token' ? 'AccessToken' : 'IdToken';
    const token = SessionStore.getDataByKey(sessionId, `kinde${tokenTypeParse}`);
    if (!token) {
      throw new Error('Request is missing required authentication credential');
    }
    return parseJWT(token);
  }

  /**
   * Get a claim from a token.
   * @param {Object} request - The HTTP request object
   * @param {string} claim - The name of the claim.
   * @param {String} {'access_token' | 'id_token'} [tokenType='access_token'] - The token to check
   * @return any The response is a data in token.
   */
  getClaim(request, claim, tokenType = 'access_token') {
    if (!this.isAuthenticated(request)) {
      throw new Error('Request is missing required authentication credential');
    }
    const data = this.getClaims(request, tokenType);
    return {
      name: claim,
      value: data[claim],
    };
  }

  /**
   * Get an array of permissions (from the permissions claim in access token)
   * And also the relevant org code (org_code claim in access token). e.g
   * @param {Object} request - The HTTP request object
   * @return {Object} The response includes orgCode and permissions.
   */
  getPermissions(request) {
    if (!this.isAuthenticated(request)) {
      throw new Error('Request is missing required authentication credential');
    }
    const claims = this.getClaims(request);
    return {
      orgCode: claims.org_code,
      permissions: claims.permissions,
    };
  }

  /**
   * Given a permission value, returns if it is granted or not (checks if permission key exists in the permissions claim array)
   * And relevant org code (checking against claim org_code) e.g
   * @param {Object} request - The HTTP request object
   * @return {Object} The response includes orgCode and isGranted.
   */
  getPermission(request, permission) {
    if (!this.isAuthenticated(request)) {
      throw new Error('Request is missing required authentication credential');
    }
    const allClaims = this.getClaims(request);
    const { permissions } = allClaims;
    return {
      orgCode: allClaims.org_code,
      isGranted: permissions.includes(permission),
    };
  }

  /**
   * Gets the org code (and later other org info) (checking against claim org_code)
   * @param {Object} request - The HTTP request object
   * @return {Object} The response is a orgCode.
   */
  getOrganization(request) {
    if (!this.isAuthenticated(request)) {
      throw new Error('Request is missing required authentication credential');
    }
    const allClaims = this.getClaims(request);
    const { org_code } = allClaims;
    return {
      orgCode: org_code,
    };
  }

  /**
   * Gets all org code
   * @param {Object} request - The HTTP request object
   * @return {Object} The response is a orgCodes.
   */
  getUserOrganizations(request) {
    if (!this.isAuthenticated(request)) {
      throw new Error('Request is missing required authentication credential');
    }
    const allClaims = this.getClaims(request, 'id_token');
    const { org_codes } = allClaims;
    return {
      orgCodes: org_codes,
    };
  }
}
