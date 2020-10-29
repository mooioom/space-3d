Space.module(function(){

    Space.Camera = function(s){

        this.type  = 'camera';
        this.group = 'cameras';

        s = s || {};
    
        this.space = s.space || $space;

        this.data = s.data || {};

        this.onframedebug = s.onframedebug || null;
    
        this.canvas = s.canvas || $space.canvas;
        this.ctx = this.canvas.getContext('2d');
    
        this.position = new Space.Vector(s.position || { x : 100 } );
        this.target   = new Space.Vector(s.target);
    
        this.name = s.name || 'Camera' + this.space.cameras.length;
    
        this.ratio = this.canvas.width / this.canvas.height;
    
        this.space.cameras.push(this);

        this.setCenter = function(){
            this.center = new Space.Vector({ x : this.canvas.width / 2, y : this.canvas.height / 2 }); // physical center
            this.cornerAngle = new Space.Vector().angle2D(this.center.multiply(2));
        }

        this.setCenter();
    
        this.positionAngle = function(){
    
            return new Space.Vector({
                x : this.position.x - this.target.x,
                y : this.position.y - this.target.y,
                z : this.position.z - this.target.z
            });
    
        }

        this.positionDistance = function(v){
            return Space.Utils.vDistance(this.position,v||this.target);
        }

        this.viewAngles = function(){
            return this.positionAngle().angles();
        }
    
        this.debug = s.debug || this.onframedebug;
    
        this.MS_START = null;
        this.MS_END   = null;
        this.FPS      = null;
    
        this.fly = function( settings ){
    
            // TODO : 2d to 3d vector
    
            this.canvas.onmousemove = function(e){
    
                var x = e.offsetX;
                var y = e.offsetY;
    
                this.target.z = -y + this.center.y;
                this.target.y = x - this.center.x;
    
                this.render();
    
            }.bind(this)
    
        }

        this.gravityToggle = false;

        this.gravityInterval = null;
        this.gravitySpeed = 0;

        this.gravity = function(){

            if( this.gravityInterval ) return clearInterval(this.gravityInterval);

            this.gravityInterval = setInterval(function(){

                if( this.position.z <= 10 ){
                    this.position.z = 10;
                    this.gravitySpeed = 0;
                    this.render();
                    return;
                }

                this.gravitySpeed += 0.05*this.gravitySpeed||0.01;
                this.position.z -= this.gravitySpeed;

                this.render();

            }.bind(this),10);

        }

        this.firstPerson = function(){

        }

        this.look = function(){

            this.canvas.onmousemove = function(e){
    
                var x = e.offsetX;
                var y = e.offsetY;

                var v = this.vectorFromPoint(x,y);
    
                this.target.set(v);
    
                this.render();
    
            }.bind(this)

        }.bind(this)

        this.fly = function(){

        }

        this.moveTop = function(){

        }

        this.moveBottom = function(){

        }

        this.moveForward = function(){
            this.position.moveTo(this.target,0,true);
        }

        this.moveBackwords = function(){
            this.position.moveFrom(this.target,0,true);
        }

        this.moveLeft = function(){

        }

        this.moveRight = function(){

        }

        this.onwalk = null;

        this.walkHandler = function(e){

            //console.log(e);

            if(e.key == 'ArrowUp')    this.moveForward();
            else if(e.key == 'ArrowDown')  this.moveBackwords();
            else if(e.key == 'ArrowLeft')  this.moveLeft();
            else if(e.key == 'ArrowRight') this.moveRight();
            else return;

            if(this.onwalk) this.onwalk();

        }.bind(this);

        this.walk = function(){

            document.addEventListener('keydown',this.walkHandler);

        }

        this.getVectors = function(){
            return [this.position.clone(this.position),this.target.clone(this.target)];
        }

        this.setVectors = function( vectors ){
            this.position.set( vectors[0] );
            this.target.set( vectors[1] );
        }

        this.vectorFromPoint = function( sx, sy, length, distanceVector ){

            var d = Space.DFP; // distance of plane from camera

            var p = d / (d / 2);

            var distance = this.positionDistance(distanceVector);
            var angles   = this.viewAngles();

            //console.log(angles);
            //distance = 3500;
    
            var x = (-sy + this.center.y) / (d / Math.sqrt(distance) / p) ;
            var y = ( sx - this.center.x) / (d / Math.sqrt(distance) / p) ;

            var trackerLength = length || 0;

            var v = new Space.Vector(-x,y,-trackerLength);

            //console.log(angles.phi,angles.theta);

            v.rotateMulti( angles.phi, angles.theta ); // z,y

            //console.log(d,p,distance,angles)

            return v;

        }
    
        this.timer = function(){
    
            if(this.MS_START){
                this.MS_END = new Date().getTime();
                this.FPS = ( 1000 / ( this.MS_END - this.MS_START ));
                var fps = (isFinite(this.FPS) ? this.FPS : '1000');
                if(this.onframedebug) this.onframedebug(fps);
                else{
                    console.log(this.name + ' :: render '+ (isFinite(this.FPS) ? this.FPS : '1000') + ' FPS' );
                }
                this.MS_START = null;
                return;
            }
    
            this.MS_START = new Date().getTime(); 
    
        }
    
        this.render = function(){
    
            if(this.debug) this.timer();
    
            this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
    
            var angles = this.viewAngles();

            //console.log(this.name,angles);
    
            var renderTree = [];
    
            this.space.elements.forEach(function(e){

                if(e.hidden) return;
    
                e.reset();
                
                e.translateView( this.position );
                e.rotateView( 0, 1.5707963267948966 - angles.theta, -angles.phi ); // x,y,z - do not touch

                var d = e.viewDistance();
                
                if(d) renderTree.push({
                    e : e,
                    d : d
                });
    
            }.bind(this));
    
            renderTree.sort(function(a,b){
                return a.d < b.d ? 1 : -1;
            });
    
            // draw all elements
    
            renderTree.forEach(function(r){
    
                r.e.draw(this);
    
            }.bind(this));
    
            if(this.debug) this.timer();
    
        }
    
    }

})