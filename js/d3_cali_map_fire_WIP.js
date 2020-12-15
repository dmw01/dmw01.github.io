// made great use of this tutorial http://duspviz.mit.edu/d3-workshop/mapping-data-with-d3/

function run_d3 () {

    var inputValue = null;
    var year = ["2013", "2014", "2015", "2016", "2017", "2018", "2019", "2020"];

    // Width and Height of the whole visualization
    var width = innerWidth-40,
        height = innerHeight-40,
        div = d3.select("#incidents").append("div")
        .style("position", "relative");


    // Create SVG
    var svg = d3.select( "body" )
        .append( "svg" )
        .attr( "width", width )
        .attr( "height", height );

    // Append empty placeholder g element to the SVG
    // g will contain geometry elements
    var g = svg.append( "g" );

    // Width and Height of the whole visualization
    // Set Projection Parameters
    var mercatorProjection = d3.geoMercator()
        .scale( 3000 )
        .rotate( [-6,0] )
        .center( [-120, 37] )
        .translate( [width/2,height/2] );


    // Create GeoPath function that uses built-in D3 functionality to turn
    // lat/lon coordinates into screen coordinates
    var geoPath = d3.geoPath()
                    .projection( mercatorProjection );

    // Classic D3... Select non-existent elements, bind the data, append the elements, and apply attributes

    g.selectAll( "path" )
        .data( neighborhoods_json.features )
        .enter()
        .append( "path" )
        .attr( "fill", "#ccc" )
        .attr( "stroke", "#333")
        .attr( "d", geoPath );


    var incidents = svg.append( "g" );

    incidents.selectAll( "path" )
        .data( fires_json.features )
        .enter()
        .append( "path" )
        .attr( "fill", "#900" )
        .attr( "stroke", "#ccc" )
        .attr( "d", geoPath )
        .attr( "class", "incident") // this line links datapoints of fires_json to css class "incident"
        .on("mouseover", function(d){
            d3.select("h8").text("Name of fire: " + d.properties.Name
                            + " and acres burned: " + d.properties.AcresBurned
                            + " and year " + d.properties.StartedDateOnly);
            d3.select(this).attr("class","incident hover");
        })
        .on("mouseout", function(d){
            d3.select("h8").text("");
            d3.select(this).attr("class","incident");
        });


    // implementing slider functionality
    // a fancy return red or grey function
    function dateMatch(data, value) {
        var d = new Date(data.properties.StartedDateOnly); // pass in the start date into the Date class
        var y = d.getFullYear().toString(); // grab the year
        if (inputValue === y) {
            this.parentElement.appendChild(this);
            // alert("hey y was == inputValue for once!!!!!");
            return "red";
        } else {
            return "#999";                                  // else, make the dots grey
        };
    }

    // event listener with D3 that listens for changes in the time slider
    // when the input range changes update the value
    d3.select("#timeslide").on("input", function() {
        update(+this.value);
    });

// update the fill of each SVG of class "incident" with value
    function update(value) {
        document.getElementById("range").innerHTML=year[value]; // displays year from year array
        inputValue = year[value];
        d3.selectAll(".incident") // is this what we call the fires too?
            .attr("fill", dateMatch);
    }

    // initializes the fire incidents initially shown before slider input detected
    // searches through fires.json file (via "d" var) and goes through properties and finds the feature: "StartedDateOnly"
    function initialDate(d,i){
        var d = new Date(d.properties.StartedDateOnly); // StartedDateOnly is from the fire json
        var y = d.getFullYear().toString();
        if (y === "2013") {
            return "red";
        } else {
            return "#999";
        };
    }
}

window.onload = run_d3;