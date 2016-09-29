/**
 * grunt-image-profile
 * https://github.com/paazmaya/grunt-image-profile
 *
 * Copyright (c) Juga Paazmaya <paazmaya@yahoo.com> (https://paazmaya.fi)
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function image_profile(grunt) {

  grunt.registerMultiTask('image_profile', 'Working with image metadata profiles via ImageMagick', function register() {

    const done = this.async();
    const commands = [];
    const options = this.options({
      convertbin: 'convert'
    });
    let iptcFile;
    let exifFile;

    // Temporary profile file
    if (Object.prototype.hasOwnProperty.call(options, 'iptc')) {
      // Create IPTC file
      iptcFile = 'tmp/' + this.target + '.iptc';
      const iptcOptions = options.iptc;
      const iptcContent = Object.keys(iptcOptions).map(function mapIptc(key) {
        return key + '="' + iptcOptions[key] + '"';
      });
      grunt.file.write(iptcFile, iptcContent.join('\n'));
    }

    if (Object.prototype.hasOwnProperty.call(options, 'exif')) {
      // Create EXIF file
      exifFile = 'tmp/' + this.target + '.exif';
      const exifOptions = options.exif;
      const exifContent = Object.keys(exifOptions).map(function mapExif(key) {
        return 'exif:' + key + '=' + exifOptions[key];
      });
      grunt.file.write(exifFile, exifContent.join('\n'));
    }

    const argumentSet = [];
    if (Object.prototype.hasOwnProperty.call(options, 'iptc')) {
      const args = [];
      args.push('+profile');
      args.push('8BIM');
      args.push('-profile');
      args.push('8BIMTEXT:' + iptcFile);
      argumentSet.push(args);
    }
    /*
    if (Object.prototype.hasOwnProperty.call(options, 'exif')) {
      args.push('+profile');
      args.push('EXIF');
      args.push('-profile');
      args.push('EXIFTEXT:' + exifFile);
      args.push(dest);
    }
    */

    // No point of iteration files if there is nothing to do
    if (argumentSet.length === 0 && !Object.prototype.hasOwnProperty.call(options, 'save')) {
      return;
    }

    const profileKeys = {
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
        if (Object.prototype.hasOwnProperty.call(options, 'save')) {
          // Profile saving
          options.save.forEach(function saveEach(profile) {
            // If the destination is set, it is supposed to be the output directory
            let dest = '';
            if (file.dest) {
              dest = file.dest + src.substring(src.lastIndexOf('/') || 0, src.lastIndexOf('.')) + '.' + profile;
            }
            else {
              dest = src.substring(0, src.lastIndexOf('.')) + '.' + profile;
            }

            const key = profileKeys[profile];
            commands.push([src, key + dest]);
          });
        }
      });
    });

    const looper = function looper(args, next) {

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

    const next = function next() {
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
