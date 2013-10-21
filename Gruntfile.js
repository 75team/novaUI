module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            options: {
                seperator: ';',
                stripBanners: true
            },
            base: {
                files: {
                    'build/nova.js' : ['src/core/class.js', 'src/core/widget.js']
                }
            },
            tab: {
                files: {
                    'build/tab/tab.js': [
                        'src/widgets/switchable/switchable.js',
                        'src/utils/prefix.js',
                        'src/widgets/tab/tab.js',
                        'src/widgets/tab/$swipe.js'
                    ],
                    'build/tab/tab.css': ['src/widgets/tab/tab.css'],
                    'build/tab/README.md': ['src/widgets/tab/README.md']
                }
            },
            slide: {
                files: {
                    'build/slide/slide.js' : [
                        'src/widgets/switchable/switchable.js',
                        'src/widgets/slide/slide.js',
                        'src/widgets/slide/$autoplay.js'
                    ],
                    'build/slide/slide.css' : ['src/widgets/slide/slide.css'],
                    'build/slide/README.md' : ['src/widgets/slide/README.md']
                }
            },
            suggest: {
                files: {
                    'build/suggest/suggest.js' : [
                        'src/utils/template.js',
                        'src/widgets/suggest/suggest.js'
                    ],
                    'build/suggest/suggest.css' : ['src/widgets/suggest/suggest.css'],
                    'build/suggest/README.md' : ['src/widgets/suggest/README.md']
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.registerTask('default', ['concat']);

}
