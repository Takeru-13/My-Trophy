import React, { useEffect, useState } from "react";
import { db } from "./firebase";
import {
  collection,
  query,
  orderBy,
  limit,
  where,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  arrayUnion,

} from "firebase/firestore";
import './styles/good-button.css';

const rankImageMap = {
  ブロンズ: "bronze",
  シルバー: "silver",
  ゴールド: "gold",
  レインボー: "rainbow",
};


const LatestTrophies = ({ currentUserId }) => {
  const [latestTrophies, setLatestTrophies] = useState([]);
  useEffect(() => {
    const fetchLatestTrophies = async () => {

      if (!currentUserId) {
        console.log("⚠️ currentUserId が未定義なのでスキップします");
        return;
      }
  
      try {
        const q = query(
          collection(db, "trophies"),
          where("ownerId", "!=", currentUserId), 
          orderBy("date", "desc"),
          limit(10)
        );
        
        const querySnapshot = await getDocs(q);
        const filteredDocs = querySnapshot.docs.filter(doc => doc.data().ownerId !== currentUserId);
        
        const trophiesData = await Promise.all(
          querySnapshot.docs.map(async (doc) => {
            const trophy = { id: doc.id, ...doc.data() };
            const userQuery = query(
              collection(db, "users"),
              where("uid", "==", trophy.ownerId)
            );
            const userDoc = await getDocs(userQuery);
            
  
            let userData = {};
            userDoc.forEach((u) => {
              userData = u.data();
            });
  
            return {
              ...trophy,
              userName: userData.name || "名無し",
              userIcon: userData.icon || "default-icon.png",
            };
          })
        );
  
        console.log("📦 トロフィー:", trophiesData);
        setLatestTrophies(trophiesData);
      } catch (error) {
        console.error("Error fetching latest trophies:", error);
      }
    };

    fetchLatestTrophies();
  }, [currentUserId]);




  // ---------Goodボタン-----------------↓↓
const handleGoodClick = async (trophyId) => {
  const trophyRef = doc(db, "trophies", trophyId);
  try {
    await updateDoc(trophyRef, {
      goodUsers: arrayUnion(currentUserId),
    });
    // ローカルデータも更新する
    setLatestTrophies(prev =>
      prev.map(trophy =>
        trophy.id === trophyId
          ? { ...trophy, goodUsers: [...(trophy.goodUsers || []), currentUserId] }
          : trophy
      )
    );
  } catch (err) {
    console.error("👍エラー:", err);
  }
};
  // ---------Goodボタン-----------------↑↑





  return (
    <div className="trophy-container">
      <h2>🌟 他のユーザーの新着トロフィー</h2>
      {latestTrophies.map((trophy) => (
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

              {/* ここにユーザー情報表示 */}
              <div className="trophy-user"
                style={{ textAlign: "left", height: "50px", paddingTop: "auto", display: "flex"}}
              >
                <img
                 src={`/user-icon/${trophy.userIcon}`}
                  alt="ユーザーアイコン"
                  className="user-icon"
                  style={{ width: "50px", height: "auto", marginRight: "10px" }}
                />
                <h2 className="user-name"
                 style={{ fontSize: "14px" }}
                >{trophy.userName}</h2>

                <button
                  onClick={() => handleGoodClick(trophy.id)}
                  disabled={trophy.goodUsers?.includes(currentUserId)}
                className="good-button">
                  👍 {trophy.goodUsers?.length || 0}
                </button>
              </div>

              <div className="trophy-meta"style={{ marginTop: "10px" }}>
                <span className="trophy-category">🏷 {trophy.category}</span>
                <span className="trophy-date">📅 {trophy.date?.toDate().toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LatestTrophies;
