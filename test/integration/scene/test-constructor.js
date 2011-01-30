var common = require('../../common');
var assert = common.assert;
var fake = common.fake;

var scene = fake.scene();

var MyClass = scene.class();
(function testNewMyClass() {
  scene.expectNext('new', MyClass)

  // Should not verify initially
  assert.throws(function() {
    scene.verify();
  });

  var myClass = new MyClass();
  scene.verify();
})();

(function testNewMyClass() {
  scene.expectNext('new', MyClass)

  // Invoking the function without new should fail
  assert.throws(function() {
    MyClass();
  });

  // We don't want to satisfy this expecation, so let's reset out scene
  scene.reset();
})();
