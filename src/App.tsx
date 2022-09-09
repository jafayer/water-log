import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";
import { db, WaterEvent } from "./db";
import { useLiveQuery } from "dexie-react-hooks";
import { sendMessage } from "./sw-client";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import Footer from "./components/footer";
import Settings from "./components/settings";

function App() {
  const goal = 8;
  const [settingsMenu, setSettingsMenu] = useState(false);
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

          const path = window.location.pathname.slice(1);
          if (path.toLowerCase() === "add") {
            console.log("Shortcut triggered: sending drip event");
            sendMessage({ type: "DRIP" });
          }

          try {
            registration.periodicSync.register("NOTIF", {
              minInterval: 30000,
            });
            console.log("HEY");
          } catch (e) {
            console.log("Background notifs could not be established", e);
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
    <>
      <div className="App">
        <header>
          <img src="/icon.png" className="logo" alt="Vite logo" />
        </header>
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
        <Footer setSettingsMenu={updateSettingsState} />
      </div>
      {settingsMenu && <Settings setSettingsMenu={updateSettingsState} />}
    </>
  );

  function updateSettingsState(val: boolean) {
    setSettingsMenu(val);
  }
}

export default App;
