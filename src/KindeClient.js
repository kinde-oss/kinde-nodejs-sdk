import FlagDataTypeMap from "./sdk/constant/FlagDataTypeMap";
import RefreshToken from "./sdk/oauth2/RefreshToken";
import { GrantType } from "./index";
import AuthorizationCode from "./sdk/oauth2/AuthorizationCode";
import ClientCredentials from "./sdk/oauth2/ClientCredentials";
import PKCE from "./sdk/oauth2/PKCE";
import { parseJWT, pkceChallengeFromVerifier, randomString } from "./sdk/utils/Utils";

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
 * @property {String} options.languageOrFramework - Language or framework name (default: 'Javascript')
 * @property {String} options.languageOrFrameworkVersion - Language or framework version (default: '3.0.9')
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
      languageOrFramework = 'JavaScript',
      languageOrFrameworkVersion = '3.0.9',
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
    this.languageOrFramework = languageOrFramework;
    this.languageOrFrameworkVersion = languageOrFrameworkVersion;

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
          const resGetToken = await auth.getToken(this);
          if (resGetToken?.error) {
            const msg = resGetToken?.error_description || resGetToken?.error;
            return next(new Error(msg));
          }
          this.saveToken(req, resGetToken);
          return next();
        }

        if (this.grantType === GrantType.AUTHORIZATION_CODE) {
          auth = new AuthorizationCode();
          const authorizationURL = auth.generateAuthorizationURL(this, {
            state,
            org_code,
            start_page: 'login',
          });
          req.session.kindeOauthState = state;
          return res.redirect(authorizationURL);
        } 

        if (this.grantType === GrantType.PKCE) {
          auth = new PKCE();
          const codeVerifier = randomString();
          const codeChallenge = pkceChallengeFromVerifier(codeVerifier);
          const authorizationURL = auth.generateAuthorizationURL(this, {
            state,
            org_code,
            start_page: 'login',
          }, codeChallenge);
          req.session.kindeOauthState = state;
          req.session.kindeOauthCodeVerifier = codeVerifier;
          return res.redirect(authorizationURL);
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
    return (req, res, next) => {
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
          const authorizationURL = auth.generateAuthorizationURL(this, {
            state,
            org_code,
            start_page: 'registration',
          });
          req.session.kindeOauthState = state;
          return res.redirect(authorizationURL);
        } 
        
        if (this.grantType === GrantType.PKCE) {
          auth = new PKCE();
          const codeVerifier = randomString();
          const codeChallenge = pkceChallengeFromVerifier(codeVerifier);
          const authorizationURL = auth.generateAuthorizationURL(this, {
            state,
            org_code,
            start_page: 'registration',
          }, codeChallenge)
          req.session.kindeOauthState = state;
          req.session.kindeOauthCodeVerifier = codeVerifier;
          return res.redirect(authorizationURL);
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
    return (req, res, next) => {
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
          const authorizationURL = auth.generateAuthorizationURL(this, {
            state,
            is_create_org,
            org_name,
            start_page: 'registration',
          })
          req.session.kindeOauthState = state;
          return res.redirect(authorizationURL);
        } 
        
        if (this.grantType === GrantType.PKCE) {
          auth = new PKCE();
          const codeVerifier = randomString();
          const codeChallenge = pkceChallengeFromVerifier(codeVerifier);
          const authorizationURL = auth.generateAuthorizationURL(this, {
            state,
            is_create_org,
            org_name,
            start_page: 'registration',
          }, codeChallenge)
          req.session.kindeOauthState = state;
          req.session.kindeOauthCodeVerifier = codeVerifier;
          return res.redirect(authorizationURL);
        }
        return next(new Error('Please provide correct grantType'));
      } catch (err) {
        return next(new Error(err));
      }
    }
  }

  /**
   * It destroy the token from the req.session and redirects the user to the logout redirect uri
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
   * @param {Object} request - Request object
   * @param {Object} token - Token object containing access_token, id_token, expires_in, etc ...
   */
  saveToken(request, token) {
    request.session.kindeLoginTimeStamp = Date.now();
    request.session.kindeAccessToken = token.access_token;
    request.session.kindeIdToken = token.id_token;
    request.session.kindeExpiresIn = token.expires_in || 0;
    request.session.kindeRefreshToken = token.refresh_token;
    const payloadIdToken = parseJWT(token.id_token);
    if (payloadIdToken) {
      const user = {
        id: payloadIdToken.sub,
        given_name: payloadIdToken.given_name,
        family_name: payloadIdToken.family_name,
        email: payloadIdToken.email,
        picture: payloadIdToken.picture,
      }
      request.session.kindeUser = user;
    }
    const payloadAccessToken = parseJWT(token.access_token);
    if (payloadAccessToken) {
      const { feature_flags } = payloadAccessToken;
      request.session.kindeFeatureFlags = feature_flags;
    }
  }

  /**
   * Function return an access token from memory
   * @param {Object} request - Request object
   * @returns {String} - Returns the access token
   */
  async getToken(request) {
    const { kindAccessToken, kindeRefreshToken } = request.session ?? {};
    if (kindAccessToken && !this.isTokenExpired(request)) {
      return kindAccessToken;
    }
    const auth = new RefreshToken();
    const resGetToken = await auth.getToken(this, kindeRefreshToken);
    if (resGetToken?.error) {
      throw new Error('Refresh token are invalid or expired.');
    }
    this.saveToken(request, resGetToken);
    return resGetToken.access_token;
  }

  /**
   * Checks if the access token has expired
   * @param {Object} request - Request object
   * @return {Boolean} True if the access token is not expired, false otherwise
   */
  isTokenExpired(request) {
    if (!request.session) {
      throw new Error('OAuth 2.0 authentication requires session support when using state. Did you forget to use express-session middleware?');
    }
    const currentTime = Date.now() / 1000;
    const tokenExpiration = request.session.kindeLoginTimeStamp + request.session.kindeExpiresIn;
    return currentTime > tokenExpiration;
  }

  /**
   * Get a flag from the feature_flags claim of the access_token.
   * @param {Object} request - Request object
   * @param {String} code - The name of the flag.
   * @param {obj} [defaultValue] - A fallback value if the flag isn't found.
   * @param {'s'|'b'|'i'|undefined} [flagType] - The data type of the flag (integer / boolean / string).
   * @return {Object} Flag details.
   */
  getFlag(request, code, defaultValue, flagType) {
    if (!this.isAuthenticated(request)) {
      throw new Error('Request is missing required authentication credential');
    }
    const flags = request.session.kindeFeatureFlags;
    const flag = flags && flags[code] ? flags[code] : {};
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
      is_default: flag.v == null
    };
  };

  /**
   * Get a boolean flag from the feature_flags claim of the access_token.
   * @param {Object} request - Request object
   * @param {String} code - The name of the flag.
   * @param {Boolean} [defaultValue] - A fallback value if the flag isn't found.
   * @return {Boolean}
   */
  getBooleanFlag(request, code, defaultValue) {
    const flag = this.getFlag(request, code, defaultValue, 'b');
    return flag.value;
  };

  /**
   * Get a string flag from the feature_flags claim of the access_token.
   * @param {Object} request - Request object
   * @param {String} code - The name of the flag.
   * @param {String} [defaultValue] - A fallback value if the flag isn't found.
   * @return {String}
   */
  getStringFlag(request, code, defaultValue) {
    const flag = this.getFlag(request, code, defaultValue, 's');
    return flag.value;
  };

  /**
   * Get an integer flag from the feature_flags claim of the access_token.
   * @param {Object} request - Request object
   * @param {String} code - The name of the flag.
   * @param {Integer} [defaultValue] - A fallback value if the flag isn't found.
   * @return {Integer}
   */
  getIntegerFlag(request, code, defaultValue) {
    const flag = this.getFlag(request, code, defaultValue, 'i');
    return flag.value;
  };

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
    if (!request.session.kindeLoginTimeStamp || !request.session.kindeExpiresIn || this.isTokenExpired(request)) {
      return false;
    }
    return true;
  }

  /**
   * It returns user's information after successful authentication
   * @param {Object} request - Request object
   * @return {Object} The response is a object containing id, given_name, family_name and email.
   */
  getUserDetails(request) {
    if (!this.isAuthenticated(request)) {
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
   * Get a claim from a token.
   * @param {Object} request - Request object
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
      value: data[claim]
    }
  }

  /**
   * Get an array of permissions (from the permissions claim in access token)
   * And also the relevant org code (org_code claim in access token). e.g
   * @param {Object} request - Request object
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
    }
  }

  /**
   * Given a permission value, returns if it is granted or not (checks if permission key exists in the permissions claim array)
   * And relevant org code (checking against claim org_code) e.g
   * @param {Object} request - Request object
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
    }
  }

  /**
   * Gets the org code (and later other org info) (checking against claim org_code)
   * @param {Object} request - Request object
   * @return {Object} The response is a orgCode.
   */
  getOrganization(request) {
    if (!this.isAuthenticated(request)) {
      throw new Error('Request is missing required authentication credential');
    }
    const allClaims = this.getClaims(request);
    const { org_code } = allClaims;
    return {
      orgCode: org_code
    }
  }

  /**
   * Gets all org code
   * @param {Object} request - Request object
   * @return {Object} The response is a orgCodes.
   */
  getUserOrganizations(request) {
    if (!this.isAuthenticated(request)) {
      throw new Error('Request is missing required authentication credential');
    }
    const allClaims = this.getClaims(request, 'id_token');
    const { org_codes } = allClaims;
    return {
      orgCodes: org_codes
    }
  }
}
