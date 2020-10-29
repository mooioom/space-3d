/*

Frame UI

A framework for creating a design software UI

Top Menu - top item, sub item, icon, keyboard shortcut
Top Bar
Sides 
Stage
Bottom Bar
Boxes (dockable, floating, resizable)

*/
window.FrameUI = function( s ){

    window._frame = this;

    var $frame = this;

    var s = s || {};

    this.root = null;

    this.element = s.element || document.body;

    this.modules = [];

    this.element.classList.add('frame-ui');

    window.DOM = function(name,props,root){

        var tag = name.match(/^[a-zA-Z0-9]+/),
            o   = props,
            el  = document.createElement( tag ? tag[0] : 'div' ),
            attr;
        
        name.split(/(?=\.)|(?=#)|(?=\[)/).forEach(function(c){
            c[0]=='#'&&(el.id=c.substr(1));
            c[0]=='.'&&(el.classList.add(c.substr(1)));
            c[0]=='['&&(attr=c.substr(1,c.length-2).split('='), el.setAttribute(attr[0],attr[1]));
        }); 
        
        root&&(el.root=root,root[name]=el);
    
        if(o){
            if(o.style) for(var p in o.style) el.style[p] = o.style[p]; delete o.style;
            if(o.name && root) root['$'+o.name] = el;
        }
    
        for(var x in o) 
            if(x[0] == '/'){
                el.appendChild( DOM(x.substr(1),o[x],root||el) );
                if(o.innerHTML) el.innerHTML += o.innerHTML;
                delete o.innerHTML;
            }else el[x] = o[x];
        
        return el;
    
    }

    var $el = function(a,b,c,d){
        var el = document.createElement(a||'div');
        el.className = 'frame-ui-'+b;
        if(c) c.appendChild(el);
        if(d) for(var x in d) el[x] = d[x];
        return el;
    }

    var getSize = function(s){
        return typeof s == 'string' ? s : (s + 'px');
    }

    Element.prototype._create = function(t,s,h){

        this.$elements = this.$elements || [];

        var $e = $el('div',t,this);

        $e.$t = t;

        $e.$parent = this;

        if(typeof h != 'undefined') {
            $e.$height = h;
            $e.style[t=='block'?'width':'height'] = getSize(h);
        }

        if(typeof s != 'undefined') {
            $e.$size = s;
            $e.style[t=='block'?'height':'width'] = getSize(s);
        }

        this.$elements.push($e);

        this.render();

        return $e;

    }

    Element.prototype.setSize = function(s){
        this.$size = s;
        this.render();
    }

    Element.prototype.block  = function(w,h){ return this._create('block',w,h);}
    Element.prototype.inline = function(w,h){ return this._create('inline',w,h);}

    Element.prototype.dockable = function(){

        this.$docking = [];

        this.dock = function( module ){

            this.$docking.push( module );

            module.dock = this;

            var docker = new $frame.Popup({
                docker : true,
                module : module,
                title : module.title
            });

            module.element = docker;

            module.prepend ? this.insertBefore( docker.$element, this.firstChild ) : this.appendChild( docker.$element );

        }

    }

    Element.prototype.render = function( r ){

        if(!r){
            // root element
        }

        if(!this.$elements) return;

        var n = this.$elements.filter(function(e){
            return typeof e.$size == 'undefined';
        });

        var d = {
            width : this.getBoundingClientRect().width,
            height : this.getBoundingClientRect().height
        }

        var sum = 0;

        this.$elements.map(function($e){
            $e.style[$e.$t=='block'?'height':'width'] = getSize($e.$size);
            sum += $e.$size || 0;
        });
        
        for(var i=0;i<n.length;i++){
            var $e = n[i];
            var p = $e.$t == 'block' ? 'height' : 'width';
            $e.style[p] = ((d[p] - sum) / n.length) + 'px';
        }

        this.$elements.map(function($e){
            $e.render(true);
        });

        if( this.$onrender ){
            //console.log(this);
        }

    }

    Element.prototype.hide = function(){
        this.$sizeCache = this.$size;
        this.$size = 0;
        this.classList.add('frame-ui-hidden');
        $frame.element.render();
    }

    Element.prototype.show = function(){
        this.$size = this.$sizeCache;
        this.classList.remove('frame-ui-hidden');
        $frame.element.render();
    }

    Element.prototype.clear = function(){
        delete this.$elements;
        delete this.$size;
        this.innerHTML = '';
    }

    this.popups = {};

    this.Popup = function( s ){

        var s = s || {};

        if( s.name ){
            if( $frame.popups[s.name] ) $frame.popups[s.name].remove();
            this.name = s.name;
            $frame.popups[this.name] = this;
        }

        this.title = s.title || '';
        this.module = s.module;

        var cl = s.docker ? 'module' : 'popup';

        this.$element = $el('div',cl);

        if(s.class) this.$element.classList.add(s.class);

        this.$head  = $el('div',cl+'-head',this.$element);
        this.$title = $el('div',cl+'-title',this.$head);
        this.$menu  = $el('div',cl+'-menu',this.$head);
        this.$right = $el('div',cl+'-right',this.$head);
        this.$close = $el('div',cl+'-menu-button',this.$menu,{
            innerHTML:'x',
            onclick : function(){
                this.hide();
            }.bind(this)
        });
        this.$clear = $el('div','clear',this.$head);

        this.$body = $el('div',cl+'-body',this.$element);

        this.$title.innerHTML = this.title;

        if(s.buttons) {
            this.$buttons = $el('div',cl+'-buttons',this.$element);
            for(var x=0;x<s.buttons.length;x++){
                var button = s.buttons[x];
                $el('div',cl+'-button',this.$buttons,{ innerHTML : button.title, onclick : button.onclick });
            }
        }

        if(s.modal){
            this.$close.remove();
            this.$modal = $el('div',cl+'-modal');
            this.$modal.$wrapper = $el('div',cl+'-modal-wrapper',this.$modal);
            this.$modal.$middle  = $el('div',cl+'-modal-middle',this.$modal);
            this.$modal.$wrapper.appendChild(this.$element)
        }

        if(!this.title) this.$head.removeChild(this.$title);

        $frame.element.appendChild(this.$modal||this.$element);

        if( s.left ) this.$element.style.left = s.left;
        if( s.top ) this.$element.style.top = s.top; 

        if( this.module ) {
            this.$body.appendChild( this.module.render(this.module.$element) );
            if(this.module.name) this.$element.classList.add( this.module.name );
            if(this.module.header === false && s.docker) this.$element.removeChild(this.$head);
            this.module.$popup = this;
        }

        this.hide = function(){
            if(this.$modal) return this.$modal.remove();
            this.$element.style.display = 'none';
        }

        this.show = function(){
            this.$element.style.display = 'block';
        }

        this.remove = function(){
            if(this.$modal) return this.$modal.remove();
            this.$element.remove();
        }

        $frame.draggable({
            element     : this.$element,
            handle      : this.$head,
            onmousedown : s.onmousedown,
            onmouseup   : s.onmouseup,
            ondrag      : s.ondrag
        });

        if( s.onload ) s.onload(this);

        return this;

    }

    this.Module = function(s){

        var s = s || {};

        for(var x in s) this[x] = s[x];

        this.name  = s.name  || 'module' + $frame.modules.length;
        this.title = s.title || '';

        this.$element = $el('div','module');
        this.$element.module = this;

        this.header = s.header;

        this.element = null; // current element view docker / popup

        this.render = s.render || function(e){
            return e;
        }

        this.dock = null;
        this.popup = null;

        if(s.dock){

            s.dock.dock(this);

        }else{

            var dock = null;

            this.popup = new $frame.Popup({
                module : this,
                title : this.title,
                ondrag : function(e,b){
                    dock = null;
                    if(b.$docking) dock = b;
                }.bind(this),
                onmouseup : function(){
                    if( dock ){
                        this.popup.hide();
                        dock.dock(this);
                    }
                }.bind(this)
            });

            this.element = this.popup;

            if(!s.popup) this.popup.hide();

        }

        this.show = function(){
            this.element.show();
        }.bind(this)

        this.hide = function(){
            this.element.hide();
        }.bind(this)

    }

    this.draggable = function( setup ){

        var setup = setup || {};

        var $e = setup.element;
     
        var mousemove = function(e){ // document mousemove

            dock = null;
     
            $e.style.left = ( e.clientX - $e.dragStartX ) + 'px';
            $e.style.top  = ( e.clientY - $e.dragStartY ) + 'px';

            $e.style.display = 'none';

            var b = document.elementFromPoint(e.clientX,e.clientY);

            setup.ondrag&&setup.ondrag(e,b||{});

            $e.style.display = 'block';
     
        }.bind($e);
     
        var mouseup = function(e){ // document mouseup
     
            document.removeEventListener('mousemove',mousemove);
            document.removeEventListener('mouseup',mouseup);

            document.body.classList.remove('frame-ui-no-select');

            setup.onmouseup&&setup.onmouseup(e);
     
        }.bind($e);
     
        var handle = setup.handle || $e;
     
        handle.addEventListener('mousedown',function(e){ // element mousedown
     
            $e.dragStartX = e.offsetX;
            $e.dragStartY = e.offsetY;

            document.body.classList.add('frame-ui-no-select');
     
            document.addEventListener('mousemove',mousemove);
            document.addEventListener('mouseup',mouseup);

            setup.onmousedown&&setup.onmousedown(e);
     
        }.bind($e)); 
     
    }

    window.onresize = function(){
        this.element.render();
    }.bind(this);

    //this.element.block();

}