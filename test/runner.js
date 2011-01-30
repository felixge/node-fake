// Experimental, might not end up using this
var exec = require('child_process').exec;

var start = +new Date;
exec('find -E '+__dirname+' -regex ".+/test-.+\.js"', function(err, stdout) {
  if (err) {
    throw err;
  }

  var tests = stdout
    .split('\n')
    .filter(function(file) {
      return !!file;
    });

  tests.forEach(function(file) {
    var relative = file.substr(__dirname.length);
    console.log(relative);
    require(file);
  });

  var duration = +new Date - start;

  console.log('');
  console.log('Executed ' + tests.length + ' tests in '+duration+' ms');
})
