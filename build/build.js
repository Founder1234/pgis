var deps = require('./deps.js').deps;

exports.getFiles = function() {
    var memo = {};

    function addFiles(srcs) {
        for (var j = 0, len = srcs.length; j < len; j++) {
            memo[srcs[j]] = true;
        }
    }

    for (var i in deps) {
        addFiles(deps[i].src);
    }

    var files = [];

    for (var src in memo) {
        if (src.match(/^LIB:/)) {
            files.push('lib/' + src.replace(/LIB:/, ''));
        } else {
            files.push('src/js/' + src);
        }
    }

    return files;
}
