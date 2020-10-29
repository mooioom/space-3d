Space.module(function(){

    Space.Studio.Bottom = function(s){

        this.$element = s.element;

        this.render = function(){

            this.$element.innerHTML = '';

            var $up = DOM('button',{
                innerHTML : 'DFP + 10',
                onclick : function(){
                    Space.DFP += 10;
                    $studio.refresh();
                }
            });

            var $down = DOM('button',{
                innerHTML : 'DFP - 10',
                onclick : function(){
                    Space.DFP -= 10;
                    $studio.refresh();
                }
            });

            this.$element.appendChild($up);
            this.$element.appendChild($down);

        }

        this.refresh = function(){};

        this.render();
        
    }

});