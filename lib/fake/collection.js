function Collection(properties) {
  this._items = [];

  for (var property in properties) {
    this[property] = properties[property];
  }
}
module.exports = Collection;

Collection.toFn = function(args) {
  args = Array.prototype.slice.call(args);
  var filter = args.shift();

  if (typeof filter === 'function') {
    return filter;
  }

  return function(item) {
    if (!(filter in item)) {
      throw new Error('Item has no property or method named: ' + filter);
    }

    var subArgs = Array.prototype.slice.call(arguments, 1)
    subArgs = args.concat(subArgs);

    var val = item[filter];
    if (typeof val === 'function') {
      return val.apply(item, subArgs);
    }

    return val;
  };
};

Collection.prototype.__defineGetter__('length', function() {
  return this._items.length;
});

Collection.prototype.getItems = function() {
  return this._items;
};

Collection.prototype.add = function(item) {
  this._items.push(item);
};

Collection.prototype.concat = function(collection) {
  var combined = new Collection();
  combined._items = this._items.concat(collection.getItems());
  return combined;
};

Collection.prototype.remove = function(item) {
  var index = this._items.indexOf(item);
  if (index === -1) {
    return;
  }

  this._items.splice(index, 1);
  return item;
};

Collection.prototype.each = function(fn) {
  this._items.forEach(fn);
  return this;
};

Collection.prototype.has = function(item) {
  return this._items.indexOf(item) > -1;
};

Collection.prototype.filter = function(method /*, args */  ) {
  method = Collection.toFn(arguments);

  var results = new Collection();
  this.each(function(item) {
    if (method(item)) {
      results.add(item);
    }
  });

  return results;
};

Collection.prototype.not = function(method /*, args */  ) {
  method = Collection.toFn(arguments);

  var not = function(item) {
    return !method(item);
  };

  return this.filter(not);
};

Collection.prototype.first = function(method /*, args */  ) {
  if (arguments.length === 0) {
    return this._items[0];
  }

  method = Collection.toFn(arguments);
  return this.filter(method).first();
};

Collection.prototype.map = function() {
  method = Collection.toFn(arguments);

  var results = new Collection();
  this.each(function(item) {
    results.add(method(item));
  });

  return results;
};

Collection.prototype.copy = function() {
  var copy = new Collection();
  copy._items = [].concat(this._items);
  return copy;
};

Collection.prototype.sortAsc = function() {
  method = Collection.toFn(arguments);

  var results = new Collection();
  results = this.copy();
  results._items.sort(function(a, b) {
    return method(a, b);
  });

  return results;
};

Collection.prototype.sortDesc = function() {
  return this
    .sortAsc.apply(this, arguments)
    .reverse();
};

Collection.prototype.reverse = function() {
  this._items.reverse();
  return this;
};
