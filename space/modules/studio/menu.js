Space.module(function(){

    Space.Studio.Menu = function(s){

        window.$menu = this;

        this.$element = s.element;

        this.$file = DOM('input.file-input',{ type : 'file' });

        this.$element.appendChild(this.$file);

        this.reset = function(){
            $studio.areyousure('Reset Project','This Cannot Be Undone',$studio.reset.bind($studio));
        }

        this.export = function(){

            var space = $space.export();

            var e = {
                studio : {}, // studio settings
                space  : space
            };

            console.log('export',e);

            $studio.userinput('Project Name','Export','project',function(name){
                var blob = new Blob([JSON.stringify(e)], {type: "application/json;charset=utf-8"});
                saveAs(blob, name+'.space');   
            });

        }

        this.import = function(){

            this.onreadfile = function( content ){

                try {
                    content = JSON.parse(content);                
                } catch (error) {
                    
                }
    
                console.log('loaded',content);
    
                // create all vectors first then attach
    
            }.bind(this);

            this.readImage = false;

            this.$file.click();

        }.bind(this);

        this.readFile = function(e){
            var file   = e.target.files[0];  if (!file) return;
            var reader = new FileReader();
            reader.onload = function(e) { this.onreadfile(e.target.result); }.bind(this);
            reader[this.readImage ? 'readAsDataURL' : 'readAsText'](file);
            this.$file.value = null;
        }.bind(this);

        this.$file.addEventListener('change', this.readFile);

        this.items = [
            {
                title : 'File',
                items : [
                    {
                        title : 'Export',
                        onclick : this.export
                    },
                    {
                        title : 'Import',
                        onclick : this.import
                    },
                    {
                        title : 'Reset',
                        onclick : this.reset
                    }
                ]
            },
            {
                title : 'Select',
                items : [
                    {
                        title : 'All',
                        onclick : $studio.objects.selectAll
                    },
                    {
                        title : 'Unselect All',
                        onclick : $studio.objects.unselectAll
                    },
                ]
            },
            {
                title : 'View',
                items : [
                    {
                        title : 'Stage Setup',
                        onclick : $studio.stage.modules.setup.show
                    }
                ]
            }
            
        ]

        this.render = function(){

            this.menu = new Menu({
                $element : this.$element,
                items : this.items
            });

        }

        this.refresh = function(){};

        this.render();

    }

});