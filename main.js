//document.body.style.margin = "0px";
//document.body.style.padding = "0px";
document.body.style.backgroundColor = "#333";
var canvas = document.getElementById("main");
var ctx = document.getElementById("main").getContext("2d");
//document.getElementById("main").width = window.innerWidth;
//document.getElementById("main").height = window.innerHeight;
var jcanvas = $("#main");
console.log(canvas);
var pointerDown = false;
ctx.fillStyle = "#fff";
ctx.fillRect(0, 0, canvas.width, canvas.height);
ctx.fillStyle = "#000";
jcanvas.mousedown(function (e) {
    pointerDown = true;
});
jcanvas.mousemove(function (e) {
    if (pointerDown)
        ctx.fillRect(e.pageX - jcanvas.position().left, e.pageY - jcanvas.position().top, 5, 5);
});
jcanvas.mouseup(function (e) {
    pointerDown = false;
});