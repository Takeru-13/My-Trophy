import React from "react";
import { Link } from "react-router-dom";
import './styles/TrophyList.css';
import bronzeImg from "../images/bronze.png";
import silverImg from "../images/silver.png";
import goldImg from "../images/gold.png";
import rainbowImg from "../images/rainbow.png";

const getRankImage = (rank) => {
  switch (rank) {
    case "ブロンズ":
      return bronzeImg;
    case "シルバー":
      return silverImg;
    case "ゴールド":
      return goldImg;
    case "レインボー":
      return rainbowImg;
    default:
      return bronzeImg;
  }
};

const TrophyCard = ({ trophy, onDelete, showButtons = true }) => {
  return (
    <div className={`trophy-card ${trophy.rank}-rank`}>
      <img
        src={getRankImage(trophy.rank)}
        alt={`${trophy.rank}トロフィー`}
        className="trophy-image"
      />
      <div className="trophy-content">
        <h2 className="trophy-title">{trophy.name}</h2>
        <p className="trophy-episode">{trophy.episode}</p>

        <div className="trophy-meta">
          <div className="trophy-category">🏷 {trophy.category}</div>
          <div className="trophy-date">
            📅 {trophy.date?.toDate().toLocaleDateString()}
          </div>
        </div>

        {showButtons && (
          <div className="trophy-buttons">
            <button onClick={() => onDelete(trophy.id)} className="delete-button">
              🗑️ 削除
            </button>
            <Link to={`/edit/${trophy.id}`} className="edit-button">
              ✏️ 編集
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrophyCard;
