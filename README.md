# Oracle Bluekai User API Connector
JS Translation of Oracle's [official Python based example](https://goo.gl/JqXX5T)

# Enter Credentails
Enter your  bkuid and bksecreket in the credentials.json file

```
{
    "bkuid" : "WEB_SERVICE_USER_KEY",
    "bksecretkey" : "WEB_SERVICE_PRIVATE_KEY"
}
```

# Example Implementations
## Write Other System Audience Classification
[oracle_dmp_api_request_classify_impl.js](oracle_dmp_api_request_classify_impl.js) contains an example which:
1. Calls the https://api.tags.bluekai.com/getdata/ endpoint
2. Syncs another systems id with a phint defined in Bluekai
3. Server response contains a categories array which the other system id belongs to in Bluekai