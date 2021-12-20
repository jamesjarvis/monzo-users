import React, { useState, useEffect } from "react";
import "./App.css";
import * as PapaParse from "papaparse";
import Chart from "react-apexcharts";

interface row {
  date: string;
  count: number;
}

function App() {
  const [data, setData] = useState<number[][]>();

  useEffect(() => {
    // Download csv data
    PapaParse.parse("/monzo-users/monzo_users.csv", {
      download: true,
      header: true,
      error: (er, _) => {
        console.log(er);
      },
      complete: (c, _) => {
        let newdata: number[][] = [];
        c.data.forEach((entry, _) => {
          let typedentry = entry as row;
          if (typedentry.date) {
            newdata.push(
              [new Date(typedentry.date).getTime(), +typedentry.count]
            );
          }
        });

        setData(newdata);
      },
    });
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <span className="title">
          <a className="App-link" href="https://monzo.com">
            Monzo
          </a>{" "}
          Users
        </span>
        <div className="chart">
          {data ? (
            <Chart
              type = "line"
              series = {[{name: "monzo-users", data: data}]}
              options = {{
                chart: {
                  type: "area",
                  stacked: false,
                  zoom: {
                    type: 'x',
                    enabled: true,
                    autoScaleYaxis: true
                  },
                  toolbar: {
                    autoSelected: 'zoom'
                  }
                },
                dataLabels: {
                  enabled: false
                },
                markers: {
                  size: 0,
                },
                fill: {
                  type: 'gradient',
                  gradient: {
                    shadeIntensity: 1,
                    inverseColors: false,
                    opacityFrom: 0.5,
                    opacityTo: 1,
                    stops: [0, 90, 100]
                  },
                },
                yaxis: {
                  labels: {
                    formatter: function (val) {
                      return (val).toFixed(0);
                    },
                  },
                  title: {
                    text: 'Price'
                  },
                },
                xaxis: {
                  type: 'datetime',
                },
                tooltip: {
                  shared: false,
                  y: {
                    formatter: function (val) {
                      return (val).toFixed(0)
                    }
                  }
                }
              }}
            />
          ) : (
            <p>Loading...</p>
          )}
        </div>
      </header>
    </div>
  );
}

export default App;
