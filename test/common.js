var path = require('path');

exports.assert = require('assert');
exports.fake = require('../');
exports.dir = {
  fixture: path.join(__dirname, '/fixture'),
};
