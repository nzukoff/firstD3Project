const w = 600, h = 300

let svg = d3.select('svg');

svg.attr("width", w)
svg.attr("height", h)

let dataset, bandScale
let checked = false

let rowConverter = (d) => {
    return {
        team: d.team, 
        wins: parseInt(d.wins), 
        color: d.color
    }
}

let toggleSort = () => {
    let sortComparer
    console.log("HERE")
    
    selectValue = d3.select('select').property('value')
    console.log("SV IS ", selectValue)
    if (selectValue === "Sort by wins" || this.checked) {        
        sortComparer = (a,b) => {
            return b.wins - a.wins
        }
    } else if (selectValue === "Sort by original order" || !this.checked) {
        sortComparer = (a,b) => {
            return a.order - b.order
        }
    }

    dataset.sort(sortComparer)
    let teamOrder = dataset.map((d)=>{return d.team})
    bandScale.domain(teamOrder)
    svg.transition()
        .duration(1000)
        .selectAll("rect")
        .delay((d,i) => {return i * 50})
        .attr("x", (d)=>{return bandScale(d.team)})
}


let barChart = (bandHeight,bandScale) => {
    svg.selectAll("rect")
        .data(dataset)
        .enter()
            .append("rect")
                .attr("x", (d,i) => {return bandScale(d.team)})
                .attr("y",  (d) => {return h - bandHeight(d.wins)})
                .attr("width", bandScale.bandwidth())
                .attr("height", (d,i) => {return bandHeight(d.wins)})
                .attr("fill", (d) => {return d.color})
                .append("title")
                    .text((d)=>{return d.team})

    
}

d3.csv("data/sports.csv", rowConverter, (error, data) => {
    if (error) {
        console.log(error)
    } else {
        dataset = data
        dataset.forEach((d,i)=>{return d.order = i})
        let teams = dataset.map((d)=>{return d.team})
        bandScale = d3.scaleBand()
            .domain(teams)
            .range([0,w])
            .padding(0.05)
        let bandHeight = d3.scaleLinear()
            .domain([0,50])
            .range([0,w])
        barChart(bandHeight,bandScale)
        
    }    
})


d3.select("#check").select('input').on("change", toggleSort)


var d1 = ["Sort by original order", "Sort by wins"];

var select = d3.select('body')
  .append('select')
  	.attr('class','select')
    .on('change',toggleSort)

var options = select
  .selectAll('option')
	.data(d1).enter()
	.append('option')
		.text(function (d) { return d; });