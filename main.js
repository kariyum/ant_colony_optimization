import {Network} from './classes/network.js';

window.onresize = () =>{
    resizeHandler();
    n.stopSimulation();
}

const n = new Network();
// init simulation can take :
// -- Number of ants
// -- Number of nodes
n.initSimulation();

// simulate would need :
// -- Boolean : 
//              drawpath
//              tracepheromone
//              drawAnts
//              tracelines
// n.simulate();
