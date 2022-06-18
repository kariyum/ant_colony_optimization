import {Network} from './classes/network.js';

window.onresize = () =>{
    resizeHandler();
    n.stopSimulation();
}

const n = new Network();
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
                "<li>Now that the ant has returned to it's starting node, we will add pheromone substance on its path to communicate the path cost with other ants.</li>",
                "<li>Now we can define how likely will the ant follow the pheromone trail, that's the beta variable.</li>",
                "You can now define your own values and simulate the algorithm."

    ]
    if (at == steps.length){
        document.getElementById('steps').innerHTML = "";
        document.getElementById('next-btn').remove();
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
    document.getElementById('start-id').remove();
    // document.getElementById('simulation').innerHTML = '';
})

document.getElementById('ant-number-input').addEventListener('input', ()=>{
    document.getElementById('ant-number-value').innerHTML = Math.floor((canvas.width * canvas.width)/(Math.PI*Math.pow(7,2)) * document.getElementById('ant-number-input').value * 0.0001);
})

document.getElementById('sim-alpa-input').addEventListener('input', ()=>{
    document.getElementById('sim-alpha-value').innerHTML = document.getElementById('sim-alpa-input').value;
})

document.getElementById('sim-beta-input').addEventListener('input',()=>{
    document.getElementById('sim-beta-value').innerHTML = document.getElementById('sim-beta-input').value;
})

document.getElementById('set-btn').addEventListener('click', ()=>{
    // assign values
    
})