/**
 * grunt-image-profile
 * https://github.com/paazmaya/grunt-image-profile
 *
 * Copyright (c) Juga Paazmaya <paazmaya@yahoo.com> (http://paazmaya.fi)
 * Licensed under the MIT license.
 */
'use strict';

module.exports = function image_profile(grunt) {

  grunt.registerMultiTask('image_profile', 'Working with image metadata profiles via ImageMagick', function register() {

    var done = this.async();
    var commands = [];
    var options = this.options({
      convertbin: 'convert'
    });
    var iptcFile;
    var exifFile;

    // Temporary profile file
    if (options.hasOwnProperty('iptc')) {
      // Create IPTC file
      iptcFile = 'tmp/' + this.target + '.iptc';
      var iptcOptions = options.iptc;
      var iptcContent = Object.keys(iptcOptions).map(function mapIptc(key) {
        return key + '="' + iptcOptions[key] + '"';
      });
      grunt.file.write(iptcFile, iptcContent.join('\n'));
    }

    if (options.hasOwnProperty('exif')) {
      // Create EXIF file
      exifFile = 'tmp/' + this.target + '.exif';
      var exifOptions = options.exif;
      var exifContent = Object.keys(exifOptions).map(function mapExif(key) {
        return 'exif:' + key + '=' + exifOptions[key];
      });
      grunt.file.write(exifFile, exifContent.join('\n'));
    }

    var argumentSet = [];
    if (options.hasOwnProperty('iptc')) {
      var args = [];
      args.push('+profile');
      args.push('8BIM');
      args.push('-profile');
      args.push('8BIMTEXT:' + iptcFile);
      argumentSet.push(args);
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
    if (argumentSet.length === 0 && !options.hasOwnProperty('save')) {
      return;
    }

    var profileKeys = {
      xmp: 'XMP:',
      iptc: 'IPTCTEXT:'
    };

    // file set, each file, profile options
    this.files.forEach(function filesEach(file) {
      file.src.forEach(function srcEach(src) {
        /*
        argumentSet.forEach(function(args) {
          // In case dest is undefined, use the src
          //commands.push([src].concat(args, (file.dest || src)));
        });
        */
        if (options.hasOwnProperty('save')) {
          // Profile saving
          options.save.forEach(function saveEach(profile) {
            // If the destination is set, it is supposed to be the output directory
            var dest = '';
            if (file.dest) {
              dest = file.dest + src.substring(src.lastIndexOf('/') || 0, src.lastIndexOf('.')) + '.' + profile;
            }
            else {
              dest = src.substring(0, src.lastIndexOf('.')) + '.' + profile;
            }

            var key = profileKeys[profile];
            commands.push([src, key + dest]);
          });
        }
      });
    });

    var looper = function looper(args, next) {

      grunt.log.writeln('convert ' + args.join(' '));

      grunt.util.spawn({
        cmd: options.convertbin,
        args: args
      }, function handler(error, result, code) {
        if (error) {
          throw error;
        }
        grunt.log.writeln(result.stdout);
        grunt.log.writeln(result.stderr);
        grunt.log.writeln(code + ' - ' + result);
        if (code !== 0) {
          grunt.warn(String(code));
        }
        else {
          next.call(this);
        }
      });
    };

    var next = function next() {
      if (commands.length > 0) {
        looper(commands.pop(), next);
      }
      else {
        done();
      }
    };

    // Start looping.
    next();
  });

};
