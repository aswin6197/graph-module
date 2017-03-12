var NS="http://www.w3.org/2000/svg";
var origin = {
    x:0,
    y:0
};
//create a svg tag to add elements to it later
function createSvg() {

    var svg = document.createElementNS(NS,"svg");
    svg.setAttribute('width',window.innerWidth);
    svg.setAttribute('height',window.innerHeight);
    document.body.appendChild(svg);
    return svg;
}

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

//draws the x y axises and all the markings
function coordinates(coord,values) {
var t =
origin.x =coord.x +  Math.round((0- values.xstart )/(values.xend- values.xstart)*coord.xlen);
origin.y =coord.ylen +  coord.y - Math.round((0 - values.ystart)/(values.yend - values.ystart)*coord.ylen);
//x axis
if(origin.x < coord.x)
    origin.x = coord.x;

else if(origin.x > coord.x + coord.xlen)
    origin.x = coord.x + coord.xlen;

else if (origin.y < coord.y) {
    origin.y = coord.y;
}
    else if(origin.y > coord.y +coord.ylen)
        origin.y = coord.y + coord.ylen;

var x = lines(coord.x,origin.y,coord.x + coord.xlen,origin.y);
svg.appendChild(x);

//y axis
x = lines(origin.x,coord.y,origin.x,coord.y + coord.ylen);
svg.appendChild(x);

//lines on x axis

    var temp = origin.x - 0;

for(var i = 1;i<=values.xend;i++){
    x = lines(Math.round(i)*ratio.x+temp,origin.y-10,Math.round(i)*ratio.x+temp,origin.y+10);
    svg.appendChild(x);
    x = text( Math.round(i)*ratio.x+temp,origin.y+20,Math.round(i));
    svg.appendChild(x);
}

for(i = -1;i>= values.xstart;i--){
    x = lines(Math.round(i)*ratio.x+temp,origin.y-10,Math.round(i)*ratio.x+temp,origin.y+10);
    svg.appendChild(x);
    x = text( Math.round(i)*ratio.x+temp,origin.y+20,Math.round(i));
    svg.appendChild(x);
}

//lines on y axis
 temp = origin.y - 0;

for(i = 1;i<=values.yend;i++){

    x = lines(origin.x,temp-Math.round(i)*ratio.y,origin.x+10,temp-Math.round(i)*ratio.y);
    svg.appendChild(x);
    x = text(origin.x-20,temp-Math.round(i)*ratio.y,Math.round(i));
    svg.appendChild(x);
}

for(i = -1;i>=values.ystart;i--){
    x = lines(origin.x,temp-Math.round(i)*ratio.y,origin.x+10,temp-Math.round(i)*ratio.y);
    svg.appendChild(x);
    x = text(origin.x-20,temp-Math.round(i)*ratio.y,Math.round(i));
    svg.appendChild(x);
}

//adds text to bottom of graph text is 'x axis'
x = text(coord.x+coord.xlen/2,origin.y+40,"x axis");
svg.appendChild(x);

//adds the text 'y axis' to y axis
x = text(origin.x-90,coord.y - coord.ylen/2,"y axis");
//    x.setAttribute('rotate',270);
svg.appendChild(x);
}




// x = document.createElementNS(NS,'text');
// x.setAttribute('x',100);
// x.setAttribute('y',100);
// x.textContent = "hello";
// svg.appendChild(x);

//draw the curve on the graph by giving the function and end points of the graph
function curve(coord,values,f) {

    ratio ={
        x : coord.xlen/(values.xend - values.xstart)/1,
        y : coord.ylen/(values.yend - values.ystart)/1
    };
border(coord);
coordinates(coord,values);

var height = window.innerHeight;
var i=values.xstart;

while(i <= values.xend){


    var x1 =  origin.x + i*ratio.x;
    var y1 = origin.y - f(i)*ratio.y;
    var x2 =  (i +1/ratio.x)*ratio.x +origin.x;
    var y2 = origin.y - f((i+1/ratio.x))*ratio.y;

    if(y1 < coord.y )
        break;
    if(y1 <= coord.y+coord.ylen)
    //    continue;
    {
        x=lines(x1,y1,x2,y2);
        svg.appendChild(x);
    }
    i = i+1/ratio.x;
}
}

$(document).mousedown(function(){
    bpos = [event.pageX,event.pageY];
});

$(document).mouseup(function(){
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


    $("svg").empty();
    curve(coord,values,f1);
    //curve(coord,values,f1)
});
