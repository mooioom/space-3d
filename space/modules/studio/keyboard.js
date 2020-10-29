Space.module(function(){

    Space.Studio.Keyboard = function(s){

        window.$keyboard = this;

        this.pressed = [];

        this.events = {};

        this.shift = null;
        this.ctrl  = null;
        this.alt   = null;

        this.register = function( key, fn ){
            this.events[ key ] = fn;
        }

        this.registerKeys = function( keys ){
            for(var key in keys) this.register( key, keys[key] );
        }

        this.numKeydown = function(e){

            var v = Number(e.target.value);

            var key   = e.key.toLowerCase();
            var shift = e.shiftKey;

            if( key == 'arrowup' ) v += shift ? 10 : 1;
            if( key == 'arrowdown' ) v -= shift ? 10 : 1;

            e.target.value = v;

        }.bind(this)

        document.body.onkeydown = function(e){

            if( e.key == 'F12' ) return;    // devtools

            if(e.target && e.target.tagName == 'INPUT'){
                if(e.target.number) this.numKeydown(e);
                return;
            }

            e.preventDefault();

            var key = e.key;

            if(this.pressed.indexOf(key) == -1) this.pressed.push(key);

            for(var keys in this.events){
                var event = this.events[keys];
                var s = keys.split('+');
                if( this.pressed.length != s.length ) continue;
                var f = 0;
                for(var i in s) if( this.pressed[i] == s[i] ) f++;
                if( f == this.pressed.length ) event(e);
            }

            this.shift = this.pressed.indexOf('Shift')   != -1;
            this.ctrl  = this.pressed.indexOf('Control') != -1;
            this.alt   = this.pressed.indexOf('Alt')     != -1;

        }.bind(this);

        document.body.onkeyup = function(e){

            e.preventDefault();

            var key = e.key;

            if(this.pressed.indexOf(key) != -1) this.pressed.splice(this.pressed.indexOf(key),1);

            this.shift = this.pressed.indexOf('Shift')   != -1;
            this.ctrl  = this.pressed.indexOf('Control') != -1;
            this.alt   = this.pressed.indexOf('Alt')     != -1;

        }.bind(this);

        $keyboard.register('Delete',function(){

            $studio.selecteds.forEach(function(n){
                n.remove();
            });

            $studio.unselect();

        }.bind(this));
        // $keyboard.register('Escape+1',function(){console.log('escape1')})
        // $keyboard.register('Escape+1+Control',function(){console.log('escape1control')})
        // $keyboard.register('Control+1',function(){console.log('escape1control')})
        
    }

});