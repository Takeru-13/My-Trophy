// RecentTrophies.jsx
import React, { useEffect, useState } from "react";
import { auth, db } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import "./styles/TrophyList.css"; // スタイル共通でOK

function RecentTrophies() {
  const [trophies, setTrophies] = useState([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const q = query(
            collection(db, "users", user.uid, "trophies"),
            orderBy("date", "desc"),
            limit(5)
          );
          const querySnapshot = await getDocs(q);
          const data = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setTrophies(data);
        } catch (error) {
          console.error("読み込みエラー:", error);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="trophy-container">
      <h2>🏅 最近手に入れたトロフィー</h2>
      {trophies.map((trophy) => (
        <div key={trophy.id} className="trophy-card">
          <img
            src={`/images/${trophy.rank.toLowerCase()}.png`}
            alt={`${trophy.rank} trophy`}
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
          </div>
        </div>
      ))}
    </div>
  );
}

export default RecentTrophies;
