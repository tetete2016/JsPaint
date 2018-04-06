//document.body.style.margin = "0px";
//document.body.style.padding = "0px";
/*
document.body.style.backgroundColor = "#333";
var _canvas = document.getElementById("main");
var ctx = document.getElementById("main").getContext("2d");
//document.getElementById("main").width = window.innerWidth;
//document.getElementById("main").height = window.innerHeight;
var jcanvas = $("#main");
console.log(_canvas);
var _pointerDown = false;
_ctx.fillStyle = "#fff";
_ctx.fillRect(0, 0, _canvas.width, _canvas.height);
_ctx.fillStyle = "#000";*/

var _pointerDown = false;
var _canvas = document.getElementById("main");
var _ctx = _canvas.getContext("2d");
var _jcanvas = $("#main");
document.body.style.backgroundColor = "#333";
var _colors=[[255,0,0,255]];
var _selectedColor=0;
var _selectedLayer=0;
var _layers=[];
var _w=256;
var _h=256;
function update(){
    for(var i=0;i<_layers.length;i++){
        _ctx.putImageData(_layers[i].imgdata,0,0);
    }
}
_layers.push(new Layer("draw",256,256));
function Layer(type,w,h){
    this.type=type;
    this.canvas=document.createElement("canvas");
    this.w=w;
    this.h=h;
    
    this.canvas.width=w;
    this.canvas.height=h;
    document.body.appendChild(this.canvas);
    this.ctx=this.canvas.getContext("2d");
    this.ctx.fillStyle = "#fff";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = "#000";
    this.imgdata=this.ctx.getImageData(0,0,w,h);
    this.canvas.width=128;
    this.canvas.height=128;
    this.ctx.fillStyle = "#fff";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = "#000";
}

function draw(l,x,y){
    var c=_colors[_selectedColor];
    console.log(c[0]);
    var i=(x+y*l.w)*4;
    l.imgdata.data[i]=c[0];
    l.imgdata.data[i+1]=c[1];
    l.imgdata.data[i+2]=c[2];
    l.imgdata.data[i+3]=c[3];
    console.log(l.w);
    
    l.imgdata.data[0]=255;
    l.imgdata.data[0]=0;
    l.imgdata.data[0]=255;
    l.imgdata.data[0]=255;
}
$(window).mousedown(function (e) {
    _pointerDown = true;
    update();
    var p=_jcanvas.position();
    var x=e.pageX-p.left;
    var y=e.pageY-p.top;
    draw(_layers[_selectedLayer],x,y);
});
$(window).mousemove(function (e) {
    if (_pointerDown){
        var p=_jcanvas.position();
        var x=e.pageX-p.left;
        var y=e.pageY-p.top;
        draw(_layers[_selectedLayer],x,y);
        update();
    }
});
$(window).mouseup(function (e) {
    _pointerDown = false;
    update();
});