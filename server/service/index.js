'use strict';

const isTest = require('../lib/test/is_test');

require('moder')(__dirname, {
  naming: 'pascal',
  lazy: false,
  exports,
  filter: isTest,
});
