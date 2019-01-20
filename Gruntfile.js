const sass = require('node-sass');

module.exports = function (grunt) {

  // load all grunt tasks with this command. No need to set grunt.loadNpmTasks(...) for each task separately;
  require('load-grunt-tasks')(grunt);

  // output time table
  require('time-grunt')(grunt);

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    // ========================================================================================
    // WATCH TASK
    // ========================================================================================
    watch: {
      basetheme: { // watch JustFancy base theme for changes
        files: ['../justfancy/app/Theme/JustBaseTheme.php'],
        tasks: ['copy:basetheme'],
        options: {
          spawn: false // Key ‘spawn’ defines whether to seed/repeat the task continuously or not.
        }
      },
      colorbox: {
        files: ['../justfancy/resources/colorbox.php'],
        tasks: ['copy:colorbox'],
        options: {
          spawn: false
        }
      },
      views: { // watch views folder for changes
        files: ['../justfancy/resources/views/**'],
        tasks: ['copy:views'],
        options: {
          spawn: false
        }
      },
      fonts: {
        files: ['../justfancy/assets/css/fonts/**'],
        tasks: ['copy:fonts'],
        options: {
          spawn: false
        }
      },
      other: {
        files: ['../justfancy/.php_cs', '../justfancy/.gitattributes'],
        tasks: ['copy:other'],
        options: {
          spawn: false
        }
      },
      scss: {
        files: ['assets/scss/**/*.scss', '../justfancy/assets/scss/**/*.scss'],
        tasks: ['default'],
        options: {
          spawn: true
        }
      },
      js: {
        files: ['assets/js/src/*.js', '../justfancy/assets/js/src/*.js'],
        tasks: ['concat'],
        options: {
          spawn: false
        }
      },
      php: {
        files: ['*.php'],
        tasks: ['phpcsfixer'],
        options: {
          spawn: false
        }
      }
    },

    // ========================================================================================
    // SASS TASK
    // ========================================================================================
    sass: {
      dev: {
        options: {
          implementation: sass,
          outputStyle: 'expanded',
          sourceMap: true

        },
        files: {
          'assets/css/style.css': ['assets/scss/style.scss']
        }
      }
    },

    // ========================================================================================
    // POSTCSS TASK
    // ========================================================================================
    postcss: {
      default: {
        options: {
          map: true,
          processors: [
            require('autoprefixer')({
              browsers: ['last 1 version', '> 2%'] // see http://browserl.ist/?q=last+1+version%2C+%3E+2%25
            })
          ]
        },
        src: ['assets/css/*.css']
      },
      dist: {
        options: {
          map: true,
          processors: [
            require('cssnano')() // add minified css
          ]
        },
        src: ['assets/css/*.css']
      }
    },

    // ========================================================================================
    // CONCAT TASK (JAVASCRIPT)
    // ========================================================================================
    concat: {
      options: {
        separator: '' + grunt.util.linefeed,
        process: function (content) {
          return content.replace(/JustFancy/, 'JustLight');
        }
      },

      justlight: {
        src: [
          '../justfancy/assets/js/_base.js',
          'assets/js/src/nav.js'
        ],
        dest: 'assets/js/theme.js'
      }
    },

    // ========================================================================================
    // UGLIFY TASK (JAVASCRIPT DIST)
    // ========================================================================================
    uglify: {
      options: {
        output: {
          comments: /^!/
        }
      },
      dist: {
        files: {
          'assets/js/theme.js': ['assets/js/theme.js']
        }
      }
    },

    // ========================================================================================
    // PHP CS FIXER
    //
    // Source: https://github.com/FriendsOfPHP/PHP-CS-Fixer    //
    // Configurator: https://mlocati.github.io/php-cs-fixer-configurator/
    // ========================================================================================

    phpcsfixer: {
      app: {
        dir: ''
      },
      options: {
        bin: '../justfancy/vendor/bin/php-cs-fixer',
        configfile: '.php_cs',
        quiet: true
      }
    },

    // ========================================================================================
    // COPY TASK
    // ========================================================================================
    copy: {
      basetheme: {
        files: [{
          src: '../justfancy/app/Theme/JustBaseTheme.php',
          dest: 'app/Theme/JustBaseTheme.php'
        }],
        options: {
          process: function (content) {
            content = content.replace(/JustFancy/, 'JustLight');
            return content.replace('JustFancy\\Theme', 'JustLight\\Theme');
          }
        }
      },

      colorbox: {
        files: [{
            cwd: '../justfancy/resources',
            src: 'colorbox.php',
            dest: 'resources',
            expand: true
          }],
          options: {
            process: function (content) {
              content = content.replace(/JustFancy/, 'JustLight');
              return content.replace(/JustFancy/, 'JustLight');
            }
          }
      },

      // Copy the view folder. Use ** to include subfolders
      // Use '!' to exclude a file or folder
      // files which does not exists in JustFancy:
      // - views/tree-page.php
      // - views/user-page.php
      views: {
        files: [{
          cwd: '../justfancy/resources/views/',
          src: [
            '**',
            '!layouts/*',
            '!individual-page.phtml'
          ],
          dest: 'resources/views',
          expand: true
        }]
      },

      fonts: {
        files: [{
          cwd: '../justfancy/assets/css/fonts/',
          src: ['**'],
          dest: 'assets/css/fonts/',
          expand: true
        }]
      },

      // gitignore is different in both themes
      // we won't copy that file.
      other: {
        files: [{
          cwd: '../justfancy',
          src: [
            '.php_cs',
            '.gitattributes'
          ],
          dest: '',
          expand: true
        }]
      }
    }
  }); // end of grunt configuration

  // ========================================================================================
  // TASKS
  // ========================================================================================
  // Default task(s)
  grunt.registerTask('default', ['sass:dev', 'postcss:default']);

  // Custom tasks (development)
  grunt.registerTask('_dev-theme', ['concat', 'sass:dev', 'postcss:default', 'copy', 'phpcsfixer']);

  // Custom tasks (distribution)
  grunt.registerTask('_dist-theme', ['_dev-theme', 'postcss:dist', 'uglify']);
};