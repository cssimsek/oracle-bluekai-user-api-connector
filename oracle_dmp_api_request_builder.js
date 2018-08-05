const Url = require('url');
const Crypto = require('crypto');

/* 
Request Signature Calculation (https://goo.gl/2pT9Jv)
1) HTTP_METHOD + URI_PATH + QUERY_ARG_VALUES + POST_DATA
2) HMAC-SHA256(Secret key, HTTP_METHOD + URI_PATH + QUERY_ARG_VALUES + POST_DATA)
*/

module.exports = class BluekaiRequestBuilder {

    constructor(_servicebasePath,_webServicePath,_credentialsObject){
        this.serviceBasePath = _servicebasePath;
        this.bkServiceURLObject = Url.parse(this.serviceBasePath.concat(_webServicePath),true);
        this.credentialsObject = _credentialsObject;
        console.log(JSON.stringify(this.bkServiceURLObject));
    }

    stringifyQPVals(qpMatrix){
        let queryStringValsString = '';
        for(let q of qpMatrix){
            queryStringValsString+=q[1];
        }
        return queryStringValsString;
    }

    encryptSecretKey(){
        const hmac = Crypto.createHmac('sha256', this.credentialsObject.bksecretkey);
        hmac.update(this.stringToSign);
        this.hmacBase64Digest = encodeURIComponent(hmac.digest('base64'));
        console.log('Signed String: ' + this.hmacBase64Digest);
        return this;
    }

    buildSignature(methodName,payloadDataObject){
        this.methodName=methodName;
        this.payloadDataObject=payloadDataObject;
        //Add HTTP_METHOD and URI+PATH
        this.stringToSign=methodName.concat(this.bkServiceURLObject.pathname);
        console.log(this.stringToSign);      
        //Add QUERY_ARG_VALUES
        this.stringToSign+=this.stringifyQPVals(Object.entries(this.bkServiceURLObject.query));
        console.log(this.stringToSign);
        //Add payloadData if exists
        if(Object.keys(payloadDataObject).length){
            this.stringToSign+=JSON.stringify(payloadDataObject);
            //Also pass as Object for actual dispatch
            console.log('payloadDataObject in Builder Class: ' + JSON.stringify(this.payloadDataObject));
        }
        console.log('stringToSign: ' + this.stringToSign);
        return this;
    }

    buildEndPointURL(){
        let urlStringified = this.bkServiceURLObject.format();
        if(!this.bkServiceURLObject.search){
            urlStringified+='?';
        }else{
            urlStringified+='&';
        }
        urlStringified+='bkuid='+this.credentialsObject.bkuid+'&bksig='+this.hmacBase64Digest;
        this.endPointURL = urlStringified;
        console.log(this.endPointURL);
    }
    
};