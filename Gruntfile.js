module.exports = function (grunt) {

    var bowerPath = 'bower_components/';

    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),
        cssmin: {
            codefire: {
                expand: true,
                cwd: 'public/assets/css/',
                src: ['*.css', '!*.min.css'],
                dest: 'public/assets/css/',
                ext: '.min.css'
            }
        },
        sass: {
            codefire: {
                options: {
                    style: 'expanded',
                    sourcemap: true,
                    sourceComments: 'map',
                    lineNumbers: true
                },
                files: {
                    'public/assets/css/cf-db-admin.css': 'src/sass/cf-db-admin.scss'
                }
            }
        },
        concat: {
            options: {
                banner: '<%= banner %>\n<%= jqueryCheck %>',
                stripBanners: false
            },
            cf: {
                src: [
                    'src/js/cf-db.js',
                    'src/js/cf-templates.js',
                    'src/js/cf-db/log-in.js'
                ],
                dest: 'public/assets/js/cf-db-admin.js'
            },
            angular: {
                src: [
                    bowerPath + 'angular/angular.js',
                    bowerPath + 'angular-route/angular-route.js',
                    bowerPath + 'angular-cookies/angular-cookies.js'
                ],
                dest: 'public/assets/js/angular.js'
            },
            jquery: {
                src: [
                    bowerPath + 'jquery/dist/jquery.min.js'
                ],
                dest: 'public/assets/js/jquery.min.js'
            },
            foundation: {
                src: [
                    bowerPath + 'modernizr/modernizr.js',
                    bowerPath + 'foundation/js/foundation.js'
                ],
                dest: 'public/assets/js/foundation.js'
            }
        },
        uglify: {
            javascript: {
                files: {
                    'public/assets/js/cf-db-admin.min.js': ['public/assets/js/cf-db-admin.js'],
                    'public/assets/js/foundation.min.js': ['public/assets/js/foundation.js']
                }
            }
        },
        html2js: {
            options: {
                module: 'cf-templates',
                rename: function (moduleName) {
                    return '/' + moduleName.replace('templates/', 'cf-templates/');
                }
            },
            main: {
                src: ['src/templates/**/*.html'],
                dest: 'src/js/cf-templates.js'
            }
        },
        watch: {
            sass: {
                files: 'src/sass/*',
                tasks: ['default'],
                options: {
                    livereload: true,
                    spawn: false
                }
            },
            js: {
                files: 'src/js/*',
                tasks: ['js'],
                options: {
                    livereload: true,
                    spawn: false
                }
            },
            html: {
                files: 'public/*.html',
                tasks: [],
                options: {
                    livereload: true,
                    spawn: false
                }
            },
            templates: {
                files: 'src/templates/**/*.html',
                tasks: ['html2js', 'js'],
                options: {
                    livereload: true,
                    spawn: false
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-html2js');

    grunt.registerTask('js', ['concat', 'uglify']);
    // Default task(s).
    grunt.registerTask('default', ['sass', 'cssmin', 'html2js', 'js']);
};