import {Network} from './classes/network.js';

window.onresize = () =>{
    // resizeHandler();
    n.stopSimulation();
}

const n = new Network();
let valuesSet = 0;
let nodesSet = 0;
let antsSet = 0;
let alphaSet = 0;
let betaSet = 0;
// init simulation can take :
// -- Number of ants
// -- Number of nodes
const numberofants = 1;
const density = 0.002;
// n.initSimulation(numberofants, density);

// simulate would need :
// -- alpha
// -- beta
// -- Boolean : 
//              drawpath
//              tracepheromone
//              drawAnts
//              tracelines
// n.simulate();

function play1ant(){
    // initialize the network with 1 ant
    // speed must take into consideration the FPS ...
    n.initSimulation(1, 0.002);

}
var at = 0;
var next_btn = 0;
document.getElementById('start-id').addEventListener('click', ()=>{
    play1ant();
    nextFunction();
    if (next_btn == 0){
        let nextbutton = document.createElement('button');
        nextbutton.innerHTML = 'Next';
        nextbutton.addEventListener('click', ()=>{
            nextFunction();
        })
        document.getElementById('next-btn').appendChild(nextbutton);
        next_btn = 1;
    }
    document.getElementById('start-id').remove();
})

function nextFunction(){
    let steps = ['We will start by having one ant on the network. The <span style="color:red; font-weight:bold;">red</span> node.',
                "<li>Define how likely will the ant choose the nearest node, that's the alpha variable.</li><div class='range-control'><label for=''>Alpha α&nbsp;</label><input type='range' name='' id='rangealpha' min=0 max=10 step=0.01><span id='alpha-value'></span></div>",
                "",
                "<li>Now that the ant has returned to it's starting node, we will add pheromone substance on its path to communicate the path cost to other ants.</li>",
                "<li>Now we can define how likely will the ant follow the pheromone trail, that's the beta variable.</li>",
                "You can now define your own values and simulate the algorithm."

    ]
    if (at == steps.length){
        document.getElementById('steps').innerHTML = "";
        // document.getElementById('next-btn').remove();
        document.getElementById('main1').remove();
        document.getElementById('main2').remove();
        return;
    }
    // <div class='range-control'><label for=''>Beta β&nbsp;</label><input type='range' name='' id='rangebeta' min=0 max=10 step=0.1></div>
    let liTag = document.createElement('li');
    liTag.innerHTML = steps[at];
    liTag.className = 'listItem';
    if (steps[at]!="") document.getElementById('steps').appendChild(liTag);
    if (at == 1){
        n.traceLines();
        let alpharange = document.getElementById('rangealpha');
        document.getElementById('alpha-value').innerHTML = alpharange.value;
        alpharange.addEventListener('input', ()=>{
            document.getElementById('alpha-value').innerHTML = alpharange.value;
            n.setAlpha(alpharange.value);
            clearScreen();
            n.drawPath();
            n.draw();
            n.draw_ants();
            n.traceLines();
        })
    }
    at++;
    if (at == 3){
        // document.getElementById('next-btn').remove();
        // append a play button
        let playbtn = document.createElement('button');
        playbtn.innerHTML = 'Play';
        n.simulate(1);
        return;
    }

}

document.getElementById('start-id1').addEventListener('click', ()=>{
    // document.getElementById('start-id').remove();
    try{
        document.getElementById('main1').remove();
        document.getElementById('main2').remove();
    }catch(error){
        ;
    }
    document.getElementById('simulation').style.display = 'block';
    // chartCanvas.width = document.getElementById('chart-container').clientWidth;
    // chartCanvas.height = document.getElementById('chart-container').clientHeight
    // document.getElementById('simulation').innerHTML = '';
})

document.getElementById('ant-number-input').addEventListener('input', ()=>{
    // document.getElementById('ant-number-value').innerHTML = document.getElementById('ant-number-input').value;
    if (valuesSet) return;
    antsSet = 1;

    n.initAnts(document.getElementById('ant-number-input').value);
    clearScreen();
    n.draw();
    n.draw_ants();
})

document.getElementById('sim-alpa-input').addEventListener('input', ()=>{
    if (valuesSet) return;
    alphaSet = 1;
    document.getElementById('sim-alpha-value').innerHTML = document.getElementById('sim-alpa-input').value;
    clearScreen();
    n.setAlpha(document.getElementById('sim-alpa-input').value);
    n.draw();
    n.draw_ants();
    n.traceLines();
})

document.getElementById('sim-beta-input').addEventListener('input',()=>{
    betaSet = 1;
    if (valuesSet) return;
    document.getElementById('sim-beta-value').innerHTML = document.getElementById('sim-beta-input').value;
    n.setBeta(document.getElementById('sim-beta-input').value);
})

document.getElementById('node-number-input').addEventListener('input', ()=>{
    nodesSet = 1;
    if (valuesSet) return;
    document.getElementById('node-number-value').innerHTML = document.getElementById('node-number-input').value;
    n.init();
    n.initSimulation(document.getElementById('ant-number-input').value, document.getElementById('node-number-input').value * 0.0001)
})

document.getElementById('set-btn').addEventListener('click', ()=>{
    // assign values
    if (!(nodesSet && antsSet && alphaSet && betaSet)){
        document.getElementById('setmsg').innerHTML = 'Please change values then press again.';
        return;
    }
    document.getElementById('setmsg').innerHTML = '';
    n.setdrawDesireability(false);
    if (!valuesSet){
        valuesSet = 1;
        document.getElementById('set-btn').innerHTML = 'Reset values';
        n.setdrawDesireability(false);
        n.setSpeed(1);
        n.setdrawAnts(0);
        n.setdrawPheromone(document.getElementById('trace-pheromone').checked);
        n.setdrawDesireability(0);
        const costele =  document.getElementById('current-cost');
        const maxele =  document.getElementById('max-cost');
        const minele =  document.getElementById('min-cost');
        const discoveryele = document.getElementById('path-percent');
        const totalele = document.getElementById('total-number-path');
        n.simulate(0, costele, maxele, minele, discoveryele, totalele);

        console.log("Simulation started.");
        
    }
    else{
        valuesSet= 0;
        document.getElementById('set-btn').innerHTML = 'Set values';
        n.stopSimulation();
    }
})

document.getElementById('sim-speed').addEventListener('input', ()=>{
    // console.log(document.getElementById('sim-speed').value);
    let speed = document.getElementById('sim-speed').value;
    n.setSpeed(9999-speed);
})

document.getElementById('draw-ants').addEventListener('change', ()=>{
    let value = document.getElementById('draw-ants').checked;
    n.setdrawAnts(value);
})
document.getElementById('trace-pheromone').addEventListener('change', ()=>{
    let value = document.getElementById('trace-pheromone').checked;
    n.setdrawPheromone(value);
})
document.getElementById('trace-desireability').addEventListener('change', ()=>{
    let value = document.getElementById('trace-desireability').checked;
    n.setdrawDesireability(value);
})
// let m = new Network();
// m.init();
// m.initSimulation(100);
// m.simulate(0);

// const chart = new Chart();
// chart.drawLimits();
// chart.drawAxis();
// chart.drawChart();