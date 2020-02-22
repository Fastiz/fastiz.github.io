
const STROKE_SIZE = 10;

let isMouseDown = false;

let currX, currY;

let color = '#000000';

let two;

let canvas;

const DEVICE = {
    MOUSE: 0,
    TOUCH: 1
};

function drawCanvasInit(){
    canvas = document.getElementById('can');

    two = new Two({
        type: Two.Types.canvas,
        width: WIDTH,
        height: HEIGHT,
        domElement: canvas
    });

    canvas.addEventListener("mousemove", function (e) {
        draw(e, DEVICE.MOUSE);
    }, false);

    canvas.addEventListener("touchmove", function (e) {
        if (e.target === canvas) {
            e.preventDefault();
        }
        draw(e, DEVICE.TOUCH);
    }, false);

    canvas.addEventListener("mousedown", function (e) {
        changeMousePosition(true);
    }, false);

    canvas.addEventListener("touchstart", function (e) {
        if (e.target === canvas) {
            e.preventDefault();
        }
        const pos = getMousePos(e, DEVICE.TOUCH);
        currX = pos.x;
        currY = pos.y;
        changeMousePosition(true);
    }, false);

    canvas.addEventListener("mouseup", function (e) {
        changeMousePosition(false);
    }, false);

    canvas.addEventListener("touchend", function (e) {
        if (e.target === canvas) {
            e.preventDefault();
        }
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

function getMousePos(evt, device) {
    const rect = canvas.getBoundingClientRect();
    if(device === DEVICE.MOUSE){
        return {
            x: evt.clientX - rect.left,
            y: evt.clientY - rect.top
        };
    }else if(device === DEVICE.TOUCH){
        const touch = evt.touches[0];
        return {
            x: touch.clientX - rect.left,
            y: touch.clientY - rect.top
        }
    }
}

function erase(){
    two.clear();
    two.update();
}

function draw(e, device){
    if(!currX || !currY){
        currX = getMousePos(e, device);
    }

    const prevX = currX, prevY = currY;

    const pos = getMousePos(e, device);

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