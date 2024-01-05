let sampleURL = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

d3.json(sampleURL).then(data => console.log(data));

function init() {

    // Use D3 to select the dropdown menu
    let dropdown = d3.select("#selDataset");

    // Fetch the JSON data
    d3.json(sampleURL).then((data) => {    

        // array for names 
        let names = data.names;

        // console log to check for names selection
        console.log(names);

        // Iterate through the names array and append to the dropdown
        names.forEach((name) => {
            dropdown.append("option").text(name).property("value", name);
        });

        // get the first object and assign to variable
        let first = names[0];

        // Call the functions to make each chart
        bar(first);
        bubble(first);
        demographics(first);
    });
}

// function to display bar graph
function bar(selection) {
    // Fetch the JSON data
    d3.json(sampleURL).then((data) => {

        // array of sample objects
        let samples = data.samples;

        // Filter data where id = selection value
        let filteredData = samples.filter((sample) => sample.id === selection);

        // get the first object and assign to variable
        let first = filteredData[0];
        
        // slice the top 10 values then reverse order to account for default order
        slicedValues = first.sample_values.slice(0,10).reverse();
        slicedID = first.otu_ids.slice(0,10).map((otuID) => `OTU ${otuID}`).reverse();
        slicedLabels = first.otu_labels.slice(0,10).reverse();
        
        // log to check value selections
        console.log(slicedValues);
        console.log(slicedID);
        console.log(slicedID);

        // Trace for the data for the horizontal bar chart
        let trace = [{
            x: slicedValues,
            y: slicedID,
            text: slicedLabels,
            type: "bar",            
            orientation: "h"
        }];
            
        // plot bar chart
        Plotly.newPlot("bar", trace);
    });
}

// function for bubble chart
function bubble(selection) {
    // Fetch the JSON data 
    d3.json(sampleURL).then((data) => {

        // An array of sample objects
        let samples = data.samples;
        
        // Filter data where id = selection value
        let filteredData = samples.filter((sample) => sample.id === selection);
        
        // get the first object and assign to variable
        let first = filteredData[0];

        console.log(first);
            
        // Trace for the data for the bubble chart
        let trace = [{
            x: first.otu_ids,
            y: first.sample_values,
            text: first.otu_labels,
            mode: "markers",
            marker: {
                size: first.sample_values,
                color: first.otu_ids,
                }
        }];
        
        // label x- axis
        let layout = {
            xaxis: {title: "OTU ID"}
        };
        
        // plot bubble chart
        Plotly.newPlot("bubble", trace, layout);
    });
}

// function for demographics panel
function demographics(selection) {
    // Fetch the JSON data
    d3.json(sampleURL).then((data) => {

        // array of metadata objects
        let metadata = data.metadata;

        // Filter data where id = selection value
        let filteredData = metadata.filter((meta) => meta.id == selection);
        
        // get the first object and assign to variable
        let first = filteredData[0];
        
        // log to check for value selection
        console.log(first);

        // Clear the previous entries in the demographic section when making new dropdown selection
        // Else selections will stack on top of eachother in the panel
        d3.select("#sample-metadata").html("");
    
        // Iterate through the entries array created with Object.entries()
        // returns [key, value] array then append
        Object.entries(first).forEach(([key,value]) => {
            d3.select("#sample-metadata").append("h5").text(`${key}: ${value}`);
        });

    });
}

function optionChanged(selection) {
    bar(selection);
    bubble(selection);
    demographics(selection);
}

init();