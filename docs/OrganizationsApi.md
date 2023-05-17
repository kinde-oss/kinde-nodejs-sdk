# KindeManagementApi.OrganizationsApi

All URIs are relative to *https://app.kinde.com*

Method | HTTP request | Description
------------- | ------------- | -------------
[**addOrganizationUsers**](OrganizationsApi.md#addOrganizationUsers) | **POST** /api/v1/organization/users | Assign Users to an Organization
[**createOrganization**](OrganizationsApi.md#createOrganization) | **POST** /api/v1/organization | Create Organization
[**deleteOrganizationFeatureFlagOverride**](OrganizationsApi.md#deleteOrganizationFeatureFlagOverride) | **DELETE** /api/v1/organizations/{org_code}/feature_flags/{feature_flag_key} | Delete organization feature flag override
[**deleteOrganizationFeatureFlagOverrides**](OrganizationsApi.md#deleteOrganizationFeatureFlagOverrides) | **DELETE** /api/v1/organizations/{org_code}/feature_flags | Delete all organization feature flag overrides
[**getOrganization**](OrganizationsApi.md#getOrganization) | **GET** /api/v1/organization | Get Organization
[**getOrganizationUsers**](OrganizationsApi.md#getOrganizationUsers) | **GET** /api/v1/organization/users | List Organization Users
[**getOrganizations**](OrganizationsApi.md#getOrganizations) | **GET** /api/v1/organizations | List Organizations
[**removeOrganizationUsers**](OrganizationsApi.md#removeOrganizationUsers) | **PATCH** /api/v1/organization/users | Remove Users from an Organization
[**updateOrganization**](OrganizationsApi.md#updateOrganization) | **PATCH** /api/v1/organizations/{org_code} | Update Organization
[**updateOrganizationFeatureFlagOverride**](OrganizationsApi.md#updateOrganizationFeatureFlagOverride) | **PATCH** /api/v1/organizations/{org_code}/feature_flags/{feature_flag_key} | Update organization feature flag override



## addOrganizationUsers

> AddOrganizationUsersResponse addOrganizationUsers(opts)

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

[**AddOrganizationUsersResponse**](AddOrganizationUsersResponse.md)

### Authorization

[kindeBearerAuth](../README.md#kindeBearerAuth)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json, application/json; charset=utf-8


## createOrganization

> CreateOrganizationResponse createOrganization(opts)

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
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **createOrganizationRequest** | [**CreateOrganizationRequest**](CreateOrganizationRequest.md)| Organization details. | [optional] 

### Return type

[**CreateOrganizationResponse**](CreateOrganizationResponse.md)

### Authorization

[kindeBearerAuth](../README.md#kindeBearerAuth)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json, application/json; charset=utf-8


## deleteOrganizationFeatureFlagOverride

> SuccessResponse deleteOrganizationFeatureFlagOverride(orgCode, featureFlagKey)

Delete organization feature flag override

Delete organization feature flag override.

### Example

```javascript
import KindeManagementApi from 'kinde_management_api';
let defaultClient = KindeManagementApi.ApiClient.instance;
// Configure Bearer (JWT) access token for authorization: kindeBearerAuth
let kindeBearerAuth = defaultClient.authentications['kindeBearerAuth'];
kindeBearerAuth.accessToken = "YOUR ACCESS TOKEN"

let apiInstance = new KindeManagementApi.OrganizationsApi();
let orgCode = "orgCode_example"; // String | The identifier for the organization.
let featureFlagKey = "featureFlagKey_example"; // String | The identifier for the feature flag.
apiInstance.deleteOrganizationFeatureFlagOverride(orgCode, featureFlagKey, (error, data, response) => {
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
 **orgCode** | **String**| The identifier for the organization. | 
 **featureFlagKey** | **String**| The identifier for the feature flag. | 

### Return type

[**SuccessResponse**](SuccessResponse.md)

### Authorization

[kindeBearerAuth](../README.md#kindeBearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json, application/json; charset=utf-8


## deleteOrganizationFeatureFlagOverrides

> SuccessResponse deleteOrganizationFeatureFlagOverrides(orgCode)

Delete all organization feature flag overrides

Delete all organization feature flag overrides.

### Example

```javascript
import KindeManagementApi from 'kinde_management_api';
let defaultClient = KindeManagementApi.ApiClient.instance;
// Configure Bearer (JWT) access token for authorization: kindeBearerAuth
let kindeBearerAuth = defaultClient.authentications['kindeBearerAuth'];
kindeBearerAuth.accessToken = "YOUR ACCESS TOKEN"

let apiInstance = new KindeManagementApi.OrganizationsApi();
let orgCode = "orgCode_example"; // String | The identifier for the organization.
apiInstance.deleteOrganizationFeatureFlagOverrides(orgCode, (error, data, response) => {
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
 **orgCode** | **String**| The identifier for the organization. | 

### Return type

[**SuccessResponse**](SuccessResponse.md)

### Authorization

[kindeBearerAuth](../README.md#kindeBearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json, application/json; charset=utf-8


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
- **Accept**: application/json, application/json; charset=utf-8


## getOrganizationUsers

> GetOrganizationsUsersResponse getOrganizationUsers(opts)

List Organization Users

Get users in an organization.

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
  'code': "code_example", // String | The organization's code.
  'permissions': "permissions_example" // String | Filter by user permissions
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
 **permissions** | **String**| Filter by user permissions | [optional] 

### Return type

[**GetOrganizationsUsersResponse**](GetOrganizationsUsersResponse.md)

### Authorization

[kindeBearerAuth](../README.md#kindeBearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json, application/json; charset=utf-8


## getOrganizations

> GetOrganizationsResponse getOrganizations(opts)

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
apiInstance.getOrganizations(opts, (error, data, response) => {
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

[**GetOrganizationsResponse**](GetOrganizationsResponse.md)

### Authorization

[kindeBearerAuth](../README.md#kindeBearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json, application/json; charset=utf-8


## removeOrganizationUsers

> RemoveOrganizationUsersResponse removeOrganizationUsers(opts)

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

[**RemoveOrganizationUsersResponse**](RemoveOrganizationUsersResponse.md)

### Authorization

[kindeBearerAuth](../README.md#kindeBearerAuth)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json, application/json; charset=utf-8


## updateOrganization

> updateOrganization(orgCode, opts)

Update Organization

Update an organization.

### Example

```javascript
import KindeManagementApi from 'kinde_management_api';
let defaultClient = KindeManagementApi.ApiClient.instance;
// Configure Bearer (JWT) access token for authorization: kindeBearerAuth
let kindeBearerAuth = defaultClient.authentications['kindeBearerAuth'];
kindeBearerAuth.accessToken = "YOUR ACCESS TOKEN"

let apiInstance = new KindeManagementApi.OrganizationsApi();
let orgCode = "orgCode_example"; // String | The identifier for the organization.
let opts = {
  'updateOrganizationRequest': new KindeManagementApi.UpdateOrganizationRequest() // UpdateOrganizationRequest | Organization details.
};
apiInstance.updateOrganization(orgCode, opts, (error, data, response) => {
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
 **orgCode** | **String**| The identifier for the organization. | 
 **updateOrganizationRequest** | [**UpdateOrganizationRequest**](UpdateOrganizationRequest.md)| Organization details. | [optional] 

### Return type

null (empty response body)

### Authorization

[kindeBearerAuth](../README.md#kindeBearerAuth)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json, application/json; charset=utf-8


## updateOrganizationFeatureFlagOverride

> SuccessResponse updateOrganizationFeatureFlagOverride(orgCode, featureFlagKey, value)

Update organization feature flag override

Update organization feature flag override.

### Example

```javascript
import KindeManagementApi from 'kinde_management_api';
let defaultClient = KindeManagementApi.ApiClient.instance;
// Configure Bearer (JWT) access token for authorization: kindeBearerAuth
let kindeBearerAuth = defaultClient.authentications['kindeBearerAuth'];
kindeBearerAuth.accessToken = "YOUR ACCESS TOKEN"

let apiInstance = new KindeManagementApi.OrganizationsApi();
let orgCode = "orgCode_example"; // String | The identifier for the organization
let featureFlagKey = "featureFlagKey_example"; // String | The identifier for the feature flag
let value = "value_example"; // String | Override value
apiInstance.updateOrganizationFeatureFlagOverride(orgCode, featureFlagKey, value, (error, data, response) => {
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
 **orgCode** | **String**| The identifier for the organization | 
 **featureFlagKey** | **String**| The identifier for the feature flag | 
 **value** | **String**| Override value | 

### Return type

[**SuccessResponse**](SuccessResponse.md)

### Authorization

[kindeBearerAuth](../README.md#kindeBearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json, application/json; charset=utf-8

