Space.module(function(){

    Space.Group = function( s ){

        this.type  = 'group';
        this.group = 'groups';

        var s = s || {};

        this.name = s.name || '';

        this.data = s.data || {};
    
        this.space = s.space || $space;
        this.space.groups.push(this);
    
        this.elements = [];
    
        this.each = function( fn ){ this.elements.forEach(fn); };
    
        this.rotate = function(axis,rad){
            this.each(function(e){
               
            })
        }

        this.append = function(e){
            e.parent = this;
            this.elements.push(e);
        }

        if( s.elements ) s.elements.forEach(function(e){
            e.parent = this;
            this.elements.push(e);
        }.bind(this));

        this.getVectors = function(){
            var vectors = [];
            this.elements.forEach(function(l){
                vectors = vectors.concat(l.getVectors());
            });
            return vectors;
        }

        this.setVectors = function(vs){
            vs.forEach(function(v){
                //debugger;
                v.parent.set(v);
            });
        }
        
    }
    
})