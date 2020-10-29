Space.module(function(){

    Space.Vertax = function(s){

        this.group = 'vertices';
        this.type  = 'vertax';

        s = s || {};
    
        Space.Prototype(this,s);        
    
        this.v = new Space.Vector(s);

        if(s.v) this.v = s.v;
    
        this.vv = this.v.clone();
        
        this.color = s.color || '#fff';
        this.size  = s.size  || 3;

        this.center = this.v;
    
        this.reset = function(){
    
            this.vv = this.v.clone();
    
        }
    
        this.draw = function( camera ){
    
            var x = camera.center.x;
            var y = camera.center.y;
    
            var ctx = camera.ctx;
    
            ctx.beginPath();
            ctx.arc(
                x + this.vv.project().x,
                y + this.vv.project().y, 
                this.size, 0, 2 * Math.PI
            );
            ctx.closePath();
            ctx.strokeStyle = this.color;
            ctx.fillStyle = this.color;
            ctx.fill();
    
        }
    
        this.rotate = function( axis, rad ){
            this.v['rotate'+axis](rad);
        }
    
        this.move = function( axis, amount ){
            this.v[axis] += amount;
        }

        this.getVectors = function(){
            return [this.v.clone(this.v)];
        }

        this.setVectors = function( vectors ){
            this.v.set( vectors[0] );
        }
    
        this.rotateCenter = function( center, theta, phi ){
            Space.Utils.rotate( this.v, center, theta, phi );
        }
    
        this.rotateView = function( a1, a2, a3 ){
            // this.vv.rotateMulti(a1,a2);
            this.vv.rotate(a1,a2,a3);
        }
    
        this.translateView = function( v ){
            this.vv.translate(v);
        }
    
        this.viewDistance = function(){
            if(this.vv.x > 0) return false;
            return this.vv.distance();
        }
    
    }
    
})