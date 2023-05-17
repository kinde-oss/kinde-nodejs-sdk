# KindeManagementApi.UsersApi

All URIs are relative to *https://app.kinde.com*

Method | HTTP request | Description
------------- | ------------- | -------------
[**createUser**](UsersApi.md#createUser) | **POST** /api/v1/user | Create User
[**deleteuser**](UsersApi.md#deleteuser) | **DELETE** /api/v1/user | Delete User
[**getUserData**](UsersApi.md#getUserData) | **GET** /api/v1/user | Get User
[**getUsers**](UsersApi.md#getUsers) | **GET** /api/v1/users | List Users
[**updateUser**](UsersApi.md#updateUser) | **PATCH** /api/v1/user | Update User



## createUser

> CreateUserResponse createUser(opts)

Create User

Creates a user record and optionally zero or more identities for the user. An example identity could be the email address of the user. 

### Example

```javascript
import KindeManagementApi from 'kinde_management_api';
let defaultClient = KindeManagementApi.ApiClient.instance;
// Configure Bearer (JWT) access token for authorization: kindeBearerAuth
let kindeBearerAuth = defaultClient.authentications['kindeBearerAuth'];
kindeBearerAuth.accessToken = "YOUR ACCESS TOKEN"

let apiInstance = new KindeManagementApi.UsersApi();
let opts = {
  'createUserRequest': new KindeManagementApi.CreateUserRequest() // CreateUserRequest | The details of the user to create.
};
apiInstance.createUser(opts, (error, data, response) => {
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
 **createUserRequest** | [**CreateUserRequest**](CreateUserRequest.md)| The details of the user to create. | [optional] 

### Return type

[**CreateUserResponse**](CreateUserResponse.md)

### Authorization

[kindeBearerAuth](../README.md#kindeBearerAuth)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json, application/json; charset=utf-8


## deleteuser

> SuccessResponse deleteuser(opts)

Delete User

Delete a user record. 

### Example

```javascript
import KindeManagementApi from 'kinde_management_api';
let defaultClient = KindeManagementApi.ApiClient.instance;
// Configure Bearer (JWT) access token for authorization: kindeBearerAuth
let kindeBearerAuth = defaultClient.authentications['kindeBearerAuth'];
kindeBearerAuth.accessToken = "YOUR ACCESS TOKEN"

let apiInstance = new KindeManagementApi.UsersApi();
let opts = {
  'id': "id_example" // String | The user's id.
};
apiInstance.deleteuser(opts, (error, data, response) => {
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
 **id** | **String**| The user&#39;s id. | [optional] 

### Return type

[**SuccessResponse**](SuccessResponse.md)

### Authorization

[kindeBearerAuth](../README.md#kindeBearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json, application/json; charset=utf-8


## getUserData

> User getUserData(opts)

Get User

Retrieve a user record. 

### Example

```javascript
import KindeManagementApi from 'kinde_management_api';
let defaultClient = KindeManagementApi.ApiClient.instance;
// Configure Bearer (JWT) access token for authorization: kindeBearerAuth
let kindeBearerAuth = defaultClient.authentications['kindeBearerAuth'];
kindeBearerAuth.accessToken = "YOUR ACCESS TOKEN"

let apiInstance = new KindeManagementApi.UsersApi();
let opts = {
  'id': "id_example" // String | The user's id.
};
apiInstance.getUserData(opts, (error, data, response) => {
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
 **id** | **String**| The user&#39;s id. | [optional] 

### Return type

[**User**](User.md)

### Authorization

[kindeBearerAuth](../README.md#kindeBearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json, application/json; charset=utf-8


## getUsers

> UsersResponse getUsers(opts)

List Users

The returned list can be sorted by full name or email address in ascending or descending order. The number of records to return at a time can also be controlled using the &#x60;page_size&#x60; query string parameter. 

### Example

```javascript
import KindeManagementApi from 'kinde_management_api';
let defaultClient = KindeManagementApi.ApiClient.instance;
// Configure Bearer (JWT) access token for authorization: kindeBearerAuth
let kindeBearerAuth = defaultClient.authentications['kindeBearerAuth'];
kindeBearerAuth.accessToken = "YOUR ACCESS TOKEN"

let apiInstance = new KindeManagementApi.UsersApi();
let opts = {
  'sort': "sort_example", // String | Field and order to sort the result by.
  'pageSize': 56, // Number | Number of results per page. Defaults to 10 if parameter not sent.
  'userId': "userId_example", // String | ID of the user to filter by.
  'nextToken': "nextToken_example" // String | A string to get the next page of results if there are more results.
};
apiInstance.getUsers(opts, (error, data, response) => {
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
 **sort** | **String**| Field and order to sort the result by. | [optional] 
 **pageSize** | **Number**| Number of results per page. Defaults to 10 if parameter not sent. | [optional] 
 **userId** | **String**| ID of the user to filter by. | [optional] 
 **nextToken** | **String**| A string to get the next page of results if there are more results. | [optional] 

### Return type

[**UsersResponse**](UsersResponse.md)

### Authorization

[kindeBearerAuth](../README.md#kindeBearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json, application/json; charset=utf-8


## updateUser

> User updateUser(updateUserRequest, opts)

Update User

Update a user record. 

### Example

```javascript
import KindeManagementApi from 'kinde_management_api';
let defaultClient = KindeManagementApi.ApiClient.instance;
// Configure Bearer (JWT) access token for authorization: kindeBearerAuth
let kindeBearerAuth = defaultClient.authentications['kindeBearerAuth'];
kindeBearerAuth.accessToken = "YOUR ACCESS TOKEN"

let apiInstance = new KindeManagementApi.UsersApi();
let updateUserRequest = new KindeManagementApi.UpdateUserRequest(); // UpdateUserRequest | The user to update.
let opts = {
  'id': "id_example" // String | The user's id.
};
apiInstance.updateUser(updateUserRequest, opts, (error, data, response) => {
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
 **updateUserRequest** | [**UpdateUserRequest**](UpdateUserRequest.md)| The user to update. | 
 **id** | **String**| The user&#39;s id. | [optional] 

### Return type

[**User**](User.md)

### Authorization

[kindeBearerAuth](../README.md#kindeBearerAuth)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json, application/json; charset=utf-8

