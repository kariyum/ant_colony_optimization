import {Network} from './classes/network.js';

window.onresize = () =>{
    resizeHandler();
    n.stopSimulation();
}

const n = new Network();
n.initSimulation();
n.simulate();
