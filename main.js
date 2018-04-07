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
var _colors = [new Uint8Array([255, 0, 0, 255])];
var _selectedColor = 0;
var _selectedLayer = 0;
var _layers = [];
var _w = 256;
var _h = 256;
var _lastposition = { x: 0, y: 0 };

function update() {
    _ctx.fillStyle = "#fff";
    _ctx.fillRect(0, 0, _w, _h);
    _ctx.fillStyle = "#aaa";
    var size = 4;
    for (var i = 0; i < _w / size/2; i++) {
        for (var j = 0; j < _h / size / 2; j++) {
            _ctx.fillRect(i * size * 2, j * size * 2, size, size);
            _ctx.fillRect(i * size * 2 + size, j * size * 2+size,size,size);
        }
    }
    for (var i = 0; i < _layers.length; i++) {
        _layers[i].update();
        _ctx.drawImage(_layers[i].canvas, 0, 0);
    }
}
function addLayer(id) {
    var l = new Layer("draw", 256, 256,id);
    _layers.push(l);
    
}
addLayer(0);
addLayer(1);
function Layer(type, w, h,id) {
    this.type = type;
    this.canvas = document.createElement("canvas");
    this.w = w;
    this.h = h;

    this.canvas.width = w;
    this.canvas.height = h;
    this.ctx = this.canvas.getContext("2d");
    this.imgdata = this.ctx.getImageData(0, 0, w, h);
    this.erase = function () {
        for (var k = 0; k < this.imgdata.data.length; k++) {
            this.imgdata.data[k] = 0;
        }
    }
    this.icon = document.createElement("canvas");
    this.icon.width = 60;
    this.icon.height = 60 * h / w;
    this.iconctx = this.icon.getContext("2d");
    this.update = function () {
        this.ctx.putImageData(this.imgdata, 0, 0);
        this.iconctx.drawImage(this.canvas, 0, 0, this.icon.width, this.icon.height)
    }

    this.button = document.createElement("button");
    document.body.appendChild(this.button);
    this.button.appendChild(this.icon);
    this.jbutton = $(this.button);
    this.erase();
    this.id = id;
    this.jbutton.click(function (e) {
        _selectedLayer = id;
    });
    //document.body.appendChild(this.canvas);
}

function draw(l, x, y) {
    var c = _colors[_selectedColor];
    //console.log(c[0]);
    var n = 3;
    var dx = (x - _lastposition.x) ;
    var dy = (y - _lastposition.y);
    var x1 = _lastposition.x;
    var y1 = _lastposition.y;
    if (Math.abs(dx) > n) {
        n = Math.floor(Math.abs(dx));
    }
    if (Math.abs(dy) > n) {
        n = Math.floor(Math.abs(dy));
    }
    dx /= n;
    dy /= n;
    //console.log(c);
    for (var k = 0; k <= n; k++) {
        var i = (Math.round(x1) + Math.round(y1) * l.w) * 4;
        l.imgdata.data[i] = c[0];
        l.imgdata.data[i + 1] = c[1];
        l.imgdata.data[i + 2] = c[2];
        l.imgdata.data[i + 3] = c[3];
        x1 += dx;
        y1 += dy;
    }
    /*
    var i = (x + y * l.w) * 4;
    l.imgdata.data[i] = c[0];
    l.imgdata.data[i + 1] = c[1];
    l.imgdata.data[i + 2] = c[2];
    l.imgdata.data[i + 3] = c[3];*/
    console.log(l.w);
}

$(window).mousedown(function (e) {
    _pointerDown = true;
    update();
    var p = _jcanvas.position();
    var x = e.pageX - p.left;
    var y = e.pageY - p.top;
    _lastposition.x = x;
    _lastposition.y = y;
    if (0 < x && x < _canvas.width && 0 < y && y < _canvas.height) {
        draw(_layers[_selectedLayer], x, y);
    } else {
        console.log("out of bounds");
    }
});
$(window).mousemove(function (e) {
    var p = _jcanvas.position();
    var x = e.pageX - p.left;
    var y = e.pageY - p.top;
    if (0 < x && x < _canvas.width && 0 < y && y < _canvas.height) {
        if (_pointerDown) {

            draw(_layers[_selectedLayer], x, y);
            _lastposition.x = x;
            _lastposition.y = y;
            update();
        }
    } else {
    }
});
$(window).mouseup(function (e) {
    _pointerDown = false;
    update();
});