Space.module(function(){

    Space.Studio.Debugger = function(s){
        
        window.$debugger = this;

        this.fps = new $studio.ui.Module({
            title : 'FPS',
            class : 'fps',
            dock : $studio.$right,
            prepend : true
        });

        var $fps = this.fps.$element;

        this.refresh = function(){

        }

        this.render = function(){

            $fps.innerHTML = '';

        }

        this.render();

    }

});