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
      }),
      iptcFile,
      exifFile;

    // Temporary profile file
    if (options.hasOwnProperty('iptc')) {
      // Create IPTC file
      iptcFile = 'tmp/' + this.target + '.iptc';
      var iptcOptions = options.iptc;
      var iptcContent = [];
      for (var key in iptcOptions) {
        if (iptcOptions.hasOwnProperty(key)) {
          iptcContent.push(key + '="' + iptcOptions[key] + '"');
        }
      }
      grunt.file.write(iptcFile, iptcContent.join("\n"));
    }

    if (options.hasOwnProperty('exif')) {
      // Create EXIF file
      exifFile = 'tmp/' + this.target + '.exif';
      var exifOptions = options.exif;
      var exifContent = [];
      for (var key in exifOptions) {
        if (exifOptions.hasOwnProperty(key)) {
          exifContent.push('exif:' + key + '=' + exifOptions[key]);
        }
      }
      grunt.file.write(exifFile, exifContent.join("\n"));
    }


    // file set
    this.files.forEach(function(file) {
      
      var args = [];

      if (options.hasOwnProperty('iptc')) {
        args.push('+profile');
        args.push('8BIM');
        args.push('-profile');
        args.push('8BIMTEXT:' + iptcFile);
       
      }
      /*
      if (options.hasOwnProperty('exif')) {
        args.push('+profile');
        args.push('EXIF');
        args.push('-profile');
        args.push('EXIFTEXT:' + exifFile);
        args.push(dest);
      }
      */
      
      // No point of iteration files if there is nothing to do
      if (args.length === 0) {
        return;
      }
      
      file.src.forEach(function(src) {
        // In case dest is undefined, use the src
        commands.push([src].concat(args, (file.dest || src)));
      });

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
          throw error;
        }
        grunt.log.writeln(result.stdout);
        grunt.log.writeln(result.stderr);
        grunt.log.writeln(code + ' - ' + result);
        if (code !== 0) {
          return grunt.warn(String(code));
        }
        next();
      });
    };

    // Start looping.
    next();
  });

};
