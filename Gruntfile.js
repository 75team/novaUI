module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            options: {
                seperator: ';',
                stripBanners: true
            },
            tab: {
                files: {
                    'build/tab/nova.tab.js': [
                        'src/core/class.js',
                        'src/core/widget.js',
                        'src/widgets/switchable/switchable.js',
                        'src/widgets/tab/nova.tab.js',
                        'src/widgets/tab/autoplay.js'
                    ],
                    'build/tab/nova.tab.css': ['src/widgets/tab/nova.tab.css'],
                    'build/tab/demo/index.html': ['src/widgets/tab/demo/index.html'],
                    'build/tab/README.md': ['src/widgets/tab/README.md']
                }
            },
            slide: {
                files: {
                    'build/slide/nova.slide.js' : [
                        'src/widgets/switchable/switchable.js',
                        'src/widgets/slide/slide.js',
                        'src/widgets/slide/$autoplay.js'
                    ]
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.registerTask('default', ['concat']);
}
