module.exports = grunt => {

  var src = [
    "src/zepto.draggable.js",
    "src/zepto.droppable.js",
    "src/data.js",
    "src/utils.js"];

  grunt.initConfig({
    concat: {
      dist: {
        src,
        dest: 'zepto.dragdrop.js'
      }
    },

    min: {
      dist: {
        src,
        dest: 'zepto.dragdrop.min.js'
      }
    },

    jshint: {
      options: {
        asi: true,
        browser: true,
        curly: false,
        eqeqeq: false,
        expr: true,
        forin: false,
        newcap: true,
        laxcomma: true,
        strict: false,
        validthis: true
      },
      globals: {
        "Zepto": true
      }
    },

    lint: {
      files: ['src/*.js']
    }
  });

  grunt.registerTask('default', 'lint concat min');
}
