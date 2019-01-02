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
      config: { // watch JustFancy base theme for changes
        files: ['../justfancy/app/Theme/JustBaseTheme.php'],
        tasks: ['copy:config'],
        options: {
          spawn: false // Key ‘spawn’ defines whether to seed/repeat the task continuously or not.
        }
      },
      resources: {
        files: ['../justfancy/resources/*'],
        tasks: ['copy:resources'],
        options: {
          spawn: false
        }
      },
      fonts: {
        files: ['../justfancy/assets/css/fonts/*'],
        tasks: ['copy:fonts'],
        options: {
          spawn: false
        }
      },
      other: {
        files: ['../justfancy/.php_cs', '../justfancy/.gitattributes', '../justfancy/.gitignore'],
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
      config: {
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

      // excluded files:
      // - individual-page
      // - views/layouts/*
      // - views/modules/lightbox/*
      // files which does not exists in JustFancy:
      // - views/tree-page.php
      // - views/user-page.php
      // Add all other files explicitly
      resources: {
        files: [{
          cwd: '../justfancy/resources',
          src: [
            'colorbox.php',
            'views/*page*',
            'views/lists/*',
            'views/modules/gedcom_block/*',
            'views/modules/gedcom_stats/*',
            'views/modules/user_welcome/*',
            'views/selects/*'
          ],
          dest: 'resources',
          expand: true
        }],
        options: {
          process: function (content) {
            return content.replace(/JustFancy/, 'JustLight');
          }
        }
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
            '.gitattributes',
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