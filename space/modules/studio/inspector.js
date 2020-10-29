Space.module(function(){

    Space.Studio.Inspector = function(s){

        window.$inspector = this;

        this.options = {};

        var options = this.options;
        
        this.$element = s.element;

        this.render = function(){

            this.$element.innerHTML = ''

        }

        this.refresh = function(){   

        }.bind(this);

        this.toolset = function(){

            this.$element.innerHTML = ''

            var menu = Space.Studio.Inspector.tools[ $studio.tool ];

            this.block($studio.tool);

            if(!menu) return;

            menu(this.$element);

        }.bind(this);

        $studio.on('toolchange',this.toolset);

        this.block = function( title ){

            var $el = DOM('.block');

            if(title) $el.innerHTML = title;

            this.$element.appendChild($el);

            return $el;

        }

        this.toggle = function( propName, title ){

            var options = $inspector.options;

            var $toggle = DOM('.toggle',{
                innerHTML : title || propName,
                onclick : function(){
                    options[propName] = !options[propName];
                    this.set();
                },
                set : function(){
                    console.log( options[propName] );
                    this.classList[ options[propName] ? 'add' : 'remove' ]('on');
                }
            });

            $toggle.set();

            return $toggle;

        }

        this.title = function( text ){

            return DOM('.title',{
                innerHTML : text
            })

        }

        this.button = function( text, fn ){

            return DOM('.button',{
                title : text,
                innerHTML : text,
                onclick : fn
            })

        }

        this.input = function( title, fn, props ){

            var $input = DOM('input',{
                placeholder : title||'',
                onkeyup : fn
            });

            if(props) {
                for(var x in props) {
                    if(x=='style') for(var y in props.style) $input.style[y] = props.style[y];
                    else $input[x] = props[x];
                }
            }

            return $input;

        }

        this.render();

    }

    Space.Studio.Inspector.tools = {

        select : function( $e ){

        },

        rotate : function( $e ){

            $inspector.options = {
                x : true,
                y : false,
                z : false
            }

            var $block = $inspector.block();

            $block.appendChild( $inspector.toggle('x') );
            $block.appendChild( $inspector.toggle('y') );
            $block.appendChild( $inspector.toggle('z') );

            var $block = $inspector.block();

            var $input = $inspector.input('Rotate',function(){
                var v = Number(this.value);
                if(isNaN(v)) return this.value = 0;
            },{
                value : 0,
                number : true,
                style : { width : '50px', textAlign : 'center' }
            })

            $block.appendChild( $input );

            $block.appendChild( $inspector.button('Apply',function(){

                var amount = Math.radians(Number($input.value));

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
                
                $studio.refresh();

            }));

        }

    }

});