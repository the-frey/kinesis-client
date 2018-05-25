const AWS = require('aws-sdk');

module.exports.defaultOpts = () => {
  return defaultOpts = {
    endpoint: "localhost:4567",
    region: 'us-east-1',
    apiVersion: '2013-12-02',
    sslEnabled: false
  };
};

module.exports.createClient = (opts) => {
  if (opts !== null && opts !== undefined) {
    new AWS.Kinesis(opts);
  } else {
    console.log('Kinesis: no config {} found, reverting to default...')
    // maybe force connectors to do this themselves?
    new AWS.Kinesis(module.exports.defaultOpts);
  }
};

module.exports.createStream = (kinesisClient, opts) => {
  var req = kinesisClient.createStream(opts);
  req.send(function (err, data) { 
    if (err) {
      if (err.code === 'ResourceInUseException') {
        console.log(`Kinesis: Success, stream '${streamName}' exists`);
        process.exit(0);
      }
      else {
        console.log(`Kinesis: Failed, create '${streamName}' failed with error ${err.stack}`);
        process.exit(1);
      }
    }
    else { 
      console.log(`Kinesis: Success, stream '${streamName}' created`);
      process.exit(0);
    }
  });
};

module.exports.putRecord = (kinesisClient, data, callbackFn) => {
  kinesisClient.putRecord(data,
                          callbackFn);
};
