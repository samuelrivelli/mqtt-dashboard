// Import MQTT service
import { MQTTService } from "./mqttService.js";

// Target specific HTML items
const sideMenu = document.querySelector("aside");
const menuBtn = document.querySelector("#menu-btn");
const closeBtn = document.querySelector("#close-btn");
const themeToggler = document.querySelector(".theme-toggler");

// Holds the background color of all chart
var chartBGColor = getComputedStyle(document.body).getPropertyValue(
  "--chart-background"
);
var chartFontColor = getComputedStyle(document.body).getPropertyValue(
  "--chart-font-color"
);
var chartAxisColor = getComputedStyle(document.body).getPropertyValue(
  "--chart-axis-color"
);

/*
  Event listeners for any HTML click
*/
menuBtn.addEventListener("click", () => {
  sideMenu.style.display = "block";
});

closeBtn.addEventListener("click", () => {
  sideMenu.style.display = "none";
});

themeToggler.addEventListener("click", () => {
  document.body.classList.toggle("dark-theme-variables");
  themeToggler.querySelector("span:nth-child(1)").classList.toggle("active");
  themeToggler.querySelector("span:nth-child(2)").classList.toggle("active");

  // Update Chart background
  chartBGColor = getComputedStyle(document.body).getPropertyValue(
    "--chart-background"
  );
  chartFontColor = getComputedStyle(document.body).getPropertyValue(
    "--chart-font-color"
  );
  chartAxisColor = getComputedStyle(document.body).getPropertyValue(
    "--chart-axis-color"
  );
  updateChartsBackground();
});

/*
  Plotly.js graph and chart setup code
*/
var temperaturaHistoryDiv = document.getElementById("temperatura-history");
var phHistoryDiv = document.getElementById("ph-history");
var turbidezHistoryDiv = document.getElementById("turbidez-history");
var oxigenioHistoryDiv = document.getElementById("oxigenio-history");

var temperaturaGaugeDiv = document.getElementById("temperatura-gauge");
var phGaugeDiv = document.getElementById("ph-gauge");
var turbidezGaugeDiv = document.getElementById("turbidez-gauge");
var oxigenioGaugeDiv = document.getElementById("oxigenio-gauge");

const historyCharts = [
  temperaturaHistoryDiv,
  phHistoryDiv,
  turbidezHistoryDiv,
  oxigenioHistoryDiv,
];

const gaugeCharts = [
  temperaturaGaugeDiv,
  phGaugeDiv,
  turbidezGaugeDiv,
  oxigenioGaugeDiv,
];

// History Data
var temperaturaTrace = {
  x: [],
  y: [],
  name: "Temperatura",
  mode: "lines+markers",
  type: "line",
};
var phTrace = {
  x: [],
  y: [],
  name: "PH",
  mode: "lines+markers",
  type: "line",
};
var turbidezTrace = {
  x: [],
  y: [],
  name: "Turbidez",
  mode: "lines+markers",
  type: "line",
};
var oxigenioTrace = {
  x: [],
  y: [],
  name: "Oxigenio",
  mode: "lines+markers",
  type: "line",
};

var temperaturaLayout = {
  autosize: true,
  title: {
    text: "Temperatura",
  },
  font: {
    size: 12,
    color: chartFontColor,
    family: "poppins, san-serif",
  },
  colorway: ["#05AD86"],
  margin: { t: 40, b: 40, l: 30, r: 30, pad: 10 },
  plot_bgcolor: chartBGColor,
  paper_bgcolor: chartBGColor,
  xaxis: {
    color: chartAxisColor,
    linecolor: chartAxisColor,
    gridwidth: "2",
    autorange: true,
  },
  yaxis: {
    color: chartAxisColor,
    linecolor: chartAxisColor,
    gridwidth: "2",
    autorange: true,
  },
};
var phLayout = {
  autosize: true,
  title: {
    text: "PH",
  },
  font: {
    size: 12,
    color: chartFontColor,
    family: "poppins, san-serif",
  },
  colorway: ["#05AD86"],
  margin: { t: 40, b: 40, l: 30, r: 30, pad: 0 },
  plot_bgcolor: chartBGColor,
  paper_bgcolor: chartBGColor,
  xaxis: {
    color: chartAxisColor,
    linecolor: chartAxisColor,
    gridwidth: "2",
  },
  yaxis: {
    color: chartAxisColor,
    linecolor: chartAxisColor,
  },
};
var turbidezLayout = {
  autosize: true,
  title: {
    text: "Turbidez",
  },
  font: {
    size: 12,
    color: chartFontColor,
    family: "poppins, san-serif",
  },
  colorway: ["#05AD86"],
  margin: { t: 40, b: 40, l: 30, r: 30, pad: 0 },
  plot_bgcolor: chartBGColor,
  paper_bgcolor: chartBGColor,
  xaxis: {
    color: chartAxisColor,
    linecolor: chartAxisColor,
    gridwidth: "2",
  },
  yaxis: {
    color: chartAxisColor,
    linecolor: chartAxisColor,
  },
};
var oxigenioLayout = {
  autosize: true,
  title: {
    text: "Oxigenio",
  },
  font: {
    size: 12,
    color: chartFontColor,
    family: "poppins, san-serif",
  },
  colorway: ["#05AD86"],
  margin: { t: 40, b: 40, l: 30, r: 30, pad: 0 },
  plot_bgcolor: chartBGColor,
  paper_bgcolor: chartBGColor,
  xaxis: {
    color: chartAxisColor,
    linecolor: chartAxisColor,
    gridwidth: "2",
  },
  yaxis: {
    color: chartAxisColor,
    linecolor: chartAxisColor,
  },
};

var config = { responsive: true, displayModeBar: false };

// Event listener when page is loaded
window.addEventListener("load", (event) => {
  Plotly.newPlot(
    temperaturaHistoryDiv,
    [temperaturaTrace],
    temperaturaLayout,
    config
  );
  Plotly.newPlot(phHistoryDiv, [phTrace], phLayout, config);
  Plotly.newPlot(turbidezHistoryDiv, [turbidezTrace], turbidezLayout, config);
  Plotly.newPlot(oxigenioHistoryDiv, [oxigenioTrace], oxigenioLayout, config);

  // Get MQTT Connection
  fetchMQTTConnection();

  // Run it initially
  handleDeviceChange(mediaQuery);
});

// Gauge Data
var temperaturaData = [
  {
    domain: { x: [0, 1], y: [0, 1] },
    value: 0,
    title: { text: "Temperatura" },
    type: "indicator",
    mode: "gauge+number+delta",
    delta: { reference: 30 },
    gauge: {
      axis: { range: [null, 50] },
      steps: [
        { range: [0, 20], color: "lightgray" },
        { range: [20, 30], color: "gray" },
      ],
      threshold: {
        line: { color: "red", width: 4 },
        thickness: 0.75,
        value: 30,
      },
    },
  },
];

var phData = [
  {
    domain: { x: [0, 1], y: [0, 1] },
    value: 0,
    title: { text: "PH" },
    type: "indicator",
    mode: "gauge+number+delta",
    delta: { reference: 50 },
    gauge: {
      axis: { range: [null, 100] },
      steps: [
        { range: [0, 20], color: "lightgray" },
        { range: [20, 30], color: "gray" },
      ],
      threshold: {
        line: { color: "red", width: 4 },
        thickness: 0.75,
        value: 30,
      },
    },
  },
];

var turbidezData = [
  {
    domain: { x: [0, 1], y: [0, 1] },
    value: 0,
    title: { text: "Turbidez" },
    type: "indicator",
    mode: "gauge+number+delta",
    delta: { reference: 750 },
    gauge: {
      axis: { range: [null, 1100] },
      steps: [
        { range: [0, 300], color: "lightgray" },
        { range: [300, 700], color: "gray" },
      ],
      threshold: {
        line: { color: "red", width: 4 },
        thickness: 0.75,
        value: 30,
      },
    },
  },
];

var oxigenioData = [
  {
    domain: { x: [0, 1], y: [0, 1] },
    value: 0,
    title: { text: "Oxigenio" },
    type: "indicator",
    mode: "gauge+number+delta",
    delta: { reference: 60 },
    gauge: {
      axis: { range: [null, 150] },
      steps: [
        { range: [0, 50], color: "lightgray" },
        { range: [50, 100], color: "gray" },
      ],
      threshold: {
        line: { color: "red", width: 4 },
        thickness: 0.75,
        value: 30,
      },
    },
  },
];

var layout = { width: 300, height: 250, margin: { t: 0, b: 0, l: 0, r: 0 } };

Plotly.newPlot(temperaturaGaugeDiv, temperaturaData, layout);
Plotly.newPlot(phGaugeDiv, phData, layout);
Plotly.newPlot(turbidezGaugeDiv, turbidezData, layout);
Plotly.newPlot(oxigenioGaugeDiv, oxigenioData, layout);

// Will hold the arrays we receive from our BME280 sensor
// Temperature
let newTempXArray = [];
let newTempYArray = [];
// Humidity
let newHumidityXArray = [];
let newHumidityYArray = [];
// Pressure
let newPressureXArray = [];
let newPressureYArray = [];
// Altitude
let newAltitudeXArray = [];
let newAltitudeYArray = [];

// The maximum number of data points displayed on our scatter/line graph
let MAX_GRAPH_POINTS = 12;
let ctr = 0;

// Callback function that will retrieve our latest sensor readings and redraw our Gauge with the latest readings
function updateSensorReadings(jsonResponse) {
  console.log(typeof jsonResponse);
  console.log(jsonResponse);

  let temperatura = Number(jsonResponse.temperatura).toFixed(2);
  let ph = Number(jsonResponse.ph).toFixed(2);
  let turbidez = Number(jsonResponse.turbidez).toFixed(2);
  let oxigenio = Number(jsonResponse.oxigenio).toFixed(2);

  updateBoxes(temperatura, ph, turbidez, oxigenio);

  updateGauge(temperatura, ph, turbidez, oxigenio);

  // Update Temperature Line Chart
  updateCharts(
    temperaturaHistoryDiv,
    newTempXArray,
    newTempYArray,
    temperatura
  );
  // Update Humidity Line Chart
  updateCharts(
    phHistoryDiv,
    newHumidityXArray,
    newHumidityYArray,
    ph
  );
  // Update Pressure Line Chart
  updateCharts(
    turbidezHistoryDiv,
    newPressureXArray,
    newPressureYArray,
    turbidez
  );

  // Update Altitude Line Chart
  updateCharts(
    oxigenioHistoryDiv,
    newAltitudeXArray,
    newAltitudeYArray,
    oxigenio
  );
}

function updateBoxes(temperatura, ph, turbidez, oxigenio) {
  let temperaturaDiv = document.getElementById("temperatura");
  let phDiv = document.getElementById("ph");
  let turbidezDiv = document.getElementById("turbidez");
  let oxigenioDiv = document.getElementById("oxigenio");

  temperaturaDiv.innerHTML = temperatura + "°C";
  phDiv.innerHTML = ph + " PH";
  turbidezDiv.innerHTML = turbidez + " UNT";
  oxigenioDiv.innerHTML = oxigenio + " O2sat";
}

function updateGauge(temperatura, ph, turbidez, oxigenio) {
  var temperatura_update = {
    value: temperatura,
  };
  var ph_update = {
    value: ph,
  };
  var turbidez_update = {
    value: turbidez,
  };
  var oxigenio_update = {
    value: oxigenio,
  };
  Plotly.update(temperaturaGaugeDiv, temperatura_update);
  Plotly.update(phGaugeDiv, ph_update);
  Plotly.update(turbidezGaugeDiv, turbidez_update);
  Plotly.update(oxigenioGaugeDiv, oxigenio_update);
}

function updateCharts(lineChartDiv, xArray, yArray, sensorRead) {
  if (xArray.length >= MAX_GRAPH_POINTS) {
    xArray.shift();
  }
  if (yArray.length >= MAX_GRAPH_POINTS) {
    yArray.shift();
  }
  xArray.push(ctr++);
  yArray.push(sensorRead);

  var data_update = {
    x: [xArray],
    y: [yArray],
  };

  Plotly.update(lineChartDiv, data_update);
}

function updateChartsBackground() {
  // updates the background color of historical charts
  var updateHistory = {
    plot_bgcolor: chartBGColor,
    paper_bgcolor: chartBGColor,
    font: {
      color: chartFontColor,
    },
    xaxis: {
      color: chartAxisColor,
      linecolor: chartAxisColor,
    },
    yaxis: {
      color: chartAxisColor,
      linecolor: chartAxisColor,
    },
  };
  historyCharts.forEach((chart) => Plotly.relayout(chart, updateHistory));

  // updates the background color of gauge charts
  var gaugeHistory = {
    plot_bgcolor: chartBGColor,
    paper_bgcolor: chartBGColor,
    font: {
      color: chartFontColor,
    },
    xaxis: {
      color: chartAxisColor,
      linecolor: chartAxisColor,
    },
    yaxis: {
      color: chartAxisColor,
      linecolor: chartAxisColor,
    },
  };
  gaugeCharts.forEach((chart) => Plotly.relayout(chart, gaugeHistory));
}

const mediaQuery = window.matchMedia("(max-width: 600px)");

mediaQuery.addEventListener("change", function (e) {
  handleDeviceChange(e);
});

function handleDeviceChange(e) {
  if (e.matches) {
    console.log("Inside Mobile");
    var updateHistory = {
      width: 323,
      height: 250,
      "xaxis.autorange": true,
      "yaxis.autorange": true,
    };
    historyCharts.forEach((chart) => Plotly.relayout(chart, updateHistory));
  } else {
    var updateHistory = {
      width: 550,
      height: 260,
      "xaxis.autorange": true,
      "yaxis.autorange": true,
    };
    historyCharts.forEach((chart) => Plotly.relayout(chart, updateHistory));
  }
}

/*
  MQTT Message Handling Code
*/
const mqttStatus = document.querySelector(".status");

function onConnect(message) {
  mqttStatus.textContent = "Connected";
}
function onMessage(topic, message) {
  var stringResponse = message.toString();
  var messageResponse = JSON.parse(stringResponse);
  updateSensorReadings(messageResponse);
}

function onError(error) {
  console.log(`Error encountered :: ${error}`);
  mqttStatus.textContent = "Error";
}

function onClose() {
  console.log(`MQTT connection closed!`);
  mqttStatus.textContent = "Closed";
}

function fetchMQTTConnection() {
  fetch("/mqttConnDetails", {
    method: "GET",
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      initializeMQTTConnection(data.mqttServer, data.mqttTopic);
    })
    .catch((error) => console.error("Error getting MQTT Connection :", error));
}
function initializeMQTTConnection(mqttServer, mqttTopic) {
  console.log(
    `Initializing connection to :: ${mqttServer}, topic :: ${mqttTopic}`
  );
  var fnCallbacks = { onConnect, onMessage, onError, onClose };

  var mqttService = new MQTTService(mqttServer, fnCallbacks);
  mqttService.connect();

  mqttService.subscribe(mqttTopic);
}
