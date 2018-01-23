module.exports = function(grunt) {

  require('load-grunt-tasks')(grunt);
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
          spawn: false
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
        separator: '' + grunt.util.linefeed
      },

      justlight: {
        src: [
          '../justfancy/assets/js/_base.js',
          'assets/js/src/grid.js'
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
          bin: '../../vendor/bin/php-cs-fixer',
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
            return content.replace('JustFancy\\Theme', 'JustLight\\Theme');
          }
        }
      },

     // excluded files:
      // - views/tab/album.php
      // Add all other files explicitly
      resources: {
        files: [{
          cwd: '../justfancy/resources',
          src: [
            'colorbox.php',
            'views/report-setup-page.php',
            'views/blocks/*',
            'views/selects/*'
          ],
          dest: 'resources',
          expand: true
        }]
      },

      fonts: {
        files: [
          {
            cwd: '../justfancy/assets/css/fonts/',
            src: ['**'],
            dest: 'assets/css/fonts/',
            expand: true
          }
        ]
      },

      other: {
       files: [{
         cwd: '../justfancy',
         src: [
           '.php_cs',
           '.gitattributes',
           '.gitignore'
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
  grunt.registerTask('_dev-theme', ['sass:dev', 'postcss:default', 'concat', 'copy', 'phpcsfixer']);

  // Custom tasks (distribution)
  grunt.registerTask('_dist-theme', ['_dev-theme', 'postcss:dist', 'uglify']);
};