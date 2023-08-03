// Global variables to store data and current chart type
let data = null;
let currentChartType = 'AreaChart';
let currentChart = null;
let options = {
    title: 'Graph of Causes and Number of Deaths from 2010 to 2020 in Indonesia',
    width: 900, 
    height: 500, 
    hAxis: { title: 'Year', titleTextStyle: { color: '#333', fontSize: 18 } },
    vAxis: { title: 'Number of Death', titleTextStyle: { color: '#333', fontSize: 18 } },
    colors: ['#4B0082', '#00FFFF', '#FF0000', '#ffa726'], // Ganti dengan warna yang lebih menarik
    animation: {
        startup: true,
        duration: 1000,
        easing: 'out',
    },
    titleTextStyle: {
        fontSize: 28,
        bold: true,
        color: '#000000',
        italic: true,
        fontName: 'Montserrat',
        textTrasform : 'uppercase',
        textAlign : 'center',
        textShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)',
    },
    legend: { position: 'top', textStyle: { color: '#555', fontSize: 14 } },
    backgroundColor: { fill: '#fff', stroke: '#ddd', strokeWidth: 1 },
    chartArea: { backgroundColor: '#f2f2f2' },
    is3D: true,
};

// Function to change the chart type
function changeChartType() {
    currentChartType = currentChartType === 'AreaChart' ? 'ColumnChart' : 'AreaChart';
    drawCharts(data, currentChartType);
}

// Function to draw the chart based on the chart type
function drawCharts(data, chartType) {
    var formatter = new google.visualization.NumberFormat({ pattern: '0' });
    formatter.format(data, 0); 

    var chart;
    if (chartType === 'AreaChart') {
        chart = new google.visualization.AreaChart(document.getElementById('chart'));
    } else if (chartType === 'ColumnChart') {
        chart = new google.visualization.ColumnChart(document.getElementById('chart'));
    }

    chart.draw(data, options);

    currentChart = chart;

    drawLegend(data); // Call the function to draw the legend
}

// Function to draw the legend based on the data
function drawLegend(data) {
    var legendContainer = document.getElementById('legend');
    var legendHtml = '';
    for (var i = 0; i < data.getNumberOfColumns(); i++) {
        if (i > 0) {
            var label = data.getColumnLabel(i);
            var value = data.getValue(0, i).toLocaleString();
            var color = options.colors[i - 1];
            legendHtml += '<li><span style="background-color: ' + color + ';"></span><span class="label">' + label + '</span><span class="value">' + value + '</span></li>';
        }
    }
    legendContainer.innerHTML = '<ul>' + legendHtml + '</ul>';
}

// Function to get the data from the spreadsheet using Google Sheets API
function getSpreadsheetData() {
    var spreadsheetId = '1xVC5pCDBAAPHpJ7m9o30JVPqqUBHUFtuZon537nyN6I';
    var range = 'Death!A1:D12';

    var query = new google.visualization.Query('https://docs.google.com/spreadsheets/d/' + spreadsheetId + '/gviz/tq?gid=0&range=' + range);
    query.send(handleQueryResponse);
}

// Function to handle the response and draw the chart
function handleQueryResponse(response) {
    if (response.isError()) {
        console.error('Error: ' + response.getMessage());
        return;
    }

    data = response.getDataTable();
    drawCharts(data, currentChartType); // Draw the chart when data is ready
}

// Load the Google Charts library and call getSpreadsheetData when loaded
google.charts.load('current', { packages: ['corechart'] });
google.charts.setOnLoadCallback(getSpreadsheetData);
