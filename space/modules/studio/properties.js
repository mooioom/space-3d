Space.module(function(){

    Space.Studio.Properties = function(s){

        window.$properties = this;

        this.module = new $studio.ui.Module({
            title : 'Properties',
            dock : $studio.$right
        });

        var $e = this.module.$element;

        this.$properties = null;

        this.render = function(){

            $e.innerHTML = '';

            this.$properties = DOM('.properties',{
                '/.head' : {
                    '/.left.name' : {
                        name : 'name'
                    },
                    '/.right.type' : {
                        name : 'type'
                    },
                    '/.clear' : {}
                },
                '/.menu' : {
                    name : 'menu'
                },
                '/.body' : {
                    name : 'body'
                }
            });

            $e.appendChild(this.$properties);

        }

        this.drawBody = function(){

        }

        this.refresh = function(){

            this.$properties.$name.innerHTML = $studio.selectionName();

            var type = $studio.selectionType();

            this.$properties.$type.style.display = type ? 'block' : 'none';
            this.$properties.$type.innerHTML = type;

            this.$properties.$body.innerHTML = '';

            var body = Space.Studio.Properties.Elements[type];

            body&&body(this.$properties.$body);
            
        };

        this.property = function( name, title, isNumber ){

            var $property = DOM('.property',{
                '/.title' : { innerHTML : title || name },
                '/input' : {
                    name : 'input',
                    value : $studio.selecteds[0][name],
                    onkeyup : function(e){
                        $studio.selecteds[0][name] = isNumber ? Number(e.target.value) : e.target.value;
                        $stage.refresh();
                        $studio.objects.refresh();
                    }
                }
            });

            if( isNumber ) $property.$input.number = true;

            if(name=='color') $property.$input.onclick = function(){
                
                $studio.ui.Popup({
                    title  : 'Colorpicker',
                    class  : 'colorpicker',
                    name   : 'colorpicker',
                    onload : function( popup ){
                        var b = $property.$input.getBoundingClientRect();
                        popup.$element.style.left = (b.left - b.width - 30 ) + 'px',
                        popup.$element.style.top = b.top + 'px',
                        popup.$body.colorpicker({
                            onPick : function(rgba,hex){
                                var c = 'rgba('+rgba[0]+','+rgba[1]+','+rgba[2]+','+rgba[3]+')';
                                $studio.selecteds[0]['color'] = c;
                                $studio.refresh();
                            },
                            rgba : true,
                            size : 200
                        })
                    }
                });

            }

            return $property;

        }

        this.vector = function( v, title ){

            return DOM('.property.vector',{
                '/.title' : { innerHTML : title || 'Position' },
                '/table' : {
                    '/tr.head' : { '/td.tdx' : { innerHTML : 'X' }, '/td.tdy' : { innerHTML : 'Y' }, '/td.tdz' : { innerHTML : 'Z' } },
                    '/tr.body' : {
                        '/td.tdx' : {'/input' : { value : v.x, number : true, onkeyup : function(){ v.x = this.value; $stage.refresh() } } },
                        '/td.tdy' : {'/input' : { value : v.y, number : true, onkeyup : function(){ v.y = this.value; $stage.refresh() } } },
                        '/td.tdz' : {'/input' : { value : v.z, number : true, onkeyup : function(){ v.z = this.value; $stage.refresh() } } }
                    }
                }
            });

        }

        this.toggle = function( title, value, onclick ){

            return DOM('.property',{
                '/.title' : { 
                    '/input' : {
                        type : 'checkbox',
                        checked : value,
                        onclick : onclick
                    },
                    '/span' : {
                        innerHTML : title 
                    }
                }
            });

        }

        this.button = function( title, fn ){

            return DOM('.property.button',{
                innerHTML : title,
                onclick : fn
            });

        }

        this.render();
        
    }

    Space.Studio.Properties.Elements = {

        vertax : function( $body ){

            $body.appendChild($properties.vector($studio.selecteds[0].v));

            $body.appendChild($properties.property('name'));
            $body.appendChild($properties.property('color'));
            $body.appendChild($properties.property('size',null,true));

        },

        vertices : function( $body ){

            $studio.selecteds.forEach(function(o){

                $body.appendChild(DOM('.button',{
                    onclick : function(o,e){
                        $studio.selecteds.forEach(function(oo){
                            oo.v = o.v;
                            if(oo.parent && oo.parentVector) oo.parent[oo.parentVector] = o.v;
                        });
                        $stage.refresh();
                    }.bind(this,o),
                    innerHTML : 'Weld on ' + $objects.objectName(o)
                }))

            });

        },

        line : function( $body ){

            $body.appendChild($properties.toggle('Toggle Vertices', $space.isRendered($studio.selecteds[0].vertax1), function(){
                $studio.selecteds[0].toggleVertices();
                $stage.refresh();
                $studio.objects.refresh();
            }));

            $body.appendChild($properties.vector($studio.selecteds[0].v1,'V1'));
            $body.appendChild($properties.vector($studio.selecteds[0].v2,'V2'));

            $body.appendChild($properties.property('name'));
            $body.appendChild($properties.property('color'));
            $body.appendChild($properties.property('width',null,true));

        },

        face : function( $body ){

            var s = $studio.selecteds[0];

            $body.appendChild($properties.property('name'));
            $body.appendChild($properties.property('color'));

            if(s.image) $body.appendChild(s.image);

            $body.appendChild($properties.button('Set Bitmap',function(){
                $menu.readImage = true;
                $menu.onreadfile = function(c){
                    s.bitmap = c;
                    s.image = document.createElement('img');
                    s.image.src = s.bitmap;
                    setTimeout(function(){
                        $studio.refresh();
                    },0)
                }
                $menu.$file.click();
            }));
            

        },

        text : function( $body ){

            $body.appendChild($properties.vector($studio.selecteds[0].v,'Position'));

            $body.appendChild($properties.property('name'));
            $body.appendChild($properties.property('text'));
            $body.appendChild($properties.property('color'));
            $body.appendChild($properties.property('size',null,true));

        },

        shape : function( $body ){

            $body.appendChild($properties.button('Convert into Face',function(){

                var shape = $studio.selecteds[0];

                var face = new Space.Face({
                    vs : shape.vectors
                });

                $studio.select(face);

                $space.elements.splice($space.elements.indexOf(shape),1);

                var l = shape.lines.length;
                while(l--) $space.elements.splice($space.elements.indexOf(shape.lines[l]),1);

                $studio.refresh();

            }));

        },

        camera : function( $body ){

            $body.appendChild($properties.vector($studio.selecteds[0].position,'Position'));
            $body.appendChild($properties.vector($studio.selecteds[0].target,'Target'));

            $body.appendChild($properties.property('name'));

        },

    }

});