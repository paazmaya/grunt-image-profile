/*
 * grunt-image-profile
 * https://github.com/paazmaya/grunt-image-profile
 *
 * Copyright (c) 2013 Juga Paazmaya
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    eslint: {
      options: {
        config: 'eslint.json'
      },
      target: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= nodeunit.tests %>'
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

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-eslint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');
  grunt.loadNpmTasks('grunt-contrib-copy');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['eslint', 'clean', 'copy', 'image_profile:copyright', 'image_profile:save_profiles', 'nodeunit']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['test']);

};
