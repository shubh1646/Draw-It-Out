let socket = io();


var penColor = "black"
var brushSize = 9;




function drawLine(ctx, s_x, s_y, e_x, e_y) {
    console.log(penColor)
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.strokeStyle = penColor;
    console.log('dwaw line is called with', s_x, s_y)
    ctx.lineTo(s_x, s_y);
    ctx.stroke();
    ctx.moveTo(e_x, e_y);

}

let greenCol = document.getElementById('greenCol');
let blueCol = document.getElementById('blueCol');
let blackCol = document.getElementById('blackCol');
let redCol = document.getElementById('redCol');
let eraser = document.getElementById('eraser');
let bSize = document.getElementById('brushSize');


bSize.onchange = function () {
    console.log(bSize.value);
    brushSize = bSize.value;
}

greenCol.onclick = function () {
    socket.emit('color_change','green');
    penColor = "green"
}

blueCol.onclick = function () {
    socket.emit('color_change','blue');
    penColor = "blue"
}


blackCol.onclick = function () {
    socket.emit('color_change','black');
    penColor = "black"
}


redCol.onclick = function () {
    socket.emit('color_change','red');
    penColor = "red"
}


eraser.onclick = function () {
    socket.emit('color_change','white');
    penColor = "white"
}


// function elementScale(el) {
//     return el.offsetWidth === 0 ? 0 : (el.width / el.offsetWidth);
// }


window.addEventListener('load', () => {

    const canvas = document.querySelector('#canvas');
    const ctx = canvas.getContext("2d");
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;



    let painting = false;

    function startPosition(e) {

        painting = true;
        draw(e)

    }

    function finishPosition() {

        painting = false;

        ctx.beginPath();
        socket.emit('done')
    }

    function draw(e) {

        if (!painting) return;

        console.log("Drawing!!!")
        ctx.lineCap = 'round';


        socket.emit('draw', {
            s_x: e.clientX,
            s_y: e.clientY,
            e_x: e.clientX,
            e_y: e.clientY,
            color: penColor
        })
//var scale = elementScale(canvas);
        drawLine(ctx, e.clientX-canvas.offsetLeft, e.clientY-canvas.offsetTop, e.clientX-canvas.offsetLeft, e.clientY-canvas.offsetTop);
    }

    canvas.addEventListener('mousedown', startPosition);
    canvas.addEventListener("mouseup", finishPosition);
    canvas.addEventListener("mousemove", draw);



    socket.on('lets_draw', (data) => {
        drawLine(ctx, data.s_x-canvas.offsetLeft, data.s_y-canvas.offsetTop, data.e_x-canvas.offsetLeft, data.e_y-canvas.offsetTop);
    })


    socket.on('done', () => {
        ctx.beginPath();
    })


    socket.on('color_cchange',(data)=>{
        console.log("socket color is called")
        penColor = data;
    })
})


