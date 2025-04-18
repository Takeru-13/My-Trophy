// AllTrophies.jsx
import React, { useState, useEffect } from "react";
import { auth, db } from "./firebase";
import { collection, getDocs, query } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { doc, deleteDoc } from "firebase/firestore";
import RecentTrophies from "./RecentTrophies";
import { Link } from "react-router-dom";
import './styles/AllTrophies.css';

function AllTrophies() {
  const [trophies, setTrophies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("date"); // "date" or "rank"


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const q = query(collection(db, "users", user.uid, "trophies"));
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setTrophies(data);
      }
    });
    return () => unsubscribe();
  }, []);
  const filteredTrophies = trophies.filter(trophy =>
    trophy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    trophy.category.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const sortedTrophies = [...filteredTrophies].sort((a, b) => {
    if (sortOption === "date") {
      return b.date.toDate() - a.date.toDate(); // 新しい順
    } else if (sortOption === "rank") {
      const rankValue = { "レインボー": 4, "ゴールド": 3, "シルバー": 2, "ブロンズ": 1 };
      return rankValue[b.rank] - rankValue[a.rank];
    }
    return 0;
  });

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("削除して大丈夫？");
    if (!confirmDelete) return;

    const user = auth.currentUser;
    if (!user) return;

    await deleteDoc(doc(db, "users", user.uid, "trophies", id));
    setTrophies((prev) => prev.filter(t => t.id !== id));
    alert("削除したよ！");
  };

  return (
    <div>
            <h2 className="all-head">すべてのトロフィー</h2>
      <div className="all-menu">
      <select value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
        <option value="date" className="menu-button">📅 日付順（新しい順）</option>
        <option value="rank" className="menu-button">🏆 ランク順（レア順）</option>
      </select>
      <input
        type="text"
        placeholder="検索（名前 or カテゴリ）"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />
    </div>

        
      {filteredTrophies.map(trophy => (
        <div key={trophy.id} className="trophy-card trophy-list">
          <h3>{trophy.name}</h3>
          <p className="trophy-episode">{trophy.episode}</p>
          <div className="cate-del">
          <p>{trophy.category}</p>
            <button onClick={() => handleDelete(trophy.id)}>削除</button>
          </div>
</div>
      ))}
      <Link to="/home" className="back-to-home">🏠 ホームに戻る</Link>
    </div>
    
  );
}

export default AllTrophies;
