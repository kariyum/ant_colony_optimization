export class Node{
    constructor(value){
        this.value = value;
        this.update();
    }
    update(x = parseInt(canvas.width / 2), y = parseInt(canvas.height / 2), radius = 15){
        this.x = x;
        this.y = y;
        this.radius = 7;
        radius = radius;
    }
    draw(){
        // this.update();
        ctx.fillStyle= 'rgba(100,100,100, 1)';
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'rgba(0, 0, 0, 1)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.font = this.radius.toString() + 'px sans-serif';
        // ctx.fillText(this.value, this.x-this.radius/3, this.y+this.radius/3);
        ctx.stroke();
        ctx.fill();
        ctx.closePath();
        // console.log('drawn');
    }
}
