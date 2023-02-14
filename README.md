# @kinde-oss/kinde-nodejs-sdk

@kinde-oss/kinde-nodejs-sdk - 
The Kinde Nodejs SDK allows developers to integrate with Express server using middleware, helpers function instead of manually using the HTTP and JSON API.

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
You need to add module `express-session` to init session in server and execute the following JS code to create KindeClient instance: 

```javascript
require('dotenv').config();
const express = require('express');
const { KindeClient, GrantType } = require('@kinde-oss/kinde-nodejs-sdk');
const session = require('express-session');
const app = express();
const port = 3000;

app.use(
  session({
    secret: '<secret_string>',
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
    resave: false,
  }),
);

const options = {
  domain: process.env.KINDE_DOMAIN,
  clientId: process.env.KINDE_CLIENT_ID,
  clientSecret: process.env.KINDE_CLIENT_SECRET,
  redirectUri: process.env.KINDE_REDIRECT_URI,
  logoutRedirectUri: process.env.KINDE_LOGOUT_REDIRECT_URI,
  grantType: GrantType.PKCE,
};

const client = new KindeClient(options);
```

## Login and registration

The Kinde client provides methods for easy to implement login / registration by the  following JS code:

### `For GrantType.CLIENT_CREDENTIALS`:

```javascript
...
app.get('/login', client.login(),(req, res) => {
  // do something in next step
  return res.redirect('/');
});

app.get('/register', client.register(),(req, res) => {
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
app.get('/login', client.login(),(req, res) => {
  // do something in next step 
  return res.redirect('/');
});
app.get('/register', client.register(),(req, res) => {
  // do something in next step 
  return res.redirect('/');
});
app.get('/callback', client.callback(), (req, res) => {
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
client.isAuthenticated(req);
// true
``` 

## Get user information

You need to have already authenticated before you call the API, otherwise an error will occur.

### User Permissions

After a user signs in and they are verified, the token return includes permissions for that user. [User permissions are set in Kinde](https://kinde.com/docs/user-management/user-permissions), but you must also configure your application to unlock these functions.

```javascript
"permissions" => [
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
client.getPermission('create:todos');
// ['orgCode' => 'org_1234', 'isGranted' => true]

client.getPermissions();
// ['orgCode' => 'org_1234', 'permissions' => ['create:todos', 'update:todos', 'read:todos']]
```

A practical example in code might look something like:

```javascript
if (client.getPermission("create:todos")['isGranted']) {
    // create new a todo
}
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

const client = new KindeClient(options);
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

const client = new KindeClient(options);
```

## Getting claims

We have provided a helper to grab any claim from your id or access tokens. The helper defaults to access tokens:

```javascript
client.getClaim(req, 'aud');
// ['api.yourapp.com']

client.getClaim(req, 'given_name', 'id_token');
// 'David'
```

## Organizations Control

### Create an organization

To have a new organization created within your application, you will need to run a similar function to below:

```javascript
...
app.get('/createOrg', client.createOrg(), (req, res) => {
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

If you want a user to sign into a particular organization, pass this code along with the sign in method.

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
client.getOrganization(req);
// ['orgCode' => 'org_1234']

client.getUserOrganizations(req);
// ['orgCodes' => ['org_1234', 'org_abcd']]
```

## SDK API Reference

| Property                        | Type   | Is required | Default                      | Description                                                                         |
| ------------------------------- | ------ | ----------- | ---------------------------- | ----------------------------------------------------------------------------------- |
| domain                            | string | Yes         |                              | Either your Kinde instance url or your custom domain. e.g https://yourapp.kinde.com |
| redirectUri                     | string | Yes         |   http://{backend_uri}/callback                           | The redirection URI registered in the authorization server
| clientId                        | string | Yes         |                              | The id of your application - get this from the Kinde admin area                     |
| clientSecret                    | string | Yes         |                              | The id secret of your application - get this from the Kinde admin area              |
| logoutRedirectUri               | string | Yes         |                              | Where your user will be redirected upon logout
| audience                         | string | No          |                             | The API Identifier for the target API                                        |
| scope                           | string | No          | openid profile email offline | The scopes to be requested from Kinde                                               |


## KindeSDK methods

| Property             | Description                                                                                       | Arguments                        | Usage                                                                                  | Sample output                                                                                         |
| -------------------- | ------------------------------------------------------------------------------------------------- | -------------------------------- | -------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| login                | Constructs redirect url and sends user to Kinde to sign in                                        | org\_code?: string, state?: string               |                                                                      |                                                                                                       |
| register             | Constructs redirect url and sends user to Kinde to sign up                                        | org\_code?: string, state?: string               |                                                                     |                                                                                                       |
| logout               | Logs the user out of Kinde                                                                        |                                  |                                                              |                                                                                                       |
| callback             | Returns the raw access token from URL after logged from Kinde                                     |                                  |                                                                  |                                                                                   |
| createOrg            | Constructs redirect url and sends user to Kinde to sign up and create a new org for your business | org\_name?: string               |                                |                                                                                                 |
| isAuthenticated              | Get a boolean value to check if a user is logged in by verifying that the access token is still valid                                                           | req: Request | client.isAuthenticated(req);                                          | true    
| getClaim             | Gets a claim from an access or id token                                                           | req: Request, keyName: string, tokenKey?: string | client.getClaim(req, 'given\_name', 'id\_token');                                          | David                                                                                                |
| getPermission        | Returns the state of a given permission                                                           | req: Request, key: string                      | client.getPermission(req, 'read:todos');                                                   | \{'orgCode' : 'org\_1234', 'isGranted' : true\}                                                    |
| getPermissions       | Returns all permissions for the current user for the organization they are logged into            |    req: Request                              | client.getPermissions(req);                                                              | \{'orgCode' : 'org\_1234', permissions : \['create:todos', 'update:todos', 'read:todos'\]\}       |
| getOrganization      | Get details for the organization your user is logged into                                         |   req: Request                               | client.getOrganization(req);                                                             | \{'orgCode' : 'org\_1234'\}                                                                          |
| getUserDetails       | Returns the profile for the current user                                                          |        req: Request                          | client.getUserDetails(req);                                                              | {'given\_name': 'Dave', 'id': 'abcdef', 'family\_name' : 'Smith', 'email' : 'dave@smith.com'\} |
| getUserOrganizations | Gets an array of all organizations the user has access to                                         |  req: Request                                 |  client.getUserOrganizations(req);                                                        |    \{ 'orgCodes: ['org_7052552de68', 'org_5a5c29381327'] \}   | 

If you need help connecting to Kinde, please contact us at [support@kinde.com](mailto:support@kinde.com).


