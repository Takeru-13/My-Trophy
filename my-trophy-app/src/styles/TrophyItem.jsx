import './styles/TrophyList.css';
function TrophyItem({ trophy }) {
  const getRankClass = (rank) => {
    switch (rank) {
      case 'ブロンズ': return 'rank-bronze';
      case 'シルバー': return 'rank-silver';
      case 'ゴールド': return 'rank-gold';
      case 'レインボー': return 'rank-rainbow';
      default: return '';
    }
  };

  return (
    <div className={`trophy-card ${getRankClass(trophy.rank)}`}>
      <img src={trophy.imageUrl} alt="トロフィー画像" className="trophy-icon" />
      <div className="trophy-content">
        <strong>{trophy.name}</strong>
        <p>{trophy.episode}</p>
        <div className="trophy-meta">
          <span>🏷 カテゴリ: {trophy.category}</span>
          <span>💎 ランク: {trophy.rank}</span>
          <span>📅 {trophy.date}</span>
        </div>
      </div>
    </div>
  );
}
