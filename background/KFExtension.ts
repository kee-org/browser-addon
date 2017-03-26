"use strict";

// constructor
function KFE ()
{
    //TODO:c: replace with structured object on this addon's global scope, probably in appState.
    this.storage = {
        _storage: {},
        has: function ss_has (aName) {
            return this._storage.hasOwnProperty(aName);
        },

        set: function ss_set (aName, aValue) {
            this._storage[aName] = aValue;
        },

        get: function ss_get (aName, aDefaultValue) {
            return this.has(aName) ? this._storage[aName] : aDefaultValue;
        }
    };

}

let KFExtension = new KFE();
