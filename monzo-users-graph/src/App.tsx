import React, { useState, useEffect } from "react";
import "./App.css";
import * as PapaParse from "papaparse";
import { Chart } from "react-charts";

interface datawrapper {
  label: string;
  data: dataarr[];
}

interface dataarr {
  x: number;
  y: number;
}

interface row {
  date: string;
  count: number;
}

function App() {
  const [data, setData] = useState<datawrapper[]>([]);

  const axis = React.useMemo(
    () => [
      { primary: true, type: "time", position: "bottom", show: true },
      { type: "linear", position: "left", show: true }
    ],
    []
  );

  const options = React.useMemo(
    () => [
      {
        scales: {
          xAxes: [
            {
              type: "time",
              distribution: "linear",
              time: {
                unit: "day"
              }
            }
          ]
        }
      }
    ],
    []
  );

  useEffect(() => {
    // Download csv data
    PapaParse.parse(
      "/monzo-users/monzo_users.csv",
      {
        download: true,
        header: true,
        error: (er, _) => {
          console.log(er);
        },
        complete: (c, _) => {
          let newdata: dataarr[] = [];
          c.data.forEach((entry, _) => {
            let typedentry = (entry as row)
            if (typedentry.date) {
              newdata.push({
                x: new Date(typedentry.date).getTime(),
                y: +typedentry.count
              });
            }
          });
          setData([
            {
              label: "monzo users",
              data: newdata
            }
          ]);
        }
      }
    );
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
          <Chart
            data={data}
            axes={axis}
            options={options}
            primaryCursor
            secondaryCursor
            tooltip
            dark
          />
        </div>
      </header>
    </div>
  );
}

export default App;
