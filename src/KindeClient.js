import AuthStatus from "./sdk/constant/AuthStatus";
import GrantType from "./sdk/constant/grantType";
import AuthorizationCode from "./sdk/oauth2/AuthorizationCode";
import ClientCredentials from "./sdk/oauth2/ClientCredentials";
import PKCE from "./sdk/oauth2/PCKE";
import { parseJWT } from "./sdk/utils/Utils";

export default class KindeClient {

    constructor(options) {
        const {
          domain,
          clientId,
          clientSecret,
          redirectUri,
          callbackUri,
          logoutRedirectUri,
          grantType,
        } = options;

        if (!domain || typeof domain !== 'string') {
            throw new Error("Please provide domain");
        }
        this.domain = domain;
    
        if (!redirectUri || typeof redirectUri !== 'string') {
            throw new Error("Please provide redirect_uri");
        }
        this.redirectUri = redirectUri;
    
        if (!clientSecret) {
            throw new Error("Please provide client_secret");
        }
        this.clientSecret = clientSecret;
    
        if (!clientId) {
            throw new Error("Please provide client_id");
        }
        this.clientId = clientId;
    
        if (!grantType) {
            throw new Error("Please provide grant_type");
        }

        if (![GrantType.CLIENT_CREDENTIALS, GrantType.AUTHORIZATION_CODE, GrantType.PKCE].includes(grantType)) {
            throw new Error("Please provide correct grant_type");
        }
        this.grantType = grantType;
    
        if (!logoutRedirectUri || typeof logoutRedirectUri !== 'string') {
            throw new Error("Please provide logout_redirect_uri");
        }
        this.logoutRedirectUri = logoutRedirectUri;
        this.callbackUri = callbackUri;
        
        // other endpoint
        this.tokenEndpoint = `${domain}/oauth2/token`;
        this.logoutEndpoint = `${domain}/logout`;
        this.authorizationEndpoint = `${domain}/oauth2/auth`;

        this.authStatus = AuthStatus.UNAUTHENTICATED;
        this.session = null;
    }

    setSession(session) {
        this.session = session;
    }
    /**
     * A function that is used to login to the API.
     *
     * @param object options The object includes params to pass api.
     * @param string audience 
     * @param string start_page 
     * @param string state This is an optional parameter that you can use to pass a value to the
     * authorization server. The authorization server will return this value to you in the response.
     * @param string scope The scopes you want to request.
     * @param string is_create_org 
     * @param string org_name Organization name.
     * @param string org_code Organization code.
     * 
     * @return 
     */
    async login(options = {}) {
        if (this.session === null) {
            return new Error('Please call setSession before call this method'); 
        }
        this.cleanSession();
        let auth;
        let url;
        try {
            this.updateAuthStatus(AuthStatus.AUTHENTICATING);
            switch (this.grantType) {
                case GrantType.CLIENT_CREDENTIALS:
                    auth = new ClientCredentials();
                    const token = await auth.getToken(this, options);
                    return token
                case GrantType.AUTHORIZATION_CODE:
                    auth = new AuthorizationCode();
                    url = await auth.getAuthorizeURL(this, {
                        ...options,
                        start_page: 'login'
                    });
                    return url;
                case GrantType.PKCE:
                    auth = new PKCE();
                    url = await auth.getAuthorizeURL(this, {
                        ...options,
                        start_page: 'login'
                    });
                    return url;
                default:
                    this.authStatus = AuthStatus.UNAUTHENTICATED;
                    throw new Error("Please provide correct grant_type");
            }
        } catch (err) {
            this.authStatus = AuthStatus.UNAUTHENTICATED;
            throw err;
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
     * @param string org_name Organization name.
     * @param string org_code Organization code.
     * 
     * @return 
     */
    register(options) {
        if (this.session === null) {
            return new Error('Please call setSession before call this method'); 
        }
        this.updateAuthStatus(AuthStatus.AUTHENTICATING);
        if (this.grantType === GrantType.AUTHORIZATION_CODE){
            const auth = new AuthorizationCode();
            return auth.getAuthorizeURL(this, {
                ...options,
                start_page: 'registration'
            });
        } else if (this.grantType === GrantType.PKCE){
            const auth = new PKCE();
            return auth.getAuthorizeURL(this, {
                ...options,
                start_page: 'registration'
            });
        } else {
            throw Error('Please provide correct grant_type')
        }   
        
    }

    /**
     * It takes the grant type as parameter, and returns the token
     * 
     * @param string urlCallback The call back url from auth server.
     */
    async getTokenFromCallbackURL(options) {
        const {
            code, state, scope, error, error_description
        } = options
        let token;
        let auth;
        this.checkStateAuthentication(state);
        if (error) {
          let msg = error_description ? error_description : error;
          throw new Error(msg);
        }
        if (!code) {
          throw new Error('Not found code param');
        }
        if (this.grantType === GrantType.PKCE) {
            let codeVerifier = this.session['kinde_oauth_code_verifier'] || '';
            if ( !codeVerifier && this.grantType === GrantType.PKCE) {
              throw new Error('Not found code_verifier');
            }
            auth = new PKCE();
            token = await auth.getToken(this, code, codeVerifier);
        } else if (this.grantType === GrantType.AUTHORIZATION_CODE) {
            auth = new AuthorizationCode();
            token = await auth.getToken(this, code, scope)
        } else {
            throw new Error("Method doesn't support for this grant_type")
        }
    
        this.session.kinde_token = token;
        this.updateAuthStatus(AuthStatus.AUTHENTICATED);
        return token;
    }

    /**
     * It redirects the user to the authorization endpoint with the client id, redirect uri, a random
     * state, and the start page set to registration and allow an organization to be created
     *
     *  @param array additionalParameters The array includes params to pass api.
     */
    createOrg(options) {
        return this.register({
            ...options,
            start_page: 'registration',
            is_create_org: true
        });
    }

    /**
     * It unset's the token from the session and redirects the user to the logout endpoint
     */
    async logout() {
        try {
            this.cleanSession();
            this.updateAuthStatus(AuthStatus.UNAUTHENTICATED);
            const searchParams = {
                redirect: this.logoutRedirectUri
            };
            const res = await fetch(client.logoutEndpoint, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/x-www-form-urlencoded'          
                },
                body: new URLSearchParams(searchParams),
              });
              const response = await res.json();
              return response
        } catch(e) {
            throw new Error(e)
        }
    }

    /**
     * Save token in req.session
     */
    saveDataToSession(token) {
        this.session.kinde_login_time_stamp = Date.now();
        this.session.kinde_access_token = token.access_token || '';
        this.session.kinde_id_token = token.id_token || '';
        this.session.kinde_expires_in= token.expires_in || 0;
        const payload = parseJWT(token.id_token || '');
        if (payload) {
          const user = {
            id: payload.sub || '',
            given_name: payload.given_name || '',
            family_name: payload.family_name || '',
            email: payload.email || ''
          };
          this.session.kinde_user = user;
        }
    }

    /**
     * Update authStatus and save in req.session
     */
    updateAuthStatus(authStatus) {
        this.session.kinde_auth_status = authStatus;
        this.authStatus = authStatus;
    }

    /**
     * Clean session
     */
    cleanSession() {
        this.session?.destroy();
    }

    /**
     * Check state authentication
     */
    checkStateAuthentication(stateServer) {
        if (!this.session?.kinde_oauth_state || stateServer !== this.session?.kinde_oauth_state) {
            throw new Error("Authentication failed because it tries to validate state");
        }
    }

    /**
     * It checks user is logged.
     *
     * @return bool The response is a bool, which check user logged or not
     */
    isAuthenticated() {
        if (!this.session?.kinde_login_time_stamp || !this.session?.kinde_expires_in) {
            return false;
        }
        return Date.now() / 1000 - this.session.kinde_login_time_stamp < this.session.kinde_expires_in;
    }

    /**
     * It returns user's information after successful authentication
     *
     * @return object The response is a array containing id, given_name, family_name and email.
     */
    getUserDetails() {
        return this.session?.kinde_user;
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
        const token = this.session[`kinde_${tokenType}`] || '';
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
        return data[keyName] ;
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