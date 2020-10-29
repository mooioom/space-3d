Space.module(function(){

// Converts from degrees to radians.
Math.radians = function(degrees) {
    return degrees * Math.PI / 180;
};
   
// Converts from radians to degrees.
Math.degrees = function(radians) {
    return radians * 180 / Math.PI;
};

Space.Utils = {

    vDistance : function(v1,v2){ return Math.sqrt( Math.pow((v1.x - v2.x),2) + Math.pow((v1.y - v2.y),2) + Math.pow((v1.z - v2.z),2) ) },
    vMiddle : function(v1,v2){ return { x : (v1.x + v2.x) / 2, y : (v1.y + v2.y) / 2, z : (v1.z + v2.z) / 2 } },

    rotateMulti : function( a1, a2, v ){
        var m1 = v.rotatez(a1,true);
        var m2 = v.rotatey(a2,true);
        var m3 = Space.Utils.multiply3x3(m1,m2);
        var m4 = Space.Utils.multiply3x1(m3,[v.x,v.y,v.z]);
        v.x = m4[0];
        v.y = m4[1];
        v.z = m4[2];
    },

    multiply3x3 : function( m1, m2 ){

        /*
        0,1,2
        3,4,5
        6,7,8
        */

        var a0 = (m1[0] * m2[0]) + (m1[1] * m2[3]) + (m1[2] * m2[6]),
            a1 = (m1[0] * m2[1]) + (m1[1] * m2[4]) + (m1[2] * m2[7]),
            a2 = (m1[0] * m2[2]) + (m1[1] * m2[5]) + (m1[2] * m2[8]),

            b0 = (m1[3] * m2[0]) + (m1[4] * m2[3]) + (m1[5] * m2[6]),
            b1 = (m1[3] * m2[1]) + (m1[4] * m2[4]) + (m1[5] * m2[7]),
            b2 = (m1[3] * m2[2]) + (m1[4] * m2[5]) + (m1[5] * m2[8]),

            c0 = (m1[6] * m2[0]) + (m1[7] * m2[3]) + (m1[8] * m2[6]),
            c1 = (m1[6] * m2[1]) + (m1[7] * m2[4]) + (m1[8] * m2[7]),
            c2 = (m1[6] * m2[2]) + (m1[7] * m2[5]) + (m1[8] * m2[8]);

        return [a0,a1,a2,b0,b1,b2,c0,c1,c2];

    },

    multiply3x1 : function( m1, m2 ){

        var a = (m1[0] * m2[0]) + (m1[1] * m2[1]) + (m1[2] * m2[2]),
            b = (m1[3] * m2[0]) + (m1[4] * m2[1]) + (m1[5] * m2[2]),
            c = (m1[6] * m2[0]) + (m1[7] * m2[1]) + (m1[8] * m2[2]);

        return [a,b,c];

    },

    rotate : function(v, center, theta, phi) {
        // Rotation matrix coefficients
        var ct = Math.cos(theta);
        var st = Math.sin(theta);
        var cp = Math.cos(phi);
        var sp = Math.sin(phi);

        // Rotation
        var x = v.x - center.x;
        var y = v.y - center.y;
        var z = v.z - center.z;

        v.x = ct * x - st * cp * y + st * sp * z + center.x;
        v.y = st * x + ct * cp * y - ct * sp * z + center.y;
        v.z = sp * y + cp * z + center.z;
    },

    randomGrey : function() {
        var v = (Math.random()*(256)|0).toString(16);//bitwise OR. Gives value in the range 0-255 which is then converted to base 16 (hex).
        return "#" + v + v + v;
    },

    centerGuide : function( size, colors, data ){

        var size = 50;

        var colors = colors || {
            x : 'green',
            y : 'orange',
            z : 'purple'
        }

        var elements = {
            c : new Space.Vertax({ x : 0, y : 0, z : 0, name : 'Center', data : data }),
            x : new Space.Line({ v1 : { x:0,y:0,z:0 }, v2 : { x:size,y:0,z:0 }, color : colors.x, name : 'LineX', data : data }),
            y : new Space.Line({ v1 : { x:0,y:0,z:0 }, v2 : { x:0,y:size,z:0 }, color : colors.y, name : 'LineY', data : data }),
            z : new Space.Line({ v1 : { x:0,y:0,z:0 }, v2 : { x:0,y:0,z:size }, color : colors.z, name : 'LineZ', data : data }),
            xt : new Space.Text({ text : 'x', x:size,y:0,z:0, color : colors.x, name : 'LabelX', data : data }),
            yt : new Space.Text({ text : 'y', x:0,y:size,z:0, color : colors.y, name : 'LabelY', data : data }),
            zt : new Space.Text({ text : 'z', x:0,y:0,z:size, color : colors.z, name : 'LabelZ', data : data })
        }

        var e = [];

        for(var x in elements) e.push( elements[x] );

        return new Space.Group({
            elements : e,
            name : 'Center Guide',
            data : data
        });

    },

    grid : function( size, width, color, data ){

        var color = color || '#222';

        var w = width / 2;

        var elements = [];

        for(var i=0; i<=width;i+=size){
            var lineX = new Space.Line({ v1 : { x:i,y:0,z:0 }, v2 : { x:i,y:width,z:0 }, color : color, data : data });
            var lineY = new Space.Line({ v1 : { x:0,y:i,z:0 }, v2 : { x:width,y:i,z:0 }, color : color, data : data });
            elements.push(lineX);
            elements.push(lineY);
        }

        var grid = new Space.Group({
            elements : elements,
            name : 'Grid',
            data : data
        });

        grid.each(function(l){
            l.move('x',-w);
            l.move('y',-w);
        })

        return grid;

    }

}
    
})