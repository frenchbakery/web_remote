/*
sliders.js
05. March 2023

slider functionality

Author:
Nilusink
*/
const motor0 = document.getElementById("motor0");
const motor1 = document.getElementById("motor1");
const motor12 = document.getElementById("motor12");

const label0 = document.getElementById("label0")
const label1 = document.getElementById("label1")
const label12 = document.getElementById("label12")


let current_m0 = 0;
let current_m1 = 1;


motor0.oninput = function() {
    label0.innerText = this.value;
    updateM0(this.value)
}

motor1.oninput = function() {
    label1.innerText = this.value;
}

// Update the current slider value (each time you drag the slider handle)
motor12.oninput = function() {
    motor0.value = this.value;
    motor1.value = this.value;

    label0.innerText = this.value;
    label1.innerText = this.value;
    label12.innerText = this.value;

    updateM0(this.value);
    updateM1(this.value);
}


function updateM0(velocity)
{
    const data = {
        type: "set",
        request: "motor",
        port: current_m0,
        velocity: parseInt(velocity)
    };

    let socket = new WebSocket("ws://192.168.37.207:9999");

    socket.onopen = (event) => {
        socket.send(JSON.stringify(data));
    }

    socket.onmessage = (event) => {
        console.log("result: ", JSON.parse(event.data))
    }
}

function updateM1(velocity)
{
    const data = {
        type: "set",
        request: "motor",
        port: current_m1,
        velocity: parseInt(velocity)
    };

    let socket = new WebSocket("ws://192.168.37.207:9999");

    socket.onopen = (event) => {
        socket.send(JSON.stringify(data));
    }

    socket.onmessage = (event) => {
        console.log("result: ", JSON.parse(event.data))
    }
}