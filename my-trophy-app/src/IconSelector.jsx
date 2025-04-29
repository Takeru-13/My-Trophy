// IconSelector.jsx
import React, { useState } from "react";
import "./styles/IconSelector.css"; // 必要ならスタイル追加

const iconList = [
  "icon1.png",
  "icon2.png",
  "icon3.png",
  "icon4.png",
];

function IconSelector({ selectedIcon, setSelectedIcon }) {
  return (
    <div className="icon-selector">
      <h3>アイコンを選んでね！</h3>
      <div className="icon-options">
        {iconList.map((icon) => (
          <img
            key={icon}
            src={`/icons/${icon}`}
            alt="user icon"
            className={`icon-img ${selectedIcon === icon ? "selected" : ""}`}
            onClick={() => setSelectedIcon(icon)}
          />
        ))}
      </div>
    </div>
  );
}

export default IconSelector;