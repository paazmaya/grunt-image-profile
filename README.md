# grunt-image-profile

> A Grunt task for working with image metadata profiles via ImageMagick

[![Build Status](https://travis-ci.org/paazmaya/grunt-image-profile.png?branch=master)](https://travis-ci.org/paazmaya/grunt-image-profile)

See [ImageMagick documentation about Image Profiles](http://www.imagemagick.org/Usage/formats/#profiles)
for more details about what is done internally.

## Getting Started
This plugin requires Grunt `~0.4.1`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the
[Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create
a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins.
Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-image-profile --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-image-profile');
```

## The "image_profile" task

### Overview
In your project's Gruntfile, add a section named `image_profile` to the data object passed into
`grunt.initConfig()` and configure according to the multi task configuration styles.

```js
grunt.initConfig({
  image_profile: {
    dist: {
      options: {
        // Task-specific options go here.
      },
      files: {
        // Target-specific file lists and/or options go here.
      }
    }
  },
})
```


### Options

#### options.convertbin
Type: `String`

Default value: `'convert'`

File path of the `convert` binary from ImageMagick. Use this option to set the path of the binary
in case it is not found in the `PATH` of the current environment.

#### options.iptc
Type: `Object`

Example: `{ '2#80#Byline': 'Juga Paazmaya' }`

Collection of keys and their values to be used as IPTC based profile.

#### options.exif
Type: `Object`

Example: `{ 'GPSLatitude': '60/1, 192322/10000, 0/1' }`

EXIF data

### Usage Examples

Please note that while most of the examples have empty `options` object, nothing will be written
to the images in case it is used as such.

#### Source and destinations

The `files` object can be used to set the source and destination of the image files.

```js
grunt.initConfig({
  image_profile: {
    different: {
      options: {},
      files: {
        'dest/image.jpg': 'src/image.jpg'
      }
    }
  }
})
```

In case the `src` property is used instead, the metadata will be written directly on the source image files.

```js
grunt.initConfig({
  image_profile: {
    same_file: {
      options: {},
      src: [
        'image.jpg'
      ]
    }
  }
})
```

Globbing can also be used, in which case the destination can be set as a directory.

```js
grunt.initConfig({
  image_profile: {
    different: {
      options: {},
      files: {
        'dest/': 'src/*.jpg'
      }
    },
    write_on_original: {
      options: {},
      src: [
        'path/*.jpg'
      ]
    }
  }
})
```

#### Using with IPTC Options

This example adds the given [IPTC](http://www.iptc.org/site/Home/) values to the JPEG files found with the source glob.

Please keep in mind that most of the keys start with `2#`.

Please see [IPTC Photo Metadata Standard, 2010-07-08](http://www.iptc.org/std/photometadata/specification/IPTC-PhotoMetadata-201007_1.pdf)
for possible keys.

```js
grunt.initConfig({
  image_profile: {
    location: {
      options: {
        iptc: {
          '2#90#City': 'Helsinki',
          '2#101#Country/Primary Location Name': 'Finland',
          '2#95#Province/State': 'Uusimaa',
        }
      },
      src: ['src/**/*.jpg']
    }
  }
})
```

### Using with EXIF options

http://www.exif.org/specifications.html


## Contributing

In lieu of a formal styleguide, take care to maintain the existing coding style.
Add unit tests for any new or changed functionality.
Lint and test your code using [Grunt](http://gruntjs.com/).


## Release History

* 2013-08-18    v0.1.1    Running tests just for IPTC usage
* 2013-08-18    v0.1.0    Initial release which can only write IPTC profiles
