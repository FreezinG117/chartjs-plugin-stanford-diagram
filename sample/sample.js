import originalData from './data.js';
import { compareEpochs, logDataValues } from './utils.js';
import stanfordDiagramPlugin from '../dist/chartjs-plugin-stanford-diagram.js';

originalData.sort(compareEpochs); // draw bigger epochs later

logDataValues(originalData);

const chartData = originalData.map(function (e) {
  return {x: e.HPE, y: e.HPL, epochs: e.epochs};
});

const ctx = document.getElementById('myChart')
  .getContext('2d');

new Chart(ctx, {
  type: 'scatter',
  data: {
    labels: 'Horizontal Data Set',
    datasets: [
      {
        data: chartData,
        radius: 4,
        pointStyle: 'rect'
      },
    ]
  },
  options: {
    aspectRatio: 1.12,
    // maintainAspectRatio: true,
    animation: false,
    legend: {
      display: false
    },
    scales: { // https://www.chartjs.org/docs/latest/axes/labelling.html#scale-title-configuration
      xAxes: [{
        scaleLabel: {
          display: true,
          labelString: 'HPE (m)'
        },
        ticks: {
          suggestedMax: 60,
          beginAtZero: true
        }
      }],
      yAxes: [{
        scaleLabel: {
          display: true,
          labelString: 'HPL (m)'
        },
        ticks: {
          suggestedMax: 60,
          beginAtZero: true
        }
      }]
    },
    tooltips: {
      enabled: true,
      callbacks: {
        label: function (item, data) {
          return `S: ${data.datasets[0].data[item.index].epochs}   (${item.xLabel}, ${item.yLabel})`;
        }
      }
    },
    hover: {
      mode: null
    },
    plugins: {
      stanfordDiagram: {
        regions: [
          {
            points: [ // add points counter-clockwise
              {x: 0, y: 0},
              {x: 40, y: 40},
              {x: 0, y: 40},
            ],
            strokeColor: 'rgba(0, 0, 0, 0.5)',
            text: {
              x: 15,
              y: 35,
              color: 'black',
              format: function (value, percentage) {
                return `Normal Operations:\n${value} (${percentage}%)`;
              }
            }
          }, {
            points: [
              {x: 0, y: 0},
              {x: 40, y: 0},
              {x: 40, y: 40},
            ],
            fillColor: 'rgba(255, 165, 0, 0.2)',
            strokeColor: 'rgba(0, 0, 0, 0.5)',
            text: {
              x: 25,
              y: 15,
              color: 'black',
              format: function (value, percentage) {
                return `MI:\n${value} (${percentage}%)`;
              }
            }
          }, {
            points: [
              {x: 40, y: 0},
              {x: 60, y: 0},
              {x: 60, y: 40},
              {x: 40, y: 40},
            ],
            fillColor: 'rgba(255, 0, 0, 0.2)',
            strokeColor: 'rgba(0, 0, 0, 0.5)',
            text: {
              x: 44,
              y: 32,
              color: 'black',
              format: function (value, percentage) {
                return `HMI:\n${value} (${percentage}%)`;
              }
            }
          },
          {
            points: [
              {x: 0, y: 40},
              {x: 40, y: 40},
              {x: 60, y: 60},
              {x: 0, y: 60},
            ],
            fillColor: 'rgba(128, 128, 128, 0.2)',
            strokeColor: 'rgba(0, 0, 0, 0.5)',
            text: {
              x: 25,
              y: 52,
              color: 'black',
              format: function (value, percentage) {
                return `Unavailable Epochs:\n${value} (${percentage}%)`;
              }
            }
          },
          {
            points: [
              {x: 40, y: 40},
              {x: 60, y: 40},
              {x: 60, y: 60}
            ],
            fillColor: 'rgba(255, 165, 0, 0.2)',
            strokeColor: 'rgba(0, 0, 0, 0.5)',
            text: {
              x: 50,
              y: 45,
              color: 'black',
              format: function (value, percentage) {
                return `MI:\n${value} (${percentage}%)`;
              }
            }
          },
        ]
      }
    }
  },
  plugins: [stanfordDiagramPlugin]
});