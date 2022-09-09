import { useEffect, useState } from "react";
import {
  XMarkIcon,
  BellSlashIcon,
  BellAlertIcon,
} from "@heroicons/react/24/solid";
import { sendMessage } from "../sw-client";

function Settings(props: any) {
  const [permission, setPermission] = useState(Notification.permission);

  return (
    <div className="overlay">
      <div className="settings">
        <div className="header">
          <div className="close">
            <XMarkIcon
              color="#5e54eb"
              onClick={() => {
                props.setSettingsMenu(false);
              }}
              height={35}
            />
          </div>
        </div>
        <div className="body">
          <h1>Settings</h1>
          <div className="fields">
            <div className="goal">
              <label htmlFor="goal">
                <input type="number" />
                <select>
                  <option value="liters">liters</option>
                  <option value="cups">cups</option>
                  <option value="oz">Fl Oz</option>
                </select>
              </label>
            </div>
          </div>
          <div className="notifications">
            <label>
              Notifications:
              <button
                className={`toggle ${permission}`}
                onClick={requestPermissions}
              >
                {permission === "granted" ? (
                  <BellAlertIcon
                    color="#ffffff"
                    height={20}
                    style={{ verticalAlign: "middle", padding: 5 }}
                  />
                ) : (
                  <BellSlashIcon
                    color="#5e54eb"
                    height={20}
                    style={{ verticalAlign: "middle", padding: 5 }}
                  />
                )}
                {permission === "granted" ? "Enabled" : "Disabled"}
              </button>
            </label>
            <button
              onClick={() => {
                sendMessage({ type: "NOTIF" });
              }}
            >
              TEST
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  function requestPermissions() {
    console.log("TESTING");
    if (!("Notification" in window)) {
      alert("Sorry, your browser doesn't support notifications");
    } else if (checkNotificationPromise()) {
      Notification.requestPermission().then((permission) => {
        setPermission(permission);
      });
    } else {
      Notification.requestPermission((permission) => {
        setPermission(permission);
      });
    }
  }
}

function checkNotificationPromise() {
  try {
    Notification.requestPermission().then();
  } catch (e) {
    return false;
  }

  return true;
}

export default Settings;
