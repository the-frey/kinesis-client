[![Build Status](https://travis-ci.org/the-frey/kinesis-client.svg?branch=master)](https://travis-ci.org/the-frey/kinesis-client)

## Kinesis Client

A very minimal functional wrapper around the AWS SDK to provide a Kinesis Client. I'll extend as necessary.

The idea here is that the `kinesis` require functions more like a namespace containing functions than as an object.

## Usage

To use in a lambda, do something like the below:

```
const kinesis = require('kinesis-client');

const defaultOpts = () => {
  return defaultOpts = {
    endpoint: 'localhost:4567',
    region: 'us-east-1',
    apiVersion: '2013-12-02',
    sslEnabled: false
  };
};

module.exports.source = (event, context, callback) => {
  const kinesisClient = kinesis.createClient(defaultOpts);
  var streamName = 'events';
  var streamOpts = { ShardCount: 1, StreamName: streamName }
  var callbackFn = function (err, data) { 
    if (err) {
      callback(err, {statusCode: 500, body: "Error writing to stream"});
    }
    else { 
      callback(null, {statusCode: 202, body: "ok" });
    }
  }

  kinesis.createStream(kinesisClient, streamOpts);

  console.log(event.body);

  kinesis.putRecord(kinesisClient,
                    {
                     Data: JSON.stringify(event.body),
                     PartitionKey: '0', // change this!
                     StreamName: streamName
                    },
                    callbackFn);
};
```

## TODO

Add tests!

## Licence

MIT
