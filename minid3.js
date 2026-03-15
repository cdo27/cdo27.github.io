import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

let svg;
const width = 800;
const height = 600;
const duration = 800;
const maxCircles = 10;

let circles = [];
let mouseDownTime = 0;

//red ones to disppear
const colorScale = d3.scaleLinear()
    .domain([0, maxCircles - 1])
    .range(["red", "black"]);


async function prepareVis() {
    svg = d3.select("#visContainer")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .style("border", "1px solid black");
}

async function drawVis() {

    svg.on("mousedown", () => {
        mouseDownTime = Date.now();
    });

    svg.on("mouseup", (event) => {

        const clickDuration = Date.now() - mouseDownTime;
        const [mouseX, mouseY] = d3.pointer(event, svg.node());

        let radius = 5 + clickDuration / 20;
        if (radius > 60) {
            radius = 60;
        }

        if (circles.length >= maxCircles) {
            const oldCircle = circles.shift();
            oldCircle
                .transition()
                .duration(500)
                .attr("opacity", 0)
                .attr("r", 0)
                .transition()
                .remove();
        }


        const newCircle = svg
            .append("circle")
            .attr("cx", mouseX)
            .attr("cy", mouseY)
            .attr("r", 0)
            .attr("opacity", 1)
            .attr("fill", "black");

        newCircle
            .transition()
            .duration(duration / 2)
            .attr("r", radius * 1.2)
            .transition()
            .duration(duration / 2)
            .attr("r", radius)

        circles.push(newCircle);

        circles.forEach((c, i) => {
            let t = i / (circles.length - 1 || 1);
            t = 1 - t;
            const red = Math.floor(255 * t);
            c.attr("fill", `rgb(${red},0,0)`);
        });
    });
    
}


async function runApp() {
    await prepareVis();
    await drawVis();
}

runApp();