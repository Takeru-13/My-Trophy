import React, { useState, useEffect } from "react";
import TrophyList from "./AllTrophies";
import { Link } from "react-router-dom";
import { auth, db } from "./firebase";
import {
          doc,
          onSnapshot,
          orderBy,
          limit,
          getDocs,
          query,
          collection,
          where,
       } from "firebase/firestore";

import { onAuthStateChanged } from "firebase/auth";
import { fetchLatestTrophies } from "./utils/firestoreUtils";
import { motion } from "framer-motion";
import RecentTrophies from "./RecentTrophies";
import LatestTrophies from "./LatestTrophies";
import './styles/Home.css';


function Home() {
  const [recentTrophies, setRecentTrophies] = useState([]); // ここで定義
  const [level, setLevel] = useState(1);
  const [experience, setExperience] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };
  useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    if (user) {
      setCurrentUserId(user.uid); // ログイン中のユーザーIDを設定
      console.log("ログイン中のユーザーID:", user.uid);
    } else {
      setCurrentUserId(null); // ユーザーがログアウトした場合
      console.log("ユーザーがログアウトしました");
    }
  });

  return () => unsubscribe(); // クリーンアップ
}, []);

  // 新着トロフィーの取得
  const fetchLatestTrophies = async () => {
    const q = query(
      collection(db, "trophies"),
      orderBy("createdAt", "desc"),
      limit(10)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  };
  useEffect(() => {
    if (!currentUserId) return;
  
    const q = query(
      collection(db, "trophies"),
      where("ownerId", "==", currentUserId)
    );
  
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const trophies = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setRecentTrophies(trophies); // 最近獲得したトロフィーを更新
      console.log("最近のトロフィー:", trophies);
    });

    
  
    return () => unsubscribe(); // クリーンアップ
  }, [currentUserId]);

  useEffect(() => {
    if (!currentUserId) return;

    const userRef = doc(db, "users", currentUserId);

    const unsubscribe = onSnapshot(userRef, (doc) => {
      if (doc.exists()) {
        const userData = doc.data();
        setExperience(userData.experience || 0); // 経験値を更新
        setLevel(userData.level || 1); // レベルを更新
        console.log("ユーザーデータ:", userData);
      }
    });

    return () => unsubscribe(); // クリーンアップ
  }, [currentUserId]);

  useEffect(() => {
    if (!currentUserId) return;

    const userRef = doc(db, "users", currentUserId);

    const unsubscribe = onSnapshot(userRef, (doc) => {
      if (doc.exists()) {
        const userData = doc.data();
        setUserData(userData); // ユーザーデータを更新
        console.log("ユーザーデータ:", userData);
      }
    });

    return () => unsubscribe(); // クリーンアップ
  }, [currentUserId]);



  return (

    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1 className="title-logo" id="page_top">
        <a href="#" className="no-hover"><img src="/images/trophy-logo.png" alt="" /></a>
      </h1>

      
      <div className="icon-name-container"> 
      {userData && (
        <div style={{ display: "flex", alignItems: "center", }} className="icon-name">
          <img
            src={`/user-icon/${userData.icon}`}
            alt="ユーザーアイコン"
            style={{ width: "50px", height: "50px", borderRadius: "50%", marginRight: "10px" }}
          />
          <h2>{userData.name} </h2>
        </div>
      )}
    </div>


      <div style={styles.levelContainer}>
        <div className="level-text" style={styles.levelHeader}>
        
         <span>Lv.{level}</span>
         <span>{experience}/{(level + 1) * 10} EXP</span>
        </div>
      <div style={styles.expBarBackground}>
        <div
        className="exp-bar-fill glowing-bar" 
          style={{
            ...styles.expBarFill,
            width: `${(experience / ((level + 1) * 10)) * 100}%`,
          }}
        />
      </div>
    </div>
        <button className="menu-button" onClick={toggleMenu}>
            MENU
          </button>
          <div className={`menu-dropdown ${isMenuOpen ? "open" : ""}`}>
            <Link to="/trophies" className="menu-item">🏆 トロフィー一覧</Link>
            <div
             className="menu-item"
             onClick={() => {
               const confirmLogout = window.confirm("ログアウトしますか？");
               if (confirmLogout) {
                 auth.signOut()
                   .then(() => {
                     alert("ログアウトしました！");
                     window.location.href = "/login"; // ログイン画面にリダイレクト
                   })
                   .catch((error) => {
                     console.error("ログアウトエラー:", error);
                     alert("ログアウトに失敗しました。");
                   });
               }
             }}
           >
             🚪 ログアウト
           </div>
          </div>
          
          <Link to="/add" className="add-button">
          <span></span>
          <span></span>
          <span></span>
            +AddTrophy
          </Link>
          <RecentTrophies />
      {/* 他ユーザーの新着トロフィー */}

      <section>
      <LatestTrophies currentUserId={currentUserId} />
      </section>

          <a href="#page_top" className="page_top_btn">↑</a>
    </div>
  );
}

const styles = {
  addButton: {
    display: "inline-block",
    margin: "20px 0",
    padding: "10px 20px",
    fontSize: "16px",
    backgroundColor: "#f57c00",
    color: "#fff",
    textDecoration: "none",
    borderRadius: "8px",
  },
  homeContainer: {
    maxWidth: "800px",
    margin: "0 auto",
    padding: "30px 20px",
  },
  title: {
    fontSize: "28px",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: "20px",
    color: "#ffffff",
  },

  logo: {
    display: "inline-block",
    width: "400px",
  },
    levelContainer: {
    margin: "20px 0",
  },
  levelHeader: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "5px",
    fontWeight: "bold",
    color: "#fff",
  },
  expBarBackground: {
    width: "80%",
    height: "20px",
    margin: "0 auto",
    backgroundColor: "#444",
    borderRadius: "10px",
    overflow: "hidden",
  },
  expBarFill: {
    height: "100%",
    background: "linear-gradient(to right, #00c6ff, #0072ff)",
    borderRadius: "10px 0 0 10px",
    transition: "width 0.5s ease",
  },
  trophyCard: {
    background: "linear-gradient(145deg, #29294d, #1e1e3f)",
    borderRadius: "15px",
    padding: "15px",
    marginBottom: "15px",
    boxShadow: "0 4px 8px rgba(0,0,0,0.3)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  trophyInfo: {
    flex: 1,
    marginLeft: "10px",
  },
  trophyTitle: {
    fontSize: "16px",
    fontWeight: "bold",
  },
  trophyDate: {
    fontSize: "12px",
    color: "#aaa",
  },
  

};





export default Home;