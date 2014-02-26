

module.exports = function(grunt) {

    var _ = require("underscore");

    var libjsfiles = [
        "bower_components/underscore/underscore.js",
        "bower_components/jquery/dist/jquery.js",
        "bower_components/uri.js/src/URI.js",
        "bower_components/momentjs/moment.js",
        "bower_components/httpinvoke/httpinvoke-browser.js",
        "bower_components/q/q.js",
        "bower_components/ring/ring.js",
        "bower_components/spear/spear.js",
    ];
    var templatesfiles = [
        "src/client_templates/templates.html",
    ];
    var templatesjsfiles = _.map(templatesfiles, function(e) { return e.replace(".html", ".js") });
    var myjsfiles = [
        "src/js/app.js",
    ].concat(templatesjsfiles);
    var jsfiles = [].concat(libjsfiles).concat(myjsfiles);

    var libcssfiles = [
    ];
    var lessfiles = [
        "src/css/style.less",
    ];
    var mycssfiles = _.map(lessfiles, function(e) { return e.replace(".less", ".css") });
    var cssfiles = [].concat(libcssfiles).concat(mycssfiles);

    grunt.initConfig({
        jshint: {
            files: myjsfiles,
        },
        less: {
            dev: {
                options: {
                    paths: ["."]
                },
                files: _.object(mycssfiles, lessfiles),
            }
        },
        watch: {
            less: {
                files: "static/css/**.less",
                tasks: ['less']
            },
            cssmin: {
                files: cssfiles,
                tasks: ['cssmin'],
            },
            js: {
                files: jsfiles,
                tasks: ['uglify'],
            },
        },
        cssmin: {
            dist: {
                files: {
                    'static/style.min.css': cssfiles,
                }
            },
        },
        clean: {
            tmp: {
                src: [].concat(mycssfiles),
            },
            all: {
                src: ["static", 'filesconfig.json'],
            }
        },
        uglify: {
            dist: {
                files: {
                    'static/app.min.js': jsfiles,
                }
            }
        },
        copy: {
            main: {
                files: [
                    {expand: true, flatten: true, cwd: 'bower_components/bootstrap/dist/fonts/', src: ['*'], dest: 'static/libs/bootstrap/'},
                ]
            }
        },
        shell: {
            jiko: {
                command: "node_modules/jiko/jiko_cli.js compile src/client_templates/templates.html",
            },
        },
    });

    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-shell');

    grunt.registerTask('writeconfig', function(type) {
        var isdev = type === "dev"; // if not dev, it is dist
        var obj = {
            "jsfiles": isdev ? jsfiles : ['static/app.min.js'],
            "cssfiles": isdev ? cssfiles : ['static/style.min.css'],
            "static_folders": ["static"].concat(isdev ? ["src", "bower_components"] : []),
        };
        grunt.file.write("filesconfig.json", JSON.stringify(obj, undefined, "    "), {encoding: "utf8"});
    });

    grunt.registerTask('gen', ['shell:jiko', 'jshint', 'less', 'copy']);
    grunt.registerTask('dev', ['gen', 'writeconfig:dev']);
    grunt.registerTask('dist', ['gen', 'uglify', 'cssmin', 'writeconfig:dist', "clean:tmp"]);
    grunt.registerTask('watcher', ['dev', 'watch']);

    grunt.registerTask('default', ['dev']);

};