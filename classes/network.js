import { Ant } from "./ants.js";
import { Node } from "./node.js";

export class Network{
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
        const minimum_radius = 7;
        function randomInt(max){
            return Math.floor(Math.random() * max);
        }
        function randomCorr(){
            return [randomInt(canvas.width-60)+30, randomInt(canvas.height-60)+30];
        }
        let nbNodes = (canvas.width * canvas.width)/(Math.PI*Math.pow(minimum_radius,2)) * density;
        for(let i=0; i<nbNodes; i++){
            const [x, y] = randomCorr();
            const currentNode = new Node(i);
            currentNode.update(x, y);
            let bool = this.clearOverlap(currentNode);
            while(bool){
                const [x, y] = randomCorr();
                currentNode.update(x, y);
                bool = this.clearOverlap(currentNode);
                console.log('Still here');
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
        for(let i = 0; i<50; i++){
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
    traceLines(){
        this.ants.forEach((ant1)=>{
            ant1.traceLines(this);
        })
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
                // console.log("Path cost = ", cost);
                // console.log("Path", ant1.path);
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
            // console.log('Pheromone evaporated.', this.pheromone);
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
                // console.log(costSet);
            }
            n.drawPath();
            n.draw();
            // n.draw_ants();
            // n.traceLines();
            n.tracePheromonetrails();
        }
        further(this);
        this.id = setInterval(further, 1, this);
        // clearInterval(id);
    }
    drawPath(){
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'rgba(255, 0, 0, 0.3)';
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
    tracePheromonetrails(){
        // normalize the values
        let max_pheromone = 0;
        let max_array = new Array();
        this.pheromone.forEach((array)=>{
            max_array.push(array.reduce(function(a,b){
                return Math.max(a, b);
            }));
        })
        max_pheromone = max_array.reduce(function(a,b){
            return Math.max(a, b);
        });
        console.log(max_pheromone);
        ctx.lineWidth = 2;
        for( let i=0; i<this.pheromone.length; i++){
            for (let j=0; j<i ;j++){
                let opacity = (this.pheromone[i][j] - 1)/max_pheromone  ; 
                ctx.strokeStyle = 'rgba(0, 0, 0,' + opacity.toString() + ')';
                let node1 = this.getNode(i);
                let node2 = this.getNode(j);
                ctx.beginPath();
                ctx.moveTo(node1.x, node1.y);
                ctx.lineTo(node2.x, node2.y);
                ctx.stroke();
                ctx.closePath();
    
            }
        }

    }
    stopSimulation(){
        clearInterval(this.id);
    }
}
