// RecentTrophies.jsx
import React, { useEffect, useState } from "react";
import { auth, db } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, query, orderBy, limit, getDocs, where, onSnapshot } from "firebase/firestore";
import "./styles/RecentTrophies.css"; // スタイル共通でOK


function RecentTrophies() {
  const [trophies, setTrophies] = useState([]);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const q = query(
          collection(db, "trophies"),
          where("ownerId", "==", user.uid),
          orderBy("date", "desc"),
          limit(5)
        );
  
        const unsubscribeSnapshot = onSnapshot(q, (snapshot) => {
          const data = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setTrophies(data);
        });
  
        return () => unsubscribeSnapshot();
      }
    });
  
    return () => unsubscribe();
  }, []);
  const rankImageMap = {
    "ブロンズ": "bronze",
    "シルバー": "silver",
    "ゴールド": "gold",
    "レインボー": "rainbow",
  };

  return (
    <div className="trophy-container">
      <h2>🏅 最近手に入れたトロフィー</h2>
      {trophies.map((trophy) => (
      <div key={trophy.id} className="trophy-card">
      <div className="trophy-content">
      <img
      src={`/images/${rankImageMap[trophy.rank] || "default"}.png`}
      alt={`${trophy.rank} trophy`}
      className="trophy-image"
      />

    <div className="trophy-text">
      <h2 className="trophy-title">{trophy.name}</h2>
      <p className="trophy-episode">{trophy.episode}</p>

      <div className="trophy-meta">
        <span className="trophy-category">🏷 {trophy.category}</span>
        <span className="trophy-date">📅 {trophy.date?.toDate().toLocaleDateString()}</span>
      </div>
    </div>
  </div>
</div>
      ))}
    </div>

    
  );
}

export default RecentTrophies;