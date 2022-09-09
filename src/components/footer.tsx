import { useState, useEffect } from "react";

function Footer(props: any) {
  return (
    <footer>
      <a
        onClick={() => {
          console.log("TEST");
          props.setSettingsMenu(true);
        }}
      >
        Settings
      </a>
    </footer>
  );
}

export default Footer;
