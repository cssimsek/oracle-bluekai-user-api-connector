const fs = require('fs');
const BluekaiRequestBuilder = require('./oracle_dmp_api_request_builder.js');
const BluekaiRequestDispatcher = require('./oracle_dmp_api_request_dispatcher_promise_generic.js');

//Fetch credentials
const credentialsObject = require('./bluekai_credentials.json');

//Other System Id to Bluekai hardcoded example
const bluekaiSiteId = '12345';
const otherSystemId = '987654321';
const baseAPIPath = 'https://api.tags.bluekai.com/getdata/';
const targetPhint = 'someSegmentName';
const ccodeName = 'IT';
const servicePathAndQuery = bluekaiSiteId + '/v1.2?puserid=' + otherSystemId + '&phint=type=' + targetPhint + '&ccode=' + ccodeName;

//Instantiate RequestBuilder with basic getdata endpoint
const bkReqBuilder = new BluekaiRequestBuilder(baseAPIPath, servicePathAndQuery, credentialsObject);

//Build signature String and Encrypt
bkReqBuilder.buildSignature('GET', {}).encryptSecretKey().buildEndPointURL();

//HTTP settings
const httpSettings = {
    headers: null
};

//Instantiate RequestDispatcher
const bkReqDispatcher = new BluekaiRequestDispatcher(bkReqBuilder, httpSettings);

/*
Invoke RequestDispatcher.dispatchRequest
With target response file or with no argument in which case the response will be logged but not stored
*/
bkReqDispatcher.dispatchRequest('other_system_to_bluekai_user_sync.json').then(function () {
    console.log('Request Dispatch Fulfilled');
}).catch(function (e) {
    console.log(e.message);
});

console.log('End point from instance: ' + bkReqBuilder.endPointURL);