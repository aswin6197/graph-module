var NS="http://www.w3.org/2000/svg";

var range;
var coordinate;
function copy(coord,values){
    range = values;
    coordinate = coord;
}

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

//draws the x y axises and all the markings
function coordinates(coord,values) {

copy(coord,values);
//x axis
var x = lines(coord.x,coord.y,coord.xend,coord.y);
svg.appendChild(x);

//y axis
x = lines(coord.x,coord.y,coord.x,coord.yend);
svg.appendChild(x);

//lines on x axis
var step = (coord.xend - coord.x)/(values.xend - values.xstart);

for(i = coord.x+step;i<= coord.xend;i+=step){
    x=lines(i,coord.y-10,i,coord.y+10);
    svg.appendChild(x);
}

//lines on y axis
step = (coord.y - coord.yend)/(values.yend - values.ystart);
for(i =coord.y-step; i>=coord.yend;i-=step){
    x = lines(coord.x-10,i,coord.x+10,i);
    svg.appendChild(x);
}
//adds text to bottom of graph text is 'x axis'
x = text((coord.x+coord.xend)/2,coord.y+40,"x axis");
svg.appendChild(x);

//adds the text 'y axis' to y axis
x = text(coord.x-90,(coord.y+coord.yend)/2,"y axis");
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


coordinates(coord,values);

var height = window.innerHeight;
var i=values.xstart;
ratio ={
    x : (coord.xend - coord.x)/(values.xend - values.xstart)/1,
    y : (coord.y  - coord.yend)/(values.yend - values.ystart)/1
};

while(i <= values.xend){
    var x1 =  coord.x + i*ratio.x;
    var y1 = coord.y- f(i)*ratio.y;
    var x2 =  (i +1/ratio.x)*ratio.x +coord.x;
    var y2 = coord.y - f((i+1/ratio.x))*ratio.y;

    x=lines(x1,y1,x2,y2);
    svg.appendChild(x);
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

    coord.x += change[0];
    coord.xend += change[0];

    coord.y += change[1];
    coord.yend += change[1];

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
