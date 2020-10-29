Space.module(function(){

    Space.Studio.Toolbox = function(s){

        this.module = new $studio.ui.Module({
            name : 'toolbox',
            dock : $studio.$left,
            header : false,
        });

        this.tool = null;

        this.select = function(){
            console.log('select');
        }

        this.tools = [
            {
                title : 'tools',
                class : 'header'
            },
            {
                name : 'select',
                title : 'Select',
                onclick : this.select
            },
            {
                name : 'move',
                title : 'Move'
            },
            {
                name : 'rotate',
                title : 'Rotate'
            },

            {
                title : 'create',
                class : 'header'
            },
            {
                name : 'vertax',
                title : 'Vertax'
            },
            {
                name : 'line',
                title : 'Line'
            },
            {
                name : 'shape',
                title : 'Shape'
            },
            {
                name : 'rectangle',
                title : 'Rect.'
            },
            {
                name : 'box',
                title : 'Box'
            },
            {
                name : 'text',
                title : 'Text'
            },
            {
                name : 'camera',
                title : 'Camera'
            },
            {
                name : 'light',
                title : 'Light'
            },

            {
                title : 'camera',
                class : 'header'
            },
            {
                name : 'pan',
                title : 'Pan'
            }
        ]

        this.render = function(){

            this.menu = new Menu({
                $element : this.module.$element,
                toolbox  : true,
                items    : this.tools,
                onselect : function( item ){
                    $studio.emit('toolchange',item.name);
                    this.tool = item.name;
                }.bind(this)
            });

            this.tools = this.menu.namedItems;

        }

        this.refresh = function(){};

        this.set = function( name ){
            this.tools[name].select();
        }.bind(this);

        this.render();

        window.$toolbox = this;
        
    }

});