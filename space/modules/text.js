Space.module(function(){

    Space.Text = function(s){

        this.type  = 'text';
        this.group = 'texts';

        Space.Prototype(this,s);
    
        this.text  = s.text;
        this.color = s.color;
        this.size  = s.size || 22;

        this.dynamicSize = false;
    
        this.v = new Space.Vector(s); 

        if(s.v) this.v = s.v;
    
        this.vv = this.v.clone();
        
        this.reset = function(){
            this.vv = this.v.clone();
        }

        this.getVectors = function(){
            return [this.v.clone(this.v)];
        }

        this.setVectors = function( vectors ){
            this.v.set( vectors[0] );
        }
    
        this.draw = function( camera ){
    
            var x = camera.center.x;
            var y = camera.center.y;
    
            var ctx = camera.ctx;

            if(this.dynamicSize){
                var d = Space.Utils.vDistance(this.v,camera.position);
                var dynamicSize = (1/d) * this.size * 3000;
                console.log(dynamicSize);
            }
    
            ctx.font         = (dynamicSize || this.size) + "px Arial";
            ctx.fillStyle    = this.color;
            ctx.textBaseline = 'middle';
            ctx.textAlign    = 'center';
    
            ctx.fillText( 
                this.text,
                x + this.vv.project().x,
                y + this.vv.project().y
            );
    
        }
    
        this.rotate = function( axis, rad ){
            this.v['rotate'+axis](rad);
        }
    
        this.move = function( axis, amount ){
            this.v[axis] += amount;
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