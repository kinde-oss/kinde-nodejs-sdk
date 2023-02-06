# KindeManagementApi.UsersApi

All URIs are relative to *https://app.kinde.com*

Method | HTTP request | Description
------------- | ------------- | -------------
[**addOrganizationUsers**](UsersApi.md#addOrganizationUsers) | **POST** /api/v1/organization/users | Assign Users to an Organization
[**createUser**](UsersApi.md#createUser) | **POST** /api/v1/user | Create User
[**getOrganizationUsers**](UsersApi.md#getOrganizationUsers) | **GET** /api/v1/organization/users | List Organization Users
[**getUsers**](UsersApi.md#getUsers) | **GET** /api/v1/users | List Users
[**removeOrganizationUsers**](UsersApi.md#removeOrganizationUsers) | **PATCH** /api/v1/organization/users | Remove Users from an Organization



## addOrganizationUsers

> AddOrganizationUsers200Response addOrganizationUsers(opts)

Assign Users to an Organization

Add existing users to an organization.

### Example

```javascript
import KindeManagementApi from 'kinde_management_api';
let defaultClient = KindeManagementApi.ApiClient.instance;
// Configure Bearer (JWT) access token for authorization: kindeBearerAuth
let kindeBearerAuth = defaultClient.authentications['kindeBearerAuth'];
kindeBearerAuth.accessToken = "YOUR ACCESS TOKEN"

let apiInstance = new KindeManagementApi.UsersApi();
let opts = {
  'code': "code_example", // String | The organization's code.
  'addOrganizationUsersRequest': new KindeManagementApi.AddOrganizationUsersRequest() // AddOrganizationUsersRequest | 
};
apiInstance.addOrganizationUsers(opts, (error, data, response) => {
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
 **code** | **String**| The organization&#39;s code. | [optional] 
 **addOrganizationUsersRequest** | [**AddOrganizationUsersRequest**](AddOrganizationUsersRequest.md)|  | [optional] 

### Return type

[**AddOrganizationUsers200Response**](AddOrganizationUsers200Response.md)

### Authorization

[kindeBearerAuth](../README.md#kindeBearerAuth)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json


## createUser

> CreateUser200Response createUser(opts)

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

[**CreateUser200Response**](CreateUser200Response.md)

### Authorization

[kindeBearerAuth](../README.md#kindeBearerAuth)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json


## getOrganizationUsers

> OrganizationUser getOrganizationUsers(opts)

List Organization Users

Get users in an organizaiton.

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
  'nextToken': "nextToken_example", // String | A string to get the next page of results if there are more results.
  'code': "code_example" // String | The organization's code.
};
apiInstance.getOrganizationUsers(opts, (error, data, response) => {
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
 **nextToken** | **String**| A string to get the next page of results if there are more results. | [optional] 
 **code** | **String**| The organization&#39;s code. | [optional] 

### Return type

[**OrganizationUser**](OrganizationUser.md)

### Authorization

[kindeBearerAuth](../README.md#kindeBearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json


## getUsers

> [User] getUsers(opts)

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
  'userId': 56, // Number | ID of the user to filter by.
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
 **userId** | **Number**| ID of the user to filter by. | [optional] 
 **nextToken** | **String**| A string to get the next page of results if there are more results. | [optional] 

### Return type

[**[User]**](User.md)

### Authorization

[kindeBearerAuth](../README.md#kindeBearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json


## removeOrganizationUsers

> RemoveOrganizationUsers200Response removeOrganizationUsers(opts)

Remove Users from an Organization

Remove existing users from an organization.

### Example

```javascript
import KindeManagementApi from 'kinde_management_api';
let defaultClient = KindeManagementApi.ApiClient.instance;
// Configure Bearer (JWT) access token for authorization: kindeBearerAuth
let kindeBearerAuth = defaultClient.authentications['kindeBearerAuth'];
kindeBearerAuth.accessToken = "YOUR ACCESS TOKEN"

let apiInstance = new KindeManagementApi.UsersApi();
let opts = {
  'code': "code_example", // String | The organization's code.
  'removeOrganizationUsersRequest': new KindeManagementApi.RemoveOrganizationUsersRequest() // RemoveOrganizationUsersRequest | 
};
apiInstance.removeOrganizationUsers(opts, (error, data, response) => {
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
 **code** | **String**| The organization&#39;s code. | [optional] 
 **removeOrganizationUsersRequest** | [**RemoveOrganizationUsersRequest**](RemoveOrganizationUsersRequest.md)|  | [optional] 

### Return type

[**RemoveOrganizationUsers200Response**](RemoveOrganizationUsers200Response.md)

### Authorization

[kindeBearerAuth](../README.md#kindeBearerAuth)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

