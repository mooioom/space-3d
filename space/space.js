var Space = function( settings ){

    var DEFAULTS = {

    }

    var settings = settings || {};

    var modules = [
        'prototype','camera','light','vector','vertax','line','face','text','shape','group','utils'
    ];

    var $s = this;

    window.$space = this;

    this.canvas = settings.canvas || document.createElement('canvas');
    this.ctx    = this.canvas.getContext('2d');

    this.activeCamera = null;

    this.elements = []; // renders

    this.cameras  = [];
    this.lights   = [];

    this.vectors  = [];
    this.vertices = [];
    this.lines    = [];
    this.faces    = [];
    
    this.texts    = [];
    this.shapes   = [];

    this.groups = [];

    this.elementsByName = function( name ){
        return this.elements.filter(function(e){
            return e.name == name;
        });
    }

    // add element to the rendered elements process
    this.add = function( element ){
        this.elements.push(element);
    }

    // remove element from the rendered elements process
    this.remove = function( element ){
        this.elements.splice( this.elements.indexOf(element), 1 );
    }

    // check if an element is in the rendered elements process
    this.isRendered = function( element ){
        return this.elements.indexOf(element) != -1;
    }

    this.export = function(){
        var data = {};
        return data;
    }

    this.import = function( data ){

    }

    this.reset = function(){

        this.activeCamera = null;

        this.elements = []; // renders

        this.cameras  = [];
        this.lights   = [];

        this.vectors  = [];
        this.vertices = [];
        this.lines    = [];
        this.faces    = [];
        
        this.texts    = [];
        this.shapes   = [];

        this.groups = [];

    }

    this.require = function( modules, onload ){

        Space.q = modules.length;

        while( modules.length ){
            var script = document.createElement('script');
            script.src = modules[ modules.length - 1 ];
            document.head.appendChild(script);
            modules.pop();
        }

        var v = setInterval(function(){
            if(!Space.q){ clearInterval(v); onload(); }
        },1);

    }.bind(this);

    this.require(modules.map(function(m){return 'space/modules/'+m+'.js'}),function(){
        if(settings.onload) settings.onload();
    }.bind(this));

}

/** @param {function} fn */
Space.module = function(fn){
    fn(); Space.q--;
}