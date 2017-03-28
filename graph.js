var NS="http://www.w3.org/2000/svg";
var origin = {
    x:0,
    y:0
};

//function to draw lines by giving it two points
function lines(x1,y1,x2,y2){
    var line = document.createElementNS(NS,"line");

    line.setAttribute('x1',x1);
    line.setAttribute('y1',y1);
    line.setAttribute('x2',x2);
    line.setAttribute('y2',y2);
    line.setAttribute('stroke',"black");
//line.setAttribute('stroke-width',10);
    return line;
}

//writes text in the svg
//takes the text and position
function text(x,y,string) {
    var t = document.createElementNS(NS,"text");
    t.setAttribute("x",x);
    t.setAttribute('y',y);
    t.textContent = string;
    return t;
}

function border(coord){

    x = lines(coord.x,coord.y,coord.x+coord.xlen,coord.y);
    svg.appendChild(x);
    x = lines(coord.x,coord.y,coord.x,coord.y+coord.ylen);
    svg.appendChild(x);
    x = lines(coord.x+coord.xlen,coord.y,coord.x+coord.xlen,coord.y+coord.ylen);
    svg.appendChild(x);
    x = lines(coord.x,coord.y+coord.ylen,coord.x+coord.xlen,coord.y+coord.ylen);
    svg.appendChild(x);
}

//create a svg tag to add elements to it later
function createSvg(coord) {

    svg1 = document.createElementNS(NS,"svg");
    svg1.setAttribute('width',window.innerWidth);
    svg1.setAttribute('height',window.innerHeight);
    document.body.appendChild(svg1);

    var svg = document.createElementNS(NS,"g");
    svg.setAttribute('width',coord.xlen);
    svg.setAttribute('height',coord.ylen);
    svg.setAttribute("x",coord.x);
    svg.setAttribute("y",coord.y);
    svg.setAttribute("id","graph");
    $("svg").append(svg);
    return svg;
}

//draws the x y axises and all the markings
function coordinates(coord,values) {
var flag ={
    x : 1,
    y : 1
};
    origin.x =coord.x +  Math.round((0- values.xstart )/(values.xend- values.xstart)*coord.xlen);
    origin.y =coord.ylen +  coord.y - Math.round((0 - values.ystart)/(values.yend - values.ystart)*coord.ylen);

    if(origin.x < coord.x || origin.x > coord.x + coord.xlen)
        flag.y = 0;

    else if(flag.y == 0)
        flag.y = 1;

    if (origin.y < coord.y || origin.y > coord.y +coord.ylen)
        flag.x = 0;

    else if(flag.x == 0)
        flag.x = 1;

//x axis
if(flag.x == 1 ){
    var x = lines(coord.x,origin.y,coord.x + coord.xlen,origin.y);
    svg.appendChild(x);


    var temp = origin.x - 0;

    for(var i = Math.ceil(values.xstart);i<=values.xend;i++){
        x = lines(Math.round(i)*ratio.x+temp,origin.y-10,Math.round(i)*ratio.x+temp,origin.y+10);
        svg.appendChild(x);
        x = text( Math.round(i)*ratio.x+temp,origin.y+20,Math.round(i));
        svg.appendChild(x);
    }
//adds text to bottom of graph text is 'x axis'
    x = text(coord.x+coord.xlen/2,origin.y+40,"x axis");
    //svg.appendChild(x);
}
//y axis
if(flag.y == 1){
    x = lines(origin.x,coord.y,origin.x,coord.y + coord.ylen);
    svg.appendChild(x);

    //lines on y axis
    temp = origin.y - 0;

    for(i =Math.ceil(values.ystart); i<=values.yend ;i++){
        x = lines(origin.x,temp-Math.round(i)*ratio.y,origin.x+10,temp-Math.round(i)*ratio.y);
        svg.appendChild(x);
        x = text(origin.x-20,temp-Math.round(i)*ratio.y,Math.round(i));
        svg.appendChild(x);
    }


//adds the text 'y axis' to y axis
    x = text(origin.x-20,coord.y - coord.ylen/2,"y axis");
    svg.appendChild(x);
    }
}


//draw the curve on the graph by giving the function and end points of the graph
function curve(coord,values,ar) {
    ratio ={
        x : coord.xlen/(values.xend - values.xstart)/1,
        y : coord.ylen/(values.yend - values.ystart)/1
    };
    border(coord);
    coordinates(coord,values);
    var height = window.innerHeight;
    var t = document.createElementNS(NS,"polyline");
    t.setAttribute('points',[]);
    t.setAttribute('fill',"none");
    for(var i = 0;i<ar.length-1;i++){

        var x1 =  origin.x + ar[i].x*ratio.x;
        var y1 = origin.y - ar[i].y*ratio.y;
        var x2 = origin.x + (ar[i +1].x)*ratio.x;
        var y2 = origin.y - ar[i+1].y*ratio.y;

        // var points = t.getAttributeNS(NS,"points");
        // points = [0,0];
        // t.setAttributeNS(NS,'points',points);

        if(x1 > coord.x && x2 < coord.x + coord.xlen)
            if(y1 < coord.y + coord.ylen && y2 > coord.y)
                if( y2 < coord.y + coord.ylen && y1 > coord.y)
            {
                var points = t.getAttribute("points");
                points += "  "+[x1,y1];
                // points += " ";
                t.setAttribute('points',points);
                // var point = svg1.createSVGPoint();
                // point.x = x1;
                // point.y = y1;
                // t.points.appendItem(point);

                // x=lines(x1,y1,x2,y2);
                // svg.appendChild(x);
            }
svg.appendChild(t);
        //
        // if(x2 >= coord.x + coord.xlen)
        //     break;
        // if(y1 < coord.y )
        //     break;
        // if(y1 <= coord.y+coord.ylen)
        // {
        //     x=lines(x1,y1,x2,y2);
        //     svg.appendChild(x);
        // }
    }
}

// for panning
var f = 0;
$(document).mousedown(function(){
    if(event.pageX > coord.x && event.pageX < coord.x + coord.xlen)
    if(event.pageY > coord.y && event.pageY < coord.y + coord.ylen){
        bpos = [event.pageX,event.pageY];
        f = 1;
    }
});

$(document).mousemove(function move(){
    if( f  == 1){

        var epos = [event.pageX,event.pageY];

        var change = [];
        change[0] = epos[0]-bpos[0];
        change[1] = epos[1]-bpos[1];
    //change[0] = 0;

        change[0] /=ratio.x;
        change[1] /= ratio.y;

        values.xstart -= change[0];
        values.xend -= change[0];

        values.ystart += change[1];
        values.yend += change[1];


        $("g").empty();

        curve(coord,values,ar);
        bpos = [event.pageX,event.pageY];
    }
});



$(document).mouseup(function move(){
    //console.log(values);
    f =0;
 });
