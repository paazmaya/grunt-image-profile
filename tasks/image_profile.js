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

    var done = this.async(),
      commands = [],
      options = this.options({
        convertbin: 'convert'
      });
    
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
      var args = [
        file.src
      ];
      
      // In case dest is undefined, use the src
      var dest = file.dest || file.src;
      

      commands.push(args);      
    });
    
    var next = function () {
      if (commands.length > 0) {
        looper(commands.pop());
      }
      else {
        done();
      }
    };

    var looper = function (args) {

      console.log('convert ' + args.join(' '));

      var child = grunt.util.spawn({
        cmd: options.convertbin,
        args: args
      }, function (error, result, code) {
        if (error) {
          //throw error;
        }
        grunt.log.writeln(result.stdout);
        grunt.log.writeln(result.stderr);
        grunt.log.writeln(code + ' - ' + result);
        if (code !== 0) {
          //return grunt.warn(String(code));
        }
        next();
      });
    };

    // Start looping.
    next();
  });

};
