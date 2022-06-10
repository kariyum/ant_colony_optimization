const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

function resizeHandler(){
    resize();
}
function resize(){
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
}
resizeHandler();
