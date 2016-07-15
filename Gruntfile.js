/**
 * grunt-image-profile
 * https://github.com/paazmaya/grunt-image-profile
 *
 * Copyright (c) Juga Paazmaya <paazmaya@yahoo.com> (https://paazmaya.fi)
 * Licensed under the MIT license.
 */
'use strict';

module.exports = function gruntConf(grunt) {
  require('time-grunt')(grunt); // Must be first item

  // Project configuration.
  grunt.initConfig({
    eslint: {
      options: {
        config: '.eslintrc.json',
        format: 'stylish'
      },
      target: [
        'Gruntfile.js',
        'tasks/*.js'
      ]
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['tmp']
    },

    // Copy files needed for tests
    copy: {
      location: {
        src: 'test/fixtures/no-copyright.jpg',
        dest: 'tmp/location.jpg'
      }
    },

    // Configuration to be run (and then tested).
    image_profile: {
      copyright: {
        options: {
          iptc: {
            '2#80#Byline': 'Jukka Paasonen'
          }
        },
        files: {
          'tmp/copyright.jpg': ['test/fixtures/no-copyright.jpg']
        }
      },

      location: {
        options: {
          exif: {
            'GPSLatitude': '60/1, 192322/10000, 0/1',
            'GPSLatitudeRef': 'N',
            'GPSLongitude': '24/1, 26125/10000, 0/1',
            'GPSLongitudeRef': 'E'
          }
        },
        src: ['tmp/location.jpg'] // Copied in copy:location task
      },

      save_profiles: {
        options: {
          save: [
            'xmp',
            'iptc'
          ]
        },
        files: {
          'tmp/': ['test/fixtures/jikishin-family.jpg']
        }
      }
    },

    // Unit tests.
    nodeunit: {
      tests: ['test/*_test.js']
    }

  });

  grunt.loadTasks('tasks');

  require('jit-grunt')(grunt);

  grunt.registerTask('test', ['eslint', 'clean', 'copy', 'image_profile:copyright', 'image_profile:save_profiles', 'nodeunit']);

  grunt.registerTask('default', ['test']);
};
