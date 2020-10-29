Space.module(function(){

    Space.DFP = 100; // distance of plane from camera

    Math.RIGHT = 1.5707963267948966;

    Space.Vector = function(x, y, z) {
        if( typeof x == 'object' ){
            this.x = x.x || 0; this.y = x.y || 0; this.z = x.z || 0;
        }else{
            this.x = x || 0;
            this.y = y || 0;
            this.z = z || 0;
        }
        //this.name = (Math.random().toString(36)+'00000000000000000').slice(2, 10+2);
        //Space.vectors.push(this);
    }

    Space.Vector.prototype = {

        project : function(){
    
            var d = Space.DFP;

            var p = d / (d / 2); // 2

            var vx = -this.x;

            if(vx <= 0) {
                vx = 0.1;
            }

            var sx = Math.sqrt(vx);
    
            var x =  this.y * (d / sx / p) ;
            var y = -this.z * (d / sx / p) ;

            if(isNaN(x) || isNaN(y)){

            }
    
            return { x : x, y : y }
    
        },

        set : function(v){
            this.x = v.x;
            this.y = v.y;
            this.z = v.z;
        },

        moveTo : function( v, amount, moveTarget ){

            amount = amount || 50;

            var a = v.subtract(this);

            var min = Math.min( a.x, a.y, a.z );

            a.set({ x : (a.x / min) * amount, y : (a.y / min) * amount, z : (a.z / min) * amount });

            this.set( this.subtract(a) );
            if( moveTarget ) v.set( v.subtract(a) );

        },

        moveFrom : function( v, amount, moveTarget ){

            amount = amount || 100;

            var a = v.subtract(this);

            var min = Math.min(a.x,a.y,a.z);

            a.set({ x : (a.x / min) * amount, y : (a.y / min) * amount, z : (a.z / min) * amount });

            this.set( this.add(a) );
            if( moveTarget ) v.set( v.add(a) );

        },
    
        negative: function() {
          return new Space.Vector(-this.x, -this.y, -this.z);
        },
    
        add: function(v) {
          if (v instanceof Space.Vector) return new Space.Vector(this.x + v.x, this.y + v.y, this.z + v.z);
          else return new Space.Vector(this.x + v, this.y + v, this.z + v);
        },
    
        subtract: function(v) {
          if (v instanceof Space.Vector) return new Space.Vector(this.x - v.x, this.y - v.y, this.z - v.z);
          else return new Space.Vector(this.x - v, this.y - v, this.z - v);
        },
    
        multiply: function(v) {
          if (v instanceof Space.Vector) return new Space.Vector(this.x * v.x, this.y * v.y, this.z * v.z);
          else return new Space.Vector(this.x * v, this.y * v, this.z * v);
        },
    
        divide: function(v) {
          if (v instanceof Space.Vector) return new Space.Vector(this.x / v.x, this.y / v.y, this.z / v.z);
          else return new Space.Vector(this.x / v, this.y / v, this.z / v);
        },
    
        equals: function(v) {
          return this.x == v.x && this.y == v.y && this.z == v.z;
        },
    
        dot: function(v) {
          return this.x * v.x + this.y * v.y + this.z * v.z;
        },
    
        cross: function(v) {
          return new Space.Vector(
            this.y * v.z - this.z * v.y,
            this.z * v.x - this.x * v.z,
            this.x * v.y - this.y * v.x
          );
        },
    
        length: function() {
          return Math.sqrt(this.dot(this));
        },
    
        unit: function() {
          return this.divide(this.length());
        },
    
        min: function() {
          return Math.min(Math.min(this.x, this.y), this.z);
        },
    
        max: function() {
          return Math.max(Math.max(this.x, this.y), this.z);
        },
    
        distance : function(v){
            if(!v) v = {x:0,y:0,z:0};
            return Math.sqrt( Math.pow((v.x - this.x),2) + Math.pow((v.y - this.y),2) + Math.pow((v.z - this.z),2) );
        },
    
        translate : function(v){
            this.x -= v.x;
            this.y -= v.y;
            this.z -= v.z;
        },
    
        angles : function(){
    
            var r = this.length();
    
            var theta = Math.acos( this.z / r );      // z axis to vector
            var phi   = Math.atan2( this.y, this.x ); // xy plane to angle
    
            var a = this.x / r;
            var b = this.y / r;
            var g = this.z / r;
    
            return {
                theta : theta,
                phi   : phi,
                x     : Math.acos(a),
                y     : Math.acos(b),
                z     : Math.acos(g) // same like theta
            }
        },
    
        angle2D : function(p,isDeg){
            var rad = Math.atan2(p.y - this.y, p.x - this.x);
            return isDeg ? rad * 180 / Math.PI : rad;
        },
    
        angleTo: function(a) {
          return Math.acos(this.dot(a) / (this.length() * a.length()));
        },
    
        toArray: function(n) {
          return [this.x, this.y, this.z].slice(0, n || 3);
        },
    
        clone: function( parent ) {
            var v = new Space.Vector(this.x, this.y, this.z);
            if(parent) v.parent = parent;
            return v
        },
    
        init: function(x, y, z) {
          this.x = x; this.y = y; this.z = z;
          return this;
        },
    
        rotatex : function( rad, matrix ){
    
            var cos = Math.cos(rad), sin = Math.sin(rad);
    
            var a0 = 1,   a1 = 0,   a2 = 0,
                b0 = 0,   b1 = cos, b2 = -sin,
                c0 = 0,   c1 = sin, c2 = cos;
    
            if(matrix) return [a0,a1,a2,b0,b1,b2,c0,c1,c2];
    
            var x = a0 * this.x + a1 * this.y + a2 * this.z;
            var y = b0 * this.x + b1 * this.y + b2 * this.z;
            var z = c0 * this.x + c1 * this.y + c2 * this.z;
    
            // if( x < 0.000000001 && x > 0 || x > -0.000000001 && x < 0 ) x = 0;
            // if( y < 0.000000001 && y > 0 || y > -0.000000001 && y < 0 ) y = 0;
            // if( z < 0.000000001 && z > 0 || z > -0.000000001 && z < 0 ) z = 0;
            
            this.x = x;
            this.y = y;
            this.z = z;

            return this;
    
        },
    
        rotatey : function( rad, matrix ){
    
            var cos = Math.cos(rad), sin = Math.sin(rad);
    
            var a0 = cos,  a1 = 0, a2 = sin,
                b0 = 0,    b1 = 1, b2 = 0,
                c0 = -sin, c1 = 0, c2 = cos;
    
            if(matrix) return [a0,a1,a2,b0,b1,b2,c0,c1,c2];
    
            var x = a0 * this.x + a1 * this.y + a2 * this.z;
            var y = b0 * this.x + b1 * this.y + b2 * this.z;
            var z = c0 * this.x + c1 * this.y + c2 * this.z;
    
            // if( x < 0.000000001 && x > 0 || x > -0.000000001 && x < 0 ) x = 0;
            // if( y < 0.000000001 && y > 0 || y > -0.000000001 && y < 0 ) y = 0;
            // if( z < 0.000000001 && z > 0 || z > -0.000000001 && z < 0 ) z = 0;
            
            this.x = x;
            this.y = y;
            this.z = z;

            return this;
    
        },
    
        rotatez : function( rad, matrix ){
    
            var cos = Math.cos(rad), sin = Math.sin(rad);
    
            var a0 = cos, a1 = -sin, a2 = 0,
                b0 = sin, b1 = cos,  b2 = 0,
                c0 = 0,   c1 = 0,    c2 = 1;
    
            if( matrix ) return [a0,a1,a2,b0,b1,b2,c0,c1,c2];
    
            var x = a0 * this.x + a1 * this.y + a2 * this.z;
            var y = b0 * this.x + b1 * this.y + b2 * this.z;
            var z = c0 * this.x + c1 * this.y + c2 * this.z;
    
            // if( x < 0.000000001 && x > 0 || x > -0.000000001 && x < 0 ) x = 0;
            // if( y < 0.000000001 && y > 0 || y > -0.000000001 && y < 0 ) y = 0;
            // if( z < 0.000000001 && z > 0 || z > -0.000000001 && z < 0 ) z = 0;
            
            this.x = x;
            this.y = y;
            this.z = z;

            return this;
    
        },
    
        // rotates z,y,x
        rotateMulti : function( a1, a2, a3 ){
            
            //if(a3) var mx = this.rotatex(a3,true);
            var mz = this.rotatez(a1,true);
            var my = this.rotatey(a2,true);
            
            //if(a3) m3 = Space.Utils.multiply3x3(mx,m3);
            var m3 = Space.Utils.multiply3x3(mz,my);
            
            var m4 = Space.Utils.multiply3x1(m3,[this.x,this.y,this.z]);

            this.x = m4[0];
            this.y = m4[1];
            this.z = m4[2];

            return this;
            
        },

        rotate : function(x,y,z){

            if(x) var a = this.rotatex(x,true);
            var b = this.rotatey(y,true);
            var c = this.rotatez(z,true);

            var r = x ? Space.Utils.multiply3x3(a,b) : b;
            r = Space.Utils.multiply3x3(r,c);

            var f = Space.Utils.multiply3x1(r,[this.x,this.y,this.z]);

            this.x = f[0];
            this.y = f[1];
            this.z = f[2];

        },

        rotateTest : function( order, angles ){

            //console.log( order, angles );

            if( order.length == 2 ){
                
                var a = this[ 'rotate'+order[0] ]( angles[0], true );
                var b = this[ 'rotate'+order[1] ]( angles[1], true );

                var r = Space.Utils.multiply3x3(a,b);

            }else if( order.length == 3 ){

                var a = this[ 'rotate'+order[0] ]( angles[0], true );
                var b = this[ 'rotate'+order[1] ]( angles[1], true );

                var r = Space.Utils.multiply3x3(a,b);

                var c = this[ 'rotate'+order[2] ]( angles[2], true );

                r = Space.Utils.multiply3x3(r,c);

            }

            var f = Space.Utils.multiply3x1(r,[this.x,this.y,this.z]);

            this.x = f[0];
            this.y = f[1];
            this.z = f[2];

        }
    
      };
    
    Space.Vector.negative = function(a, b) {
        b.x = -a.x; b.y = -a.y; b.z = -a.z;
        return b;
    };
    
    Space.Vector.add = function(a, b, c) {
        if (b instanceof Space.Vector) { c.x = a.x + b.x; c.y = a.y + b.y; c.z = a.z + b.z; }
        else { c.x = a.x + b; c.y = a.y + b; c.z = a.z + b; }
        return c;
    };
    
    Space.Vector.subtract = function(a, b, c) {
        if (b instanceof Space.Vector) { c.x = a.x - b.x; c.y = a.y - b.y; c.z = a.z - b.z; }
        else { c.x = a.x - b; c.y = a.y - b; c.z = a.z - b; }
        return c;
    };
    
    Space.Vector.multiply = function(a, b, c) {
        if (b instanceof Space.Vector) { c.x = a.x * b.x; c.y = a.y * b.y; c.z = a.z * b.z; }
        else { c.x = a.x * b; c.y = a.y * b; c.z = a.z * b; }
        return c;
    };
    
    Space.Vector.divide = function(a, b, c) {
        if (b instanceof Space.Vector) { c.x = a.x / b.x; c.y = a.y / b.y; c.z = a.z / b.z; }
        else { c.x = a.x / b; c.y = a.y / b; c.z = a.z / b; }
        return c;
    };
    
    Space.Vector.cross = function(a, b, c) {
        c.x = a.y * b.z - a.z * b.y;
        c.y = a.z * b.x - a.x * b.z;
        c.z = a.x * b.y - a.y * b.x;
        return c;
    };
    
    Space.Vector.unit = function(a, b) {
        var length = a.length();
        b.x = a.x / length;
        b.y = a.y / length;
        b.z = a.z / length;
        return b;
    };
    
    Space.Vector.fromAngles = function(theta, phi) {
        return new Space.Vector(Math.cos(theta) * Math.cos(phi), Math.sin(phi), Math.sin(theta) * Math.cos(phi));
    };
    
    Space.Vector.randomDirection = function() {
        return Space.Vector.fromAngles(Math.random() * Math.PI * 2, Math.asin(Math.random() * 2 - 1));
    };
    
    Space.Vector.min = function(a, b) {
        return new Space.Vector(Math.min(a.x, b.x), Math.min(a.y, b.y), Math.min(a.z, b.z));
    };
    
    Space.Vector.max = function(a, b) {
        return new Space.Vector(Math.max(a.x, b.x), Math.max(a.y, b.y), Math.max(a.z, b.z));
    };
    
    Space.Vector.lerp = function(a, b, fraction) {
        return b.subtract(a).multiply(fraction).add(a);
    };
    
    Space.Vector.fromArray = function(a) {
        return new Space.Vector(a[0], a[1], a[2]);
    };
    
    Space.Vector.angleBetween = function(a, b) {
        return a.angleTo(b);
    };
    
})
/*
window.permut = function(string,min,max,re) {

    if (string.length < 2) return string; // This is our break condition

    var permutations = []; // This array will hold our permutations

    for (var i=0; i<string.length; i++) {
        var char = string[i];

        // Cause we don't want any duplicates:
        if (string.indexOf(char) != i) // if char was used already
            continue;           // skip it this time

        var remainingString = string.slice(0,i) + string.slice(i+1,string.length); //Note: you can concat Strings via '+' in JS

        for (var subPermutation of permut(remainingString,min,max,true))
            permutations.push(char + subPermutation)

    }

    if(!re){

        for(var x=0;x<string.length;x++){
            var l = permutations.length;
            for(var i=0;i<l;i++){
                permutations = permutations.concat( permutations[i].substr(x,permutations[i].length));
            }
        }

        var l = permutations.length;

        while(l--){
            if(!permutations[l]) permutations.splice(l,1);
            if( permutations.indexOf(permutations[l]) != l ) permutations.splice(l,1);
            if( min && permutations[l] && permutations[l].length < min ) permutations.splice(l,1);
            if( max && permutations[l] && permutations[l].length > max ) permutations.splice(l,1);
        }

    }

    return permutations;
}*/