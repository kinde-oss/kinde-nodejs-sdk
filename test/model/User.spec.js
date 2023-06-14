/**
 * Kinde Management API
 * Provides endpoints to manage your Kinde Businesses
 *
 * The version of the OpenAPI document: 1
 * Contact: support@kinde.com
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 *
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD.
    define(['expect.js', process.cwd()+'/src/index'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    factory(require('expect.js'), require(process.cwd()+'/src/index'));
  } else {
    // Browser globals (root is window)
    factory(root.expect, root.KindeManagementApi);
  }
}(this, function(expect, KindeManagementApi) {
  'use strict';

  var instance;

  beforeEach(function() {
    instance = new KindeManagementApi.User();
  });

  var getProperty = function(object, getter, property) {
    // Use getter method if present; otherwise, get the property directly.
    if (typeof object[getter] === 'function')
      return object[getter]();
    else
      return object[property];
  }

  var setProperty = function(object, setter, property, value) {
    // Use setter method if present; otherwise, set the property directly.
    if (typeof object[setter] === 'function')
      object[setter](value);
    else
      object[property] = value;
  }

  describe('User', function() {
    it('should create an instance of User', function() {
      // uncomment below and update the code to test User
      //var instance = new KindeManagementApi.User();
      //expect(instance).to.be.a(KindeManagementApi.User);
    });

    it('should have the property id (base name: "id")', function() {
      // uncomment below and update the code to test the property id
      //var instance = new KindeManagementApi.User();
      //expect(instance).to.be();
    });

    it('should have the property providedId (base name: "provided_id")', function() {
      // uncomment below and update the code to test the property providedId
      //var instance = new KindeManagementApi.User();
      //expect(instance).to.be();
    });

    it('should have the property email (base name: "email")', function() {
      // uncomment below and update the code to test the property email
      //var instance = new KindeManagementApi.User();
      //expect(instance).to.be();
    });

    it('should have the property lastName (base name: "last_name")', function() {
      // uncomment below and update the code to test the property lastName
      //var instance = new KindeManagementApi.User();
      //expect(instance).to.be();
    });

    it('should have the property firstName (base name: "first_name")', function() {
      // uncomment below and update the code to test the property firstName
      //var instance = new KindeManagementApi.User();
      //expect(instance).to.be();
    });

    it('should have the property fullName (base name: "full_name")', function() {
      // uncomment below and update the code to test the property fullName
      //var instance = new KindeManagementApi.User();
      //expect(instance).to.be();
    });

    it('should have the property isSuspended (base name: "is_suspended")', function() {
      // uncomment below and update the code to test the property isSuspended
      //var instance = new KindeManagementApi.User();
      //expect(instance).to.be();
    });

    it('should have the property picture (base name: "picture")', function() {
      // uncomment below and update the code to test the property picture
      //var instance = new KindeManagementApi.User();
      //expect(instance).to.be();
    });

    it('should have the property totalSignIns (base name: "total_sign_ins")', function() {
      // uncomment below and update the code to test the property totalSignIns
      //var instance = new KindeManagementApi.User();
      //expect(instance).to.be();
    });

    it('should have the property failedSignIns (base name: "failed_sign_ins")', function() {
      // uncomment below and update the code to test the property failedSignIns
      //var instance = new KindeManagementApi.User();
      //expect(instance).to.be();
    });

    it('should have the property lastSignedIn (base name: "last_signed_in")', function() {
      // uncomment below and update the code to test the property lastSignedIn
      //var instance = new KindeManagementApi.User();
      //expect(instance).to.be();
    });

    it('should have the property createdOn (base name: "created_on")', function() {
      // uncomment below and update the code to test the property createdOn
      //var instance = new KindeManagementApi.User();
      //expect(instance).to.be();
    });

  });

}));
