# KindeManagementApi.OrganizationsApi

All URIs are relative to *https://app.kinde.com*

Method | HTTP request | Description
------------- | ------------- | -------------
[**addOrganizationUsers**](OrganizationsApi.md#addOrganizationUsers) | **POST** /api/v1/organization/users | Assign Users to an Organization
[**createOrganization**](OrganizationsApi.md#createOrganization) | **POST** /api/v1/organization | Create Organization
[**getOrgainzations**](OrganizationsApi.md#getOrgainzations) | **GET** /api/v1/organizations | List Organizations
[**getOrganization**](OrganizationsApi.md#getOrganization) | **GET** /api/v1/organization | Get Organization
[**getOrganizationUsers**](OrganizationsApi.md#getOrganizationUsers) | **GET** /api/v1/organization/users | List Organization Users
[**removeOrganizationUsers**](OrganizationsApi.md#removeOrganizationUsers) | **PATCH** /api/v1/organization/users | Remove Users from an Organization



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

let apiInstance = new KindeManagementApi.OrganizationsApi();
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


## createOrganization

> createOrganization(opts)

Create Organization

Create an organization.

### Example

```javascript
import KindeManagementApi from 'kinde_management_api';
let defaultClient = KindeManagementApi.ApiClient.instance;
// Configure Bearer (JWT) access token for authorization: kindeBearerAuth
let kindeBearerAuth = defaultClient.authentications['kindeBearerAuth'];
kindeBearerAuth.accessToken = "YOUR ACCESS TOKEN"

let apiInstance = new KindeManagementApi.OrganizationsApi();
let opts = {
  'createOrganizationRequest': new KindeManagementApi.CreateOrganizationRequest() // CreateOrganizationRequest | Organization details.
};
apiInstance.createOrganization(opts, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **createOrganizationRequest** | [**CreateOrganizationRequest**](CreateOrganizationRequest.md)| Organization details. | [optional] 

### Return type

null (empty response body)

### Authorization

[kindeBearerAuth](../README.md#kindeBearerAuth)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: Not defined


## getOrgainzations

> [Organization] getOrgainzations(opts)

List Organizations

Get a list of organizations. 

### Example

```javascript
import KindeManagementApi from 'kinde_management_api';
let defaultClient = KindeManagementApi.ApiClient.instance;
// Configure Bearer (JWT) access token for authorization: kindeBearerAuth
let kindeBearerAuth = defaultClient.authentications['kindeBearerAuth'];
kindeBearerAuth.accessToken = "YOUR ACCESS TOKEN"

let apiInstance = new KindeManagementApi.OrganizationsApi();
let opts = {
  'sort': "sort_example", // String | Field and order to sort the result by.
  'pageSize': 56, // Number | Number of results per page. Defaults to 10 if parameter not sent.
  'nextToken': "nextToken_example" // String | A string to get the next page of results if there are more results.
};
apiInstance.getOrgainzations(opts, (error, data, response) => {
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

### Return type

[**[Organization]**](Organization.md)

### Authorization

[kindeBearerAuth](../README.md#kindeBearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json


## getOrganization

> Organization getOrganization(opts)

Get Organization

Gets an organization given the organization&#39;s code. 

### Example

```javascript
import KindeManagementApi from 'kinde_management_api';
let defaultClient = KindeManagementApi.ApiClient.instance;
// Configure Bearer (JWT) access token for authorization: kindeBearerAuth
let kindeBearerAuth = defaultClient.authentications['kindeBearerAuth'];
kindeBearerAuth.accessToken = "YOUR ACCESS TOKEN"

let apiInstance = new KindeManagementApi.OrganizationsApi();
let opts = {
  'code': "code_example" // String | The organization's code.
};
apiInstance.getOrganization(opts, (error, data, response) => {
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

### Return type

[**Organization**](Organization.md)

### Authorization

[kindeBearerAuth](../README.md#kindeBearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
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

let apiInstance = new KindeManagementApi.OrganizationsApi();
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

let apiInstance = new KindeManagementApi.OrganizationsApi();
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

