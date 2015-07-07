exports.init = function(genericAWSClient) {
  //creates an Amazon Product Advertising API Client
  var createProdAdvClient = function (accessKeyId, secretAccessKey, associateTag, options) {
    options = options || {};
    var aws = genericAWSClient({
      host: options.host || "webservices.amazon.in",
      path: options.path || "/onca/xml",
      accessKeyId: accessKeyId,
      secretAccessKey: secretAccessKey,
      secure: options.secure
    });
    var callFn = function(action, query, callback) {
      query["Operation"] = action
      query["Service"] = "AWSECommerceService"
      query["Version"] = options.version || '2013-08-01'
      query["AssociateTag"] = associateTag;
      query["Region"] = options.region || "IN"
      return aws.call(action, query, callback);
    }
    return {
        client: aws,
        call: callFn
    };
  }
  return createProdAdvClient;
}