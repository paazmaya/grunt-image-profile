/*
 * grunt-image-profile
 * https://github.com/paazmaya/grunt-image-profile
 *
 * Copyright (c) 2013 Juga Paazmaya
 * Licensed under the MIT license.
 */

module.exports = function(grunt) {
  'use strict';

  grunt.registerMultiTask('image_profile', 'Working with image metadata profiles via ImageMagick', function() {

    // Defaults, if any
    var options = this.options({});
    
    // Temporary profile file
    if (options.hasOwnProperty('iptc')) {
      // Create IPTC file
      var iptcOptions = options.iptc;
      var iptcContent = [];
      for (var key in iptcOptions) {
        if (iptcOptions.hasOwnProperty(key)) {
          iptcContent.push(key + '="' + iptcOptions[key] + '"');
        }
      }
      grunt.file.write('tmp/' + this.target + '.iptc', iptcContent.join("\n"));
    }


    this.files.forEach(function(file) {
      
      grunt.log.writeln('Processing "' + file.src + '" ');

      console.log('file.src: ' + file.src);
      
      // In case dest is undefined, use the src
      console.log('file.dest: ' + file.dest);

    });
  });

};
