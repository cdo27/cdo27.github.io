//SVG Art
//get container by div id
const artcontainer = document.getElementById("svg-art");
const datacontainer = document.getElementById("data-vis");
const tooltip = document.getElementById("tooltip");
const svgns = "http://www.w3.org/2000/svg";

//data
const datasvg = document.createElementNS(svgns, "svg");

datasvg.setAttribute("viewBox", "0 0 650 400");
datasvg.style.width = "60%";
datasvg.style.height = "auto";
datasvg.style.border = "3px solid black";
datacontainer.appendChild(datasvg);

const bakingData = [
  { day:"Mon", hours:0, item:"", amount:0 },
  { day:"Tues", hours:0, item:"", amount:0 },
  { day:"Wed", hours:1, item:"Maple Pecan Danish", amount:2 },
  { day:"Fri", hours:1.5, item:"Salt Bread", amount:8 },
  { day:"Thurs", hours:0, item:"", amount:0 },
  { day:"Sat", hours:0.5, item:"Macademia Cookies", amount:6 },
  { day:"Sun", hours:2, item:"Mini Chicken Pot Pies", amount:8 }
];

const barWidth = 40;
const spacing = 70;
const baseline = 320;
const scale = 100;
const maxAmount = Math.max(...bakingData.map(d => d.amount));
const maxHours = Math.max(...bakingData.map(d => d.hours));

//title
const title = document.createElementNS(svgns, "text");
title.setAttribute("x", 315);
title.setAttribute("y", 40);
title.setAttribute("text-anchor", "middle");
title.setAttribute("font-size", "18");
title.setAttribute("font-weight", "bold");
title.style.fontFamily = "New Atten, sans-serif";
title.textContent = "Amount of Time Spent Baking Over the Week";
datasvg.appendChild(title);


for(let h = 0; h <= maxHours; h += 0.5){
  const y = baseline - h * scale;

  //horizontal line
  const line = document.createElementNS(svgns, "line");
  line.setAttribute("x1", 80);  
  line.setAttribute("x2", 600); 
  line.setAttribute("y1", y);
  line.setAttribute("y2", y);
  line.setAttribute("stroke", "#000"); 
  datasvg.appendChild(line);

  //y axis label
  const label = document.createElementNS(svgns, "text");
  label.setAttribute("x", 70);  
  label.setAttribute("y", y);
  label.setAttribute("text-anchor", "end");
  label.setAttribute("dominant-baseline", "middle");
  label.textContent = h + "h";
  label.setAttribute("font-size", "14");
  label.style.fontFamily = "New Atten, sans-serif";
  datasvg.appendChild(label);
}


bakingData.forEach((d, i) => {
  const x = 80 + i * spacing;
  const barHeight = d.hours * scale;
  const y = baseline - barHeight;

  //bars
  const rect = document.createElementNS(svgns,"rect");
  rect.setAttribute("x", x);
  rect.setAttribute("y", y);
  rect.setAttribute("width", barWidth);
  rect.setAttribute("height", barHeight);

  const intensity = d.amount / maxAmount; //bar color based on amount
  const color = `rgba(217,160,102,${0.3 + intensity*0.7})`;
  rect.setAttribute("fill", color);

  datasvg.appendChild(rect);

  //week label
  const dayText = document.createElementNS(svgns,"text");
  dayText.setAttribute("x", x + barWidth/2);
  dayText.setAttribute("y", baseline + 20);
  dayText.setAttribute("text-anchor","middle");
  dayText.setAttribute("font-size", "14");
  dayText.style.fontFamily = "New Atten, sans-serif";
  dayText.textContent = d.day;

  datasvg.appendChild(dayText);

//item label
//   const itemText = document.createElementNS(svgns,"text");
//   itemText.setAttribute("x", x + barWidth/2);
//   itemText.setAttribute("y", y - 5);
//   itemText.setAttribute("text-anchor","middle");
//   itemText.setAttribute("font-size","8");
//   itemText.style.fontFamily = "New Atten, sans-serif";
//   itemText.textContent = d.item;

//   datasvg.appendChild(itemText);

// interactivity, hover to see amount and what was baked
  rect.addEventListener("mousemove", (e) => {
    tooltip.style.left = e.pageX + 10 + "px";
    tooltip.style.top = e.pageY + 10 + "px";
    tooltip.style.opacity = 1;
    tooltip.textContent = d.item 
      ? `${d.item}: ${d.amount} baked, ${d.hours}h spent`
      : "No baking";
  });

  rect.addEventListener("mouseleave", () => {
    tooltip.style.opacity = 0;
  });

  //highlight bar on hover
  rect.addEventListener("mouseenter", () => {
    rect.setAttribute("stroke", "#333");
    rect.setAttribute("stroke-width", 2);
  });
  rect.addEventListener("mouseleave", () => {
    rect.removeAttribute("stroke");
    rect.removeAttribute("stroke-width");
  });


});

//art
const svg = document.createElementNS(svgns, "svg");

svg.setAttribute("viewBox", "0 0 500 250");
svg.style.width = "50%";
svg.style.height = "auto";
svg.style.border = "3px solid black";
artcontainer.appendChild(svg);

const body = document.createElementNS(svgns, "ellipse");
body.setAttribute("cx", 250);
body.setAttribute("cy", 170);
body.setAttribute("rx", 150);
body.setAttribute("ry", 90);
body.setAttribute("fill", "#c4a69f");
svg.appendChild(body);

const head = document.createElementNS(svgns, "ellipse");
head.setAttribute("cx", 160);
head.setAttribute("cy", 130);
head.setAttribute("rx", 75);
head.setAttribute("ry", 90);
head.setAttribute("fill", "#c4a69f");
head.setAttribute("transform", "rotate(-5, 200, 150)");
svg.appendChild(head);

const bottom = document.createElementNS(svgns, "rect");
bottom.setAttribute("x", 0);
bottom.setAttribute("y", 220);
bottom.setAttribute("width", 500);
bottom.setAttribute("height", 50);
bottom.setAttribute("fill", "#624a33");
svg.appendChild(bottom);

//ears
const leftEar = document.createElementNS(svgns, "path");
leftEar.setAttribute("d", "M 80, 80 L125,30 L165,80 Z"); 
leftEar.setAttribute("fill", "#c4a69f");
leftEar.setAttribute("transform", "rotate(-20, 125, 55)");
svg.appendChild(leftEar);

const rightEar = document.createElementNS(svgns, "path");
rightEar.setAttribute("d", "M130,80 L190,30 L215,80 Z");
rightEar.setAttribute("fill", "#c4a69f");
svg.appendChild(rightEar);

//tail
const tail = document.createElementNS(svgns, "path");
tail.setAttribute("d", "M400,175 C440,170 440,120 420,120");

tail.setAttribute("stroke", "#c4a69f");
tail.setAttribute("stroke-width", 25);
tail.setAttribute("fill", "none");
tail.setAttribute("stroke-linecap", "round");

svg.appendChild(tail);

//eyes
const leftEye = document.createElementNS(svgns, "circle");
leftEye.setAttribute("cx", 130);
leftEye.setAttribute("cy", 80);
leftEye.setAttribute("r", 5);
leftEye.setAttribute("fill", "#292929");

svg.appendChild(leftEye);

const rightEye = document.createElementNS(svgns, "circle");
rightEye.setAttribute("cx", 175);
rightEye.setAttribute("cy", 80);
rightEye.setAttribute("r", 5);
rightEye.setAttribute("fill", "#3f3f3f");

svg.appendChild(rightEye);

//mouth
const mouth = document.createElementNS(svgns, "path");
mouth.setAttribute("d", "M153,85 C155,70 150,95 160,90");

mouth.setAttribute("stroke", "#474747");
mouth.setAttribute("stroke-width", 5);
mouth.setAttribute("fill", "none");
mouth.setAttribute("stroke-linecap", "round");

svg.appendChild(mouth);

const rightMouth = document.createElementNS(svgns, "path");
rightMouth.setAttribute("d", "M153,85 C155,70 150,95 160,90");
rightMouth.setAttribute("stroke", "#474747");
rightMouth.setAttribute("stroke-width", 5);
rightMouth.setAttribute("fill", "none");
rightMouth.setAttribute("stroke-linecap", "round");
rightMouth.setAttribute("transform", "translate(306,0) scale(-1,1)");

svg.appendChild(rightMouth);

//whiskers
const whisker1 = document.createElementNS(svgns, "line");
whisker1.setAttribute("x1", 94);  // start X
whisker1.setAttribute("y1", 85);   // start Y
whisker1.setAttribute("x2", 83);  // end X
whisker1.setAttribute("y2", 82);   // end Y
whisker1.setAttribute("stroke", "#474747");
whisker1.setAttribute("stroke-width", 3);
whisker1.setAttribute("stroke-linecap", "round");

svg.appendChild(whisker1);

const whisker2 = document.createElementNS(svgns, "line");
whisker2.setAttribute("x1", 98);  // start X
whisker2.setAttribute("y1", 77);   // start Y
whisker2.setAttribute("x2", 86);  // end X
whisker2.setAttribute("y2", 70);   // end Y
whisker2.setAttribute("stroke", "#474747");
whisker2.setAttribute("stroke-width", 3);
whisker2.setAttribute("stroke-linecap", "round");

svg.appendChild(whisker2);

const whisker3 = document.createElementNS(svgns, "line");
whisker3.setAttribute("x1", 220);  // start X
whisker3.setAttribute("y1", 73);   // start Y
whisker3.setAttribute("x2", 200);  // end X
whisker3.setAttribute("y2", 78);   // end Y
whisker3.setAttribute("stroke", "#474747");
whisker3.setAttribute("stroke-width", 3);
whisker3.setAttribute("stroke-linecap", "round");

svg.appendChild(whisker3);

const whisker4 = document.createElementNS(svgns, "line");
whisker4.setAttribute("x1", 220);  // start X
whisker4.setAttribute("y1", 86);   // start Y
whisker4.setAttribute("x2", 200);  // end X
whisker4.setAttribute("y2", 85);   // end Y
whisker4.setAttribute("stroke", "#474747");
whisker4.setAttribute("stroke-width", 3);
whisker4.setAttribute("stroke-linecap", "round");

svg.appendChild(whisker4);


