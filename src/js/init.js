const HEIGHT = 400, WIDTH = 400;


function init(){
    drawCanvasInit();
    modalInit();

    document.getElementById('download-button').onclick = function(){
        const canvas = document.getElementById("draw-shapes");
        const image = canvas.toDataURL("image/png", 1.0).replace("image/png", "image/octet-stream");
        const link = document.createElement('a');
        link.download = "generated-image.png";
        link.href = image;
        link.click();
    };

}