window.onresize = () =>{
    resizeHandler();
    // network1.node_distribution();
    // network1.draw();
    // network1.line_tracing();
    n.init();
    n.generate();
    n.draw();
}
var radius = 20;
const alpha = 4;
const beta = 2;
class Node{
    constructor(value){
        this.value = value;
        this.update();
    }
    update(x = parseInt(canvas.width / 2), y = parseInt(canvas.height / 2), radius = 15){
        this.x = x;
        this.y = y;
        this.radius = radius;
        radius = radius;
    }
    draw(){
        // this.update();
        ctx.fillStyle= 'rgba(1,0,0, 1)';
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'rgba(0, 0, 0, 1)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.font = this.radius.toString() + 'px sans-serif';
        ctx.fillText(this.value, this.x-this.radius/3, this.y+this.radius/3);
        ctx.stroke();
        // ctx.fill();
        ctx.closePath();
        // console.log('drawn');
    }
}
class Network{
    constructor(){
        this.init();
    }
    init(){
        this.map = new Array();
        this.nodes = new Array();
        this.pheromone = new Array();
        this.ants = new Array();
        this.recentMovement = new Array();
        this.currentCost = 99999;
        this.bestPath = new Set();
    }
    addNode(node){
        this.nodes.push(node);
    }
    addMovement(origin, destination){
        let arr = new Array();
        arr.push(origin);
        arr.push(destination);
        this.recentMovement.push(arr);
    }
    getNode(node_value){
        var node_res = -1;
        this.nodes.forEach((node)=>{
            if (node.value == node_value){
                node_res = node;
                return;
            }
        })
        return node_res;
    }
    initSimulation(){
        // generate the nodes for the network
        this.generate();

        // initialize map for distances using nodes --verified.
        const calcDistance = function (n1, n2){
            return Math.sqrt(Math.pow(n1.x - n2.x, 2) + Math.pow(n1.y - n2.y, 2));
        }
        for(let i =0; i<this.nodes.length; i++){
            let arr = new Array();
            for(let j=0; j<=i; j++){
                arr.push(calcDistance(this.nodes[i], this.nodes[j]));
            }
            this.map.push(arr);
        }

        // initialize pheromone levels --verified
        for(let i =0; i<this.nodes.length; i++){
            let arr = new Array();
            for(let j=0; j<=i; j++){
                if (i==j){
                    arr.push(0);
                }else{
                    arr.push(1);
                }
            }
            this.pheromone.push(arr);
        }

        //initiliaze ants
        this.initAnts();
        this.draw();
        this.draw_ants();
    }
    generate(density = 0.002){
        function randomInt(max){
            return Math.floor(Math.random() * max);
        }
        function randomCorr(){
            return [randomInt(canvas.width-60)+30, randomInt(canvas.height-60)+30];
        }
        let nbNodes = canvas.width * canvas.width * density / 140;
        for(let i=0; i<nbNodes; i++){
            const [x, y] = randomCorr();
            const currentNode = new Node(i);
            currentNode.update(x, y);
            let bool = this.clearOverlap(currentNode);
            while(bool){
                const [x, y] = randomCorr();
                currentNode.update(x, y);
                bool = this.clearOverlap(currentNode);
            }
            this.addNode(currentNode);
        }
    }
    checkOverlap(node1, node2){
        let radius = node1.radius;
        let distance = Math.sqrt(Math.pow(node1.x-node2.x, 2) + Math.pow(node1.y-node2.y, 2));
        return distance < 10*radius; 
    }
    clearOverlap(n1){
        let res = 0;
        this.nodes.forEach((n2)=>{
            // console.log(this.checkOverlap(n1,n2));
            if (this.checkOverlap(n1,n2)==1){
                res = 1;
            };
        })
        return res;
    }
    draw(){
        this.nodes.forEach((node) => {
            node.draw();
        })
    }
    initAnts(){
        const ant1 = new Ant();
        this.ants.push(ant1);
        let r = Math.floor(Math.random()*this.nodes.length);
        ant1.update(this.nodes[r].x, this.nodes[r].y, this.nodes[r].value);
        for(let i = 0; i<10; i++){
            const ant2 = new Ant();
            this.ants.push(ant2);
            r = Math.floor(Math.random()*this.nodes.length);
            ant2.update(this.nodes[r].x, this.nodes[r].y, this.nodes[r].value);
        }
    }
    draw_ants(){
        this.ants.forEach((ant1)=>{
            // ant1.traceLines(this);
            ant1.draw();
        })
        //console.log(this.ants);
    }
    step(){
        this.ants.forEach((ant1)=>{
            ant1.updateDesireability(this);
            let next_node_value = ant1.next();
            // console.log(ant1.value);
            // console.log(next_node_value);
            let node = this.getNode(next_node_value);
            if (node == -1){
                console.log("Node not found.");
                return;
            }
            ant1.update(node.x, node.y, node.value, this.map);
            if (ant1.isDone()){
                const cost = ant1.pathCost(this.map);
                console.log("Path cost = ", cost);
                console.log("Path", ant1.path);
                if (this.currentCost > cost){
                    this.currentCost = cost;
                    this.bestPath = ant1.path;
                }
                ant1.releasePheromone(this);
            }
        })
        let done = 1;
        this.ants.forEach((ant1)=>{
            if (! ant1.isDone()){
                done = 0;
                return;
            }else{
                ant1.reInit();
            }
        })
        if (done){
            this.evaporatePheromone();
            console.log('Pheromone evaporated.', this.pheromone);
        }
        // console.log("Done=", done);
        return done;
    }
    simulate(){
        let costSet = new Set();
        function further(n){
            clearScreen();
            if (n.step()){
                costSet.add(n.currentCost);
                console.log(costSet);
            }
            n.drawPath();
            n.draw();
            n.draw_ants();
        }
        const id = setInterval(further, 1, this);
        // clearInterval(id);
    }
    drawPath(){
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'rgba(0, 0, 0, 1)';
        let path = new Array();
        this.bestPath.forEach((nodeValue)=>{
            path.push(nodeValue);
        })

        let pathTuple = new Array();
        for(let i=0; i<path.length-1; i++){
            let arr = new Array();
            arr.push(path[i]);
            arr.push(path[i+1]);
            pathTuple.push(arr);
        }
        pathTuple.push([path[path.length-1], path[0]]);

        // console.log(pathTuple);
        pathTuple.forEach(([nodevalue1, nodevalue2])=>{
            let node1 = this.getNode(nodevalue1);
            let node2 = this.getNode(nodevalue2);
            ctx.beginPath();
            ctx.moveTo(node1.x, node1.y);
            ctx.lineTo(node2.x, node2.y);
            ctx.stroke();
            ctx.closePath();

        })

    }
    evaporatePheromone(){
        // decrease 1 than evaporate by 50% than add 1
        // console.log("PHEROMONE",this.pheromone);
        for( let i=0; i<this.pheromone.length; i++){
            for (let j=0; j<i ;j++){
                this.pheromone[i][j] = (this.pheromone[i][j] - 1)*0.5 + 1;
            }
        }
    }
}
class Ant{
    constructor(){
        this.desireability = new Map();
        this.visited = new Set();
        this.cost = 0;
        this.lastNode = -1;
        this.path = new Set();
    }
    reInit(){
        this.path = new Set();
        this.visited = new Set();
        this.visited.add(this.value);
    }
    update(x = canvas.width/2, y = canvas.height/2, value = 0, distances){
        this.x = x;
        this.y = y;
        this.radius = 13;
        this.value = value;
        this.visited.add(value);
        if (this.lastNode == -1){
            this.lastNode = value;
        }else{
            if (value in this.path){
                console.log('VALUE ALREADY IN PATH.');
            }
            this.path.add(value);
            // console.log(this.path);
        }
        // console.log('Ant VALUES Updated', 'Current Value ', this.value, 'lastNode ', this.lastNode);
        
    }
    draw(){
        ctx.beginPath();
        ctx.fillStyle= 'rgba(0, 65, 65, 1)';
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
                return
            }

            // get pheromone level this edge
            let pheromone = pheromoneLevel[i][j];

            // compute the desire
            let to = Math.pow((1/distance), alpha);
            let nu = Math.pow(pheromone, beta);
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
        let max_distance = 0;
        let min_distance = network.map[1][0];
        network.nodes.forEach((node)=>{
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
            let x = this.x;
            let y = this.y;
            let tox = node.x;
            let toy = node.y;
            let desireability_to_prefere_near_by_town = 1;
            let distance = Math.sqrt(Math.pow(this.x-node.x, 2) + Math.pow(this.y-node.y, 2));
            if (distance != 0){
                let desire = Math.pow(min_distance/distance * network.pheromone[Math.max(this.value, node.value)][Math.min(this.value, node.value)], desireability_to_prefere_near_by_town);
                this.drawLine(x, y, tox, toy, desire);
            }
        })
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

        // we can normalize the numbers since they are big compared to 1.
        const cost = this.cost;
        if (cost != this.pathCost(network.map)){
            console.log('ERROR releasing pheromone without before calculating the path');
            return;
        }
        if (cost == 0 ){
            console.log('ERROR COST (Releasing pheromone method) VALUE NULL');
        }
        const ph = 3000/cost;
        for (const [i, j] of pathNM(this.path)){
            network.pheromone[i][j] += ph;
            // console.log(i, j);
        }
        // console.log(network.pheromone);
        
    }
}
function clearScreen(){
    ctx.fillStyle = 'rgba(255, 255, 255, 1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}
const n = new Network();
// n.generate();
// n.draw();
// n.initAnts();
n.initSimulation();
// n.simulate();


// setInterval(draw_frame, 500);

function* pathNM(path){
    let arr = new Array();
    path.forEach((node)=>{
        arr.push(node);
    })
    // iterate over path array and count the cost.
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
