import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";
import { db, WaterEvent } from "./db";
import { useLiveQuery } from "dexie-react-hooks";
import { sendMessage } from "./sw-client";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

function App() {
  const goal = 8;
  const [workerEnabled, setWorkerEnabed] = useState(false);
  const [isErrored, setIsErrored] = useState(false);

  const todaysDrinks = useLiveQuery(async () => {
    //
    // Query the DB using our promise based API.
    // The end result will magically become
    // observable.
    //
    const midnight = new Date().setHours(0, 0, 0, 0);
    return await db.events.where("ts").above(midnight).toArray();
  });

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/serviceWorker.js").then(
        (registration) => {
          // success
          console.log("service worker registered successfully", registration);
          setWorkerEnabed(true);

          const path = window.location.pathname.slice(1);
          if (path.toLowerCase() === "add") {
            console.log("Shortcut triggered: sending drip event");
            sendMessage({ type: "DRIP" });
          }
        },
        (error) => {
          // catch
          setIsErrored(true);
          console.log("Error:", error);
        }
      );
    }
  }, []);

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
            pathColor: todaysDrinks
              ? todaysDrinks.length < goal
                ? "#5046e6"
                : "rgb(74 222 128)"
              : "#5046e6",
            textColor: "#5046e6",
          })}
          value={((todaysDrinks ? todaysDrinks.length : 0) / 8) * 100}
          text={`${todaysDrinks ? todaysDrinks.length : 0}/${goal}`}
        />
      </div>
      <div className="container">
        <div className="buttons">
          <button
            className="add"
            onClick={() => {
              const response = sendMessage({ type: "DRIP" });
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
