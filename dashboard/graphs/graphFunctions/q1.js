import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

export default function getGraph1 () {
    //load the data from the external file
d3.csv("../data/customer_satisfaction.csv").then((data) => {
// Extract the Flight Distance column
const flightDistances = data.map((d) => +d["Flight Distance"]);
//render chart
renderChart(flightDistances);
//check if we got the data in the console
console.log(flightDistances);
});

function renderChart(data) {

const svgwidth = 500;
const svgheight = 500;
const padding = 50;

const svg = d3
    .select("#line_chart")
    .append("#q1Container")
    .attr("width", svgwidth)
    .attr("height", svgheight);

svg
    .append("text")
    .attr("x", "20")
    .attr("y", padding / 2)
    .attr("text-anchor", "start")
    .style("font-size", "20px")
    .text("Flight Distance");

const inner_width = svgwidth - 2 * padding;
const inner_height = svgheight - 2 * padding;

const g = svg
    .append("g")
    .attr("transform", `translate(${padding},${padding})`);

//create scales for our data (ranges and domains allowing us to visualize data)
const xscale = d3
    .scaleLinear()
    //this domain on the x axis represents the amount of data points we are looking at
    .domain([0, data.length - 1])
    //the range for the size of our graph
    .range([0, inner_width]);

const yscale = d3
    .scaleLinear()
    //our domain includes 0 to the maximum amount of distance for our graph on the y axis
    .domain([0, d3.max(data)])
    .range([inner_height, 0]);

//we are creating the axis
//the data.length on line 78 defines how many ticks there will be
//without this it will not show numbers 0 to 98 on our chart!
const xaxis = d3.axisBottom(xscale).ticks(data.length);
//this creates a y axis on the left side of the chart
//ticks(5) tells us there are 8 tick marks on the x axis
const yaxis = d3.axisLeft(yscale).ticks(8);

//adding the axis to the graph with .append()
//0 represents the x axis and inner height makes sure the x axis starts at the bottom of the
//chart for proper rendering
g.append("g")
    .attr("transform", `translate(0,${inner_height})`)
    //call renders the x axis when we are done
    .call(xaxis);

//we now add the y axis to our graph
g.append("g").call(yaxis);

//creating a line for our linear graph
const line = d3
    .line()
    //iterate through the values on the x scale with an arrow function
    .x((d, i) => xscale(i))
    .y((d) => yscale(d));

//add our newly created line
g.append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", "blue")
    .attr("stroke-width", 2)
    .attr("d", line);

//add circles for each data point
g.selectAll("circle")
    .data(data)
    .join("circle")
    .style("opacity", "60%")
    .attr("cx", (d, i) => xscale(i))
    .attr("cy", (d) => yscale(d))
    //make the radius of each point (circle) 8
    .attr("r", 4)
    .attr("fill", "red")
    //when the user hovers over the color changes
    .on("mouseover", function (event, d) {
    const tooltip = d3.select("#tooltip");
    tooltip
        .style("display", "block")
        .style("left", `${event.pageX + 10}px`)
        .style("top", `${event.pageY - 10}px`)
        .text(`Flight Distance: ${d}`);
    d3.select(this).attr("fill", "blue").attr("r", 13); // Change color to blue and enlarge radius
    })
    .on("mousemove", function (event) {
    const tooltip = d3.select("#tooltip");
    tooltip
        .style("left", `${event.pageX + 10}px`)
        .style("top", `${event.pageY - 10}px`);
    })
    .on("mouseout", function () {
    d3.select("#tooltip").style("display", "none");
    d3.select(this).attr("fill", "red").attr("r", 4); // Revert color and radius when mouse leaves
    });

//append the tooltips
g.selectAll(".label")
    .data(data)
    //.join creates text elements -> updates or even removes them based on if the data has changed
    //great for making sure that we don't have extra text elements that are empty or we do not need
    .join("text")
    .attr("class", "label")
    //by adding +4 to the label we are positioning the label to be slightly to the right of the red circles
    .attr("x", (d, i) => xscale(i) + 4)
    //the label will be slightly above the red circle
    .attr("y", (d) => yscale(d) - 10)
    //d => d is an arrow function that will return the values of our array and will create a text element
    //for each data point
    .text((d) => d)
    //we will make the font size 11px
    .style("font-size", "11px")
    .style("fill", "black");
}

}