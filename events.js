const canvas = document.getElementById('sim');
const ctx = canvas.getContext('2d');

const chartCanvas = document.getElementById('chart');
const context = chartCanvas.getContext('2d');
function resizeHandler(){
    resize();
}
function resize(){
    canvas.width = window.innerWidth * 7/9;
    canvas.height = window.innerHeight;

    // chartCanvas.width = document.getElementById('chart-container').clientWidth;
    // chartCanvas.height = document.getElementById('chart-container').clientHeight;
}
function clearScreen(){
    ctx.fillStyle = 'rgba(255, 255, 255, 1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

resizeHandler();
