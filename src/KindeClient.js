import GrantType from "./sdk/constant/grantType";
import AuthorizationCode from "./sdk/oauth2/AuthorizationCode";
import ClientCredentials from "./sdk/oauth2/ClientCredentials";
import PKCE from "./sdk/oauth2/PCKE";
import { createStore, parseJWT } from "./sdk/utils/Utils";

/**
 * KindeClient class for OAuth 2.0 authentication.
 * @class KindeClient
 * @param {Object} options - Options object
 * @property {string} options.domain - Base URL of the Kinde authorization server
 * @property {string} options.clientId - Client ID of the application
 * @property {string} options.clientSecret - Client secret of the application
 * @property {string} options.redirectUri - Redirection URI registered in the authorization server
 * @property {string} options.logoutRedirectUri - URI to redirect the user after logout
 * @property {string} options.grantType - Grant type for the authentication process (client_credentials, authorization_code or pkce)
 * @property {string} options.homepageUri - Homepage URL of the application
 * @property {string} options.audience - API Identifier for the target API (Optional)
 * @property {string} options.scope - List of scopes requested by the application (default: 'openid profile email offline')
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
            homepageUri,
            audience = '',
            scope = 'openid profile email offline'
        } = options;

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
        this.grantType = grantType;

        if (!logoutRedirectUri || typeof logoutRedirectUri !== 'string') {
            throw new Error('Please provide logoutRedirectUri');
        }
        this.logoutRedirectUri = logoutRedirectUri;

        if (!homepageUri || typeof homepageUri !== 'string') {
            throw new Error('Please provide homepageUri');
        }
        this.homepageUri = homepageUri;
        this.audience = audience;
        this.scope = scope;

        // other endpoint
        this.tokenEndpoint = `${domain}/oauth2/token`;
        this.logoutEndpoint = `${domain}/logout`;
        this.authorizationEndpoint = `${domain}/oauth2/auth`;

        this.store = createStore();
    }

    /**
      * Login function to handle OAuth 2.0 authentication.
      *
      * @param {Object} request - Request object
      * @param {Object} response - Response object
      * @param {Object} options - Additional options for the authentication process
      * @property {string} options.start_page - URL of the page that will initiate the authorization
      * @property {string} options.state - Optional parameter used to pass a value to the authorization server
      * @property {bool} options.is_create_org - Flag indicating if the user is creating a new organization
      * @property {string} options.org_code - Organization code
      * @property {string} options.org_name - Organization name
      *
      * @returns {Response} HTTP response with redirect URL or JSON error message
      */
    async login(request, response, options = {}) {
        if (!request.session) {
            return response.status(400).json({ error: 'OAuth 2.0 authentication requires session support when using state. Did you forget to use express-session middleware?' });
        }

        try {
            let auth;
            if (this.grantType === GrantType.CLIENT_CREDENTIALS) {
                auth = new ClientCredentials();
                const token = await auth.getToken(this);
                this.saveToken(request, token);
                return response.redirect(this.homepageUri);
            } if (this.grantType === GrantType.AUTHORIZATION_CODE) {
                auth = new AuthorizationCode();
                const authCodeResponse = auth.generateAuthorizationURL(this, {
                    ...options,
                    start_page: 'login',
                });
                request.session.kindeOauthState = authCodeResponse.state;
                return response.redirect(authCodeResponse.url);
            } if (this.grantType === GrantType.PKCE) {
                auth = new PKCE();
                const pkceResponse = await auth.generateAuthorizationURL(this, {
                    ...options,
                    start_page: 'login',
                });
                request.session.kindeOauthState = pkceResponse?.state;
                request.session.kindeOauthCodeVerifier = pkceResponse?.codeVerifier;
                return response.redirect(pkceResponse?.url);
            }
            return response.status(400).json({ error: 'Please provide correct grant_type' });
        } catch (err) {
            return response.status(500).json({ error: err.message });
        }
    }

    /**
      * It redirects the user to the authorization endpoint with the client id,
      * redirect uri, a random state, and the start page set to registration
      *
      * @param {Object} request - Request object
      * @param {Object} response - Response object
      * @param {Object} options - Additional options for the authentication process
      * @property {string} options.start_page - URL of the page that will initiate the authorization
      * @property {string} options.state - Optional parameter used to pass a value to the authorization server
      * @property {bool} options.is_create_org - Flag indicating if the user is creating a new organization
      * @property {string} options.org_code - Organization code
      * @property {string} options.org_name - Organization name
      *
      * @return
      */
    async register(request, response, options) {
        if (!request.session) {
            return response.status(400).json({ error: 'OAuth 2.0 authentication requires session support when using state. Did you forget to use express-session middleware?' });
        }

        try {
            let auth;
            if (this.grantType === GrantType.AUTHORIZATION_CODE) {
                auth = new AuthorizationCode();
                const authCodeResponse = auth.generateAuthorizationURL(this, {
                    ...options,
                    start_page: 'registration',
                });
                request.session.kindeOauthState = authCodeResponse.state;
                return response.redirect(authCodeResponse.url);
            } if (this.grantType === GrantType.PKCE) {
                auth = new PKCE();
                const pkceResponse = await auth.generateAuthorizationURL(this, {
                    ...options,
                    start_page: 'registration',
                });
                request.session.kindeOauthState = pkceResponse?.state;
                request.session.kindeOauthCodeVerifier = pkceResponse?.codeVerifier;
                return response.redirect(pkceResponse?.url);
            }
            return response.status(400).json({ error: 'Please provide correct grantType' });
        } catch (err) {
            return response.status(500).json({ error: err.message });
        }
    }

    /**
     * Callback function for Kinde OAuth 2.0 flow
     * This function is responsible for handling the response from the authorization server
     * and obtaining the access token.
     *
     * @param {Object} request - Request object
     * @param {Object} response - Response object
     * 
     * @returns {Object} response - Save token in req.session and redirect to url
     */
    async callbackKinde(request, response) {
        try {
            const {
                code, state, scope, error, error_description,
            } = request.query;
            let token;
            let auth;

            // Check if the authorization response contains error
            if (error) {
                const msg = error_description || error;
                return response.status(400).json({ error: msg });
            }

            // Validate the state parameter
            if (!request.session.kindeOauthState || state !== request.session.kindeOauthState) {
                return response.status(400).json({ error: 'Authentication failed because it tries to validate state' });
            }

            // Check if the authorization response contains code
            if (!code) {
                return response.status(400).json({ error: 'Not found code param' });
            }

            // Determine the grant type and get the access token
            if (this.grantType === GrantType.AUTHORIZATION_CODE) {
                auth = new AuthorizationCode();
                token = await auth.getToken(this, code, scope);
                this.saveToken(request, token);
                return response.redirect(this.homepageUri);
            } if (this.grantType === GrantType.PKCE) {
                const codeVerifier = request.session.kindeOauthCodeVerifier || '';
                if (!codeVerifier) {
                    return response.status(400).json({ error: 'Not found code_verifier' });
                }
                auth = new PKCE();
                token = await auth.getToken(this, code, codeVerifier);
                this.saveToken(request, token);
                return response.redirect(this.homepageUri);
            }
            return response.status(400).json({ error: 'Please provide correct grantType' });
        } catch (err) {
            return response.status(500).json({ error: err.message });
        }
    }

    /**
     * It redirects the user to the authorization endpoint with the client id, redirect uri, a random
     * state, and the start page set to registration and allow an organization to be created
     *
     * @param {Object} request - Request object
     * @param {Object} response - Response object
     * @param {Object} options - Additional options for the authentication process
     * @property {string} options.start_page - URL of the page that will initiate the authorization
     * @property {string} options.state - Optional parameter used to pass a value to the authorization server
     * @property {bool} options.is_create_org - Flag indicating if the user is creating a new organization
     * @property {string} options.org_code - Organization code
     * @property {string} options.org_name - Organization name
     * 
     * @returns {Object} response - Redirect to register url
     */
    createOrg(request, response, options) {
        return this.register(request, response, {
            ...options,
            start_page: 'registration',
            is_create_org: true,
        });
    }

    /**
      * It destroy the token from the req.session and redirects the user to the logout endpoint
      * @param {Object} request - Request object
      * @param {Object} response - Response object
      * 
      * @returns {Object} response - Redirect to logout url
      */
    async logout(request, response) {
        try {
            this.cleanSession(request);
            const searchParams = {
                redirect: this.logoutRedirectUri,
            };
            response.redirect(`${this.logoutEndpoint}?${new URLSearchParams(searchParams).toString()}`);
        } catch (e) {
            return response.status(500).json({ error: e.message });
        }
    }

    /**
     * saveToken - saves the tokens and user information to the store and req.session.
     *
     * @param  {Object} request - Request object
     * @param  {Object} token - Token object containing access_token, id_token, expires_in
     */
    saveToken(request, token) {
        const kindeLoginTimeStamp = Date.now();
        this.store.setItem('kindeLoginTimeStamp', kindeLoginTimeStamp);
        this.store.setItem('kindeAccessToken', token.access_token || '');
        this.store.setItem('kindeIdToken', token.id_token || '');
        this.store.setItem('kindeExpiresIn', token.expires_in || 0);

        request.session.kindeLoginTimeStamp = kindeLoginTimeStamp;
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
            };
            request.session.kindeUser = user;
            this.store.setItem('kindeUser', user);
        }
    }

    /**
     * cleanSession - Function is used to destroy the current session and remove related data from store.
     * 
     * @param {Object} request - Request object
     */
    cleanSession(request) {
        request?.session && request?.session?.destroy();

        this.store.removeItem('kindeAccessToken');
        this.store.removeItem('kindeIdToken');
        this.store.removeItem('kindeOauthState');
        this.store.removeItem('kindeOauthCodeVerifier');
        this.store.removeItem('kindeLoginTimeStamp');
        this.store.removeItem('kindeExpireIn');
        this.store.removeItem('kindeUser');
    }

    /**
     * Check if the user is authenticated.
     * 
     * @returns {bool} true if the user is authenticated, otherwise false.
     */
    isAuthenticated() {
        if (!this.store.getItem('kindeLoginTimeStamp') || !this.store.getItem('kindeExpiresIn')) {
            return false;
        }
        return Date.now() / 1000 - this.store.getItem('kindeLoginTimeStamp') < this.store.getItem('kindeExpiresIn');
    }

    /**
     * It returns user's information after successful authentication
     *
     * @return {Object} The response is a object containing id, given_name, family_name and email.
     */
    getUserDetails() {
        return this.store.getItem('kindeUser');
    }

    /**
     * Accept a key for a token and returns the claim value.
     * Optional argument to define which token to check - defaults to Access token  - e.g.
     *
     * @param {string} tokenType Optional argument to define which token to check.
     *
     * @return any The response is a data in token.
     */
    getClaims(tokenType = 'access_token') {
        if (!['access_token', 'id_token'].includes(tokenType)) {
            throw new Error('Please provide valid token (access_token or id_token) to get claim');
        }
        const tokenTypeParse = tokenType === 'access_token' ? 'AccessToken' : 'IdToken'
        const token = this.store.getItem(`kinde${tokenTypeParse}`) || '';
        if (!token) {
            throw new Error('Request is missing required authentication credential');
        }
        return parseJWT(token);
    }

    /**
     * Accept a key for a token and returns the claim value.
     * Optional argument to define which token to check - defaults to Access token  - e.g.
     *
     * @param {string} keyName - Accept a key for a token.
     * @param {string} tokenType - Optional argument to define which token to check.
     *
     * @return any The response is a data in token.
     */
    getClaim(keyName, tokenType = 'access_token') {
        const data = this.getClaims(tokenType);
        return data[keyName];
    }

    /**
     * Get an array of permissions (from the permissions claim in access token)
     * And also the relevant org code (org_code claim in access token). e.g
     *
     * @return {Object} The response includes orgCode and permissions.
     */
    getPermissions() {
        const claims = this.getClaims();
        return {
            orgCode: claims.org_code,
            permissions: claims.permissions,
        };
    }

    /**
     * Given a permission value, returns if it is granted or not (checks if permission key exists in the permissions claim array)
     * And relevant org code (checking against claim org_code) e.g
     *
     * @return {Object} The response includes orgCode and isGranted.
     */
    getPermission(permission) {
        const allClaims = this.getClaims();
        const { permissions } = allClaims;
        return {
            orgCode: allClaims.org_code,
            isGranted: permissions.includes(permission),
        };
    }

    /**
     * Gets the org code (and later other org info) (checking against claim org_code)
     *
     * @return {Object} The response is a orgCode.
     */
    getOrganization() {
        return {
            orgCode: this.getClaim('org_code'),
        };
    }

    /**
     * Gets all org code
     *
     * @return {Object} The response is a orgCodes.
     */
    getUserOrganizations() {
        return {
            orgCodes: this.getClaim('org_codes', 'id_token'),
        };
    }
}
