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
document.body.style.backgroundColor = "#555";
var _colors = [new Uint8Array([255, 0, 0, 255])];
var _selectedColor = 0;
var _selectedLayer = 0;
var _layers = [];
var _w = 256;
var _h = 100;
var _lastposition = { x: 0, y: 0 };
var _zoom = 1;
var _horizontal = 0;
var _vertical = 0;
//_canvas.width = _w;
//_canvas.height = _h;
function getMargin() {
    return { x: -_w * _horizontal * _zoom / 512, y: -_h * _vertical * _zoom / 512 };
}
function update() {
    var marginX = -_w * _horizontal * _zoom / 512;
    var marginY = -_h * _vertical * _zoom / 512;
    _ctx.imageSmoothingEnabled = false;

    _ctx.fillStyle = "#555";
    _ctx.fillRect(0, 0, _canvas.width, _canvas.height);
    _ctx.fillStyle = "#fff";
    _ctx.fillRect(marginX, marginY, _w * _zoom, _h * _zoom);
    _ctx.fillStyle = "#eee";
    var size = 6;
    for (var i = 0; i < _w / size / 2 * _zoom - 1; i++) {
        for (var j = 0; j < _h / size / 2 * _zoom - 1; j++) {
            _ctx.fillRect(i * size * 2 + marginX, j * size * 2 + marginY, size, size);
            _ctx.fillRect(i * size * 2 + size + marginX, j * size * 2 + size + marginY, size, size);
        }
    }
    var y = Math.ceil(_h / size / 2 * _zoom - 1) * size * 2;
    var x = Math.ceil(_w / size / 2 * _zoom - 1) * size * 2;
    for (var i = 0; i < _w / size / 2 * _zoom - 1; i++) {
        _ctx.fillRect(i * size * 2 + marginX, y + marginY, size, _h * _zoom - y);
        //_ctx.fillRect(i * size * 2 + size, Math.ceil(_h / size / 2 * _zoom) * size * 2 + size, size, size);
    }
    _ctx.fillRect(x + marginX, y + marginY, _w * _zoom - x, _h * _zoom - y);
    for (var i = 0; i < _h / size / 2 * _zoom - 1; i++) {
        _ctx.fillRect(x + marginX, i * size * 2 + marginY, _w * _zoom - x, size);
        //_ctx.fillRect(i * size * 2 + size, Math.ceil(_h / size / 2 * _zoom) * size * 2 + size, size, size);
    }

    for (var i = 0; i < _layers.length; i++) {
        _layers[i].update();
        _ctx.drawImage(_layers[i].canvas, marginX, marginY, _w * _zoom, _h * _zoom);
    }
}
function addLayer(id) {
    var l = new Layer("draw", _w, _h, id);
    _layers.push(l);
}
addLayer(0);
addLayer(1);
updateButton();
update();
$("#zoomtext").text("zoom" + Math.floor(_zoom * 100) + "%");
function Layer(type, w, h, id) {
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
    document.getElementById("layerBox").appendChild(this.button);
    this.button.appendChild(this.icon);
    var p = document.createElement("p");
    p.innerHTML = "Layer" + id;
    this.button.appendChild(p);
    this.jbutton = $(this.button);
    this.erase();
    this.id = id;
    this.jbutton.css("background", "#eee");
    //this.jbutton.css("border", "none");
    this.jbutton.click(function (e) {
        _selectedLayer = id;
        updateButton();
    });
    //document.body.appendChild(this.canvas);
}
function updateButton() {
    for (var i = 0; i < _layers.length; i++) {
        if (i == _selectedLayer) {
            _layers[i].jbutton.css("border-style", "dashed");
            _layers[i].jbutton.css("border-color", "#f44");
            //_layers[i].button.style.backgroundColor= "#f00";
        } else {
            _layers[i].jbutton.css("border-style", "solid");
            _layers[i].jbutton.css("border-color", "#eee");
            //_layers[i].button.style.backgroundColor = "#555";
        }
    }
}
function draw(l, x, y) {
    var c = _colors[_selectedColor];
    //console.log(c[0]);
    var n = 3;
    var dx = (x - _lastposition.x);
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
    x /= _zoom;
    y /= _zoom;
   // _lastposition.x = x;
    //_lastposition.y = y;
    var marginX = -_w * _horizontal / 512;
    var marginY = -_h * _vertical / 512;
    if (0 < x && x < _canvas.width && 0 < y && y < _canvas.height) {
        x -= marginX;
        y -= marginY;
        _lastposition.x = x;
        _lastposition.y = y;
        if (0 < x && x < _w && 0 < y && y < _h) {
            draw(_layers[_selectedLayer], x, y);
        }
        e.preventDefault();
    } else {
        x -= marginX;
        y -= marginY;
        _lastposition.x = x;
        _lastposition.y = y;
        console.log("out of bounds");
    }
    console.log(_lastposition);
});
$(window).mouseup(function (e) {
    _pointerDown = false;
    update();
    e.preventDefault();
});
_jcanvas.mousemove(function (e) {
    var p = _jcanvas.offset();
    var x = e.pageX - p.left;
    var y = e.pageY - p.top;
    var marginX = -_w * _horizontal / 512;
    var marginY =- _h * _vertical / 512;
    x /= _zoom;
    y /= _zoom;

    if (0 < x && x < _canvas.width && 0 < y && y < _canvas.height) {
        x -= marginX;
        y -= marginY;
        if (0 < x && x < _w && 0 < y && y < _h) {
            if (_pointerDown) {
                draw(_layers[_selectedLayer], x, y);
                _lastposition.x = x;
                _lastposition.y = y;
            }
        }
    } else {
    }
    update();
    e.preventDefault();
});

//toolbox
$("#zoom").change(function (e) {
    _zoom = Math.pow(2, $(this).val());
    console.log(_zoom);
    $("#zoomtext").text("zoom" + Math.floor(_zoom * 100) + "%");
    update();
});

var _horizontalElement = { bg: $("#horizontal"), forward: $("#hSlider") };
function hSliderEvent(e) {
    if (_pointerDown) {
        var p = _horizontalElement.bg.position();
        _horizontal = e.pageX - p.left;
        _horizontalElement.forward.css({
            position: "absolute",
            marginLeft: 0, marginTop: 0,
            top: p.top, left: p.left + _horizontal
        });
        update();
        e.preventDefault();
    }
    e.preventDefault();
}
$("#horizontal").mousemove(hSliderEvent);
$("#horizontal").mousedown(function (e) { _pointerDown = true; hSliderEvent(e); });

var _verticalElement = { bg: $("#vertical"), forward: $("#vSlider") };
function vSliderEvent(e) {
    if (_pointerDown) {
        var p = _verticalElement.bg.position();
        _vertical = e.pageY - p.top;
        _verticalElement.forward.css({
            position: "absolute",
            marginLeft: 0, marginTop: 0,
            top: p.top + _vertical, left: p.left
        });
        update();
    }
    e.preventDefault();
}
$("#vertical").mousemove(vSliderEvent);
$("#vertical").mousedown(function (e) { _pointerDown = true; vSliderEvent(e); });
/*
$("#horizontal").draggable("disable");
$("#vertical").draggable("disable");
$("#main").draggable("disable");*/