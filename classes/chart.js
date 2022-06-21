export class Chart{
    constructor(){
        this.values = new Array();
        this.nbIteration = 0; // number of visited paths
        this.best = 0;
        this.worst = 0;
        this.width = chartCanvas.width*0.97;
        this.height = chartCanvas.height*0.97;
        this.x = chartCanvas.width *0.02;
        this.y = chartCanvas.height * 0.04;
    }
    drawChart(arr){
        // const arr = [100, 300, 400, 200, 100, 500, 300];
        // console.log(arr);
        // const array = arr.slice(Math.max(0, arr.length-100));
        const array = arr;
        // console.log(array);
        let stepx = (this.width / array.length);
        const maxy = Math.max(...array);
        const stepy = (this.height/ (maxy));
        const miny = Math.min(...array) / this.height;
        // console.log(stepy);
        function drawLine(fromx, fromy, tox, toy, green=0){
            context.lineWidth = 1;
            if (green) context.strokeStyle = 'rgba(0,112,0,1)';
            else context.strokeStyle = 'rgba(0, 0, 0, 1)';
            context.beginPath();
            context.moveTo(fromx, fromy);
            context.lineTo(tox, toy);
            context.stroke();
            context.closePath();
        }
        const reducedArr = array.slice(Math.max(0, array.length-120), array.length);
        stepx = this.width / reducedArr.length;
        for(let i=0; i<reducedArr.length-1; i++){
            let fromx = this.x + i*stepx;
            let fromy = this.height - (this.y + reducedArr[i]*stepy - miny);
            let tox = this.x + (i+1)*stepx;
            let toy = this.height - (this.y + reducedArr[i+1]*stepy - miny); 
            drawLine(fromx, fromy, tox, toy);
            // console.log(fromx, fromy, tox, toy);
        }

        // draw low line
        drawLine(this.x, this.height - (this.y + this.height*miny*stepy - miny), this.width, this.height - (this.y + this.height*miny*stepy - miny), 1)
        // context.font = "15px Arial";
        // context.fillText("Minimum cost found = " + (miny*this.height).toString(), this.x, this.height - (this.y + this.height*miny*stepy - 2*miny));

        // draw high line
        // drawLine(this.x, this.height - (this.y + maxy*stepy - miny), this.width, this.height - (this.y + maxy*stepy - miny))
    }
    drawAxis(){
        function drawArrow(x, y, up=1){
            if (!up){
                context.beginPath();
                context.moveTo(x-5, y-5);
                context.lineTo(x, y);
                context.stroke();

                context.beginPath();
                context.moveTo(x-5, y+5);
                context.lineTo(x, y);
                context.stroke();

            }
            else{
                context.beginPath();
                context.moveTo(x-5, y+5);
                context.lineTo(x, y);
                context.stroke();

                context.beginPath();
                context.moveTo(x+5, y+5);
                context.lineTo(x, y);
                context.stroke();
            }
        }
        context.lineWidth = 1;
        context.strokeStyle = 'rgba(0, 0, 0, 1)'
        context.beginPath();
        context.moveTo(this.x, this.height);
        context.lineTo(this.width, this.height);
        context.stroke();
        drawArrow(this.width, this.height, 0);
        
        context.beginPath();
        context.moveTo(this.x, this.height);
        context.lineTo(this.x, this.y);
        context.stroke();
        drawArrow(this.x, this.y);
    }
    drawLimits(){
        context.strokeStyle = 'rgba(0, 0, 0, 1)'
        context.rect(this.x, this.y, this.width, this.height);
        context.stroke();
    }
    clear(){
        context.clearRect(0, 0, chartCanvas.width, chartCanvas.height);
    }
}