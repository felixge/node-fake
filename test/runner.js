// Experimental, might not end up using this
var exec = require('child_process').exec;

exec('find -E '+__dirname+' -regex ".+/test-.+\.js"', function(err, stdout) {
  if (err) {
    throw err;
  }

  stdout
    .split('\n')
    .forEach(function(file) {
      if (!file) {
        return;
      }

      var relative = file.substr(__dirname.length);
      console.log(relative);
      require(file);
    });
})
