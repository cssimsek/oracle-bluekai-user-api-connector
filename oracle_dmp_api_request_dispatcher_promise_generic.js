const https = require('https');
const querystring = require('querystring');
const fs = require('fs');
const Url = require('url');
const defaultHeaderObject = {"Accept":"application/json","Content-type":"application/json","User_Agent":"Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10.6; en-US; rv:1.9.1) Gecko/20090624 Firefox/3.5"};

module.exports = class BluekaiRequestDispatcher{

    constructor(_bkReqInstance,_httpSettings){
        this.bkReqInstance = _bkReqInstance;
        this.httpVerb= _bkReqInstance.methodName;
        this.endPointURL = _bkReqInstance.endPointURL;
        this.httpHeadersObject = _httpSettings.headers;
        this.postDataObject = _bkReqInstance.payloadDataObject;
        console.log('this.postDataObject: ' + this.postDataObject);
    }

    dispatchRequest(_outputFile){
        this.outputFile = _outputFile;
        let that = this;
        let endPointURLObject = Url.parse(this.endPointURL);
        let optionsObject = {
            hostname: endPointURLObject.hostname,
            port: 443,
            path: endPointURLObject.path + '?' + querystring.stringify(endPointURLObject.querystring),
            method: this.httpVerb
        };
        let postDataString = (Object.keys(this.postDataObject)).length ? querystring.stringify(this.postDataObject) : '';
        if(this.httpHeadersObject){
            optionsObject.headers = this.httpHeadersObject;
            if(postDataString){
                optionsObject.headers['Content-Length'] = Buffer.byteLength(postDataString);
                for(var key in this.postDataObject){
                    optionsObject[key] = this.postDataObject[key];
                }
            }
        }
        return new Promise(function(resolve, reject){
            var req = https.request(optionsObject, (res) => {
                console.log('statusCode:', res.statusCode);
                console.log('headers:', res.headers);
                 // Reject on bad status
                 if (res.statusCode < 200 || res.statusCode >= 300) {
                    return reject(new Error('statusCode=' + res.statusCode));
                }
                res.on('data', (dataChunk) => {
                    if(that.outputFile){
                        that.writeToFile(dataChunk,this);
                    }else{
                        process.stdout.write(dataChunk);
                    }
                });
                res.on('end', function () {
                    console.log('No more data in response.');
                    setTimeout(function(){
                        resolve();
                    },2000);
                });
            }).on('error', (e) => {
                console.error('error: \n' + e);
            });
            // reject on request error
            req.on('error', function(err) {
                // Rejection for Promise
                reject(err);
            });
            req.end();
        });
    }

    writeToFile(_chunk){
        fs.appendFile(this.outputFile, _chunk, 'utf8', (err) => {
            if (err) throw err;
            console.log('The "data chunk" was appended to the target file!');
        });
    }

};