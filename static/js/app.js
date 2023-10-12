//Connect to the data source
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

const dataPromise = d3.json(url);
console.log(dataPromise);

//Populate the id dropdown
d3.json(url).then(function(data){
    const individuals = [...new Set(data.metadata.map(entry => entry.id))];
    const userSelection = document.getElementById("selDataset");
    individuals.forEach(id => {
        const option = document.createElement("option");
        option.value = id;
        option.textContent = id;
        userSelection.appendChild(option);
    });
})

// Create event listener for a change in the ID dropdown
let userSelectedID = "940";
function updateID(id){
    userSelectedID = id;
};
const selectedID = document.getElementById('selDataset');
selectedID.addEventListener('change', function(){
    const selectedOption = selectedID.value;
    console.log(selectedOption);
    updateID(selectedOption);
});

//Function for creating bar chart
function createBar(data){
    let sample_values = data[0].sample_values;
    let otu_ids = data[0].otu_ids;
    let otu_labels = data[0].otu_labels;
    var otu_ids_rename = otu_ids.map(item => "OTU" + " " + item.toString());
    //Sort data in descending order
    var sortedData = sample_values.map((value, index) => ({
        id: otu_ids_rename[index],
        labels: otu_labels[index],
        value: value,
    })).sort((a, b) => a.value - b.value);

    var top10Data = sortedData.slice(-11,-1);

    var sortedIDs = top10Data.map(item => item.id);
    var sortedLabels = top10Data.map(item => item.labels);
    var sortedValues = top10Data.map(item => item.value);

    var barDiv = document.getElementById('bar');
    var trace = [{
        y: sortedIDs,
        x: sortedValues,
        type: 'bar',
        text: sortedLabels,
        orientation: 'h'
        }];
    Plotly.newPlot(barDiv, trace);
}
//Function for creating bubble chart
function createBubble(data){
    var bubbleDiv = document.getElementById('bubble');
    let otu_ids = data[0].otu_ids;
    let sample_values = data[0].sample_values;
    var trace = [{
        x: otu_ids,
        y: sample_values,
        text: data[0].otu_labels,
        mode: 'markers',
        marker: {
          color: otu_ids,
          size: sample_values
        }
      }];
      
    var layout = {
        showlegend: false,
        xaxis: {
            title: 'OTU id'
          }
      };
    Plotly.newPlot(bubbleDiv, trace, layout);
}
//Update metadata field
function updateMeta(data){
    var metadata = document.getElementById("sample-metadata");
    let newText= "id = " + data[0].id +"<br>"+
                 "ethnicity = " + data[0].ethnicity+"<br>"+
                 "gender = " + data[0].gender+"<br>"+
                 "age = " + data[0].age+"<br>"+
                 "location = " + data[0].location+"<br>"+
                 "bbtype = " + data[0].bbtype+"<br>"+
                 "wfreq = " + data[0].wfreq
                ;
    metadata.innerHTML = newText;
}

//Initialize first graphs
d3.json(url).then(function(data){
    // Filter the data based on dropdown selections
    let sampleData = data.samples;
    const filteredData = sampleData.filter((item) => item.id == userSelectedID);
    createBar(filteredData);
    createBubble(filteredData);
    // Filter to correct metadata
    let metaData = data.metadata;
    const filteredMeta = metaData.filter((item) => item.id == userSelectedID);
    updateMeta(filteredMeta);
    });

//Update graphs when dropdown changes
function dropdownChange(){
    d3.json(url).then(function(data){
        // Filter the data based on dropdown selections
        let sampleData = data.samples;
        const filteredData = sampleData.filter((item) => item.id == userSelectedID);
        createBar(filteredData);
        createBubble(filteredData);
        // Filter to correct metadata
        let metaData = data.metadata;
        const filteredMeta = metaData.filter((item) => item.id == userSelectedID);
        updateMeta(filteredMeta);
        });
}