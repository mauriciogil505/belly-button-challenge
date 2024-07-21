// Code to READ the JSON data
// Fetch the JSON data and console log to make debugging easier
d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
    console.log("Data loaded:", data);

    // Initialize the dashboard
    function init() {
        console.log("Initializing dashboard...");

        // Populate the dropdown menu
        let dropdown = d3.select("#selDataset");
        data.names.forEach((name) => {
            dropdown.append("option").text(name).property("value", name);
        });

        console.log("Dropdown populated with names:", data.names);

        // Use the first sample to build the initial plots
        const firstSample = data.names[0];
        console.log("First sample selected:", firstSample);
        buildCharts(firstSample);
        buildMetadata(firstSample);
    }

    // Function to update the charts
    function buildCharts(sample) {
        console.log("Building charts for sample:", sample);

        let samples = data.samples.filter(s => s.id === sample)[0];
        console.log("Filtered sample data:", samples);

        let otu_ids = samples.otu_ids.slice(0, 10).reverse();
        let sample_values = samples.sample_values.slice(0, 10).reverse();
        let otu_labels = samples.otu_labels.slice(0, 10).reverse();

        console.log("Top 10 OTU IDs:", otu_ids);
        console.log("Top 10 sample values:", sample_values);
        console.log("Top 10 OTU labels:", otu_labels);

        // Bar chart
        let barData = [{
            x: sample_values,
            y: otu_ids.map(otu_id => `OTU ${otu_id}`),
            text: otu_labels,
            type: "bar",
            orientation: "h"
        }];

        let barLayout = {
            title: "Top 10 Bacteria Cultures Found",
            margin: { t: 30, l: 150 }
        };

        Plotly.newPlot("bar", barData, barLayout);
        console.log("Bar chart created");

        // Bubble chart
        let bubbleData = [{
            x: samples.otu_ids,
            y: samples.sample_values,
            text: samples.otu_labels,
            mode: "markers",
            marker: {
                size: samples.sample_values,
                color: samples.otu_ids
            }
        }];

        let bubbleLayout = {
            title: "Bacteria Cultures Per Sample",
            margin: { t: 0 },
            hovermode: "closest",
            xaxis: { title: "OTU ID" },
            margin: { t: 30 }
        };

        Plotly.newPlot("bubble", bubbleData, bubbleLayout);
        console.log("Bubble chart created");
    }

    // Function to update the metadata
    function buildMetadata(sample) {
        console.log("Building metadata for sample:", sample);

        let metadata = data.metadata.filter(m => m.id === parseInt(sample))[0];
        console.log("Filtered metadata:", metadata);

        let panel = d3.select("#sample-metadata");

        // Clear existing metadata
        panel.html("");

        // Add new metadata
        Object.entries(metadata).forEach(([key, value]) => {
            panel.append("h6").text(`${key.toUpperCase()}: ${value}`);
        });

        console.log("Metadata panel updated");
    }

    // Event listener for the dropdown menu
    d3.selectAll("#selDataset").on("change", optionChanged);

    // Function to handle change in dropdown selection
    function optionChanged() {
        let newSample = d3.select("#selDataset").property("value");
        console.log("New sample selected:", newSample);
        buildCharts(newSample);
        buildMetadata(newSample);
    }

    // Initialize the dashboard
    init();
});
// Launched in port http://localhost:8000/
