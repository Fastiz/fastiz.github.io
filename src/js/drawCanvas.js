
const STROKE_SIZE = 10;

let isMouseDown = false;

let currX, currY;

let color = '#000000';

let two;

let canvas;

function drawCanvasInit(){
    canvas = document.getElementById('can');

    two = new Two({
        type: Two.Types.canvas,
        width: WIDTH,
        height: HEIGHT,
        domElement: canvas
    });

    canvas.addEventListener("mousemove", function (e) {
        draw(e)
    }, false);
    canvas.addEventListener("mousedown", function (e) {
        changeMousePosition(true);
    }, false);
    canvas.addEventListener("mouseup", function (e) {
        changeMousePosition(false);
    }, false);
}

function setColor(obj){
    switch (obj.id) {
        case "black":
            color = "#000000";
            break;
        case "white":
            color = "#ffffff";
            break;
    }
}

function getMousePos(evt) {
    const rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}

function erase(){
    two.clear();
    two.update();
}

function draw(e){
    if(!currX || !currY){
        currX = getMousePos(e);
    }

    const prevX = currX, prevY = currY;

    const pos = getMousePos(e);

    currX = pos.x;
    currY = pos.y;

    if(isMouseDown){
        const line = two.makeLine(prevX, prevY, currX, currY);

        line.stroke = color;

        line.linewidth = STROKE_SIZE;

        two.update();
    }
}

function changeMousePosition(newPosition){
    isMouseDown = newPosition;
}