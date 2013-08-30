'use strict';

var grunt = require('grunt');

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

exports.image_profile = {
  setUp: function(done) {
    // setup here if necessary
    done();
  },

  copyright: function(test) {
    test.expect(1);

    var actual = grunt.file.read('tmp/copyright.iptc');
    var expected = grunt.file.read('test/expected/copyright.iptc');
    test.equal(actual, expected, 'Temporarily created IPTC profile file is correct');

    // Does the image now contain the metadata?
    //convert tmp/copyright.jpg IPTCTEXT:tmp/copyright-written.iptc
    //var written = grunt.file.read('tmp/copyright-written.iptc');
    //test.equal(written, expected, 'Written IPTC profile matches the expected');

    test.done();
  },

  location: function(test) {
    test.expect(0);

    test.done();
  },

  save_profiles: function(test) {
    test.expect(2);

    var actual = grunt.file.read('tmp/jikishin-family.iptc');
    var expected = grunt.file.read('test/expected/jikishin-family.iptc');
    test.equal(actual, expected, 'IPTC profile was saved correctly');

    actual = grunt.file.read('tmp/jikishin-family.xmp');
    expected = grunt.file.read('test/expected/jikishin-family.xmp');
    test.equal(actual, expected, 'XMP profile was saved correctly');

    test.done();
  }

};
