(function(root, factory) {

  if (typeof define === 'function' && define.amd) {
    define(['exports'], function(exports) {
      root.Lockr = factory(root, exports);
    });
  } else {
    root.Lockr = factory(root, {});
  }

}(this, function(root, Lockr) {
  'use strict';

  root.Lockr = Lockr;

  Lockr.salt = "";

  Lockr.set = function (key, value) {
    var salted_key = this.salt + key;

    try {
      localStorage.setItem(salted_key, JSON.stringify({"data": value}));
    } catch (e) {
      if (console) console.warn("Lockr didn't successfully save the '{"+ key +": "+ value +"}' pair, because the localStorage is full.");
    }
  };

  Lockr.get = function (key, missing) {
    var salted_key = this.salt + key,
        value;

    try {
      value = JSON.parse(localStorage.getItem(salted_key));
    } catch (e) {
      value = null;
    }
    if(value === null)
      return missing;
    else
      return (value.data || missing);
  };

  Lockr.sadd = function(key, value) {
    var salted_key = this.salt + key, json;

    var values = Lockr.smembers(key);

    if (values.indexOf(value) > -1) {
      return null;
    }

    try {
      values.push(value);
      json = JSON.stringify({"data": values});
      localStorage.setItem(salted_key, json);
    } catch (e) {
      if (console) console.warn("Lockr didn't successfully add the "+ value +" to "+ key +" set, because the localStorage is full.");
    }
  };

  Lockr.smembers = function(key) {
    var salted_key = this.salt + key, value;

    try {
      value = JSON.parse(localStorage.getItem(salted_key));
    } catch (e) {
      value = null;
    }

    if (value === null)
      return [];
    else
      return (value.data || []);
  };

  Lockr.sismember = function(key, value) {
    return Lockr.smembers(key).indexOf(value) > -1;
  };

  Lockr.getAll = function () {
    var keys = Object.keys(localStorage);

    return keys.map(function (key) {
      return Lockr.get(key);
    });
  };

  Lockr.rm =  function (key) {
    localStorage.removeItem(key);
  };

  Lockr.flush = function () {
    localStorage.clear();
  };
  return Lockr;

}));
