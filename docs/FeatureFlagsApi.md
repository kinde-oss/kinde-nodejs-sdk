# KindeManagementApi.FeatureFlagsApi

All URIs are relative to *https://app.kinde.com*

Method | HTTP request | Description
------------- | ------------- | -------------
[**createFeatureFlag**](FeatureFlagsApi.md#createFeatureFlag) | **POST** /api/v1/feature_flags | Create a new feature flag
[**deleteFeatureFlag**](FeatureFlagsApi.md#deleteFeatureFlag) | **DELETE** /api/v1/feature_flags/{feature_flag_key} | Delete a feature flag
[**updateFeatureFlag**](FeatureFlagsApi.md#updateFeatureFlag) | **PUT** /api/v1/feature_flags/{feature_flag_key} | Update a feature flag



## createFeatureFlag

> SuccessResponse createFeatureFlag(name, description, key, type, allowOverrideLevel, defaultValue)

Create a new feature flag

Create feature flag.

### Example

```javascript
import KindeManagementApi from 'kinde_management_api';
let defaultClient = KindeManagementApi.ApiClient.instance;
// Configure Bearer (JWT) access token for authorization: kindeBearerAuth
let kindeBearerAuth = defaultClient.authentications['kindeBearerAuth'];
kindeBearerAuth.accessToken = "YOUR ACCESS TOKEN"

let apiInstance = new KindeManagementApi.FeatureFlagsApi();
let name = "name_example"; // String | The name of the flag.
let description = "description_example"; // String | Description of the flag purpose.
let key = "key_example"; // String | The flag identifier to use in code.
let type = "type_example"; // String | The variable type.
let allowOverrideLevel = "allowOverrideLevel_example"; // String | Allow the flag to be overridden at a different level.
let defaultValue = "defaultValue_example"; // String | Default value for the flag used by environments and organizations.
apiInstance.createFeatureFlag(name, description, key, type, allowOverrideLevel, defaultValue, (error, data, response) => {
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
 **name** | **String**| The name of the flag. | 
 **description** | **String**| Description of the flag purpose. | 
 **key** | **String**| The flag identifier to use in code. | 
 **type** | **String**| The variable type. | 
 **allowOverrideLevel** | **String**| Allow the flag to be overridden at a different level. | 
 **defaultValue** | **String**| Default value for the flag used by environments and organizations. | 

### Return type

[**SuccessResponse**](SuccessResponse.md)

### Authorization

[kindeBearerAuth](../README.md#kindeBearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json, application/json; charset=utf-8


## deleteFeatureFlag

> SuccessResponse deleteFeatureFlag(featureFlagKey)

Delete a feature flag

Delete feature flag

### Example

```javascript
import KindeManagementApi from 'kinde_management_api';
let defaultClient = KindeManagementApi.ApiClient.instance;
// Configure Bearer (JWT) access token for authorization: kindeBearerAuth
let kindeBearerAuth = defaultClient.authentications['kindeBearerAuth'];
kindeBearerAuth.accessToken = "YOUR ACCESS TOKEN"

let apiInstance = new KindeManagementApi.FeatureFlagsApi();
let featureFlagKey = "featureFlagKey_example"; // String | The identifier for the feature flag.
apiInstance.deleteFeatureFlag(featureFlagKey, (error, data, response) => {
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
 **featureFlagKey** | **String**| The identifier for the feature flag. | 

### Return type

[**SuccessResponse**](SuccessResponse.md)

### Authorization

[kindeBearerAuth](../README.md#kindeBearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json, application/json; charset=utf-8


## updateFeatureFlag

> SuccessResponse updateFeatureFlag(featureFlagKey, name, description, key, type, allowOverrideLevel, defaultValue)

Update a feature flag

Update feature flag.

### Example

```javascript
import KindeManagementApi from 'kinde_management_api';
let defaultClient = KindeManagementApi.ApiClient.instance;
// Configure Bearer (JWT) access token for authorization: kindeBearerAuth
let kindeBearerAuth = defaultClient.authentications['kindeBearerAuth'];
kindeBearerAuth.accessToken = "YOUR ACCESS TOKEN"

let apiInstance = new KindeManagementApi.FeatureFlagsApi();
let featureFlagKey = "featureFlagKey_example"; // String | The identifier for the feature flag.
let name = "name_example"; // String | The name of the flag.
let description = "description_example"; // String | Description of the flag purpose.
let key = "key_example"; // String | The flag identifier to use in code.
let type = "type_example"; // String | The variable type
let allowOverrideLevel = "allowOverrideLevel_example"; // String | Allow the flag to be overridden at a different level.
let defaultValue = "defaultValue_example"; // String | Default value for the flag used by environments and organizations.
apiInstance.updateFeatureFlag(featureFlagKey, name, description, key, type, allowOverrideLevel, defaultValue, (error, data, response) => {
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
 **featureFlagKey** | **String**| The identifier for the feature flag. | 
 **name** | **String**| The name of the flag. | 
 **description** | **String**| Description of the flag purpose. | 
 **key** | **String**| The flag identifier to use in code. | 
 **type** | **String**| The variable type | 
 **allowOverrideLevel** | **String**| Allow the flag to be overridden at a different level. | 
 **defaultValue** | **String**| Default value for the flag used by environments and organizations. | 

### Return type

[**SuccessResponse**](SuccessResponse.md)

### Authorization

[kindeBearerAuth](../README.md#kindeBearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json, application/json; charset=utf-8

