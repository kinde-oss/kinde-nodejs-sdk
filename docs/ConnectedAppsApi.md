# KindeManagementApi.ConnectedAppsApi

All URIs are relative to *https://app.kinde.com*

Method | HTTP request | Description
------------- | ------------- | -------------
[**getConnectedAppAuthUrl**](ConnectedAppsApi.md#getConnectedAppAuthUrl) | **GET** /api/v1/connected_apps/auth_url | Get Connected App URL
[**getConnectedAppToken**](ConnectedAppsApi.md#getConnectedAppToken) | **GET** /api/v1/connected_apps/token | Get Connected App Token
[**revokeConnectedAppToken**](ConnectedAppsApi.md#revokeConnectedAppToken) | **POST** /api/v1/connected_apps/revoke | Revoke Connected App Token



## getConnectedAppAuthUrl

> ConnectedAppsAuthUrl getConnectedAppAuthUrl(keyCodeRef, userId)

Get Connected App URL

Get a URL that authenticates and authorizes a user to a third-party connected app.

### Example

```javascript
import KindeManagementApi from 'kinde_management_api';
let defaultClient = KindeManagementApi.ApiClient.instance;
// Configure Bearer (JWT) access token for authorization: kindeBearerAuth
let kindeBearerAuth = defaultClient.authentications['kindeBearerAuth'];
kindeBearerAuth.accessToken = "YOUR ACCESS TOKEN"

let apiInstance = new KindeManagementApi.ConnectedAppsApi();
let keyCodeRef = "keyCodeRef_example"; // String | The unique key code reference of the connected app to authenticate against.
let userId = "userId_example"; // String | The id of the user that needs to authenticate to the third-party connected app.
apiInstance.getConnectedAppAuthUrl(keyCodeRef, userId, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **keyCodeRef** | **String**| The unique key code reference of the connected app to authenticate against. | 
 **userId** | **String**| The id of the user that needs to authenticate to the third-party connected app. | 

### Return type

[**ConnectedAppsAuthUrl**](ConnectedAppsAuthUrl.md)

### Authorization

[kindeBearerAuth](../README.md#kindeBearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json, application/json; charset=utf-8


## getConnectedAppToken

> ConnectedAppsAccessToken getConnectedAppToken(sessionId)

Get Connected App Token

Get an access token that can be used to call the third-party provider linked to the connected app.

### Example

```javascript
import KindeManagementApi from 'kinde_management_api';
let defaultClient = KindeManagementApi.ApiClient.instance;
// Configure Bearer (JWT) access token for authorization: kindeBearerAuth
let kindeBearerAuth = defaultClient.authentications['kindeBearerAuth'];
kindeBearerAuth.accessToken = "YOUR ACCESS TOKEN"

let apiInstance = new KindeManagementApi.ConnectedAppsApi();
let sessionId = "sessionId_example"; // String | The unique sesssion id reprensenting the login session of a user.
apiInstance.getConnectedAppToken(sessionId, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **sessionId** | **String**| The unique sesssion id reprensenting the login session of a user. | 

### Return type

[**ConnectedAppsAccessToken**](ConnectedAppsAccessToken.md)

### Authorization

[kindeBearerAuth](../README.md#kindeBearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json, application/json; charset=utf-8


## revokeConnectedAppToken

> SuccessResponse revokeConnectedAppToken(sessionId)

Revoke Connected App Token

Revoke the tokens linked to the connected app session.

### Example

```javascript
import KindeManagementApi from 'kinde_management_api';
let defaultClient = KindeManagementApi.ApiClient.instance;
// Configure Bearer (JWT) access token for authorization: kindeBearerAuth
let kindeBearerAuth = defaultClient.authentications['kindeBearerAuth'];
kindeBearerAuth.accessToken = "YOUR ACCESS TOKEN"

let apiInstance = new KindeManagementApi.ConnectedAppsApi();
let sessionId = "sessionId_example"; // String | The unique sesssion id reprensenting the login session of a user.
apiInstance.revokeConnectedAppToken(sessionId, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **sessionId** | **String**| The unique sesssion id reprensenting the login session of a user. | 

### Return type

[**SuccessResponse**](SuccessResponse.md)

### Authorization

[kindeBearerAuth](../README.md#kindeBearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json, application/json; charset=utf-8

