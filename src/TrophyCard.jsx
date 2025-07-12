// TrophyCard.jsx - モダンデザイン版
import React from "react";
import { Link } from "react-router-dom";
import './styles/common.css';
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

const getRankColor = (rank) => {
  switch (rank) {
    case "ブロンズ":
      return "bronze-accent";
    case "シルバー":
      return "silver-accent";
    case "ゴールド":
      return "gold-accent";
    case "レインボー":
      return "rainbow-accent";
    default:
      return "bronze-accent";
  }
};

const TrophyCard = ({ trophy, onDelete, showButtons = true, compact = false }) => {
  const handleDelete = () => {
    if (window.confirm(`「${trophy.name}」を削除しますか？`)) {
      onDelete(trophy.id);
    }
  };

  return (
    <div className={`trophy-card glass-card ${getRankColor(trophy.rank)} ${compact ? 'compact' : ''}`}>
      <div className="trophy-image-container">
        <img
          src={getRankImage(trophy.rank)}
          alt={`${trophy.rank}トロフィー`}
          className="trophy-image"
        />
        <div className="trophy-rank-badge">{trophy.rank}</div>
      </div>
      
      <div className="trophy-content">
        <h3 className="trophy-title">{trophy.name}</h3>
        <p className="trophy-episode">{trophy.episode}</p>

        <div className="trophy-meta">
          <div className="meta-item">
            <span className="meta-icon">🏷</span>
            <span className="meta-text">{trophy.category}</span>
          </div>
          <div className="meta-item">
            <span className="meta-icon">📅</span>
            <span className="meta-text">
              {trophy.date?.toDate().toLocaleDateString()}
            </span>
          </div>
          {trophy.goodUsers && (
            <div className="meta-item">
              <span className="meta-icon">👍</span>
              <span className="meta-text">{trophy.goodUsers.length}</span>
            </div>
          )}
        </div>

        {showButtons && (
          <div className="trophy-actions">
            <Link to={`/edit/${trophy.id}`} className="btn btn-secondary btn-small">
              <span className="btn-icon">✏️</span>
              編集
            </Link>
            <button 
              onClick={handleDelete} 
              className="btn btn-danger btn-small"
            >
              <span className="btn-icon">🗑️</span>
              削除
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrophyCard;