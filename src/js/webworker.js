function getNewGrid(height, width){
    let grid = [];
    for(let i=0; i<height; i++){
        const newRow = [];
        for(let j=0; j<width; j++){
            const closestXMargin = j < width -j ? j : width - j;
            const closestYMargin = i < height - i ? i : height - i;
            newRow.push(closestXMargin < closestYMargin ? closestXMargin : closestYMargin);
        }
        grid.push(newRow);
    }
    return grid;
}

function updateGrid(grid, iPos, jPos, radius){
    for(let i=0; i<grid.length; i++) {
        for (let j = 0; j < grid[0].length; j++) {
            const distance = Math.round(Math.sqrt(Math.pow(i-iPos, 2) + Math.pow(j-jPos, 2)));
            const availableSpace = grid[i][j] < distance - radius ? grid[i][j] : distance - radius;
            grid[i][j] = availableSpace < 0 ? 0 : availableSpace;
        }
    }
}

function addCircle(grid, max, min){
    let maxFound = 0;
    let iPos=-1, jPos=-1;
    for(let i=0; i<grid.length; i++){
        for(let j=0; j<grid[0].length; j++){
            if(grid[i][j] > maxFound && grid[i][j] <= max){
                maxFound = grid[i][j];
                iPos = i;
                jPos = j;
            }
        }
    }

    if(maxFound < min)
        return null;

    const newRadius = Math.random()*(maxFound-min) + min;

    updateGrid(grid, iPos, jPos, newRadius);

    return {
        x: jPos,
        y: iPos,
        radius: newRadius
    }
}

function calculateCircleMap(maxRadius, minimumRadius, height, width){
    const grid = getNewGrid(height, width);
    const circles = [];

    let newCircle;
    while((newCircle = addCircle(grid, maxRadius, minimumRadius))){
        circles.push(newCircle);
    }

    return circles;
}

function imageDataToBooleanMatrix(imageData){

    const array = imageData.data;
    const resultMatrix = [];
    for(let i=0; i<imageData.height; i++){
        const newRow = [];
        for(let j=0; j<imageData.width; j++){
            const pos = (i*imageData.width + j)*4; //RGBA

            if(array[pos] === 0){
                newRow.push(true);
            }else{
                newRow.push(false);
            }
        }
        resultMatrix.push(newRow);
    }

    return resultMatrix;
}


function checkSurroundings(boolMatrix, circle){

    for(let i=circle.y-Math.round(circle.radius/2) ; i< circle.y+circle.radius/2; i++){
        for(let j=circle.x-Math.round(circle.radius/2); j< circle.x+circle.radius/2; j++){
            if(boolMatrix[i][j]){

                return true;
            }
        }
    }

    return false;
}

function calculate(imageData, maxRadius, minRadius, height, width) {
    postMessage({
        type: 'step',
        message: 'Retrieving pixel information of drawn image...'
    });

    const boolMatrix = imageDataToBooleanMatrix(imageData);

    postMessage({
        type: 'step',
        message: 'Filling space with circles...'
    });

    const circles = calculateCircleMap(maxRadius,minRadius,height,width);

    postMessage({
        type: 'step',
        message: 'Coloring the circles...'
    });

    circles.forEach((circle)=>{
        circle.draw = checkSurroundings(boolMatrix, circle);
    });

    return circles;
}

onmessage = function(e){
    // the passed-in data is available via e.data
    const {imageData, maxRadius, minRadius, height, width} = e.data;

    postMessage({
        type: 'done',
        circles: calculate(imageData, maxRadius, minRadius, height, width)
    });
};
