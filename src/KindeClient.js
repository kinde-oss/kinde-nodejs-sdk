import GrantType from "./sdk/constant/grantType";
import AuthorizationCode from "./sdk/oauth2/AuthorizationCode";
import ClientCredentials from "./sdk/oauth2/ClientCredentials";
import PKCE from "./sdk/oauth2/PKCE";
import { parseJWT, randomString } from "./sdk/utils/Utils";

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
 */
export default class KindeClient {
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
    } = options

    if (!domain || typeof domain !== 'string') {
      throw new Error('Please provide domain');
    }
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
    this.grantType = grantType

    if (!logoutRedirectUri || typeof logoutRedirectUri !== 'string') {
      throw new Error('Please provide logoutRedirectUri');
    }
    this.logoutRedirectUri = logoutRedirectUri;

    this.audience = audience;
    this.scope = scope;

    // other endpoint
    this.tokenEndpoint = `${domain}/oauth2/token`;
    this.logoutEndpoint = `${domain}/logout`;
    this.authorizationEndpoint = `${domain}/oauth2/auth`;
  }

  /**
   * Login middleware function to handle OAuth 2.0 authentication.
   * @returns {Function} Middleware function for handling the authorization response
   * @property {Object} request - Request object
   * @property {String} request.query.state - Optional parameter used to pass a value to the authorization server
   * @property {String} request.query.org_code - Organization code
   */
  login() {
    return async (req, res, next) => {
      if (!req.session) {
        return next(new Error('OAuth 2.0 authentication requires session support when using state. Did you forget to use express-session middleware?'));
      }

      if(req.session.kindeAccessToken){
        return next();
      }

      const {
        state = randomString(),
        org_code,
      } = req.query;

      try {
        let auth;
        if (this.grantType === GrantType.CLIENT_CREDENTIALS) {
          auth = new ClientCredentials();
          const token = await auth.getToken(this);
          this.saveToken(req, token);
          return next();
        } if (this.grantType === GrantType.AUTHORIZATION_CODE) {
          auth = new AuthorizationCode();
          const authCodeResponse = auth.generateAuthorizationURL(this, {
            state,
            org_code,
            start_page: 'login',
          });
          req.session.kindeOauthState = authCodeResponse.state;
          return res.redirect(authCodeResponse.url);
        } if (this.grantType === GrantType.PKCE) {
          auth = new PKCE();
          const pkceResponse = await auth.generateAuthorizationURL(this, {
            state,
            org_code,
            start_page: 'login',
          });
          req.session.kindeOauthState = pkceResponse?.state;
          req.session.kindeOauthCodeVerifier = pkceResponse?.codeVerifier;
          return res.redirect(pkceResponse?.url);
        }
        return next(new Error('Please provide correct grantType'));
      } catch (err) {
        return next(new Error(err));
      }
    }
  }

  /**
   * Register middleware function to handle OAuth 2.0 authentication.
   * @returns {Function} Middleware function for handling the authorization response
   * @property {Object} request - Request object
   * @property {String} request.query.state - Optional parameter used to pass a value to the authorization server
   * @property {String} request.query.org_code - Organization code
   */
  register() {
    return async (req, res, next) => {
      if (!req.session) {
        return next(new Error('OAuth 2.0 authentication requires session support when using state. Did you forget to use express-session middleware?'));
      }

      if(req.session.kindeAccessToken){
        return next();
      }

      const {
        state = randomString(),
        org_code,
      } = req.query;

      try {
        let auth;
        if (this.grantType === GrantType.AUTHORIZATION_CODE) {
          auth = new AuthorizationCode();
          const authCodeResponse = auth.generateAuthorizationURL(this, {
            state,
            org_code,
            start_page: 'registration',
          });
          req.session.kindeOauthState = authCodeResponse.state;
          return res.redirect(authCodeResponse.url);
        } if (this.grantType === GrantType.PKCE) {
          auth = new PKCE();
          const pkceResponse = await auth.generateAuthorizationURL(this, {
            state,
            org_code,
            start_page: 'registration',
          })
          req.session.kindeOauthState = pkceResponse?.state;
          req.session.kindeOauthCodeVerifier = pkceResponse?.codeVerifier;
          return res.redirect(pkceResponse?.url);
        }
        return next(new Error('Please provide correct grantType'));
      } catch (err) {
        return next(new Error(err));
      }
    }
  }

  /**
   * Callback middleware function for Kinde OAuth 2.0 flow
   * This function is responsible for handling the response from the authorization server
   * and obtaining the access token.
   * @returns {Function} Middleware function for handling the authorization response
   */
  callback() {
    return async (req, res, next) => {
      try {
        if(req.session.kindeAccessToken){
          return next();
        }

        const {
          code, state, error, error_description
        } = req.query;
        let resGetToken;
        let auth;

        // Check if the authorization response contains error
        if (error) {
          const msg = error_description || error;
          return next(new Error(msg));
        }

        // Validate the state parameter
        if (!req.session.kindeOauthState || state !== req.session.kindeOauthState) {
          return next(new Error('Authentication failed because it tries to validate state'));
        }

        // Check if the authorization response contains code
        if (!code) {
          return next(new Error('Not found code param'));
        }

        // Determine the grant type and get the access token
        if (this.grantType === GrantType.AUTHORIZATION_CODE) {
          auth = new AuthorizationCode();
          resGetToken = await auth.getToken(this, code);
          if (resGetToken?.error) {
            const msg = resGetToken?.error_description || resGetToken?.error;
            return next(new Error(msg));
          }
          this.saveToken(req, resGetToken);
          return next();
        }

        if (this.grantType === GrantType.PKCE) {
          const codeVerifier = req.session.kindeOauthCodeVerifier || '';
          if (!codeVerifier) {
            return next(new Error('Not found code_verifier'));
          }
          auth = new PKCE();
          resGetToken = await auth.getToken(this, code, codeVerifier);
          if (resGetToken?.error) {
            const msg = resGetToken?.error_description || resGetToken?.error;
            return next(new Error(msg));
          }
          this.saveToken(req, resGetToken);
          return next();
        }
        return next(new Error('Please provide correct grantType'));
      } catch (err) {
        return next(new Error(err));
      }
    }
  }

  /**
   * CreateOrg middleware functions allows an organization to be created.
   * @returns {Function} Middleware function for handling the authorization response
   * @property {Object} request - Request object
   * @property {String} request.query.state - Optional parameter used to pass a value to the authorization server
   * @property {Boolean} request.query.is_create_org - Flag indicating if the user is creating a new organization
   * @property {String} request.query.org_name - Organization name
   */
  createOrg() {
    return async (req, res, next) => {
      if (!req.session) {
        return next(new Error('OAuth 2.0 authentication requires session support when using state. Did you forget to use express-session middleware?'));
      }

      if(req.session.kindeAccessToken){
        return next();
      }

      const {
        state = randomString(),
        is_create_org = true,
        org_name = '',
      } = req.query

      try {
        let auth
        if (this.grantType === GrantType.AUTHORIZATION_CODE) {
          auth = new AuthorizationCode();
          const authCodeResponse = auth.generateAuthorizationURL(this, {
            state,
            is_create_org,
            org_name,
            start_page: 'registration',
          })
          req.session.kindeOauthState = authCodeResponse.state;
          return res.redirect(authCodeResponse.url);
        } if (this.grantType === GrantType.PKCE) {
          auth = new PKCE();
          const pkceResponse = await auth.generateAuthorizationURL(this, {
            state,
            is_create_org,
            org_name,
            start_page: 'registration',
          })
          req.session.kindeOauthState = pkceResponse?.state;
          req.session.kindeOauthCodeVerifier = pkceResponse?.codeVerifier;
          return res.redirect(pkceResponse?.url);
        }
        return next(new Error('Please provide correct grantType'));
      } catch (err) {
        return next(new Error(err));
      }
    }
  }

  /**
   * It destroy the token from the req.session and redirects the user to the logout endpoint
   * @returns {Response} HTTP response with redirect logout URL
   */
  logout() {
    return (req, res) => {
      try {
        this.cleanSession(req);
        return res.redirect(`${this.logoutEndpoint}?redirect=${this.logoutRedirectUri}`);
      } catch (e) {
        return res.status(500).json({ error: e.message });
      }
    }
  }

  /**
   * saveToken - saves the tokens and user information to the store and req.session.
   * @param  {Object} request - Request object
   * @param  {Object} token - Token object containing access_token, id_token, expires_in, etc ...
   */
  saveToken(request, token) {
    request.session.kindeLoginTimeStamp = Date.now();
    request.session.kindeAccessToken = token.access_token || '';
    request.session.kindeIdToken = token.id_token || '';
    request.session.kindeExpiresIn = token.expires_in || 0;
    const payload = parseJWT(token.id_token || '');
    if (payload) {
      const user = {
        id: payload.sub || '',
        given_name: payload.given_name || '',
        family_name: payload.family_name || '',
        email: payload.email || '',
      }
      request.session.kindeUser = user;
    }
  }

  /**
   * cleanSession - Function is used to destroy the current session and remove related data from store.
   * @param {Object} request - Request object
   */
  cleanSession(request) {
    request?.session && request?.session?.destroy();
  }

  /**
   * Check if the user is authenticated.
   * @param {Object} request - Request object
   * @returns {Boolean} true if the user is authenticated, otherwise false.
   */
  isAuthenticated(request) {
    if (!request.session.kindeLoginTimeStamp || !request.session.kindeExpiresIn) {
      return false;
    }
    return Date.now() / 1000 - request.session.kindeLoginTimeStamp < request.session.kindeExpiresIn;
  }

  /**
   * It returns user's information after successful authentication
   * @param {Object} request - Request object
   * @return {Object} The response is a object containing id, given_name, family_name and email.
   */
  getUserDetails(request) {
    if (!this.isAuthenticated(request)){
      throw new Error('Request is missing required authentication credential');
    }
    return request.session.kindeUser;
  }

  /**
   * Accept a key for a token and returns the claim value.
   * Optional argument to define which token to check - defaults to Access token  - e.g.
   * @param {Object} request - Request object
   * @param {String} tokenType Optional argument to define which token to check.
   * @return any The response is a data in token.
   */
  getClaims(request, tokenType = 'access_token') {
    if (!['access_token', 'id_token'].includes(tokenType)) {
      throw new Error('Please provide valid token (access_token or id_token) to get claim');
    }
    const tokenTypeParse = tokenType === 'access_token' ? 'AccessToken' : 'IdToken';
    const token = request.session[`kinde${tokenTypeParse}`] || '';
    if (!token) {
      throw new Error('Request is missing required authentication credential');
    }
    return parseJWT(token);
  }

  /**
   * Accept a key for a token and returns the claim value.
   * Optional argument to define which token to check - defaults to Access token  - e.g.
   * @param {Object} request - Request object
   * @param {String} keyName - Accept a key for a token.
   * @param {String} tokenType - Optional argument to define which token to check.
   * @return any The response is a data in token.
   */
  getClaim(request, keyName, tokenType = 'access_token') {
    if (!this.isAuthenticated(request)){
      throw new Error('Request is missing required authentication credential');
    }
    const data = this.getClaims(request, tokenType);
    return data[keyName];
  }

  /**
   * Get an array of permissions (from the permissions claim in access token)
   * And also the relevant org code (org_code claim in access token). e.g
   * @param {Object} request - Request object
   * @return {Object} The response includes orgCode and permissions.
   */
  getPermissions(request) {
    if (!this.isAuthenticated(request)){
      throw new Error('Request is missing required authentication credential');
    }
    const claims = this.getClaims(request);
    return {
      orgCode: claims.org_code,
      permissions: claims.permissions,
    }
  }

  /**
   * Given a permission value, returns if it is granted or not (checks if permission key exists in the permissions claim array)
   * And relevant org code (checking against claim org_code) e.g
   * @param {Object} request - Request object
   * @return {Object} The response includes orgCode and isGranted.
   */
  getPermission(request, permission) {
    if (!this.isAuthenticated(request)){
      throw new Error('Request is missing required authentication credential');
    }
    const allClaims = this.getClaims(request);
    const { permissions } = allClaims;
    return {
      orgCode: allClaims.org_code,
      isGranted: permissions.includes(permission),
    }
  }

  /**
   * Gets the org code (and later other org info) (checking against claim org_code)
   * @param {Object} request - Request object
   * @return {Object} The response is a orgCode.
   */
  getOrganization(request) {
    if (!this.isAuthenticated(request)){
      throw new Error('Request is missing required authentication credential');
    }
    return {
      orgCode: this.getClaim(request, 'org_code')
    }
  }

  /**
   * Gets all org code
   * @param {Object} request - Request object
   * @return {Object} The response is a orgCodes.
   */
  getUserOrganizations(request) {
    if (!this.isAuthenticated(request)){
      throw new Error('Request is missing required authentication credential');
    }
    return {
      orgCodes: this.getClaim(request, 'org_codes', 'id_token')
    }
  }
}

