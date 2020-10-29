Space.module(function(){

    Space.Studio = function(s){

        window.$studio = this;

        var s = s || {};

        this.element = s.element || document.body;

        this.tool = null;

        this.selecteds = [];

        this.events = {};

        this.element.classList.add('studio');

        this.ui = new FrameUI({
            element : this.element
        });

        this.$studio = this.ui.element;

        this.onresize = function(){}
        this.$studio.$onresize = this.onresize;

        this.$top       = this.$studio.block(22);
        this.$inspector = this.$studio.block(35);
        this.$middle    = this.$studio.block();
        this.$bottom    = this.$studio.block(30);

        this.$left  = this.$middle.inline(50);
        this.$stage = this.$middle.inline();
        this.$right = this.$middle.inline(250);

        this.$top.classList.add('top');
        this.$inspector.classList.add('inspector');
        this.$middle.classList.add('middle');
        this.$bottom.classList.add('bottom');
        this.$left.classList.add('left-unit');
        this.$stage.classList.add('stage');
        this.$right.classList.add('right-unit');

        this.$right.dockable();
        this.$left.dockable();

        this.$left.setSize(50);
        window.$left = this.$left;

        this.on = function( eventName, fn ){
            var events = this.events[eventName];
            if(!events) return this.events[eventName] = [fn];
            events.push(fn);
        }

        this.emit = function( eventName, data ){
            var events = this.events[eventName];
            if(!events) return false;
            events.forEach(function(fn){
                fn(data);
            })
        }

        this.on('toolchange',function( tool ){
            this.tool = tool;
        }.bind(this));

        this.utils    = new Space.Studio.Utils;

        this.toolbox    = new Space.Studio.Toolbox;
        this.inspector  = new Space.Studio.Inspector({ element : this.$inspector });
        this.stage      = new Space.Studio.Stage({ element : this.$stage, });
        this.objects    = new Space.Studio.Objects;
        this.properties = new Space.Studio.Properties;
        this.bottom     = new Space.Studio.Bottom({ element : this.$bottom });
        this.menu       = new Space.Studio.Menu({ element : this.$top });
        this.debugger   = new Space.Studio.Debugger;

        this.keyboard = new Space.Studio.Keyboard;

        this.units = [this.inspector,this.toolbox,this.stage,this.objects,this.properties,this.bottom,this.menu,this.debugger];

        this.refresh = function( name ){

            if(name && this[name] && this[name].refresh) return this[name].refresh();

            this.units.forEach(function(unit){
                unit.refresh&&unit.refresh();
            });

        }

        this.select        = this.objects.select.bind(this.objects);
        this.unselect      = this.objects.unselect.bind(this.objects);
        this.selectionName = this.objects.selectionName.bind(this.objects); 
        this.selectionType = this.objects.selectionType.bind(this.objects); 

        this.reset = function(){

            $space.reset();
            this.selecteds = [];
            this.stage.render();
            this.refresh();

        }

        this.areyousure = function( title, text, fn ){
            var popup = $studio.ui.Popup({
                title   : title || 'Are You Sure?', class : 'areyousure', name : 'areyousure', modal : true,
                buttons : [
                    { title : 'No', onclick : function(){ popup.remove(); }},
                    { title : 'Yes',onclick : function(){ fn && fn(); popup.remove(); }}
                ],
                onload  : function( popup ){ popup.$element; popup.$body.innerHTML = text || 'This Cannot Be Undone'; }
            });
        }

        this.userinput = function( title, actionText, value, fn ){
            var popup = $studio.ui.Popup({
                title   : title || 'User Input', class : 'userinput', name : 'userinput', modal : true,
                buttons : [
                    { title : 'No', onclick : function(){ popup.remove(); }},
                    { title : actionText||'Yes',onclick : function(){ fn && fn(popup.$input.value); popup.remove(); }}
                ],
                onload  : function( popup ){ 
                    popup.$input = document.createElement('input');
                    if(value) popup.$input.value = value;
                    popup.$body.appendChild(popup.$input);
                    popup.$input.focus();
                }
            });
        }

        // init

        this.toolbox.set('select');

        this.refresh();

        console.log(this);

    }

});