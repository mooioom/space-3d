Space.module(function(){

    Space.Face = function(s){

        this.type  = 'face';
        this.group = 'faces';

        Space.Prototype(this,s);
    
        this.vs = s.vs || [];
    
        this.color = s.color || Space.Utils.randomGrey();

        this.bitmap = null;
    
        this.reset = function(){
    
            this.vsv = this.vs.map(function(v){
                return v.clone();
            });
    
        }

        this.getVectors = function(){
            return this.vs.map(function(v){ return v.clone(v) });
        }

        this.setVectors = function(vs){
            vs.forEach(function(v,i){
                this.vs[i].set(v);
            }.bind(this))
        }
    
        this.reset();
    
        this.draw = function( camera ){
    
            var x = camera.center.x;
            var y = camera.center.y;
    
            var ctx = camera.ctx;

            if( this.image ){
                ctx.save();
                ctx.drawImage(this.image,0,0,150,180);
                ctx.restore();
                return;
            }
    
            ctx.beginPath();
            ctx.moveTo(this.vsv[0].project().x+x,this.vsv[0].project().y + y);
            this.vsv.forEach(function(v){  
                ctx.lineTo(
                    v.project().x + x,
                    v.project().y + y); 
            });
            ctx.lineTo(this.vsv[0].project().x+x,this.vsv[0].project().y + y);
            ctx.closePath();

            ctx.fillStyle = this.color || '#333';
            ctx.fill();
    
        }
    
        this.move = function( axis, amount ){
            this.vs.forEach(function(v){
                v[axis]+=amount;
            });
        }
    
        this.rotate = function( axis, rad ){
            this.vs.forEach(function(v){
                v['rotate'+axis](rad);
            });
        }
    
        this.rotateView = function( a1, a2, a3 ){
            this.vsv.forEach(function(vv){
                //vv.rotateMulti(a1,a2);
                vv.rotate(a1,a2,a3);
            });
        }
    
        this.translateView = function( v ){
            this.vsv.forEach(function(vv){
                vv.translate(v);
            });
        }
    
        this.viewDistance = function(){
            var a = Math.min.apply(this,this.vsv.map(function(v){
                if(v.x > 0) return null;
                return v.distance();
            }));
            return a;
        }
    
    }

})