Space.module(function(){

    Space.Prototype = function( e, s ){

        var s = s || {};

        for(var x in s) e[x] = s[x];
    
        e.s = s;
    
        e.name = s.name || null;
    
        e.space = s.space || $space;

        e.data = s.data || {};
    
        if(!s.hide) e.space.elements.push(e);
        e.space[ e.group ].push(e);

        e.parent = s.parent || null;

        e.onremove = s.onremove || null;

        e.remove = function(){
            e.space.elements.splice( e.space.elements.indexOf(e), 1 );
            e.space[e.group].splice( e.space[e.group].indexOf(e), 1 );
            if(e.onremove) e.onremove(e);
        };
    
        e.rotate = function(){};
        e.reset  = function(){};
        e.draw   = function(){};
    
        e.rotateView    = function(){};
        e.translateView = function(){};
        e.viewDistance  = function(){}
    
    }
    
})