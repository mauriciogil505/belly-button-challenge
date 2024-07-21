# belly-button-challenge
## This project builds an interactive webpage and dashboard to explore and visualize data charts about biodiversity of a bacteria species found in human belly buttons.

### Project Overview
The objective is to build a dashboard that displays various visualizations based on the selected test subject ID, allowing users to explore the dataset.

### Analysis Goals
The dashboard provides the following visualizations and information:

- A horizontal bar chart showing the top 10 OTUs found in the selected individual.
- A bubble chart displaying each sample's OTU IDs and their corresponding sample values.
- A panel displaying the demographic information of the selected individual.
- An interactive dropdown menu to select different test subject IDs and update the visualizations accordingly.

### Steps
Clone the Repository in your local machine:

Copy code
git clone https://github.com/yourusername/belly-button-challenge.git
Navigate to the Project Directory:

Copy code
cd belly-button-challenge
Open the index.html File:
Open the index.html file in your web browser to view the interactive dashboard.

Launch app.js in VS Code or preferred code editor:
Edit the JavaScript file app.js to implement the logic for fetching and visualizing the data.

Run the Script:
The dashboard should automatically update with the selected test subject ID. No additional script execution is required as the app.js script runs in the browser environment.

Visualizations
Horizontal Bar Chart
Values: sample_values for the bar chart.
Labels: otu_ids for the bar chart.
Hovertext: otu_labels for the bar chart.
Bubble Chart
X Values: otu_ids for the bubble chart.
Y Values: sample_values for the bubble chart.
Marker Size: sample_values for the bubble chart.
Marker Colors: otu_ids for the bubble chart.
Text Values: otu_labels for the bubble chart.
Demographic Info Panel
Displays the metadata of the selected individual.
Updates when a new test subject ID is selected.

### Visualize results in your local browser
I used port http://localhost:8000/

The results should be visible on the web page and updated interactively.
Use git add ., git commit -m "Your commit message", and git push to push changes to the GitHub repository.

### CODE FOR HTML FILE
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Belly Button Biodiversity Dashboard</title>
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css">
    <script src="https://d3js.org/d3.v5.min.js"></script>
    <script src="https://cdn.plot.ly/plotly-latest.min.js"></script>
    <style>
        body {
            margin: 40px;
        }
        .jumbotron {
            text-align: center;
        }
        .panel {
            border: 1px solid #ddd;
            padding: 10px;
            border-radius: 5px;
        }
        .panel-heading {
            background-color: #f8f9fa;
            padding: 10px;
            border-bottom: 1px solid #ddd;
        }
        .panel-body {
            padding: 10px;
        }
    </style>
</head>
<body>
    <div class="jumbotron">
        <h1>Belly Button Biodiversity Dashboard</h1>
        <p>Use the interactive charts below to explore the dataset</p>
    </div>

    <div class="container">
        <div class="row">
            <div class="col-md-3">
                <div class="panel">
                    <div class="panel-heading">
                        <h5>Test Subject ID No.:</h5>
                        <select id="selDataset" class="form-control"></select>
                    </div>
                    <div class="panel-body">
                        <h5>Demographic Info</h5>
                        <div id="sample-metadata" class="panel panel-default"></div>
                    </div>
                </div>
            </div>
            <div class="col-md-9">
                <div id="bar" class="mb-4"></div>
                <div id="bubble"></div>
            </div>
        </div>
    </div>

    <script src="app.js"></script>
</body>
</html>

### CODE FOR JAVASCRIPT FILE
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

### Deployment of webpage via static pages offered by GitHub.
https://mauriciogil505.github.io/belly-button-challenge/

### Credits
Class Recordings, Class Study Materials, Xpert Learning Assistant, Peer discussions, Stack overflow
