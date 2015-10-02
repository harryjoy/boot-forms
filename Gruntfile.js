'use strict';

module.exports = function (grunt) {
  require('time-grunt')(grunt);
  require('jit-grunt')(grunt, {
    useminPrepare: 'grunt-usemin',
    ngtemplates: 'grunt-angular-templates',
    cdnify: 'grunt-google-cdn',
    injector: 'grunt-asset-injector'
  });
  var appConfig = {
    app: require('./bower.json').appPath || 'app',
    dist: 'dist'
  };

  grunt.initConfig({
    wooterConfig: appConfig,
    watch: {
      bower: {
        files: ['bower.json'],
        tasks: ['wiredep']
      },
      js: {
        files: ['<%= wooterConfig.app %>/scripts/{,*/}*.js'],
        tasks: [],
        options: {
          livereload: '<%= connect.options.livereload %>'
        }
      },
      injectJS: {
        files: [
          '<%= wooterConfig.app %>/scripts/**/*.js',
          '!<%= wooterConfig.app %>/scripts/**/*.spec.js',
          '!<%= wooterConfig.app %>/scripts/**/*.mock.js',
          '!<%= wooterConfig.app %>/scripts/app.js'],
        tasks: ['injector:scripts']
      },
      compass: {
        files: ['<%= wooterConfig.app %>/assets/styles/{,*/}*.{scss,sass}'],
        tasks: ['compass:server', 'autoprefixer:server', 'injector:sass']
      },
      gruntfile: {
        files: ['Gruntfile.js']
      },
      livereload: {
        options: {
          livereload: '<%= connect.options.livereload %>'
        },
        files: [
          '<%= wooterConfig.app %>/{,*/}*.html',
          '.tmp/styles/{,*/}*.css',
          '<%= wooterConfig.app %>/assets/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
        ]
      }
    },

    // The actual grunt server settings
    connect: {
      options: {
        port: 9000,
        hostname: 'localhost',
        livereload: 35729
      },
      livereload: {
        options: {
          open: true,
          middleware: function (connect) {
            return [
              connect.static('.tmp'),
              connect().use('/bower_components', connect.static('./bower_components')),
              connect().use('/app/assets/styles', connect.static('./app/assets/styles')),
              connect.static(appConfig.app)
            ];
          }
        }
      },
      dist: {
        options: {
          open: true,
          base: '<%= wooterConfig.dist %>'
        }
      }
    },

    // Empties folders to start fresh
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= wooterConfig.dist %>/{,*/}*',
            '!<%= wooterConfig.dist %>/.git{,*/}*'
          ]
        }]
      },
      server: '.tmp'
    },

    // Add vendor prefixed styles
    autoprefixer: {
      options: {
        browsers: ['last 1 version']
      },
      server: {
        options: {
          map: true,
        },
        files: [{
          expand: true,
          cwd: '.tmp/styles/',
          src: '{,*/}*.css',
          dest: '.tmp/styles/'
        }]
      },
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/styles/',
          src: '{,*/}*.css',
          dest: '.tmp/styles/'
        }]
      }
    },

    // Automatically inject Bower components into the app
    wiredep: {
      app: {
        src: ['<%= wooterConfig.app %>/index.html'],
        ignorePath:  /\.\.\//
      },
      sass: {
        src: ['<%= wooterConfig.app %>/assets/styles/{,*/}*.{scss,sass}'],
        ignorePath: /(\.\.\/){1,2}(\.\.\/){1,2}bower_components\//
      }
    },

    // Compiles Sass to CSS and generates necessary files if requested
    compass: {
      options: {
        sassDir: '<%= wooterConfig.app %>/assets/styles',
        cssDir: '.tmp/styles',
        generatedImagesDir: '.tmp/images/generated',
        imagesDir: '<%= wooterConfig.app %>/assets/images',
        javascriptsDir: '<%= wooterConfig.app %>/scripts',
        fontsDir: '<%= wooterConfig.app %>/assets/fonts',
        importPath: './bower_components',
        httpImagesPath: '/assets/images',
        httpGeneratedImagesPath: '/images/generated',
        httpFontsPath: '/assets/fonts',
        relativeAssets: false,
        assetCacheBuster: false,
        raw: 'Sass::Script::Number.precision = 10\n'
      },
      dist: {
        options: {
          generatedImagesDir: '<%= wooterConfig.dist %>/images/generated'
        }
      },
      server: {
        options: {
          sourcemap: true
        }
      }
    },

    // Renames files for browser caching purposes
    filerev: {
      dist: {
        src: [
          '<%= wooterConfig.dist %>/scripts/{,*/}*.js',
          '<%= wooterConfig.dist %>/styles/{,*/}*.css',
          '<%= wooterConfig.dist %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
          '<%= wooterConfig.dist %>/styles/fonts/*'
        ]
      }
    },

    // Reads HTML for usemin blocks to enable smart builds that automatically
    // concat, minify and revision files. Creates configurations in memory so
    // additional tasks can operate on them
    useminPrepare: {
      html: '<%= wooterConfig.app %>/index.html',
      options: {
        dest: '<%= wooterConfig.dist %>',
        flow: {
          html: {
            steps: {
              js: ['concat', 'uglifyjs'],
              css: ['cssmin']
            },
            post: {}
          }
        }
      }
    },

    // Performs rewrites based on filerev and the useminPrepare configuration
    usemin: {
      html: ['<%= wooterConfig.dist %>/{,*/}*.html'],
      css: ['<%= wooterConfig.dist %>/styles/{,*/}*.css'],
      js: ['<%= wooterConfig.dist %>/scripts/{,*/}*.js'],
      options: {
        assetsDirs: [
          '<%= wooterConfig.dist %>',
          '<%= wooterConfig.dist %>/images',
          '<%= wooterConfig.dist %>/styles'
        ],
        patterns: {
          js: [[/(images\/[^''""]*\.(png|jpg|jpeg|gif|webp|svg))/g, 'Replacing references to images']]
        }
      }
    },

    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= wooterConfig.app %>/assets/images',
          src: '{,*/}*.{png,jpg,jpeg,gif}',
          dest: '<%= wooterConfig.dist %>/images'
        }]
      }
    },

    svgmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= wooterConfig.app %>/assets/images',
          src: '{,*/}*.svg',
          dest: '<%= wooterConfig.dist %>/images'
        }]
      }
    },

    htmlmin: {
      dist: {
        options: {
          collapseWhitespace: true,
          conservativeCollapse: true,
          collapseBooleanAttributes: true,
          removeCommentsFromCDATA: true
        },
        files: [{
          expand: true,
          cwd: '<%= wooterConfig.dist %>',
          src: ['*.html'],
          dest: '<%= wooterConfig.dist %>'
        }]
      }
    },

    ngtemplates: {
      dist: {
        options: {
          module: 'wooterApp',
          htmlmin: '<%= htmlmin.dist.options %>',
          usemin: 'scripts/scripts.js'
        },
        cwd: '<%= wooterConfig.app %>',
        src: 'views/{,*/}*.html',
        dest: '.tmp/templateCache.js'
      }
    },

    // ng-annotate tries to make the code safe for minification automatically
    // by using the Angular long form for dependency injection.
    ngAnnotate: {
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/concat/scripts',
          src: '*.js',
          dest: '.tmp/concat/scripts'
        }]
      }
    },

    // Replace Google CDN references
    cdnify: {
      dist: {
        html: ['<%= wooterConfig.dist %>/*.html']
      }
    },

    // Copies remaining files to places other tasks can use
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= wooterConfig.app %>',
          dest: '<%= wooterConfig.dist %>',
          src: [
            '*.{ico,png,txt}',
            '.htaccess',
            '*.html',
            'assets/images/{,*/}*.{webp}',
            'assets/fonts/{,*/}*.*'
          ]
        }, {
          expand: true,
          cwd: '.tmp/images',
          dest: '<%= wooterConfig.dist %>/images',
          src: ['generated/*']
        }, {
          expand: true,
          cwd: '.',
          src: 'bower_components/bootstrap-sass-official/assets/fonts/bootstrap/*',
          dest: '<%= wooterConfig.dist %>'
        }]
      },
      styles: {
        expand: true,
        cwd: '<%= wooterConfig.app %>/assets/styles',
        dest: '.tmp/styles/',
        src: '{,*/}*.css'
      }
    },

    // Run some tasks in parallel to speed up the build process
    concurrent: {
      server: [
        'compass:server'
      ],
      dist: [
        'compass:dist',
        'imagemin',
        'svgmin'
      ]
    },

    injector: {
      options: {
      },
      // Inject application script files into index.html (doesn't include bower)
      scripts: {
        options: {
          transform: function(filePath) {
            console.log(filePath);
            filePath = filePath.replace('/app/', '');
            filePath = filePath.replace('/.tmp/', '');
            console.log(filePath);
            return '<script src="' + filePath + '"></script>';
          },
          starttag: '<!-- injector:js -->',
          endtag: '<!-- endinjector -->'
        },
        files: {
          '<%= wooterConfig.app %>/index.html': [
              ['{.tmp,<%= wooterConfig.app %>}/scripts/**/*.js',
               '!{.tmp,<%= wooterConfig.app %>}/scripts/app.js']
            ]
        }
      },
      // Inject component scss into app.scss
      sass: {
        options: {
          transform: function(filePath) {
            filePath = filePath.replace('/app/assets/styles/', '');
            return '@import \'' + filePath + '\';';
          },
          starttag: '// injector',
          endtag: '// endinjector'
        },
        files: {
          '<%= wooterConfig.app %>/assets/styles/main.scss': [
            '<%= wooterConfig.app %>/**/*.{scss,sass}',
            '!<%= wooterConfig.app %>/assets/styles/main.{scss,sass}'
          ]
        }
      },
    }
  });


  grunt.registerTask('serve', 'Compile then start a connect web server', function (target) {
    if (target === 'dist') {
      return grunt.task.run(['build', 'connect:dist:keepalive']);
    }

    grunt.task.run([
      'clean:server',
      'injector',
      'wiredep',
      'concurrent:server',
      'autoprefixer:server',
      'connect:livereload',
      'watch'
    ]);
  });

  grunt.registerTask('build', [
    'clean:dist',
    'wiredep',
    'useminPrepare',
    'concurrent:dist',
    'autoprefixer',
    'ngtemplates',
    'concat',
    'ngAnnotate',
    'copy:dist',
    'cdnify',
    'cssmin',
    'uglify',
    'filerev',
    'usemin',
    'htmlmin'
  ]);

  grunt.registerTask('default', [
    'build'
  ]);
};
