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
      scss: {
        files: ['assets/scss/*.scss'],
        tasks: ['default'],
        options: {
          spawn: false
        }
      },      
      js: {
        files: ['assets/js/src/*.js'],
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
            'views/report-setup.php',
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
            cwd: '../justfancy/fonts/css/icomoon/',
            src: ['**'],
            dest: 'assets/css/fonts/icomoon/',
            expand: true
          },
        ]
      }
    }
  });

  // ========================================================================================
  // TASKS
  // ========================================================================================
  // Default task(s)
  grunt.registerTask('default', ['sass:dev', 'postcss:default']);

  // Custom tasks (development)
  grunt.registerTask('_dev-theme', ['sass:dev', 'postcss:default', 'concat', 'copy']);

  // Custom tasks (distribution)
  grunt.registerTask('_dist-theme', ['sass:dev', 'postcss', 'concat', 'uglify', 'copy']);
};