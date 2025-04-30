// MyTrophies.jsx
import React, { useState, useEffect } from "react";
import { auth, db } from "./firebase";
import { collection, query, where, onSnapshot, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { Link } from "react-router-dom";
import './styles/AllTrophies.css';

function MyTrophies() {
  const [trophies, setTrophies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("date");

  const rankImageMap = {
    "ブロンズ": "bronze",
    "シルバー": "silver",
    "ゴールド": "gold",
    "レインボー": "rainbow",
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        const q = query(
          collection(db, "trophies"),
          where("ownerId", "==", user.uid) // 自分のownerIdのみ
        );
        onSnapshot(q, (snapshot) => {
          const myTrophies = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));
          console.log("MyTrophies取得:", myTrophies);
          setTrophies(myTrophies);
        });
      }
    });

    return () => unsubscribe();
  }, []);

  // 削除処理
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("削除して大丈夫？");
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

      alert("削除したよ！");
    } catch (error) {
      console.error("削除エラー:", error);
      alert("削除に失敗しました。");
    }
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

  return (
    <div>
      <h1 className="title-logo" id="page_top">
        <Link to="/home" className="no-hover">
          <img src="/images/trophy-logo.png" alt="Trophy Logo" />
        </Link>
      </h1>

      <h2 className="all-head">トロフィー 一覧</h2>

      <div className="all-menu">
        <select value={sortOption} onChange={(e) => setSortOption(e.target.value)} className="select-section">
          <option value="date" style={{ color: "black" }}>日付順</option>
          <option value="rank" style={{ color: "black" }}>ランク順</option>
        </select>

        <input
          type="text"
          placeholder="検索（名前 or カテゴリ）"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      <Link to="/home" className="back-to-home">HOME</Link>

      {sortedTrophies.map(trophy => (
        <div key={trophy.id} className="trophy-card trophy-list">
          <img
            src={`/images/${rankImageMap[trophy.rank] || "default"}.png`}
            alt={`${trophy.rank} trophy`}
            className="trophy-image"
          />

          <h3 className="trophy-title">{trophy.name}</h3>
          <p className="trophy-episode">{trophy.episode}</p>

          <div className="cate-del">
            <Link to={`/edit/${trophy.id}`} className="edit-button">編集</Link>
            <button onClick={() => handleDelete(trophy.id)} className="del-button">削除</button>
          </div>

          <p className="good-button">👍 {trophy.goodUsers?.length || 0}</p>

          <div className="trophy-meta">
            <span className="trophy-category">🏷 {trophy.category}</span>
            <span className="trophy-date">📅 {trophy.date?.toDate().toLocaleDateString()}</span>
          </div>
        </div>
      ))}

      <a href="#page_top" className="page_top_btn">↑</a>
    </div>
  );
}

export default MyTrophies;