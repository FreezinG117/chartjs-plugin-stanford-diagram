import { calculatePercentageValue, countEpochsInRegion, pointInPolygon } from '../src/stanford.js';

describe('pointInPolygon', () => {
  const chart = {
    scales: {
      'x-axis-1': null,
      'y-axis-1': null
    }
  };

  const polygon = [
    {x: 0, y: 0},
    {x: 20, y: 0},
    {x: 20, y: 20},
    {x: 20, y: 20}
  ];

  const pointInside = {x: 0, y: 0};
  const pointOutInside = {x: 21, y: 0};

  it('should return true if point is inside region', () => {
    expect(pointInPolygon(chart, pointInside, polygon)).toBe(true);
  });

  it('should return false if point is outside region', () => {
    expect(pointInPolygon(chart, pointOutInside, polygon)).toBe(false);
  });
});

describe('countEpochsInRegion', () => {
  let chart;

  beforeAll(() => {
    const ctx = document.createElement('canvas').getContext('2d');

    chart = new Chart(ctx, {
      type: 'stanford',
      data: {
        labels: 'Data Set',
        datasets: [{
          data: [
            {
              x: 25,
              y: 25,
              epochs: 30
            }, {
              x: 35,
              y: 33,
              epochs: 35
            },
            {
              x: 65,
              y: 3,
              epochs: 10
            },
            {
              x: 5,
              y: 73,
              epochs: 10
            },
            {
              x: 85,
              y: 83,
              epochs: 10
            }
          ]
        }]
      },
      options: {
        scales: {
          xAxes: [{
            ticks: {
              max: 60
            }
          }],
          yAxes: [{
            ticks: {
              max: 60
            }
          }]
        }
      },
    });
  });

  it('should return 0 if the region has no epochs', () => {
    const region = [
      {x: 0, y: 0},
      {x: 20, y: 0},
      {x: 20, y: 20},
      {x: 0, y: 20}
    ];

    const result = countEpochsInRegion(chart, region);

    expect(Number(result.percentage)).toBe(0);
    expect(result.count).toBe(0);
  });

  it('should return 100% if the region has all the epochs', () => {
    const region = [
      {x: 0, y: 0},
      {x: 'MAX_X', y: 0},
      {x: 'MAX_X', y: 'MAX_Y'},
      {x: 0, y: 'MAX_Y'}
    ];

    const result = countEpochsInRegion(chart, region);

    expect(Number(result.percentage)).toBe(100);
    expect(result.count).toBe(95);
  });
});

describe('calculatePercentageValue', () => {
  it('should return 0 when the count value is 0', () => {
    const chart = {
      options: {
        plugins: {
          stanfordDiagram: {}
        }
      }
    };

    expect(calculatePercentageValue(chart, 100, 0)).toBe('0.0');
  });

  it('should round to 1 decimal case by default', () => {
    const chart = {
      options: {
        plugins: {
          stanfordDiagram: {}
        }
      }
    };

    expect(calculatePercentageValue(chart, 10000, 25)).toBe('0.3'); // 0.025 rounded to 0.3
  });

  it('should round to 2 decimal cases', () => {
    const chart = {
      options: {
        plugins: {
          stanfordDiagram: {
            percentage: {
              decimalPlaces: 2
            }
          }
        }
      }
    };

    expect(calculatePercentageValue(chart, 100000, 2)).toBe('0.00'); // 0.002 rounded to 0.00
  });

  it('should round to 2 decimal cases', () => {
    const chart = {
      options: {
        plugins: {
          stanfordDiagram: {
            percentage: {
              roundingMethod: 'ceil'
            }
          }
        }
      }
    };

    expect(calculatePercentageValue(chart, 100000, 2)).toBe('0.1'); // 0.002 ceil to 0.1
  });

  it('should round to 2 decimal cases', () => {
    const chart = {
      options: {
        plugins: {
          stanfordDiagram: {
            percentage: {
              roundingMethod: 'floor'
            }
          }
        }
      }
    };

    expect(calculatePercentageValue(chart, 100000, 2)).toBe('0.0'); // 0.002 ceil to 0.1
  });
});
