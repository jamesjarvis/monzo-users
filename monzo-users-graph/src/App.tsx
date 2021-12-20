import React, { useState, useEffect } from "react";
import "./App.css";
import * as PapaParse from "papaparse";
import {
  Charts,
  ChartContainer,
  ChartRow,
  YAxis,
  LineChart
} from "react-timeseries-charts";
import {TimeSeries} from 'pondjs';

interface row {
  date: string;
  count: number;
}

function App() {
  const [data, setData] = useState<TimeSeries>(new TimeSeries({
    name: "monzo-users",
    columns: ["time", "users"],
    points: [
      [1400425947000, 52],
      [1400425948000, 18],
    ],
  }));

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
          let newdata: any[] = [];
          c.data.forEach((entry, _) => {
            let typedentry = (entry as row)
            if (typedentry.date) {
              newdata.push([
                new Date(typedentry.date).getTime(),
                +typedentry.count
              ]);
            }
          });
          setData(
            new TimeSeries({
              name: "monzo-users",
              columns: ["time", "users"],
              points: newdata,
            })
          );
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
          <ChartContainer timeRange={data.timerange()} format="%b '%y">
            <ChartRow height="500">
                <YAxis
                    id="users"
                    label="Number of Monzo Users"
                    min={data.min("users", (a:any) => (a))} max={data.max("users")}
                    width="60"
                    />
                <Charts>
                    <LineChart axis="users" series={data} />
                </Charts>
            </ChartRow>
        </ChartContainer>
        </div>
      </header>
    </div>
  );
}

export default App;
