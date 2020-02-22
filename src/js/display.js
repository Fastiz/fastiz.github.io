
const MAX_RADIUS = 8, MIN_RADIUS = 5;

const PALETTES = {
    circle7: {
        drawingColors: ['#89994b', '#c5d277', '#b0b77a'],
        backgroundColors: ['#faa183', '#ffba51', '#fff44c', '#ffb545']
    },
    circle13: {
        drawingColors: ['#ca567d', '#f68888'],
        backgroundColors: ['#625542', '#a58f7b', '#7e6e68']
    },
    circle16: {
        drawingColors: ['#f88c48'],
        backgroundColors: ['#a0a0a0']
    },
    circle8: {
        drawingColors: ['#c6b33f', '#fbad8a'],
        backgroundColors: ['#f1d352', '#c6b33f']
    },
    circle12: {
        drawingColors: ['#a69d67', '#c5d277'],
        backgroundColors: ['#f57354', '#fcbc84']
    },
    circle9: {
        drawingColors: ['#f8863e', '#fba670'],
        backgroundColors: ['#c6b33f', '#95a993', '#f1d352', '#d5d5a7']
    },
};

let currentpalette = 'circle7';

function setPalette(obj){
    currentpalette = obj.id;
}

function webworkerMessage(worker){
    const loadingDiv = document.getElementById('loading');
    const resultDiv = document.getElementById('result');
    return (e)=>{
        const {data} = e;
        switch (data.type) {
            case 'done':
                worker.terminate();
                drawCircles(data.circles);
                loadingDiv.style.display = 'none';
                resultDiv.style.display = 'block';
                break;
            case 'step':
                const message = document.getElementById('loading-message');
                message.innerText = data.message;
                break;
        }

    }
}

function displayResult(){
    const loadingDiv = document.getElementById('loading');
    const resultDiv = document.getElementById('result');

    loadingDiv.style.display = 'block';
    resultDiv.style.display = 'none';

    const ctx = document.getElementById('can').getContext('2d');
    const imgd = ctx.getImageData(0,0,WIDTH, HEIGHT);

    const maxRadius = parseInt(document.getElementById('max-radius').value || MAX_RADIUS);
    const minRadius = parseInt(document.getElementById('min-radius').value || MIN_RADIUS);

    const worker = new Worker('./src/js/webworker.js');

    worker.postMessage({
        maxRadius,
        minRadius,
        height: HEIGHT,
        width: WIDTH,
        imageData: imgd
    });

    worker.onmessage = webworkerMessage(worker);

    worker.onerror = function(e){
        console.log(e);
    };
}


function drawCircles(circles){
    const backgroundColors = PALETTES[currentpalette].backgroundColors,
        drawingColors = PALETTES[currentpalette].drawingColors;

    const two = new Two({
        type: Two.Types.canvas,
        width: WIDTH,
        height: HEIGHT,
        domElement: document.getElementById('draw-shapes')
    });

    const background = two.makeRectangle(WIDTH/2,HEIGHT/2,WIDTH, HEIGHT);
    background.fill = '#ffffff';
    background.noStroke();

    circles.forEach((circle)=>{
        const newCircle = two.makeCircle(circle.x, circle.y, circle.radius);

        let colors;
        if(circle.draw){
            colors = drawingColors;
        }else{
            colors = backgroundColors;
        }

        newCircle.fill = colors[Math.floor(Math.random()*colors.length)];


        newCircle.noStroke();
    });


    two.update();
}























