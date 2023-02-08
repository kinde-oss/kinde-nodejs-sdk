import GrantType from "./sdk/constant/grantType";
import AuthorizationCode from "./sdk/oauth2/AuthorizationCode";
import ClientCredentials from "./sdk/oauth2/ClientCredentials";
import PKCE from "./sdk/oauth2/PCKE";
import { createStore, parseJWT } from "./sdk/utils/Utils";

export default class KindeClient {

    constructor(options) {
        const {
            domain,
            clientId,
            clientSecret,
            redirectUri,
            logoutRedirectUri,
            grantType,
            callbackUri
        } = options;

        if (!domain || typeof domain !== 'string') {
            throw new Error("Please provide domain");
        }
        this.domain = domain;

        if (!redirectUri || typeof redirectUri !== 'string') {
            throw new Error("Please provide redirectUri");
        }
        this.redirectUri = redirectUri;

        if (!clientSecret) {
            throw new Error("Please provide clientSecret");
        }
        this.clientSecret = clientSecret;

        if (!clientId) {
            throw new Error("Please provide clientId");
        }
        this.clientId = clientId;

        if (!grantType) {
            throw new Error("Please provide grantType");
        }

        if (![GrantType.CLIENT_CREDENTIALS, GrantType.AUTHORIZATION_CODE, GrantType.PKCE].includes(grantType)) {
            throw new Error("Please provide correct grantType");
        }
        this.grantType = grantType;

        if (!logoutRedirectUri || typeof logoutRedirectUri !== 'string') {
            throw new Error("Please provide logoutRedirectUri");
        }
        this.logoutRedirectUri = logoutRedirectUri;

        if (!callbackUri || typeof callbackUri !== 'string') {
            throw new Error("Please provide callbackUri");
        }
        this.callbackUri = callbackUri;


        // other endpoint
        this.tokenEndpoint = `${domain}/oauth2/token`;
        this.logoutEndpoint = `${domain}/logout`;
        this.authorizationEndpoint = `${domain}/oauth2/auth`;

        this.store = createStore()
    }

   /**
    * Login function to handle OAuth 2.0 authentication.
    * 
    * @param {Object} request - Express request object
    * @param {Object} response - Express response object
    * @param {Object} options - Additional options for the authentication process
    * @param {string} options.audience 
    * @param {string} options.start_page - This is a parameter that you can use to pass a value to the authorization server. Enum values are login, registration. Default value is login.
    * @param {string} options.state - This is an optional parameter that you can use to pass a value to the authorization server. The authorization server will return this value in the response.
    * @param {string} options.scope - The scopes you want to request.
    * @param {bool} options.is_create_org - This is parameter that you can use to pass a value to create an organization to the authorization server. Enum values are true, false. Default value is false.
    * @param {string} options.org_code - Organization code.
    * 
    * @returns {Response} HTTP response with either redirect URL or JSON error message
    */
    async login(request, response, options = {}) {
        if (!request.session) {
            return response.status(400).json({ error: 'OAuth 2.0 authentication requires session support when using state. Did you forget to use express-session middleware?' })
        }

        try {
            let auth;
            switch (this.grantType) {
                case GrantType.CLIENT_CREDENTIALS:
                    auth = new ClientCredentials();
                    const token = await auth.getToken(this, options);
                    this.saveToken(request, token);
                    return response.redirect(this.redirectUri);
                case GrantType.AUTHORIZATION_CODE:
                    auth = new AuthorizationCode();
                    const authCodeResponse = auth.getAuthorizeURL(this, {
                        ...options,
                        start_page: 'login'
                    });
                    request.session.kindeOauthState = authCodeResponse.state;
                    return response.redirect(authCodeResponse.url);
                case GrantType.PKCE:
                    auth = new PKCE();
                    const pkceResponse = await auth.getAuthorizeURL(this, {
                        ...options,
                        start_page: 'login'
                    });
                    request.session.kindeOauthState = pkceResponse?.state;
                    request.session.kindeOauthCodeVerifier = pkceResponse?.codeVerifier;
                    return response.redirect(pkceResponse?.url);
                default:
                    return response.status(400).json({ error: 'Please provide correct grant_type' });
            }
        } catch (err) {
            return response.status(500).json({ error: err.message });
        }
    }

    /**
     * It redirects the user to the authorization endpoint with the client id, redirect uri, a random
     * state, and the start page set to registration
     *
     * @param object options The object includes params to pass api.
     * @param string audience 
     * @param string start_page 
     * @param string state This is an optional parameter that you can use to pass a value to the
     * authorization server. The authorization server will return this value to you in the response.
     * @param string scope The scopes you want to request.
     * @param string is_create_org 
     * @param string org_code Organization code.
     * 
     * @return 
     */
    async register(request, response, options) {
        if (!request.session) {
            return response.status(400).json({ error: 'OAuth 2.0 authentication requires session support when using state. Did you forget to use express-session middleware?' })
        }
        try {
            let auth;
            switch (this.grantType) {
                case GrantType.AUTHORIZATION_CODE: 
                    auth = new AuthorizationCode();
                    const authCodeResponse = auth.getAuthorizeURL(this, {
                        ...options,
                        start_page: 'registration'
                    });
                    request.session.kindeOauthState = authCodeResponse.state;
                    return response.redirect(authCodeResponse.url);
                case GrantType.PKCE:
                    auth = new PKCE();
                    const pkceResponse = await auth.getAuthorizeURL(this, {
                        ...options,
                        start_page: 'registration'
                    });
                    request.session.kindeOauthState = pkceResponse?.state;
                    request.session.kindeOauthCodeVerifier = pkceResponse?.codeVerifier;
                    return response.redirect(pkceResponse?.url);
                default: 
                    return response.status(400).json({ error: 'Please provide correct grant_type' })
            }

        } catch (err) {
            return response.status(500).json({ error: err.message });
        }
    }

    /**
     * It takes the grant type as parameter, and returns the token
     * 
     * @param string urlCallback The call back url from auth server.
     */
    async callbackKinde(request, response) {
        try {
            const {
                code, state, scope, error, error_description
            } = request.query
            let token;
            let auth;
            if (error) {
                let msg = error_description ? error_description : error;
                return response.status(400).json({ error: msg });
            }

            if (!request.session.kindeOauthState || state !== request.session.kindeOauthState) {
                return response.status(400).json({ error: 'Authentication failed because it tries to validate state' });
            }

            if (!code) {
                return response.status(400).json({ error: 'Not found code param' });
            }

            if (this.grantType === GrantType.AUTHORIZATION_CODE) {
                auth = new AuthorizationCode();
                token = await auth.getToken(this, code, scope);
                this.saveDataToSession(request, token);
                return response.redirect(this.redirectUri);
            } else if (this.grantType === GrantType.PKCE) {
                let codeVerifier = request.session.kindeOauthCodeVerifier || '';
                if (!codeVerifier) {
                    return response.status(400).json({ error: 'Not found code_verifier' });
                }
                auth = new PKCE();
                token = await auth.getToken(this, code, codeVerifier);
                this.saveDataToSession(request, token);
                return response.redirect(this.redirectUri);
            } else {
                return response.status(401).json({ error: 'Please provide correct grantType' });
            }
        } catch (err) {
            return response.status(500).json({ error: err.message });
        }
    }

    /**
     * It redirects the user to the authorization endpoint with the client id, redirect uri, a random
     * state, and the start page set to registration and allow an organization to be created
     *
     *  @param array additionalParameters The array includes params to pass api.
     */
    createOrg(request, response, options) {
        return this.register(request, response, {
            ...options,
            start_page: 'registration',
            is_create_org: true
        });
    }

    /**
     * It unset's the token from the session and redirects the user to the logout endpoint
     */
    async logout(request, response) {
        try {
            this.cleanSession(request);
            const searchParams = {
                redirect: this.logoutRedirectUri
            };
            response.redirect(`${this.logoutEndpoint}?${new URLSearchParams(searchParams).toString()}`)
        } catch (e) {
            return response.status(500).json({ error: e.message})
        }
    }

    /**
     * Save token in req.session and store
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
                email: payload.email || ''
            };
            request.session.kindeUser = user;
            this.store.setItem('kindeUser', user);
        }
    }

    /**
     * Clean session
     */
    cleanSession(request) {        
        request?.session && request.session.destroy();

        this.store.removeItem('kindeAccessToken')
        this.store.removeItem('kindeIdToken')
        this.store.removeItem('kindeOauthState')
        this.store.removeItem('kindeOauthCodeVerifier')
        this.store.removeItem('kindeLoginTimeStamp')
        this.store.removeItem('kindeUser')
    }

    /**
     * It checks user is logged.
     *
     * @return {bool} The response is a bool, which check user logged or not
     */
    isAuthenticated() {
        if (!this.store.getItem('kinde_login_time_stamp') || !this.store.getItem('kinde_expires_in')) {
            return false;
        }
        return Date.now() / 1000 - this.store.getItem('kinde_login_time_stamp') < this.store.getItem('kinde_expires_in');
    }

    /**
     * It returns user's information after successful authentication
     *
     * @return object The response is a array containing id, given_name, family_name and email.
     */
    getUserDetails() {
        return this.store.getItem('kinde_user');
    }

    /**
     * Accept a key for a token and returns the claim value.
     * Optional argument to define which token to check - defaults to Access token  - e.g.
     *
     * @param string tokenType Optional argument to define which token to check.
     *
     * @return any The response is a data in token.
     */
    getClaims(tokenType = 'access_token') {
        if (!['access_token', 'id_token'].includes(tokenType)) {
            throw new Error('Please provide valid token (access_token or id_token) to get claim');
        }
        const token = this.store.getItem(`kinde_${tokenType}`) || '';
        if (!token) {
            throw new Error('Request is missing required authentication credential');
        }
        return parseJWT(token);
    }

    /**
     * Accept a key for a token and returns the claim value.
     * Optional argument to define which token to check - defaults to Access token  - e.g.
     *
     * @param string keyName Accept a key for a token.
     * @param string tokenType Optional argument to define which token to check.
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
     * @return object The response includes orgCode and permissions.
     */
    getPermissions() {
        const claims = this.getClaims();
        return {
            orgCode: claims['org_code'],
            permissions: claims['permissions']
        }
    }

    /**
     * Given a permission value, returns if it is granted or not (checks if permission key exists in the permissions claim array)
     * And relevant org code (checking against claim org_code) e.g
     *
     * @return object The response includes orgCode and isGranted.
     */
    getPermission(permission) {
        const allClaims = this.getClaims();
        const permissions = allClaims['permissions'];
        return {
            orgCode: allClaims['org_code'],
            isGranted: permissions.includes(permission)
        };
    }

    /**
     * Gets the org code (and later other org info) (checking against claim org_code)
     *
     * @return array The response is a orgCode.
     */
    getOrganization() {
        return {
            orgCode: this.getClaim('org_code')
        }
    }

    /**
     * Gets all org code
     *
     * @return object The response is a orgCodes.
     */
    getUserOrganizations() {
        return {
            orgCodes: this.getClaim('org_codes', 'id_token')
        }
    }
}