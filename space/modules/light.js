Space.module(function(){

    Space.Light = function( s ){

        this.type  = 'light';
        this.group = 'lights';

        var s = s || {};

        this.position = new Space.Vector(s.position);
        if(s.position && s.position instanceof Space.Vector ) this.position = s.position;

        if(s.target){
            this.target = new Space.Vector(s.target);
            if(s.target && s.target instanceof Space.Vector ) this.target = s.target;
        }

        this.intensity = 1;

        this.name = s.name || '';

        this.data = s.data || {};
    
        this.space = s.space || $space;
        
    }
    
})