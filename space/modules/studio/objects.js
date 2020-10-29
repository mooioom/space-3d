Space.module(function(){

    Space.Studio.Objects = function( s ){

        window.$objects = this;

        this.module = new $studio.ui.Module({
            title : 'Objects',
            dock : $studio.$right
        });

        var $e = this.module.$element;

        var filterTypes = ['elements','faces','groups','lines','texts','shapes','vertices','cameras','lights','guides'];

        this.ONE_TO_MANY = {
            vertax : 'vertices', line : 'lines', shape : 'shapes', face : 'faces', text : 'texts', camera : 'cameras', light : 'lights'
        }

        this.TYPE2ARRAY = {
            vertax : 'vertices', camera : 'cameras', face : 'faces', group : 'groups', line : 'lines', text : 'texts', shape : 'shapes'
        };

        this.filter = 'elements';

        this.isSelected = function(object){
            return $studio.selecteds.indexOf(object) != -1;
        }

        this.isMultiSelection = function(){
            return $studio.selecteds.length > 1;
        }

        this.isSingleSelection = function(){
            return $studio.selecteds.length == 1;
        }

        this.uniqueSelection = function(objects){
            objects = objects || [];
            return objects.filter(function(o){
                return $studio.selecteds.indexOf(o) == -1;
            });
        }

        this.select = function( objects ){
            $studio.selecteds = Array.isArray(objects) ? this.uniqueSelection(objects) : [objects];
            $studio.refresh();
        }

        this.addSelection = function( objects ){
            objects = objects || [];
            $studio.selecteds = $studio.selecteds.concat(this.uniqueSelection(objects));
            $studio.refresh();
        }

        this.unselect = function( objects ){

            if( !objects ){
                var l = $studio.selecteds.length;
                while(l--) $studio.selecteds.splice(l,1);
                return $studio.refresh();
            }

            if( Array.isArray(objects) ){
                var i = objects.length;
                while(i--){
                    $studio.selecteds.splice( $studio.selecteds.indexOf(objects[i]), 1 );    
                }
            }else{
                $studio.selecteds.splice( $studio.selecteds.indexOf(objects), 1 );
            }

            $studio.refresh();

        }

        this.selectAll = function(){
            $studio.selecteds = [];
            $space.elements.forEach(function(el){
                if(!el.data || !el.data.guide) $studio.selecteds.push(el);
            });
            $studio.refresh();
        }

        this.unselectAll = function(){
            $studio.selecteds = [];
            $studio.refresh();
        }

        this.selectionName = function(){
            if(!$studio.selecteds.length) return 'No Selection';
            return $studio.selecteds.length > 1 ? 'Multiple Selected' : this.objectName( $studio.selecteds[0] );
        }

        this.selectionType = function(){
            if(!$studio.selecteds.length) return '';
            if($studio.selecteds.length == 1) return $studio.selecteds[0].type;
            var uniqueTypes = $studio.selecteds.map(function(a){return a.type}).filter(function(a,b,c){
                return c.indexOf(a) === b;
            });
            if(uniqueTypes.length == 1) return this.ONE_TO_MANY[ uniqueTypes[0] ];
            return 'Mixed';
        }

        this.objectName = function( o ){
            if(o.name) return o.name;
            if(o.parent)var p = this.objectName(o.parent) + ' > ';
            var typeGroup = this.TYPE2ARRAY[o.type];
            return (p||'') + o.type + $space[ typeGroup ].indexOf(o);
        }

        this.render = function(){

            $e.innerHTML = '';

            var $filters = DOM('.object-fitlers',{
                '/.left' : { innerHTML : '' },
                '/.right' : { '/select' : { name : 'select' } },
                '/.clear' : {}
            });

            $filters.onmousedown = function(e){
                e.stopPropagation();
            }

            this.$filters = $filters;

            filterTypes.forEach(function(f){
                $filters.$select.appendChild(DOM('option',{
                    value : f,
                    innerHTML : f
                }));
            });

            $filters.$select.onchange = function(e){

                this.filter = e.target.selectedOptions[0].value;
                this.refresh();

            }.bind(this);

            this.$objects = DOM('.objects-wrapper',{
                '/table.objects-list' : {
                    name : 'list'
                }
            });

            $e.module.$popup.$right.appendChild(this.$filters);
            $e.appendChild(this.$objects);

        }

        this.refresh = function(){

            this.$objects.$list.innerHTML = '';

            var includeGuides = false;

            var n = this.filter;

            if( n == 'guides' )
            {
                includeGuides = true;
                n = 'elements';
            }

            this.list = $space[n] || [];

            this.list = this.list.filter(function(o){
                return includeGuides ? true : !o.data.guide;
            });

            if( !this.list.length ) return this.$objects.$list.innerHTML = '<div class="objects-empty">Empty '+n+'</div>';

            for(var x in this.list){
                var o = this.list[x];
                var $object = DOM('tr.object',{
                    onclick : function(o,x,e){
                        o.color = o.$color || 'white';
                        if( this.isSelected(o) ) return this.unselect(o);
                        if( $keyboard.ctrl ){
                            this.addSelection([o]);
                        }else this.select([o]);
                    }.bind(this,o,x),
                    onmouseover : function(o,x,e){
                        o.$color = o.color;
                        o.color = 'yellow';
                        $stage.refresh();
                    }.bind(this,o,x),
                    onmouseout : function(o,x,e){
                        o.color = o.$color || 'white';
                        $stage.refresh();
                    }.bind(this,o,x),
                    '/td.type' : {
                        innerHTML : o.type
                    },
                    '/td.name' : {
                        innerHTML : this.objectName(o)
                    },
                    '/td.actions' : {

                    }
                });
                if( $studio.selecteds.indexOf(o) != -1) $object.classList.add('selected');
                this.$objects.$list.appendChild($object);
            }

        };

        this.render();
        
    }

});