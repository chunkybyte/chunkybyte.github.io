"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
var DataService = function () {
    return {
        set: function set(key, value) {
            localStorage.setItem(key, JSON.stringify(value));
        },
        get: function get(key) {
            return JSON.parse(localStorage.getItem(key));
        },
        hasProperty: function hasProperty(propertyName) {
            return localStorage.hasOwnProperty(propertyName);
        }
    };
}();

exports.default = DataService;