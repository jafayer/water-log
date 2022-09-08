import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";
import { db, WaterEvent, todaysDrinks } from "./db";
import { useLiveQuery } from "dexie-react-hooks";
import { sendMessage } from "./sw-client";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

function App() {
  const goal = 8;
  const [events, setEvents] = useState<WaterEvent[]>([]);
  const [workerEnabled, setWorkerEnabed] = useState(false);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/serviceWorker.js");
      setWorkerEnabed(true);
      todaysDrinks().then((data) => {
        setEvents(data);
      });
    }
  });

  return (
    <div className="App">
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src="/icon.png" className="logo" alt="Vite logo" />
        </a>
      </div>
      <div
        style={{
          maxWidth: 200,
          margin: "auto",
        }}
      >
        <CircularProgressbar
          styles={buildStyles({
            pathColor: events?.length !== goal ? "#5046e6" : "rgb(74 222 128)",
            textColor: "#5046e6",
          })}
          value={((events ? events.length : 0) / 8) * 100}
          text={`${events ? events.length : 0}/${goal}`}
        />
      </div>
      <div className="container">
        <div className="buttons">
          <button
            className="add"
            onClick={() => {
              const response = sendMessage({ type: "DRIP" });
              console.log(response);
              response.then((data) => console.log(data));
            }}
          >
            Add
          </button>
          <button
            onClick={() => {
              const response = sendMessage({ type: "DEL" });
              console.log(response);
              response.then((data) => console.log(data));
            }}
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
