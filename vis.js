import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

///global sales
makeVis1();

//Platform Sales by Year
makeVis2();

//Game Peak Sales Over Time
makeVis3();


function makeVis1() {
  const width = 800;
  const height = 600;
  const margin = { top: 40, right: 120, bottom: 100, left: 70 };

  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const svg = d3.create("svg").attr("width", width).attr("height", height);
  const visContainer = document.querySelector("#visContainer1");
  visContainer.append(svg.node());

  // margins
  const g = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

  d3.csv("data/videogames_wide.csv").then(data => {

    //calc total sales per genre and platform for sorting
    const genreTotals = d3.rollup(
    data,
    v => d3.sum(v, d => +d.Global_Sales),
    d => d.Genre
    );

    const platformTotals = d3.rollup(
    data,
    v => d3.sum(v, d => +d.Global_Sales),
    d => d.Platform
    );

    // sort genres highest to lowest
    const genres = [...new Set(data.map(d => d.Genre))]
    .sort((a, b) => genreTotals.get(b) - genreTotals.get(a));

    // sort platforms lowest to highest
    const platforms = [...new Set(data.map(d => d.Platform))]
    .sort((a, b) => platformTotals.get(a) - platformTotals.get(b));

    // calc sales by genre + platform
    const salesMap = d3.rollup(
      data,
      v => d3.sum(v, d => +d.Global_Sales),
      d => d.Genre,
      d => d.Platform
    );

    // scales
    const xScale = d3.scaleBand()
      .domain(genres)
      .range([0, innerWidth])
      .padding(0.05);

    const yScale = d3.scaleBand()
      .domain(platforms)
      .range([0, innerHeight])
      .padding(0.05);

    const colorScale = d3.scaleSequential()
      .domain([0, d3.max(data, d => +d.Global_Sales)])
      .interpolator(d3.interpolateRgb("#bfecf7", "#6786ea"));

    // x axis
    g.append("g")
      .attr("transform", `translate(0, ${innerHeight})`)
      .call(d3.axisBottom(xScale))
      .selectAll("text")
      .attr("transform", "rotate(-45)")
      .style("text-anchor", "end");

    // y axis
    g.append("g")
      .call(d3.axisLeft(yScale));

    // draw rects
    genres.forEach(genre => {
      platforms.forEach(platform => {
        const sales = salesMap.get(genre)?.get(platform) || 0;

        g.append("rect")
          .attr("x", xScale(genre))
          .attr("y", yScale(platform))
          .attr("width", xScale.bandwidth())
          .attr("height", yScale.bandwidth())
          .attr("fill", sales > 0 ? colorScale(sales) : "#f9f9f9")
          .on("mouseover", function(event) {
            d3.select(this).attr("stroke", "black").attr("stroke-width", 2);
            tooltip.style("opacity", 1)
              .html(`<strong>${genre} / ${platform}</strong><br>Sales: ${sales.toFixed(2)}M`)
              .style("left", (event.pageX + 10) + "px")
              .style("top", (event.pageY - 20) + "px");
          })
          .on("mouseout", function() {
            d3.select(this).attr("stroke", "none");
            tooltip.style("opacity", 0);
          });
      });
    });

    //LABELS
    // genre
    g.append("text")
      .attr("x", innerWidth / 2)
      .attr("y", innerHeight + margin.bottom - 30)
      .attr("text-anchor", "middle")
      .style("font-size", "13px")
      .style("font-weight", "bold")
      .style("font-family", "'Atten New', sans-serif")
      .text("Genre");

    // plat
    g.append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -innerHeight / 2)
      .attr("y", -margin.left + 12)
      .attr("text-anchor", "middle")
      .style("font-size", "13px")
      .style("font-weight", "bold")
      .style("font-family", "'Atten New', sans-serif")
      .text("Platform");


    // title
    svg.append("text")
    .attr("x", width / 2)
    .attr("y", margin.top / 2)
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    .style("font-weight", "bold")
    .style("font-family", "'Atten New', sans-serif")
    .text("Global Sales by Genre and Platform");

    // tooltip
    const tooltip = d3.select("body").append("div")
    .style("position", "absolute")
    .style("background", "rgba(0,0,0,0.75)")
    .style("color", "white")
    .style("padding", "6px 10px")
    .style("border-radius", "6px")
    .style("font-size", "13px")
    .style("font-family", "'Atten New', sans-serif")
    .style("pointer-events", "none")
    .style("opacity", 0);

    // legend dimensions
    const legendWidth = 20;
    const legendHeight = 200;
    const legendX = width - 100;
    const legendY = margin.top + 20;

    //gradient
    const defs = svg.append("defs");
    const linearGradient = defs.append("linearGradient")
      .attr("id", "legend-gradient")
      .attr("x1", "0%").attr("y1", "0%")
      .attr("x2", "0%").attr("y2", "100%"); 

    linearGradient.append("stop")
    .attr("offset", "0%")
    .attr("stop-color", "#0c0c9b"); 

    linearGradient.append("stop")
    .attr("offset", "100%")
    .attr("stop-color", "#bfecf7");

    //gradient rect
    svg.append("rect")
      .attr("x", legendX)
      .attr("y", legendY)
      .attr("width", legendWidth)
      .attr("height", legendHeight)
      .style("fill", "url(#legend-gradient)");

    // legend title
    svg.append("text")
      .attr("x", legendX + legendWidth / 2 -10)
      .attr("y", legendY - 10)
      .attr("text-anchor", "left")
      .style("font-size", "11px")
      .style("font-weight", "bold")
      .style("font-family", "'Atten New', sans-serif")
      .text("Global Sales (M)");

    // legend scale + axis
    const legendScale = d3.scaleLinear()
    .domain([300, 0])
    .range([0, legendHeight]);

    const legendAxis = d3.axisRight(legendScale)
    .tickValues([300, 200, 100]); 

    svg.append("g")
      .attr("transform", `translate(${legendX + legendWidth}, ${legendY})`)
      .call(legendAxis);

  });
}

function makeVis2() {
  const width = 800;
  const height = 600;
  const margin = { top: 40, right: 120, bottom: 100, left: 70 };

  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const svg = d3.create("svg").attr("width", width).attr("height", height);
  const visContainer = document.querySelector("#visContainer2");
  visContainer.append(svg.node());

  const g = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  d3.csv("data/videogames_wide.csv").then(data => {

    // calc sales by platform + year
    const salesMap = d3.rollup(
      data,
      v => d3.sum(v, d => +d.Global_Sales),
      d => d.Platform,
      d => d.Year
    );

    const platformTotals = d3.rollup(
      data,
      v => d3.sum(v, d => +d.Global_Sales),
      d => d.Platform
    );

    // sort platforms highest to lowest
    const platforms = [...new Set(data.map(d => d.Platform))]
      .sort((a, b) => platformTotals.get(b) - platformTotals.get(a));

    const years = [...new Set(data.map(d => d.Year))]
      .filter(y => y && +y <= 2016) // up to 2017, cause 2020 data and n/a?
      .sort();

    const xScale = d3.scaleBand()
      .domain(years)
      .range([0, innerWidth])
      .padding(0.05);

    const yScale = d3.scaleBand()
      .domain(platforms)
      .range([0, innerHeight])
      .padding(0.05);

    const maxSales = d3.max(
      platforms.flatMap(p => years.map(y => salesMap.get(p)?.get(y) || 0))
    );

    const colorScale = d3.scaleSequential()
      .domain([0, maxSales])
      .interpolator(d3.interpolateRgb("#dbeafe", "#0c0c9b"));

    // x axis
    g.append("g")
      .attr("transform", `translate(0, ${innerHeight})`)
      .call(d3.axisBottom(xScale))
      .selectAll("text")
      .attr("transform", "rotate(-45)")
      .style("text-anchor", "end");

    // y axis
    g.append("g")
      .call(d3.axisLeft(yScale));

    // draw rects
    platforms.forEach(platform => {
      years.forEach(year => {
        const sales = salesMap.get(platform)?.get(year) || 0;

        g.append("rect")
          .attr("x", xScale(year))
          .attr("y", yScale(platform))
          .attr("width", xScale.bandwidth())
          .attr("height", yScale.bandwidth())
          .attr("fill", sales > 0 ? colorScale(sales) : "#f9f9f9")
          .on("mousemove", function(event) {
            d3.select(this).attr("stroke", "black").attr("stroke-width", 2);
            tooltip.style("opacity", 1)
              .html(`<strong>${platform} / ${year}</strong><br>Sales: ${sales.toFixed(2)}M`)
              .style("left", (event.pageX + 10) + "px")
              .style("top", (event.pageY + 10) + "px");
          })
          .on("mouseout", function() {
            d3.select(this).attr("stroke", "none");
            tooltip.style("opacity", 0);
          });
      });
    });

    // year
    g.append("text")
      .attr("x", innerWidth / 2)
      .attr("y", innerHeight + margin.bottom - 50)
      .attr("text-anchor", "middle")
      .style("font-size", "13px")
      .style("font-weight", "bold")
      .style("font-family", "'Atten New', sans-serif")
      .text("Year");

    // y label
    g.append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -innerHeight / 2)
      .attr("y", -margin.left + 12)
      .attr("text-anchor", "middle")
      .style("font-size", "13px")
      .style("font-weight", "bold")
      .style("font-family", "'Atten New', sans-serif")
      .text("Platform");

    // title
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", margin.top / 2)
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .style("font-weight", "bold")
      .style("font-family", "'Atten New', sans-serif")
      .text("Platform Sales by Year");

    // tooltip
    const tooltip = d3.select("body").append("div")
      .style("position", "absolute")
      .style("background", "rgba(0,0,0,0.75)")
      .style("color", "white")
      .style("padding", "6px 10px")
      .style("border-radius", "6px")
      .style("font-size", "13px")
      .style("font-family", "'Atten New', sans-serif")
      .style("pointer-events", "none")
      .style("opacity", 0);

    // legend
    const legendWidth = 20;
    const legendHeight = 200;
    const legendX = width - 100;
    const legendY = margin.top + 20;

    const defs = svg.append("defs");
    const linearGradient = defs.append("linearGradient")
      .attr("id", "legend-gradient-2")  // unique id!
      .attr("x1", "0%").attr("y1", "0%")
      .attr("x2", "0%").attr("y2", "100%");

    linearGradient.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "#0c0c9b");

    linearGradient.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "#dbeafe");

    svg.append("rect")
      .attr("x", legendX)
      .attr("y", legendY)
      .attr("width", legendWidth)
      .attr("height", legendHeight)
      .style("fill", "url(#legend-gradient-2)");

    svg.append("text")
      .attr("x", legendX + legendWidth / 2 - 10)
      .attr("y", legendY - 10)
      .attr("text-anchor", "left")
      .style("font-size", "11px")
      .style("font-weight", "bold")
      .style("font-family", "'Atten New', sans-serif")
      .text("Total Sales (M)");

    const legendScale = d3.scaleLinear()
      .domain([200, 0])
      .range([0, legendHeight]);

    const legendAxis = d3.axisRight(legendScale)
      .tickValues([200, 150, 100, 50]);

    svg.append("g")
      .attr("transform", `translate(${legendX + legendWidth}, ${legendY})`)
      .call(legendAxis);
  });
}

function makeVis3() {
  const visContainer = document.querySelector("#visContainer3");
  const width = 850;
  const height = 500;
  const margin = { top: 40, right: 160, bottom: 80, left: 70 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const svg = d3.create("svg").attr("width", width).attr("height", height);
  visContainer.append(svg.node());

  const g = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  d3.csv("data/videogames_wide.csv").then(data => {

    // total sales by genre + year
    const salesMap = d3.rollup(
      data,
      v => d3.sum(v, d => +d.Global_Sales),
      d => d.Genre,
      d => d.Year
    );

    const genres = [...new Set(data.map(d => d.Genre))].sort();
    const years = [...new Set(data.map(d => d.Year))]
      .filter(y => y <= 2016) // up to 2016 agane cause incomplete data and n/a data
      .sort();

    //line data
    const lineData = genres.map(genre => ({
      genre,
      values: years.map(year => ({
        year,
        sales: salesMap.get(genre)?.get(year) || 0
      }))
    }));

    const xScale = d3.scalePoint()
      .domain(years)
      .range([0, innerWidth]);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(lineData, d => d3.max(d.values, v => v.sales))])
      .nice()
      .range([innerHeight, 0]);

    const colorScale = d3.scaleOrdinal()
      .domain(genres)
      .range(d3.schemeTableau10.concat(d3.schemePastel1));

    // gridlines
    g.append("g")
      .attr("class", "grid")
      .call(d3.axisLeft(yScale).tickSize(-innerWidth).tickFormat(""))
      .selectAll("line")
      .style("stroke", "#e0e0e0")
      .style("stroke-dasharray", "3,3");
    g.select(".grid .domain").remove();

    // global sales
    g.append("g")
      .attr("transform", `translate(0, ${innerHeight})`)
      .call(d3.axisBottom(xScale))
      .selectAll("text")
      .attr("transform", "rotate(-45)")
      .style("text-anchor", "end");

    // year
    g.append("g")
      .call(d3.axisLeft(yScale));

    // lines
    const line = d3.line()
      .x(d => xScale(d.year))
      .y(d => yScale(d.sales));

    // draw lines + dots
    const lineGroups = g.selectAll(".line-group")
      .data(lineData)
      .join("g")
      .attr("class", "line-group");

    lineGroups.append("path")
      .attr("class", d => `line line-${d.genre.replace(/\s+/g, '-')}`)
      .attr("fill", "none")
      .attr("stroke", d => colorScale(d.genre))
      .attr("stroke-width", 2)
      .attr("d", d => line(d.values));

    lineGroups.selectAll("circle")
      .data(d => d.values.map(v => ({ ...v, genre: d.genre })))
      .join("circle")
      .attr("cx", d => xScale(d.year))
      .attr("cy", d => yScale(d.sales))
      .attr("r", 3)
      .attr("fill", d => colorScale(d.genre))
      .on("mousemove", function(event, d) {
        tooltip.style("opacity", 1)
          .html(`<strong>${d.genre}</strong><br>Year: ${d.year}<br>Sales: ${d.sales.toFixed(2)}M`)
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY + 10) + "px");
      })
      .on("mouseout", () => tooltip.style("opacity", 0));

    // year
    g.append("text")
      .attr("x", innerWidth / 2)
      .attr("y", innerHeight + margin.bottom - 10)
      .attr("text-anchor", "middle")
      .style("font-size", "13px")
      .style("font-weight", "bold")
      .style("font-family", "'Atten New', sans-serif")
      .text("Year");

    // glob sales
    g.append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -innerHeight / 2)
      .attr("y", -margin.left + 15)
      .attr("text-anchor", "middle")
      .style("font-size", "13px")
      .style("font-weight", "bold")
      .style("font-family", "'Atten New', sans-serif")
      .text("Total Global Sales (Millions)");

    // title
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", margin.top / 2)
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .style("font-weight", "bold")
      .style("font-family", "'Atten New', sans-serif")
      .text("Genre Peak Sales Over Time");

    // legend, click to highlight
    const legend = svg.append("g")
      .attr("transform", `translate(${width - margin.right + 10}, ${margin.top})`);

    legend.append("text")
      .attr("x", 0)
      .attr("y", -10)
      .style("font-size", "13px")
      .style("font-weight", "bold")
      .style("font-family", "'Atten New', sans-serif")
      .text("Genre (Click to Highlight)");

    let activeGenre = null;

    genres.forEach((genre, i) => {
      const row = legend.append("g")
        .attr("transform", `translate(0, ${i * 22})`)
        .style("cursor", "pointer")
        .on("click", function() {
          if (activeGenre === genre) {
            // deselect — restore all
            activeGenre = null;
            lineGroups.selectAll("path").style("opacity", 1).attr("stroke-width", 2);
            lineGroups.selectAll("circle").style("opacity", 1);
            legend.selectAll("text.legend-label").style("opacity", 1);
          } else {
            // highlight selected, fade others
            activeGenre = genre;
            lineGroups.selectAll("path")
              .style("opacity", d => d.genre === genre ? 1 : 0.08)
              .attr("stroke-width", d => d.genre === genre ? 3.5 : 1);
            lineGroups.selectAll("circle")
              .style("opacity", d => d.genre === genre ? 1 : 0.08);
            legend.selectAll("text.legend-label")
              .style("opacity", d => d === genre ? 1 : 0.4);
          }
        });

      row.append("circle")
        .attr("cx", 6)
        .attr("cy", 6)
        .attr("r", 6)
        .attr("fill", colorScale(genre));

      row.append("text")
        .attr("class", "legend-label")
        .datum(genre)
        .attr("x", 18)
        .attr("y", 11)
        .style("font-size", "12px")
        .style("font-family", "'Atten New', sans-serif")
        .text(genre);
    });

    // tooltip
    const tooltip = d3.select("body").append("div")
      .style("position", "absolute")
      .style("background", "rgba(0,0,0,0.75)")
      .style("color", "white")
      .style("padding", "6px 10px")
      .style("border-radius", "6px")
      .style("font-size", "13px")
      .style("font-family", "'Atten New', sans-serif")
      .style("pointer-events", "none")
      .style("opacity", 0);
  });
}
