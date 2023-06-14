# @kinde-oss/kinde-nodejs-sdk

@kinde-oss/kinde-nodejs-sdk - 
The Kinde Nodejs SDK allows developers to integrate with Express server using middleware, helpers function instead of manually using the HTTP and JSON API.

## Requirement
 - `Node version 18.x.x or newer`

## Install

Run the following command using npm:

```
npm install @kinde-oss/kinde-nodejs-sdk
```

If you prefer yarn, use this command instead:

```
yarn add @kinde-oss/kinde-nodejs-sdk
```
## How to use

The easiest way to get up and going is to use our starter kit [https://github.com/kinde-starter-kits/kinde-nodejs-starter-kit](https://github.com/kinde-starter-kits/kinde-nodejs-starter-kit)

## Getting Started
### Register for Kinde
You need a Kinde domain to get started, e.g. `yourapp.kinde.com`.
If you haven’t already got a Kinde account, [register for free here](http://app.kinde.com/register) (no credit card required).

### Set callback URLs

1. In Kinde, go to **Settings** > **Applications** > **Backend app**.
2. Add your callback URLs in the relevant fields. For example:

    - Allowed callback URLs - for example, `https://localhost:3000/callback`
    - Allowed logout redirect URLs - for example, `https://localhost:3000`

3. Select **Save**.

## Add environments

Kinde comes with a production environment, but you can set up other environments if you want to. Note that each environment needs to be set up independently, so you need to use the Environment subdomain in the code block above for those new environments.

## Configure your app

**Environment variables**

The following variables need to be replaced in the code snippets below.

-   `KINDE_DOMAIN` - your Kinde domain - e.g. `https://your_kinde_domain.kinde.com`
-   `KINDE_CLIENT_ID` - you can find this on the **App keys** page - e.g. `your_kinde_client_id`
-   `KINDE_CLIENT_SECRET` - you can find this on the **App keys** page - e.g. `your_kinde_client_secret`
-   `KINDE_REDIRECT_URI` - your callback url, make sure this URL is under your allowed callback redirect URLs. - e.g. `http://localhost:3000/callback`
-   `KINDE_LOGOUT_REDIRECT_URI` - where you want users to be redirected to after logging out, make sure this URL is under your allowed logout redirect URLs. - e.g. `http://localhost:3000`


## Integrate with your app
You need to execute the following JS code to create KindeClient instance: 

```javascript
require('dotenv').config();
const { KindeClient, GrantType } = require('@kinde-oss/kinde-nodejs-sdk');
const options = {
  domain: process.env.KINDE_DOMAIN,
  clientId: process.env.KINDE_CLIENT_ID,
  clientSecret: process.env.KINDE_CLIENT_SECRET,
  redirectUri: process.env.KINDE_REDIRECT_URI,
  logoutRedirectUri: process.env.KINDE_LOGOUT_REDIRECT_URI,
  grantType: GrantType.PKCE,
};
const kindeClient = new KindeClient(options);
```

## Login and registration

The Kinde client provides methods for easy to implement login / registration by the  following JS code:

### `For GrantType.CLIENT_CREDENTIALS`:

```javascript
...
app.get('/login', kindeClient.login(),(req, res) => {
  // do something in next step
  return res.redirect('/');
});

app.get('/register', kindeClient.register(),(req, res) => {
  // do something in next step 
  return res.redirect('/');
});
...
```
### `For GrantType.AUTHORIZATION_CODE or GrantType.PKCE`:
You will need to route `/callback` to call a function to handle this.
When the user is redirected back to your site from Kinde, this will call your callback URL defined in the `KINDE_REDIRECT_URI` variable. 

```javascript
...
app.get('/login', kindeClient.login(),(req, res) => {
  // do something in next step 
  return res.redirect('/');
});
app.get('/register', kindeClient.register(),(req, res) => {
  // do something in next step 
  return res.redirect('/');
});
app.get('/callback', kindeClient.callback(), (req, res) => {
  // do something in next step
  return res.redirect('/');
});
...
```
### View users in Kinde
Go to the **Users** page in Kinde to see who has registered.

## Logout

The Kinde client comes with a logout method.

```javascript
app.get('/logout', client.logout());
```
## Check isAuthenticated              
We have provided a helper to get a boolean value to check if a user is logged in by verifying that the access token is still

```javascript
kindeClient.isAuthenticated(req);
// true
``` 

## Get user information

You need to have already authenticated before you call the API, otherwise an error will occur.

Use the `OAuthApi` class, then call the getUser method.
```javascript
...
const { OAuthApi } = require('@kinde-oss/kinde-nodejs-sdk');
...
const apiInstance = new OAuthApi(kindeClient);
apiInstance.getUser((error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + JSON.stringify(data));
  }
});
```
### User Permissions

After a user signs in and they are verified, the token return includes permissions for that user. [User permissions are set in Kinde](https://kinde.com/docs/user-management/user-permissions), but you must also configure your application to unlock these functions.

```javascript
"permissions": [
    "create:todos",
    "update:todos",
    "read:todos",
    "delete:todos",
    "create:tasks",
    "update:tasks",
    "read:tasks",
    "delete:tasks",
];
```
We provide helper functions to more easily access permissions:

```javascript
kindeClient.getPermission(req, 'create:todos');
// { orgCode: 'org_1234', isGranted: true }

kindeClient.getPermissions(req);
// { orgCode: 'org_1234', permissions: ['create:todos', 'update:todos', 'read:todos'] }
```

A practical example in code might look something like:

```javascript
if (kindeClient.getPermission(req, 'create:todos')['isGranted']) {
    // create new a todo
}
```
## Feature flags

When a user signs in the Access token your product/application receives contains a custom claim called feature_flags which is an object detailing the feature flags for that user.

You can set feature flags in your Kinde account. Here’s an example.

```javascript
feature_flags: {
  theme: {
      "t": "s",
      "v": "pink"
 },
 is_dark_mode: {
      "t": "b",
      "v": true
  },
 competitions_limit: {
      "t": "i",
      "v": 5
  }
}
```
In order to minimize the payload in the token we have used single letter keys / values where possible. The single letters represent the following:

t = type

v = value

s = string

b = boolean

i = integer

We provide helper functions to more easily access feature flags:

```javascript
/**
 * Get a flag from the feature_flags claim of the access_token.
 * @param {Object} request - Request object
 * @param {String} code - The name of the flag.
 * @param {Object} [defaultValue] - A fallback value if the flag isn't found.
 * @param {'s'|'b'|'i'|undefined} [flagType] - The data type of the flag (integer / boolean / string).
 * @return {Object} Flag details.
 */
kindeClient.getFlag(req, code, { defaultValue }, flagType);

/* Example usage */

kindeClient.getFlag(req, 'theme');
/*{
//   "code": "theme",
//   "type": "string",
//   "value": "pink",
//   "is_default": false // whether the fallback value had to be used
}*/

kindeClient.getFlag(req, 'create_competition', { defaultValue: false });
/*{
      "code": "create_competition",
      "value": false,
      "is_default": true // because fallback value had to be used
}*/
```
We also require wrapper functions by type which should leverage getFlag above.
Booleans:
```javascript
/**
 * Get a boolean flag from the feature_flags claim of the access_token.
 * @param {Object} request - Request object
 * @param {String} code - The name of the flag.
 * @param {Boolean} [defaultValue] - A fallback value if the flag isn't found.
 * @return {Boolean}
 */
kindeClient.getBooleanFlag(req, code, defaultValue);

/* Example usage */
kindeClient.getBooleanFlag(req, "is_dark_mode");
// true

kindeClient.getBooleanFlag(req, "is_dark_mode", false);
// true

kindeClient.getBooleanFlag(req, "new_feature", false);
// false (flag does not exist so falls back to default)
```
Strings and integers work in the same way as booleans above:
```javascript
/**
 * Get a string flag from the feature_flags claim of the access_token.
 * @param {Object} request - Request object
 * @param {String} code - The name of the flag.
 * @param {String} [defaultValue] - A fallback value if the flag isn't found.
 * @return {String}
 */
kindeClient.getStringFlag(req, code, defaultValue);

/**
 * Get an integer flag from the feature_flags claim of the access_token.
 * @param {Object} request - Request object
 * @param {String} code - The name of the flag.
 * @param {Integer} [defaultValue] - A fallback value if the flag isn't found.
 * @return {Integer}
 */
kindeClient.getIntegerFlag(code, defaultValue);
```

## Audience

An `audience` is the intended recipient of an access token - for example the API for your application. The audience argument can be passed to the Kinde client to request an audience be added to the provided token.

The audience of a token is the intended recipient of the token.

```javascript
const options = {
  domain: process.env.KINDE_DOMAIN,
  clientId: process.env.KINDE_CLIENT_ID,
  clientSecret: process.env.KINDE_CLIENT_SECRET,
  redirectUri: process.env.KINDE_REDIRECT_URI,
  logoutRedirectUri: process.env.KINDE_LOGOUT_REDIRECT_URI,
  grantType: GrantType.PKCE,
  audience: 'api.example.com/v1',
};

const kindeClient = new KindeClient(options);
```

For details on how to connect, see [Register an API](https://kinde.com/docs/developer-tools/register-an-api/)

## Overriding scope

By default the KindeSDK SDK requests the following scopes:

-   profile
-   email
-   offline
-   openid

You can override this by passing scope into the KindeSDK

```javascript
...
const options = {
  domain: process.env.KINDE_DOMAIN,
  clientId: process.env.KINDE_CLIENT_ID,
  clientSecret: process.env.KINDE_CLIENT_SECRET,
  redirectUri: process.env.KINDE_REDIRECT_URI,
  logoutRedirectUri: process.env.KINDE_LOGOUT_REDIRECT_URI,
  grantType: GrantType.PKCE,
  scope: 'openid profile email offline',
};

const kindeClient = new KindeClient(options);
```

## Getting claims

We have provided a helper to grab any claim from your id or access tokens. The helper defaults to access tokens:

```javascript
kindeClient.getClaim(req, 'aud');
// {
//    name: "aud",
//    value: ["api.myapp.com", "api2.blah.com"]
// }

kindeClient.getClaim(req, 'given_name', 'id_token');
// {
//    name: "given_name",
//    value: "David"
// }
```

## Organizations Control

### Create an organization

To have a new organization created within your application, you will need to run a similar function to below:

```javascript
...
app.get('/createOrg', kindeClient.createOrg(), (req, res) => {
  // do something in next step
  return res.redirect('/');
});
...
```
You can also pass org_name as your create organization url

`http://localhost:3000/createOrg?org_name=<org_name>`

### Sign up and sign in to organizations

Kinde has a unique code for every organization. You’ll have to pass this code through when you register a new user. Example function below:

`http://localhost:3000/register?org_code=<org_code>`

You can also pass state as your register url

`http://localhost:3000/register?state=<state>`

If you want a user to sign in to a particular organization, pass this code along with the sign in method.

`http://localhost:3000/login?org_code=<org_code>`

You can also pass state as your login url

`http://localhost:3000/login?state=<state>`


Following authentication, Kinde provides a json web token (jwt) to your application. Along with the standard information we also include the org_code and the permissions for that organization (this is important as a user can belong to multiple organizations and have different permissions for each). Example of a returned token:

```json
{
    "aud": [],
    "exp": 1658475930,
    "iat": 1658472329,
    "iss": "https://your_subdomain.kinde.com",
    "jti": "123457890",
    "org_code": "org_1234",
    "permissions": ["read:todos", "create:todos"],
    "scp": ["openid", "profile", "email", "offline"],
    "sub": "kp:123457890"
}
```

The id_token will also contain an array of organization that a user belongs to - this is useful if you want to build out an organization switcher for example.

```json
{
  "org_codes": ["org_1234", "org_4567"]
}
```

There are two helper functions you can use to extract information:

```javascript
kindeClient.getOrganization(req);
// { orgCode: 'org_1234' }

kindeClient.getUserOrganizations(req);
// { orgCodes: ['org_1234', 'org_abcd'] }
```

## SDK API Reference

| Property                        | Type   | Is required | Default                       | Description                                                                         |
| ------------------------------- | ------ | ----------- | ----------------------------- | ----------------------------------------------------------------------------------- |
| domain                          | string | Yes         |                               | Either your Kinde instance url or your custom domain. e.g https://yourapp.kinde.com |
| redirectUri                     | string | Yes         | http://{backend_uri}/callback | The redirection URI registered in the authorization server                          |
| clientId                        | string | Yes         |                               | The id of your application - get this from the Kinde admin area                     |
| clientSecret                    | string | Yes         |                               | The id secret of your application - get this from the Kinde admin area              |
| logoutRedirectUri               | string | Yes         |                               | Where your user will be redirected upon logout                                      |
| audience                        | string | No          |                               | The API Identifier for the target API                                               |
| scope                           | string | No          | openid profile email offline  | The scopes to be requested from Kinde                                               |

## KindeSDK methods

| Property             | Description                                                                                           | Arguments                                                       | Usage                                              | Sample output                                                                                                                                                    |
| -------------------- | ----------------------------------------------------------------------------------------------------- | --------------------------------------------------------------- | -------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| login                | Constructs redirect url and sends user to Kinde to sign in                                            | org\_code?: string, state?: string                              |                                                    |                                                                                                                                                                  |
| register             | Constructs redirect url and sends user to Kinde to sign up                                            | org\_code?: string, state?: string                              |                                                    |                                                                                                                                                                  |
| logout               | Logs the user out of Kinde                                                                            |                                                                 |                                                    |                                                                                                                                                                  |
| callback             | Returns the raw access token from URL after logged from Kinde                                         |                                                                 |                                                    |                                                                                                                                                                  |
| createOrg            | Constructs redirect url and sends user to Kinde to sign up and create a new org for your business     | org\_name?: string                                              |                                                    |                                                                                                                                                                  |
| isAuthenticated      | Get a boolean value to check if a user is logged in by verifying that the access token is still valid | req: Request                                                    | kindeClient.isAuthenticated(req);                       | true                                                                                                                                                             |
| getClaim             | Gets a claim from an access or id token                                                               | req: Request, keyName: string, tokenKey?: string                | kindeClient.getClaim(req, 'given\_name', 'id\_token');  | \{ name : 'given\_name', value : 'David' \}                                                                                                                                                              |
| getPermission        | Returns the state of a given permission                                                               | req: Request, key: string                                       | kindeClient.getPermission(req, 'read:todos');           | \{ orgCode : 'org\_1234', isGranted : true \}                                                                                                                     |
| getPermissions       | Returns all permissions for the current user for the organization they are logged into                | req: Request                                                    | kindeClient.getPermissions(req);                        | \{ orgCode : 'org\_1234', permissions : \['create:todos', 'update:todos', 'read:todos'\] \}                                                                      |
| getOrganization      | Get details for the organization your user is logged into                                             | req: Request                                                    | kindeClient.getOrganization(req);                       | \{ orgCode : 'org\_1234' \}                                                                                                                                      |
| getUserDetails       | Returns the profile for the current user                                                              | req: Request                                                    | kindeClient.getUserDetails(req);                        | \{ given\_name: 'Dave', id: 'abcdef', family\_name : 'Smith', email : 'dave@smith.com' \}                                                                        |
| getUserOrganizations | Gets an array of all organizations the user has access to                                             | req: Request                                                    | kindeClient.getUserOrganizations(req);                  | \{ orgCodes: ['org_7052552de68', 'org_5a5c29381327'] \}                                                                                                          |
| getToken             | Returns the access token                                                                              | req: Request                                                    | kindeClient.getToken(req);                              | eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c      | 
| getFlag              | Get a flag from the feature_flags claim of the access_token                                           | req: Request, code: string, defaultValue: obj, flagType: string | kindeClient.getFlag(req, 'theme');                      | \{   "code": "theme", "type": "string", "value": "pink", "is_default": false \}                                                                                  | 
| getBooleanFlag       | Get a boolean flag from the feature_flags claim of the access_token                                   | req: Request, code: string, defaultValue: obj                   | kindeClient.getBooleanFlag(req, "is_dark_mode");        | true                                                                                                                                                             |
| getStringFlag        | Get a string flag from the feature_flags claim of the access_token                                    | req: Request, code: string, defaultValue: obj                   | kindeClient.getStringFlag(req, "theme");                | pink                                                                                                                                                             |
| getIntegerFlag       | Get an integer flag from the feature_flags claim of the access_token                                  | req: Request, code: string, defaultValue: obj                   | kindeClient.getIntegerFlag(req, "team_count");          | 2                                                                                                                                                                |


If you need help connecting to Kinde, please contact us at [support@kinde.com](mailto:support@kinde.com).
