// MyTrophies.jsx - モダンデザイン版
import React, { useState, useEffect } from "react";
import { auth, db } from "./firebase";
import { collection, query, where, onSnapshot, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { Link } from "react-router-dom";
import './styles/common.css';
import './styles/AllTrophies.css';

function MyTrophies() {
  const [trophies, setTrophies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("date");
  const [loading, setLoading] = useState(true);

  const rankImageMap = {
    "ブロンズ": "bronze",
    "シルバー": "silver",
    "ゴールド": "gold",
    "レインボー": "rainbow",
  };

  const rankColors = {
    "ブロンズ": "bronze-accent",
    "シルバー": "silver-accent", 
    "ゴールド": "gold-accent",
    "レインボー": "rainbow-accent",
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        const q = query(
          collection(db, "trophies"),
          where("ownerId", "==", user.uid)
        );
        onSnapshot(q, (snapshot) => {
          const myTrophies = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));
          console.log("MyTrophies取得:", myTrophies);
          setTrophies(myTrophies);
          setLoading(false);
        });
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // 削除処理
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("このトロフィーを削除しますか？");
    if (!confirmDelete) return;

    try {
      const user = auth.currentUser;
      if (!user) return;

      await deleteDoc(doc(db, "trophies", id));
      await deleteDoc(doc(db, "users", user.uid, "trophies", id));

      // UI更新
      const updatedTrophies = trophies.filter(t => t.id !== id);
      setTrophies(updatedTrophies);

      // ポイント再計算
      const calculatePoints = (trophies) => {
        let total = 0;
        for (const trophy of trophies) {
          if (trophy.rank === "ブロンズ") total += 1;
          if (trophy.rank === "シルバー") total += 5;
          if (trophy.rank === "ゴールド") total += 10;
          if (trophy.rank === "レインボー") total += 25;
        }
        return total;
      };

      const calculateLevel = (points) => {
        return Math.floor(points / 10) + 1;
      };

      const points = calculatePoints(updatedTrophies);
      const level = calculateLevel(points);

      await updateDoc(doc(db, "users", user.uid), {
        experience: points,
        level: level,
      });

      // 成功メッセージ
      showNotification("トロフィーを削除しました", "success");
    } catch (error) {
      console.error("削除エラー:", error);
      showNotification("削除に失敗しました", "error");
    }
  };

  // 通知表示
  const showNotification = (message, type) => {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.remove();
    }, 3000);
  };

  // ソートとフィルター
  const filteredTrophies = trophies.filter(trophy =>
    trophy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    trophy.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const rankValue = {
    "レインボー": 4,
    "ゴールド": 3,
    "シルバー": 2,
    "ブロンズ": 1
  };

  const sortedTrophies = [...filteredTrophies].sort((a, b) => {
    if (sortOption === "date") {
      return b.date?.toDate() - a.date?.toDate();
    } else if (sortOption === "rank") {
      return rankValue[b.rank] - rankValue[a.rank];
    }
    return 0;
  });

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>トロフィーを読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="mytrophies-container animate-fadeInUp">
        {/* Header */}
        <header className="mytrophies-header">
          <Link to="/home" className="logo-link">
            <img src="/images/trophy-logo.png" alt="Trophy Logo" className="logo" />
          </Link>
          <p className="subtitle">トロフィー一覧</p>
        </header>

        {/* Controls */}
        <div className="controls-section glass-card-small">
          <div className="controls-grid">
            <div className="control-group">
              <label htmlFor="sort" className="control-label">並び替え</label>
              <select 
                id="sort"
                value={sortOption} 
                onChange={(e) => setSortOption(e.target.value)} 
                className="select"
              >
                <option value="date">日付順</option>
                <option value="rank">ランク順</option>
              </select>
            </div>

            <div className="control-group">
              <label htmlFor="search" className="control-label">検索</label>
              <input
                id="search"
                type="text"
                placeholder="トロフィー名・カテゴリで検索..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input"
              />
            </div>
          </div>
          

          <div className="stats-summary">
            <div className="stat-item">
              <span className="stat-number">{sortedTrophies.length}</span>
              <span className="stat-label">獲得トロフィー</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">
                {sortedTrophies.filter(t => t.rank === "レインボー").length}
              </span>
              <span className="stat-label">レインボー</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">
                {sortedTrophies.filter(t => t.rank === "ゴールド").length}
              </span>
              <span className="stat-label">ゴールド</span>
            </div>
          </div>
        </div>

        {/* Trophy Grid */}
        <div className="trophies-grid">
          {sortedTrophies.length === 0 ? (
            <div className="empty-state glass-card">
              <div className="empty-icon">🏆</div>
              <h3>トロフィーがありません</h3>
              <p>最初のトロフィーを作成してみましょう！</p>
              <Link to="/create" className="btn btn-primary">
                トロフィーを作成
              </Link>
            </div>
          ) : (
            sortedTrophies.map((trophy, index) => (
              <div 
                key={trophy.id} 
                className={`trophy-card glass-card ${rankColors[trophy.rank]} animate-slideIn`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="trophy-image-container">
                  <img
                    src={`/images/${rankImageMap[trophy.rank] || "default"}.png`}
                    alt={`${trophy.rank} trophy`}
                    className="trophy-image"
                  />
                  <div className="trophy-rank-badge">{trophy.rank}</div>
                </div>

                <div className="trophy-content">
                  <h3 className="trophy-title">{trophy.name}</h3>
                  <p className="trophy-episode">{trophy.episode}</p>



                  <div className="trophy-actions">
                    <Link to={`/edit/${trophy.id}`} className="edit-btn btn btn-secondary btn-small">
                      
                      編集
                    </Link>
                    <button 
                      onClick={() => handleDelete(trophy.id)} 
                      className="del-btn btn btn-danger btn-small"
                    >
                      
                      削除
                    </button>
                  </div>

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
                    <div className="meta-item">
                      <span className="meta-icon">👍</span>
                      <span className="meta-text">{trophy.goodUsers?.length || 0}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <footer className="mytrophies-footer">
          <Link to="/home" className="btn home-btn">
           Home
          </Link>
          <button 
            className="scroll-to-top"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            ↑
          </button>
        </footer>
      </div>
    </div>
  );
}

export default MyTrophies;