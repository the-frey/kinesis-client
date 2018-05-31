'use strict';

var expect = require('chai').expect;
var core = require('../core');

var defaultOpts = {
  endpoint: "localhost:4567",
  region: 'us-east-1',
  apiVersion: '2013-12-02',
  sslEnabled: false,
  accessKeyId: '-',
  secretAccessKey: '-'
};

describe('createClient()', function () {
  before(function(done){
    // clean up
    var streamName = 'testEventsStream';
    var streamOpts = { ShardCount: 1, StreamName: streamName };
    var kinesisClient = core.createClient(defaultOpts);
    core.deleteStream(kinesisClient, {StreamName: streamName}).on('complete', (response) => {
      done();
    });
  })

  it('should return a client object', function () {
    var kinesisClient = core.createClient(defaultOpts)

    expect(typeof kinesisClient).to.be.equal('object');

  });
});

describe('createStream()', function () {
  before(function(done){
    // clean up
    var streamName = 'testEventsStream';
    var streamOpts = { ShardCount: 1, StreamName: streamName };
    var kinesisClient = core.createClient(defaultOpts);
    core.deleteStream(kinesisClient, {StreamName: streamName}).on('complete', (response) => {
      done();
    });
  })

  var streamName = 'testEventsStream';
  var streamOpts = { ShardCount: 1, StreamName: streamName };
  var kinesisClient = core.createClient(defaultOpts);

  it('should create a stream and return 0', function () {

    core.createStream(kinesisClient, streamOpts).on('complete', (response) => {

      expect(response.data.code).to.be.equal(0);
      console.log(`KinesisTest: response response.data.code '${response.data.code}' receieved`);


      describe('the stream already exists', function () {
        it('should return 0', function (){

          core.createStream(kinesisClient, streamOpts).on('complete', (response) => {
            // data is nulled by the callback
            expect(response.error.code).to.be.equal('ResourceInUseException');
            expect(response.data).to.be.equal(null);

          });

        });
      });

    });

  });

  // it('should return 1 on a real error', function () {
  //   var kinesisClient = undefined;
  //   expect(core.createStream(kinesisClient, streamOpts)).to.be.equal(1);
  // });
});

describe('putRecord()', function () {

  before(function(done){
    // clean up
    var streamName = 'testEventsStream';
    var streamOpts = { ShardCount: 1, StreamName: streamName };
    var kinesisClient = core.createClient(defaultOpts);

    core.deleteStream(kinesisClient, {StreamName: streamName}).on('complete', (response) => {
      core.createStream(kinesisClient, streamOpts).on('complete', (resp) => {
        done();
      });
    });

  })

  it('should put a record on the stream', function(){

    var streamName = 'testEventsStream';
    var streamOpts = { ShardCount: 1, StreamName: streamName };
    var kinesisClient = core.createClient(defaultOpts);
    var data = {
      Data: JSON.stringify({test: "data"}),
      PartitionKey: '0',
      StreamName: streamName
    }
    var callbackFn = (err, data) => { 
      if (err) {
        return err;
      }
      else { 
        return data;
      }
    }

    core.putRecord(kinesisClient, data).on('complete', (putResponse) => {

      expect(putResponse.error).to.be.equal(null);
      expect(putResponse.httpResponse.statusCode).to.be.equal(200);

    });

  });
});
