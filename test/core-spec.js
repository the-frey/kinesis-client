'use strict';

var expect = require('chai').expect;
var core = require('../core');

const defaultOpts = () => {
  return defaultOpts = {
    endpoint: "localhost:4567",
    region: 'us-east-1',
    apiVersion: '2013-12-02',
    sslEnabled: false,
    accessKeyId: '-',
    secretAccessKey: '-'
  };
};

describe('createClient()', function () {
  it('should return a client object', function () {

    var kinesisClient = core.createClient(defaultOpts)

    expect(typeof kinesisClient).to.be.equal('object');

  });
});
