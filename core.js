'use strict';

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
    return new AWS.Kinesis(opts);
  } else {
    console.log('Kinesis: no config {} found, reverting to default...')
    // maybe force connectors to do this themselves?
    return new AWS.Kinesis(module.exports.defaultOpts());
  }
};

module.exports.createStream = (kinesisClient, opts) => {
  console.log(`Kinesis: creating stream with '${JSON.stringify(opts)}'`);

  var req = kinesisClient.createStream(opts);

  req.send(
    (err, data) => { 
      if (err) {
        if (err.code === 'ResourceInUseException') {
          console.log(`Kinesis: Success, stream '${opts.StreamName}' exists`);
        } else {
          console.log(`Kinesis: Failed, create '${opts.StreamName}' failed with error ${err.stack}`);
        }
      } else { 
        console.log(`Kinesis: Success, stream '${opts.StreamName}' created`);
        data.code = 0;
      }
  });

  return req;
};

module.exports.deleteStream = (kinesisClient, opts) => {
  console.log(`Kinesis: deleting stream with '${JSON.stringify(opts)}'`);

  var req = kinesisClient.deleteStream(opts);

  req.send(
    (err, data) => {
      if (err) {
        if (err.code === 'ResourceNotFoundException') {
          console.log(`Kinesis: delete failed, '${opts.StreamName}' does not exist.`)
        } else {
          console.log(err, err.stack);
        }
      } else {
        console.log(`Kinesis: delete successful, '${data}'`);
      }
    });

  return req;
};

module.exports.putRecord = (kinesisClient, data, callback) => {
  console.log(`Kinesis: putting record on stream with '${JSON.stringify(data)}'`);

  var req = kinesisClient.putRecord(data);

  req.send(
    (err, data) => {
      callback(err, data);
    }
  );

  return req;
};
