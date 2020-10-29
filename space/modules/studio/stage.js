Space.module(function(){

    Space.Studio.Stage = function( s ){

        window.$stage = this;

        var $stage = this;

        this.$element = s.element;

        this.modules = {};

        this.initialView = 'quad';

        this.view = null;

        this.snapSize  = 10;
        this.gridSize  = 200;
        this.guideSize = 50;

        var INIT_CAMERA_DISTANCE = 700;   // initial camera distance from center

        this.lastFrameFPS = 0;

        this.templates = {

            cameras : [
                {
                    name     : 'top',
                    title    : 'Top',
                    position : { x : 0, y : 0, z : INIT_CAMERA_DISTANCE },
                    target   : { x : 0, y : 0, z : 0 }
                },
                {
                    name     : 'bottom',
                    title    : 'Bottom',
                    position : { x : 0, y : 0, z : -INIT_CAMERA_DISTANCE },
                    target   : { x : 0, y : 0, z : 0 }
                },
                {
                    name     : 'left',
                    title    : 'Left',
                    position : { x : 0, y : INIT_CAMERA_DISTANCE, z : 0 },
                    target   : { x : 0, y : 0, z : 0 }
                },
                {
                    name     : 'right',
                    title    : 'Right',
                    position : { x : 0, y : -INIT_CAMERA_DISTANCE, z : 0 },
                    target   : { x : 0, y : 0, z : 0 }
                },
                {
                    name     : 'front',
                    title    : 'Front',
                    position : { x : INIT_CAMERA_DISTANCE, y : 0, z : 0 },
                    target   : { x : 0, y : 0, z : 0 }
                },
                {
                    name     : 'back',
                    title    : 'Back',
                    position : { x : -INIT_CAMERA_DISTANCE, y : 0, z : 0 },
                    target   : { x : 0, y : 0, z : 0 }
                },
                {
                    name     : 'perspective',
                    title    : 'Perspective',
                    position : { x : INIT_CAMERA_DISTANCE, y : INIT_CAMERA_DISTANCE, z : INIT_CAMERA_DISTANCE },
                    target   : { x : 0, y : 0, z : 0 }
                }
            ],

            layouts : [
                {
                    name  : 'quad',
                    title : 'Quadruple',
                    views : [[50,50,'top'],[50,50,'left'],[50,50,'front'],[50,50,'perspective']]
                },
                {
                    name  : 'tritop',
                    title : 'Triple - Top',
                    views : [[100,50,'perspective'],[50,50,'top'],[50,50,'front']]
                },
                {
                    name  : 'tribottom',
                    title : 'Triple - Bottom',
                    views : [[50,50,'perspective'],[50,50,'top'],[100,50,'front']]
                },
                {
                    name  : 'duovertical',
                    title : 'Dual - Horizontal',
                    views : [[100,50,'perspective'],[100,50,'front']]
                },
                {
                    name  : 'duohorizontal',
                    title : 'Dual - Vertical',
                    views : [[50,100,'perspective'],[50,100,'front']]
                },
                {
                    name  : 'single',
                    title : 'Single',
                    views : [[100,100,'perspective']]
                }
            ]

        }

        this.getCameraTemplate = function( name ){
            return this.templates.cameras.filter(function(c){
                return c.name == name;
            })[0]
        }.bind(this);

        this.onwheel = function(e){

            var delta;

            if (event.wheelDelta) delta = event.wheelDelta;
            else delta = -1 * event.deltaY;

            this.camera.position[ 'move' + (delta > 0 ? 'To':'From') ]( this.camera.target, null, true );

            return $studio.refresh();

        }

        var View = function(se){

            this.$element = $stage.$element.inline( se[0]+'%',se[1]+'%');
            this.$element.classList.add('view');

            this.$canvas = document.createElement('canvas');

            this.$canvas.width  = this.$element.clientWidth;
            this.$canvas.height = this.$element.clientHeight;

            this.$element.appendChild(this.$canvas);

            this.guide = null;

            this.$label = DOM('.label',{
                '/.title' : { name : 'title', innerHTML : '' },
                '/.menu' : {
                    name : 'menu'
                }
            });

            this.$element.appendChild(this.$label);

            this.reset = function(){
                this.setCamera();
            }.bind(this);

            this.toggleGravity = function(){
                this.camera.gravity();
            }.bind(this);

            this.toggleFirstPerson = function(){
                this.camera.toggleFirstPerson();
            }.bind(this);

            this.toggleLook = function(){
                this.camera.look();
            }.bind(this);

            this.toggleWalk = function(){
                this.camera.onwalk = function(){
                    $stage.refresh();
                }.bind(this);
                this.camera.walk();
            }.bind(this);

            this.toggleFly = function(){
                this.camera.fly();
            }.bind(this);

            this.toggleGuide = function(){

                if(this.guide) {
                    for(var x in this.guide) this.guide[x].remove();
                    this.guide = null;
                    $stage.refresh();
                    return;
                }

                this.guide = {
                    line         : new Space.Line({ v1 : this.camera.position, v2 : this.camera.target, data : { guide : true } }),
                    position     : new Space.Vertax({ v : this.camera.position, color : 'green', name : this.name + ' Position', data : { guide : true } }),
                    positionText : new Space.Text({ v : this.camera.position, text : this.name + ' Position', size : 10, color : 'green', data : { guide : true } }),
                    target       : new Space.Vertax({ v : this.camera.target, color : 'green', name : this.name + ' Target', data : { guide : true } }),
                    targetText   : new Space.Text({ v : this.camera.target, text : this.name + ' Target', size : 10, color : 'green', data : { guide : true } }),
                };

                $stage.refresh();

            }.bind(this);

            this.setCamera = function(name){

                if(this.camera) this.unload();

                if( name instanceof Space.Camera ){

                    this.camera = name;

                    this.title    = this.camera.name;
                    this.position = this.camera.position;
                    this.target   = this.camera.target;

                    this.camera.canvas = this.$canvas;
                    this.camera.ctx    = this.$canvas.getContext('2d');

                    this.camera.setCenter();

                    this.$label.$title.innerHTML = this.title;

                    this.camera.render();

                    return;

                }else{

                    this.cs = $stage.getCameraTemplate(name || this.cs.name || 'perspective');

                    this.name     = this.cs.name;
                    this.title    = this.cs.title;
                    this.position = this.cs.position;
                    this.target   = this.cs.target;

                }

                this.$label.$title.innerHTML = this.title;

                this.camera = new Space.Camera({
                    position : this.position,
                    target   : this.target,
                    name     : this.name,
                    canvas   : this.$canvas,
                    onframedebug : function( fps ){
                        this.lastFrameFPS = fps;
                        if(typeof $debugger != 'undefined') $debugger.fps.$element.innerHTML = fps;
                    }.bind(this)
                });

                this.camera.render();

            }

            var items = [
                {
                    title : 'Select Camera...',
                    items : $stage.templates.cameras.map(function(c){
                        return {
                            title : c.title,
                            onclick : this.setCamera.bind(this,c.name)
                        }
                    }.bind(this))
                },
                {
                    title   : 'Camera Guide',
                    toggle  : true,
                    onclick : this.toggleGuide
                },
                {
                    title   : '1st Person',
                    toggle  : true,
                    onclick : this.toggleFirstPerson
                },
                {
                    title   : 'Camera Gravity',
                    toggle  : true,
                    onclick : this.toggleGravity
                },
                {
                    title   : 'Look',
                    toggle  : true,
                    onclick : this.toggleLook
                },
                {
                    title   : 'Walk',
                    toggle  : true,
                    onclick : this.toggleWalk
                },
                {
                    title   : 'Camera Details',
                    onclick : function(){
                        $studio.objects.unselectAll();
                        $studio.objects.select(this.camera);
                        $studio.refresh();
                    }.bind(this)
                },
                {
                    title : 'Reset Camera',
                    onclick : this.reset
                }
            ]

            this.setCamera( se[2] || 'perspective' );

            this.menu = new Menu({
                $element : this.$label.$menu,
                items : items
            });

            this.drag = null;

            this.render = function(){
                this.camera.render();
            }

            this.unload = function(){
                if(!this.camera) return;
                $space.cameras.splice( $space.cameras.indexOf(this.camera), 1 );
            }

            this.set = function( name ){
                this.unload();
            }

        }

        var Layout = function(se){

            this.name  = se.name;
            this.title = se.title;
            this.views = se.views;
 
            this.render = function(){

                $stage.$element.clear();

                for(var x in this.views)
                {

                    this.views[x] = new View(this.views[x]);

                }

            }

            this.refresh = function(){

                this.views.forEach(function(view){
                    view.render();
                });

            }

            this.unload = function(){

                this.views.forEach(function(view){
                    view.unload();
                });

            }

        }

        this.render = function(){

            this.guides = {

                center : Space.Utils.centerGuide( this.guideSize, null, {guide:true} ),
                grid   : Space.Utils.grid( this.snapSize, this.gridSize, null, {guide:true} )
    
            }

            this.layout = new Layout( JSON.parse(JSON.stringify(this.templates.layouts[0]) ) );

            this.layout.render();

            // bind events by selected tool
            this.interactions();

        }

        this.refresh = function(){

            this.layout.refresh();

        }

        $studio.on('toolchange',function( tool ){

            console.log('stage:toolchange',tool);

            var interactions = Space.Studio.Stage.Interactions[tool];
            if( interactions && interactions.keyboard ){
                $studio.keyboard.registerKeys( interactions.keyboard );
            }

        }.bind(this));

        this.setLayout = function( name ){

            var template = this.templates.layouts.filter(function(t){
                return t.name == name;
            })[0];

            if(this.layout) this.layout.unload();

            this.layout = new Layout( template );

            this.render();
            this.refresh();

            // clean up previous cameras from space

        }

        this.snap = function( v ){

            if( $studio.keyboard.shift ) return v;

            v.x = Math.round(v.x / this.snapSize) * this.snapSize;
            v.y = Math.round(v.y / this.snapSize) * this.snapSize;
            v.z = Math.round(v.z / this.snapSize) * this.snapSize;

            return v;

        }

        this.modules.setup = new $studio.ui.Module({

            title : 'Stage',

            render : function(e){

                e.innerHTML = '';

                var $select = document.createElement('select');

                for(var x in this.templates.layouts){
                    var t = this.templates.layouts[x];
                    var $option = document.createElement('option');
                    $option.value = t.name;
                    $option.innerHTML = t.title;
                    $select.appendChild($option);
                }

                $select.onchange = function(ev){
                    this.setLayout( ev.target.selectedOptions[0].value );
                }.bind(this);

                e.appendChild($select);

                return e;

            }.bind(this)
        });

        this.interactions = function(){

            var $i = Space.Studio.Stage.Interactions;

            this.layout.views.forEach(function( view ){

                view.$canvas.addEventListener('wheel',$stage.onwheel.bind(view));

                view.$canvas.addEventListener('mousedown',function(e){

                    // e.button = 1 (wheeldown) 0 (left) 2 (right)

                    e.$view = this;

                    var pointerVector = this.camera.vectorFromPoint( e.offsetX, e.offsetY, 0, {x:0,y:0,z:0} );
                    e.vector = $stage.snap(pointerVector);

                    this.drag = {
                        sx : e.offsetX, // start
                        sy : e.offsetY,
                        px : e.offsetX, // previous
                        py : e.offsetY,
                        sv : e.vector.clone(), // start vector
                        pv : e.vector.clone(), // prev vector
                        position : this.camera.position.clone()
                    };

                    if( $i[ $studio.tool ] && $i[ $studio.tool ].mousedown ) $i[ $studio.tool ].mousedown.call(this,e);

                    //$studio.refresh();

                }.bind(view));

                view.$canvas.addEventListener('mousemove',function(e){

                    e.$view = this;

                    $stage.pointerView = this;

                    var r = null;

                    if( view.drag ) view.drag.moved = true;

                    var pointerVector = view.camera.vectorFromPoint( e.offsetX, e.offsetY, 0, {x:0,y:0,z:0} );
                    e.vector = $stage.snap(pointerVector);

                    if( $i[ $studio.tool ] && $i[ $studio.tool ].mousemove ) {
                        r = $i[ $studio.tool ].mousemove.call(this,e);
                    }

                    if( view.drag ){
                        view.drag.px = e.offsetX;
                        view.drag.py = e.offsetY;
                    }

                    if( r ) return $studio.refresh();

                    if(!view.drag) return;

                    var g = view.drag.position.clone();

                    var zr = (view.drag.sx - e.offsetX) / 100;
                    var yr = (view.drag.sy - e.offsetY) / 100;

                    g.rotateMulti(zr,yr);

                    view.camera.position.set(g);

                    $studio.refresh();

                }.bind(view));

                view.$canvas.addEventListener('mouseup',function(e){

                    e.$view = this;

                    var pointerVector = view.camera.vectorFromPoint( e.offsetX, e.offsetY, 0, {x:0,y:0,z:0} );
                    e.vector = $stage.snap(pointerVector);

                    if( $i[ $studio.tool ] && $i[ $studio.tool ].mouseup ) $i[ $studio.tool ].mouseup.call(this,e);

                    view.drag = null;

                    $studio.refresh();

                }.bind(view));

            }.bind(this));

        }

        this.render();
        this.refresh();

    }

    // actions and events for each tool selection

    // this = view
    // e.vector = pointer vector

    Space.Studio.Stage.Interactions = {

        tool : {
            mousedown : function(e){},
            mousemove : function(e){},
            mouseup : function(e){}
        },

        select : {
            mousedown : function(e){
                
            },
            mousemove : function(e){
                
            },
            mouseup : function(e){

            }
        },

        rotate : {
            mousedown : function(e){

            },
            mousemove : function(e){

                var view = e.$view;

                if(!view.drag) return;

                var amount = (view.drag.py - e.offsetY) / 100;

                var clones = [];

                $studio.selecteds.forEach(function(s){

                    var vectors = s.getVectors();

                    vectors.forEach(function(v){

                        if( clones.indexOf(v) != -1 ) {
                            return;
                        }
                        else clones.push(v);

                        var args = [
                            $inspector.options.x ? amount : 0,
                            $inspector.options.y ? amount : 0,
                            $inspector.options.z ? amount : 0
                        ]

                        v.rotate.apply(v,args);

                    });

                    s.setVectors(vectors);

                });

                return true;
            },
            mouseup : function(e){

            }
        },

        move : {
            mousedown : function(e){
                $stage.$vector = e.vector.clone();
                $studio.selecteds.forEach(function(el){
                    el.$vectors = el.getVectors();
                });
            },
            mousemove : function(e){
                if(!$stage.$vector) return;
                var diff = $stage.$vector.subtract(e.vector).negative();
                $studio.selecteds.forEach(function(el){
                    var vectors = [];
                    el.$vectors.forEach(function(v){
                        var n = v.add( diff );
                        n.parent = v.parent;
                        vectors.push( n ); 
                    });
                    el.setVectors(vectors);
                });
                return true;
            },
            mouseup : function(e){
                delete $stage.$vector;
                $studio.selecteds.forEach(function(el){
                    delete el.$vectors;
                });
            }
        },

        vertax : {
            mousedown : function(){
                return true;
            },
            mousemove : function(){
                return true;
            },
            mouseup : function(e){
                if( this.drag.moved ) return true;
                $studio.select(new Space.Vertax(e.vector));
            }
        },

        text : {
            mouseup : function(e){
                if( this.drag.moved ) return;
                e.vector.text = 'Hello World';
                e.vector.color = '#fff';
                $studio.select(new Space.Text(e.vector));
            }
        },

        line : {
            mousedown : function(e){
                $studio.$line = new Space.Line({
                    v1 : e.vector.clone(),
                    v2 : e.vector.clone()
                });
                $studio.select( $studio.$line );
            },
            mousemove : function(e){
                $studio.$line && $studio.$line.v2.set(e.vector);
                return true; // prevent default stage rotation
            },
            mouseup : function(e){
                delete $studio.$line;
            }
        },

        camera : {
            mousedown : function(e){

                $studio.$line = new Space.Line({
                    v1 : e.vector.clone(),
                    v2 : e.vector.clone(),
                    hideFromStudio : true
                });

                $studio.$camera = new Space.Camera({
                    position : $studio.$line.v1,
                    target : $studio.$line.v2,
                });

                $studio.select( $studio.$camera );

                $stage.layout.views[3].setCamera($studio.$camera);

            },
            mousemove : function(e){
                $studio.$line && $studio.$line.v2.set(e.vector);
                $studio.$camera && $studio.$camera.target.set(e.vector);
                return true; // prevent default stage rotation
            },
            mouseup : function(e){
                delete $studio.$line;
                delete $studio.$camera;
            }
        },

        shape : {
            mousedown : function(e){
                if( $studio.$shape ){
                    return;
                }
                $studio.$shape = new Space.Shape(e.vector);
                $studio.select( $studio.$shape );
            },
            mousemove : function(e){
                if(!$studio.$shape || !$studio.$line) return true;
                $studio.$line.v2.set(e.vector);
                return true;
            },
            mouseup : function(e){
                if( $studio.$shape ){
                    $studio.$line = $studio.$shape.lineTo(e.vector);  
                    return;
                }
            },
            keyboard : {
                Escape : function(){
                    console.log('release shape');
                    if( $studio.$shape ){
                        if($studio.$line){
                            $studio.$line.remove();
                            $studio.$shape.vectors.splice($studio.$shape.vectors.length-1,1);
                            delete $studio.$line;
                        }
                        if(!$studio.$shape.lines.length) {
                            $studio.$shape.remove();
                            $studio.unselect($studio.$shape);
                        }
                        delete $studio.$shape;
                        $studio.refresh();
                        return;
                    }
                }
            }
        },

        rectangle : {
            mousedown : function(e){
                $studio.$shape = new Space.Shape(e.vector);
                $studio.$rectangle = {
                    sw : new Space.Vector( e.vector.clone() ),
                    nw : new Space.Vector( e.vector.clone() ),
                    ne : new Space.Vector( e.vector.clone() ),
                    se : new Space.Vector( e.vector.clone() ),
                    w : $studio.$shape.lineTo(e.vector),
                    n : $studio.$shape.lineTo(e.vector),
                    e : $studio.$shape.lineTo(e.vector),
                    s : $studio.$shape.lineTo(e.vector)
                }
                $studio.select( $studio.$shape );
            },
            mousemove : function(e){

                if(!$studio.$shape) return true;

                var angles = e.$view.camera.viewAngles();

                var $r = $studio.$rectangle;

                $r.ne.set(e.vector);
                $r.se.set(e.vector);

                var m = new Space.Vector( Space.Utils.vMiddle($r.ne,$r.sw) );

                var a = Math.RIGHT;

                $r.nw.set( $r.sw.subtract(m) );
                $r.nw.rotate( a - angles.x, a - angles.y , a - angles.z );
                $r.nw.set( $r.nw.add(m) );

                $r.se.set( $r.ne.subtract(m) );
                $r.se.rotate( a - angles.x, a - angles.y , a - angles.z );
                $r.se.set( $r.se.add(m) );

                $studio.$shape.vectors[0] = $r.e.v1 = $r.se;
                $studio.$shape.vectors[1] = $r.e.v2 = $r.ne;

                $studio.$shape.vectors[1] = $r.n.v1 = $r.ne;
                $studio.$shape.vectors[2] = $r.n.v2 = $r.nw;

                $studio.$shape.vectors[2] = $r.w.v1 = $r.nw;
                $studio.$shape.vectors[3] = $r.w.v2 = $r.sw;

                $studio.$shape.vectors[3] = $r.s.v1 = $r.sw;
                $studio.$shape.vectors[4] = $r.s.v2 = $r.se;

                return true;
            },
            mouseup : function(e){
                delete $studio.$shape;
                delete $studio.$rectangle;
            }
        },

        box : {
            mousedown : function(e){
                if(!$studio.$shape){
                    // create rect
                    Space.Studio.Stage.Interactions.rectangle.mousedown.call(this,e);
                    return true;
                }else{
                    // release
                    delete $studio.$shape;
                    delete $studio.$rectangle;
                    delete $studio.$clickPhase;
                }
            },
            mousemove : function(e){
                if(!$studio.$shape) return true;
                if(!$studio.$clickPhase){
                    // first phase drag create rectangle
                    Space.Studio.Stage.Interactions.rectangle.mousemove.call(this,e);
                }else{
                    // second phase drag extrude
                    var amount = ( e.offsetY - $studio.$rectangle.sx );

                }
                return true;
            },
            mouseup : function(e){
                if($studio.$shape) {
                    $studio.$clickPhase = true;
                    $studio.$rectangle.sx = e.offsetY;
                    var v1 = $studio.$shape.vectors[0];
                    var v2 = $studio.$shape.vectors[1];
                    var faces = $studio.$shape.extrudeAxis('z',v1.distance(v2),true);
                    $studio.select(new Space.Group({
                        elements : faces
                    }))
                    $studio.$shape.remove();
                }
            }
        },

        pan : {
            mousedown : function(e){
                $stage.$mousedown = true;
                return true;
            },
            mousemove : function(e){
                if(!$stage.$mousedown) return true;
                e.$view.camera.target.set(e.vector);
                return true;
            },
            mouseup : function(e){
                delete $stage.$mousedown;
            }
        }

    }

});