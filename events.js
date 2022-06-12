const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

function resizeHandler(){
    resize();
}
function resize(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
function clearScreen(){
    ctx.fillStyle = 'rgba(255, 255, 255, 1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}
resizeHandler();
