import React, { useState, useEffect } from "react";
import "./App.css";
import * as PapaParse from "papaparse";
import {
  Charts,
  ChartContainer,
  ChartRow,
  YAxis,
  LineChart,
} from "react-timeseries-charts";
import { TimeSeries, Event } from "pondjs";

interface row {
  date: string;
  count: number;
}

function App() {
  const [data, setData] = useState<TimeSeries>();
  // new TimeSeries({
  //   name: "monzo-users",
  //   events: [
  //     new Event(new Date(), 10),
  //   ],
  // })

  useEffect(() => {
    // Download csv data
    PapaParse.parse("/monzo-users/monzo_users.csv", {
      download: true,
      header: true,
      error: (er, _) => {
        console.log(er);
      },
      complete: (c, _) => {
        let newdata: any[] = [];
        c.data.forEach((entry, _) => {
          let typedentry = entry as row;
          if (typedentry.date) {
            newdata.push(
              // new Event(
              //   new Date(typedentry.date),
              //   +typedentry.count,
              // )
              [new Date(typedentry.date), +typedentry.count]
            );
          }
        });
        console.log(newdata);
        let timeseries = new TimeSeries({
          name: "monzo-users",
          columns: ["time", "users"],
          points: newdata,
          // events: newdata,
        });
        setData(timeseries);
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
            <ChartContainer timeRange={data.timerange()} format="%b '%y">
              <ChartRow height="500">
                <YAxis
                  id="users"
                  label="Number of Monzo Users"
                  min={0}
                  max={data.max("users")}
                  width="60"
                />
                <Charts>
                  <LineChart axis="users" series={data} />
                </Charts>
              </ChartRow>
            </ChartContainer>
          ) : (
            <p>Loading...</p>
          )}
        </div>
      </header>
    </div>
  );
}

export default App;
