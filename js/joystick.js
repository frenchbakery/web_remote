/*
joystick.js
09. March 2023

a 2D-Joystick (derived from rslider.js)

Author:
melektron
*/


// let currVal = 0; // between -100 and 100
//const angle = 120;  // +-
//const n_rings = 19;
//let mouseDown = false;

class NoiceJoystick
{
    constructor(div_id, initialx = 0, initialy = 0, size=400)
    {
        this.size = size;
        this.div_id = div_id;
        this.raiser_id = (Math.random() * 1_000_000) + ".NoiceButton";
        this.inner_id = (Math.random() * 1_000_000) + ".NoiceButton";
        this.dot_id = (Math.random() * 1_000_000) + ".NoiceButton";
        this.on_value_change_func = (_) => {};


        document.getElementById(div_id).innerHTML = `
        <div id="${this.raiser_id}" class="circleRaiser" style="width: ${size}px; height: ${size}px;"></div>
        <canvas id="${this.inner_id}" width=${size/1.6} height=${size/1.6} class="innerCircle"></canvas>
        <div id="${this.dot_id}" class="dot" style="width: ${size / 10}px; height: ${size / 10}px;"></div>
 `

        this.valuex = initialx;
        this.valuey = initialy;

        const div = document.getElementById(this.div_id);
        div.addEventListener('mousemove', (event) => {
            this.onMouseDown(event);
        });
        div.addEventListener("mouseup", (event) => {
            this.onValueChange(0, 0, false);
        });

        this.onValueChange(initialx, initialy);
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
            this.onValueChange(x * 2 / this.size, y * 2 / this.size);
        }
    }

    onValueChange(currValX, currValY, no_callback = false)
    {
        if (isNaN(currValX) || isNaN(currValY))
        {
            currValX = this.valuex;
            currValY = this.valuey;
        }
        else
        {
            if (!no_callback)
            {
                this.on_value_change_func(currValX, currValY);
            }
            this.valuex = currValX;
            this.valuey = currValY;
        }

        const raiser = document.getElementById(this.raiser_id);
        const inner = document.getElementById(this.inner_id);
        const dot = document.getElementById(this.dot_id);

        const raiser_rect = raiser.getBoundingClientRect();
        const inner_rect = inner.getBoundingClientRect();
        const dot_rect = dot.getBoundingClientRect();
        const inner_rad = inner_rect.width / 2;

        const cen_x = inner_rect.left + inner_rect.width / 2;
        const cen_y = inner_rect.top + inner_rect.width / 2;

        let curr_perc = currValY;

        // dot position calculations
        let dot_x = cen_x - dot_rect.width / 2 + currValX * this.size / 2;
        let dot_y = cen_y - dot_rect.width / 2 + currValY * this.size / 2;

        dot.style.left = dot_x + "px";
        dot.style.top = dot_y + "px";

        // innerCircle color calculations
        // halo
        let halo;
        let halo_perc = .5 + Math.abs(curr_perc) / 2;

        if (curr_perc < 0)
        {
            halo_perc = -halo_perc;
        }

        if (currValX >= 0)
        {
            halo = `rgb(${39 * halo_perc}, ${89 * halo_perc}, ${114 * halo_perc})`;
        }
        else
        {
            halo = `rgb(${114 * halo_perc}, ${39 * halo_perc}, ${89 * halo_perc})`;
        }

        let rad_perc = halo_perc;

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
        let c;
        if (currValX >= 0)
        {
            bg = `rgb(${39 * currValX}, ${89 * currValX}, ${114 * currValX})`;
        }
        else
        {
            c = Math.abs(currValX);
            bg = `rgb(${114 * c}, ${39 * c}, ${89 * c})`;
        }

        gradient.addColorStop(Math.abs(curr_perc / 10), bg);
        gradient.addColorStop(Math.abs(curr_perc / 10) + .9, "#222");

        inner_ctx.fillStyle = gradient;
        inner_ctx.fillRect(0, 0, inner_rect.width, inner_rect.height)

        // outer rings
        

        raiser.style.left = cen_x - raiser_rect.width / 2 + "px";
        raiser.style.top = cen_y - raiser_rect.height / 2 + "px";
    }

    setValueChangeCallback(func)
    {
        this.on_value_change_func = func;
        func(this.valuex, this.valuey);
    }
}

function setPrimaryButtonState(e) {
    const flags = e.buttons !== undefined ? e.buttons : e.which;
    mouseDown = (flags & 1) === 1;
}

document.addEventListener("mousedown", setPrimaryButtonState);
document.addEventListener("mousemove", setPrimaryButtonState);
document.addEventListener("mouseup", setPrimaryButtonState);
