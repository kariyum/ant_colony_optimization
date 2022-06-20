const alpha = 2; // distance
const beta = 4; // pheromone
export class Ant{
    constructor(){
        this.desireability = new Map();
        this.visited = new Set();
        this.cost = 0;
        this.lastNode = -1;
        this.path = new Set();
        this.deltaTime = 0;
        this.alpha = 5;
        this.beta = 4;
    }
    setAlpha(alpha){
        this.alpha = alpha;
    }
    setBeta(beta){
        this.beta = beta;
    }
    reInit(){
        this.path = new Set();
        this.visited = new Set();
        this.visited.add(this.value);
    }
    update(x = canvas.width/2, y = canvas.height/2, value = 0, distances){
        this.previousx = this.x;
        this.previousy = this.y;
        this.goalx = x;
        this.goaly = y;
        this.radius = 7;
        this.value = value;
        this.visited.add(value);
        if (this.lastNode == -1){
            this.lastNode = value;
            this.previousx = x;
            this.previousy = y;
            this.x = x;
            this.y = y;
        }else{
            if (value in this.path){
                console.log('VALUE ALREADY IN PATH.');
            }
            this.path.add(value);
            // console.log(this.path);
        }
        // console.log('Ant VALUES Updated', 'Current Value ', this.value, 'lastNode ', this.lastNode);
        
    }
    animate(nsteps){
        // console.log(this.goalx, this.x);
        const done = Math.round(this.goalx) == Math.round(this.x) && Math.round(this.goaly) == Math.round(this.y);
        // console.log(done);
        if (done){
            this.deltaTime = 0;
            return 1;
        }
        const a = (this.goaly - this.previousy) / (this.goalx - this.previousx);
        const b = this.goaly - a * this.goalx;
        this.x = this.x + (this.goalx - this.x) * Math.abs(Math.sin(Math.PI/2 * this.deltaTime/nsteps));
        // this.y = a*this.x + b;
        this.y = this.y + (this.goaly - this.y) * Math.abs(Math.sin(Math.PI/2 * this.deltaTime/nsteps));
        this.deltaTime += 1;
        return 0;
    }
    updatePosition(x, y){
        this.previousx = this.x;
        this.previousy = this.y;
        this.x = x;
        this.y = y;
    }
    draw(){
        ctx.beginPath();
        ctx.fillStyle= 'rgba(200, 65, 65, 1)';
        ctx.strokeStyle = 'rgba(0, 65, 65, 1)'
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.stroke();
        ctx.fill();
        ctx.closePath();
    }
    updateDesireability(network){
        // Update the desireability into probabilities
        let pheromoneLevel = network.pheromone;
        let nodes = network.nodes;
        let distances = network.map;
        let sum = 0;
        this.desireability.clear();
        nodes.forEach((node)=>{
            // set diserability for every edge
            // get the distance between this ant and other node
            let i = Math.max(node.value, this.value);
            let j = Math.min(node.value, this.value);
            let distance = distances[i][j];
            if (distance==0){
                return;
            }

            // get pheromone level this edge
            let pheromone = pheromoneLevel[i][j];

            // compute the desire
            let to = Math.pow((1/distance), this.alpha);
            let nu = Math.pow(pheromone, this.beta);
            let desire = to*nu;
            this.desireability.set(node.value, desire);
            // console.log("desire====", desire);
            sum+=desire;
            //console.log(desire);
        })

        // remove visited nodes from desireability map
        this.visited.forEach((key)=>{
            if (this.desireability.has(key)){
                sum-= this.desireability.get(key);
                this.desireability.delete(key);
            }
        })
        // console.log(this.desireability);
        
        // convert the desireability into probabilites
        this.desireability.forEach((value, key)=>{
            this.desireability.set(key, value/sum);
        })
        // done.
        
    }
    next(){
        function weighted_random(items, weights) {
            var i;
            var random = Math.random() * weights[weights.length - 1];
            // console.log("Reandom =", random);
            for (i = 0; i < weights.length; i++)
                if (weights[i] > random)
                    break;
            return items[i];
        }
        // loop over the ants and update the pheromone over time
        // try for 1 ant at first
        if (this.desireability.size ==0 ){
            return this.lastNode;
        }
        // console.log("Updated desireability,", this.desireability);
        let items = new Array();
        let weights = new Array();
        this.desireability.forEach((value, key)=>{
            items.push(key);
            weights.push(value);
        })
        for(let i=1; i<weights.length; i++){
            weights[i] += weights[i-1];
        }
        // console.log(weights);
        let next_node_value = weighted_random(items, weights);
        this.visited.add(next_node_value);
        // console.log(next_node_value);
        return next_node_value;
        // done
    }
    isDone(){
        return this.value == this.lastNode;
    }
    pathCost(distances){
        this.cost = 0;
        if (this.value != this.lastNode){
            console.log('Path is not yet finished.');
            return;
        }
        
        let arr = new Array();
        this.path.forEach((node)=>{
            arr.push(node);
        })
        // iterate over path array and count the cost.
        for(let i=0; i<arr.length-1; i++){
            let n = Math.max(arr[i], arr[i+1]);
            let m = Math.min(arr[i], arr[i+1]);
            this.cost += distances[n][m];
        }

        // add last edge cost
        let n = Math.max(arr[arr.length-1], arr[0]);
        let m = Math.min(arr[arr.length-1], arr[0]);
        this.cost += distances[n][m];
        return this.cost;
    }
    traceLines(network){
        const thisant = this;
        let max_distance = 0;
        let min_distance = network.map[1][0];
        network.nodes.forEach((node)=>{
            for(const key of thisant.visited){
                if (key == node.value){
                    return;
                }
            }
            // let distance = Math.sqrt(Math.pow(this.x-node.x, 2) + Math.pow(this.y-node.y, 2));
            let distance = network.map[Math.max(node.value, this.value)][Math.min(node.value, this.value)];
            if (max_distance < distance){
                max_distance = distance;
            }
            if (distance != 0){
                if (min_distance > distance){
                    min_distance = distance;
                }
            }
        })
        network.nodes.forEach((node)=>{
            for(const key of thisant.visited){
                if (key == node.value){
                    return;
                }
            }
            let x = this.x;
            let y = this.y;
            let tox = node.x;
            let toy = node.y;
            let desireability_to_prefere_near_by_town = this.alpha;
            let distance = Math.sqrt(Math.pow(this.x-node.x, 2) + Math.pow(this.y-node.y, 2));
            if (distance != 0){
                let desire = Math.pow(min_distance/distance * network.pheromone[Math.max(this.value, node.value)][Math.min(this.value, node.value)], desireability_to_prefere_near_by_town);
                this.drawLine(x, y, tox, toy, desire);
            }
        })
        let nextnode = network.getNode(this.value);
        this.drawLine(this.x, this.y, nextnode.x, nextnode.y, 1);
    }
    drawLine(x, y, tox, toy, strength = 1){
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'rgba(0, 0, 0, ' + strength.toString() + ')';
        ctx.beginPath();
        ctx.moveTo(x,y);
        ctx.lineTo(tox, toy);
        ctx.stroke();
        ctx.closePath();
    }
    releasePheromone(network){
        // for every edge we're going to update the pheromone
        // TODO: normalize the numbers since they are big compared to 1
        const cost = this.cost;
        if (cost != this.pathCost(network.map)){
            console.log('ERROR releasing pheromone before calculating the path');
            return;
        }
        if (cost == 0 ){
            console.log('ERROR COST (Releasing pheromone method) VALUE NULL');
        }
        const ph = 1150000/Math.pow(cost, 2);
        for (const [i, j] of pathNM(this.path)){
            network.pheromone[i][j] += ph;
            // console.log(i, j);
        }
        // console.log(network.pheromone);
        
    }
}
function* pathNM(path){
    // this generative function is used to facilitate the loop on edges
    let arr = new Array();
    path.forEach((node)=>{
        arr.push(node);
    })

    // iterate over path array
    for(let i=0; i<arr.length-1; i++){
        let n = Math.max(arr[i], arr[i+1]);
        let m = Math.min(arr[i], arr[i+1]);
        yield [n, m];
    }

    // add last edge cost
    let n = Math.max(arr[arr.length-1], arr[0]);
    let m = Math.min(arr[arr.length-1], arr[0]);
    yield [n,m];
}
