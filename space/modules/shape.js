Space.module(function(){

    Space.Shape = function(s){

        this.type  = 'shape';
        this.group = 'shapes';

        Space.Prototype(this,s);
    
        this.origin = {
            x : this.s.x || 0,
            y : this.s.y || 0,
            z : this.s.z || 0
        };
    
        this.vectors = [];
        this.lines   = [];
        this.faces   = [];
    
        this.vectors.push( new Space.Vector( this.origin ) );

        this.onremove = function(){
            var l = this.lines.length;
            while(l--) this.lines[l].remove();
        }
    
        this.lineTo = function(x,y,z){

            var v2 = {x:x,y:y,z:z};

            if( typeof x == 'object' ){
                var o = x;
                x = o.x;
                y = o.y;
                z = o.z;
                v2 = o;
            }

            var v1 = this.vectors[ this.vectors.length - 1 ];
            var v2 = new Space.Vector(v2);

            this.vectors.push(v2);
    
            var line = new Space.Line({
                s : this.space,
                v1 : v1,
                v2 : v2,
                parent : this,
                onremove : function(l){
                    this.lines.splice( this.lines.indexOf(l), 1 );
                }.bind(this)
            });
    
            this.lines.push(line);
    
            return line;
    
        }
        
        this.rotate = function( axis, rad ){
            this.lines.forEach(function(l){ l.rotate(axis,rad); });
            this.faces.forEach(function(f){ f.rotate(axis,rad); });
        }
    
        this.move = function( axis, amount ){
            this.lines.forEach(function(l){ l.move(axis,amount); });
            this.faces.forEach(function(f){ f.move(axis,amount); });
        }

        this.extrude = function( angle, amount ){

        }

        this.getVectors = function(){
            return this.vectors.map(function(v){ return v.clone() });
        }

        this.setVectors = function(vs){
            vs.forEach(function(v,i){
                this.vectors[i].set(v);
            }.bind(this))
        }
    
        this.extrudeAxis = function( axis, amount, cap ){
            this.faces = this.lines.map(function(l){
                return l.extrudeAxis(axis,amount);
            });
            if(cap){
                this.faces.push( new Space.Face({vs:this.getVectors()}) );
                var vs = this.getVectors().map(function(v){
                    var g = v.clone();
                    g[axis]+=amount; return g;
                });
                this.faces.push( new Space.Face({vs:vs}) );
            }
            return this.faces;
        }
    
    }
    
    
})