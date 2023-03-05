/*
rslider.js
05. March 2023

a round slider

Author:
Nilusink
*/

// let currVal = 0; // between -100 and 100
const angle = 120;  // +-
const n_rings = 19;
let mouseDown = false;


class NoiceButton
{
    constructor(div_id, initial = 0, size=400)
    {
        this.size = size;
        this.div_id = div_id;
        this.raiser_id = (Math.random() * 1_000_000) + ".NoiceButton";
        this.inner_id = (Math.random() * 1_000_000) + ".NoiceButton";
        this.outer_id = (Math.random() * 1_000_000) + ".NoiceButton";
        this.dot_id = (Math.random() * 1_000_000) + ".NoiceButton";
        this.on_value_change_func = (_) => {};


        document.getElementById(div_id).innerHTML = `
        <div id="${this.raiser_id}" class="circleRaiser" style="width: ${size}px; height: ${size}px;"></div>
        <canvas id="${this.outer_id}" width=${size} height=${size} class="outerCircle"></canvas>
        <canvas id="${this.inner_id}" width=${size/1.6} height=${size/1.6} class="innerCircle"></canvas>
        <div id="${this.dot_id}" class="dot" style="width: ${size / 10}px; height: ${size / 10}px;"></div>
 `

        this.value = initial;

        const div = document.getElementById(this.div_id);
        div.addEventListener('mousemove', (event) => {
            this.onMouseDown(event);
        });

        this.onValueChange(initial);
        setInterval(this.onValueChange.bind(this), 20)
    }

    onMouseDown(event)
    {
        // if clicked
        if (mouseDown)
        {
            const inner = document.getElementById(this.inner_id);
            const inner_rect = inner.getBoundingClientRect();

            // get relative coordinates (to inner center)
            let x = (event.pageX - inner_rect.left) - inner_rect.width / 2;
            let y = (event.pageY - inner_rect.top) - inner_rect.height / 2;

            // calculate angle to center based on click coordinates
            let curr_angle = Math.atan(y / x) * (180 / Math.PI) - 90;

            if (x >= 0)
            {
                curr_angle += 180;
            }

            let val = (curr_angle / angle) * 100;

            val = -100 < val && val < 100 ? val : 100 * (val / Math.abs(val));

            this.onValueChange(val);
        }
    }

    onValueChange(currVal)
    {
        if (isNaN(currVal))
        {
            currVal = this.value
        }
        else
        {
            this.on_value_change_func(currVal);
            this.value = currVal;
        }

        const raiser = document.getElementById(this.raiser_id);
        const outer = document.getElementById(this.outer_id);
        const inner = document.getElementById(this.inner_id);
        const dot = document.getElementById(this.dot_id);

        const raiser_rect = raiser.getBoundingClientRect();
        const outer_rect = outer.getBoundingClientRect();
        const inner_rect = inner.getBoundingClientRect();
        const dot_rect = dot.getBoundingClientRect();
        const inner_rad = inner_rect.width / 2;

        const cen_x = inner_rect.left + inner_rect.width / 2;
        const cen_y = inner_rect.top + inner_rect.width / 2;

        const curr_perc = currVal / 100;

        // dot position calculations
        let dot_x = cen_x - dot_rect.width / 2  + Math.cos(curr_perc * (angle * (Math.PI / 180)) - Math.PI / 2) * inner_rad * .7;
        let dot_y = cen_y - dot_rect.height / 2  + Math.sin(curr_perc * (angle * (Math.PI / 180)) - Math.PI / 2) * inner_rad * .7;

        dot.style.left = dot_x + "px";
        dot.style.top = dot_y + "px";

        // innerCircle color calculations
        // halo
        let halo;
        let halo_perc = .5 + Math.abs(curr_perc) * .5
        halo_perc = Math.abs(curr_perc) > .2 ? halo_perc : .2

        if (curr_perc >= 0)
        {
            halo = `rgb(${39 * halo_perc}, ${89 * halo_perc}, ${114 * halo_perc})`;
        }
        else
        {
            halo = `rgb(${114 * halo_perc}, ${39 * halo_perc}, ${89 * halo_perc})`;
        }

        let rad_perc = Math.abs(curr_perc) > .2 ? Math.abs(curr_perc)-.2 : 0;

        inner.style.boxShadow = `0 0 ${100 * rad_perc}px ${5 * rad_perc}px ${halo}`;

        // radial gradient for background
        const inner_ctx = inner.getContext("2d");

        let gradient = inner_ctx.createRadialGradient(
            inner_rect.width / 2,
            inner_rect.height / 2,
            0,
            inner_rect.width / 2,
            inner_rect.height / 2,
            inner_rad * .9,
        );

        let bg;
        if (curr_perc >= 0)
        {
            bg = `rgb(${39 * curr_perc}, ${89 * curr_perc}, ${114 * curr_perc})`;
        }
        else
        {
            bg = `rgb(${114 * -curr_perc}, ${39 * -curr_perc}, ${89 * -curr_perc})`;
        }

        gradient.addColorStop(Math.abs(curr_perc / 10), bg);
        gradient.addColorStop(Math.abs(curr_perc / 10) + .9, "#222");

        inner_ctx.fillStyle = gradient;
        inner_ctx.fillRect(0, 0, inner_rect.width, inner_rect.height)

        // outer rings
        outer.style.left = cen_x - outer_rect.width / 2 + "px";
        outer.style.top = cen_y - outer_rect.height / 2 + "px";

        const outer_ctx = outer.getContext("2d");
        let r_col_on = "rgb(114, 39, 89)";
        if (curr_perc >=  0)
        {
            r_col_on = "rgb(39, 89, 114)";
        }
        for (let i = 0; i < n_rings; i++) {
            let ring_perc = ((2 * i + 1) / n_rings) - 1;

            let x0 = outer_rect.width / 2 + Math.cos(ring_perc * (angle * (Math.PI / 180)) - Math.PI / 2) * inner_rad * 1.1;
            let y0 = outer_rect.height / 2 + Math.sin(ring_perc * (angle * (Math.PI / 180)) - Math.PI / 2) * inner_rad * 1.1;

            let x1 = outer_rect.width / 2 + Math.cos(ring_perc * (angle * (Math.PI / 180)) - Math.PI / 2) * inner_rad * 1.4;
            let y1 = outer_rect.height / 2 + Math.sin(ring_perc * (angle * (Math.PI / 180)) - Math.PI / 2) * inner_rad * 1.4;

            outer_ctx.beginPath();
            outer_ctx.moveTo(x0, y0);
            outer_ctx.lineTo(x1, y1);

            let colored = false;
            if (curr_perc > 0 && ring_perc >= 0 && ring_perc <= curr_perc)
            {
                colored = true;
            }
            else if (curr_perc < 0 && ring_perc <= 0 && ring_perc >= curr_perc)
            {
                colored = true;
            }

            outer_ctx.lineWidth = this.size / 60;
            outer_ctx.globalAlpha = .5;
            outer_ctx.strokeStyle = colored ? r_col_on : "#000";
            outer_ctx.stroke();
        }

        raiser.style.left = cen_x - raiser_rect.width / 2 + "px";
        raiser.style.top = cen_y - raiser_rect.height / 2 + "px";
    }

    setValueChangeCallback(func)
    {
        this.on_value_change_func = func;
    }
}

function setPrimaryButtonState(e) {
    const flags = e.buttons !== undefined ? e.buttons : e.which;
    mouseDown = (flags & 1) === 1;
}

document.addEventListener("mousedown", setPrimaryButtonState);
document.addEventListener("mousemove", setPrimaryButtonState);
document.addEventListener("mouseup", setPrimaryButtonState);
