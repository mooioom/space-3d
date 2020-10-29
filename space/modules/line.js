Space.module(function(){

    Space.Line = function(s){

        this.type  = 'line';
        this.group = 'lines';

        Space.Prototype(this,s);
    
        this.v1 = s.v1 instanceof Space.Vector ? s.v1 : new Space.Vector(s.v1);
        this.v2 = s.v2 instanceof Space.Vector ? s.v2 : new Space.Vector(s.v2);
    
        this.vv1 = new Space.Vector(s.v1);
        this.vv2 = new Space.Vector(s.v2);
    
        this.color = s.color || '#fff';
        this.width = s.width || 1;

        this.vertax1 = new Space.Vertax({ v : this.v1, hide : true, parent : this, parentVector : 'v1' });
        this.vertax2 = new Space.Vertax({ v : this.v2, hide : true, parent : this, parentVector : 'v2' });
        
        this.reset = function(){
    
            this.vv1 = this.v1.clone();
            this.vv2 = this.v2.clone();
    
        }

        this.getVectors = function(){
            return [this.v1.clone(this.v1),this.v2.clone(this.v2)];
        }

        this.setVectors = function( vectors ){
            this.v1.set( vectors[0] );
            this.v2.set( vectors[1] );
        }

        this.toggleVertices = function(){

            var isVisible = this.space.isRendered(this.vertax1);

            this.space[ isVisible ? 'remove' : 'add' ](this.vertax1);
            this.space[ isVisible ? 'remove' : 'add' ](this.vertax2);

        }
    
        this.draw = function( camera ){
    
            var x = camera.center.x;
            var y = camera.center.y;
    
            var ctx = camera.ctx;
    
            var x1 = x + this.vv1.project().x;
            var y1 = y + this.vv1.project().y;
    
            var x2 = x + this.vv2.project().x;
            var y2 = y + this.vv2.project().y;
    
            if( !isFinite(x1) ) x1 = x;
            if( !isFinite(x2) ) x2 = x;

            if( !isFinite(y1) ) y1 = y;
            if( !isFinite(y2) ) y2 = y;

            ctx.lineWidth = this.width || 1;
    
            ctx.beginPath();
            ctx.moveTo(x1,y1);
            ctx.lineTo(x2,y2);
            ctx.closePath();
            ctx.strokeStyle = this.color;
            ctx.stroke();
    
        }
    
        this.rotate = function( axis, rad ){
            this.v1['rotate'+axis](rad);
            this.v2['rotate'+axis](rad);
        }
    
        this.move = function( axis, amount ){
            this.v1[axis] += amount;
            this.v2[axis] += amount;
         }
    
        this.rotateView = function( a1, a2, a3 ){
            // this.vv1.rotateMulti(a1,a2);
            // this.vv2.rotateMulti(a1,a2);
            this.vv1.rotate(a1,a2,a3);
            this.vv2.rotate(a1,a2,a3);
        }
    
        this.translateView = function( v ){
            this.vv1.translate(v);
            this.vv2.translate(v);
        }
    
        this.viewDistance = function(){
            var d1 = this.vv1.distance();
            var d2 = this.vv2.distance();
            if(this.vv1.x > 0 && this.vv2.x > 0) return false;
            return d1 < d2 ? d2 : d1;
        }
    
        this.rotateCenter = function( center, theta, phi ){
            Space.Utils.rotate( this.v1, center, theta, phi );
            Space.Utils.rotate( this.v2, center, theta, phi );
        }

        this.extrude = function( angle, amount ){

        }
    
        this.extrudeAxis = function( axis, amount ){
    
            var v3 = this.v2.clone();
            var v4 = this.v1.clone();
    
            v3[axis] = v3[axis] + amount;
            v4[axis] = v4[axis] + amount;
    
            vs = [ this.v1.clone(), this.v2.clone(), v3, v4 ];
    
            return new Space.Face({
                vs : vs
            });
    
        }
    
    }
    
})