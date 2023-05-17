# KindeManagementApi.EnvironmentsApi

All URIs are relative to *https://app.kinde.com*

Method | HTTP request | Description
------------- | ------------- | -------------
[**deleteEnvironementFeatureFlagOverride**](EnvironmentsApi.md#deleteEnvironementFeatureFlagOverride) | **DELETE** /api/v1/environment/feature_flags/{feature_flag_key} | Delete environment feature flag override
[**deleteEnvironementFeatureFlagOverrides**](EnvironmentsApi.md#deleteEnvironementFeatureFlagOverrides) | **DELETE** /api/v1/environment/feature_flags/ | Delete all environment feature flag overrides
[**updateEnvironementFeatureFlagOverride**](EnvironmentsApi.md#updateEnvironementFeatureFlagOverride) | **PATCH** /api/v1/environment/feature_flags/{feature_flag_key} | Update environment feature flag override



## deleteEnvironementFeatureFlagOverride

> SuccessResponse deleteEnvironementFeatureFlagOverride(featureFlagKey)

Delete environment feature flag override

Delete environment feature flag override.

### Example

```javascript
import KindeManagementApi from 'kinde_management_api';
let defaultClient = KindeManagementApi.ApiClient.instance;
// Configure Bearer (JWT) access token for authorization: kindeBearerAuth
let kindeBearerAuth = defaultClient.authentications['kindeBearerAuth'];
kindeBearerAuth.accessToken = "YOUR ACCESS TOKEN"

let apiInstance = new KindeManagementApi.EnvironmentsApi();
let featureFlagKey = "featureFlagKey_example"; // String | The identifier for the feature flag.
apiInstance.deleteEnvironementFeatureFlagOverride(featureFlagKey, (error, data, response) => {
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


## deleteEnvironementFeatureFlagOverrides

> SuccessResponse deleteEnvironementFeatureFlagOverrides()

Delete all environment feature flag overrides

Delete all environment feature flag overrides.

### Example

```javascript
import KindeManagementApi from 'kinde_management_api';
let defaultClient = KindeManagementApi.ApiClient.instance;
// Configure Bearer (JWT) access token for authorization: kindeBearerAuth
let kindeBearerAuth = defaultClient.authentications['kindeBearerAuth'];
kindeBearerAuth.accessToken = "YOUR ACCESS TOKEN"

let apiInstance = new KindeManagementApi.EnvironmentsApi();
apiInstance.deleteEnvironementFeatureFlagOverrides((error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters

This endpoint does not need any parameter.

### Return type

[**SuccessResponse**](SuccessResponse.md)

### Authorization

[kindeBearerAuth](../README.md#kindeBearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json, application/json; charset=utf-8


## updateEnvironementFeatureFlagOverride

> SuccessResponse updateEnvironementFeatureFlagOverride(featureFlagKey, value)

Update environment feature flag override

Update environment feature flag override.

### Example

```javascript
import KindeManagementApi from 'kinde_management_api';
let defaultClient = KindeManagementApi.ApiClient.instance;
// Configure Bearer (JWT) access token for authorization: kindeBearerAuth
let kindeBearerAuth = defaultClient.authentications['kindeBearerAuth'];
kindeBearerAuth.accessToken = "YOUR ACCESS TOKEN"

let apiInstance = new KindeManagementApi.EnvironmentsApi();
let featureFlagKey = "featureFlagKey_example"; // String | The identifier for the feature flag.
let value = "value_example"; // String | The override value for the feature flag.
apiInstance.updateEnvironementFeatureFlagOverride(featureFlagKey, value, (error, data, response) => {
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
 **value** | **String**| The override value for the feature flag. | 

### Return type

[**SuccessResponse**](SuccessResponse.md)

### Authorization

[kindeBearerAuth](../README.md#kindeBearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json, application/json; charset=utf-8

