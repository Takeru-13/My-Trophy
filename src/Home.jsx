import React, { useState, useEffect } from "react";
import TrophyList from "./AllTrophies";
import { Link } from "react-router-dom";
import { auth, db } from "./firebase";
import { doc, onSnapshot, orderBy, limit, getDocs } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import './styles/Home.css';
import { motion } from "framer-motion";
import RecentTrophies from "./RecentTrophies";


function Home() {
  const [level, setLevel] = useState(1);
  const [experience, setExperience] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };



  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth,async (user) => {
      if (!user) return;
  
      const userDocRef = doc(db, "users", user.uid);
      const unsubscribeSnapshot = onSnapshot(userDocRef, (docSnapshot) => {
        if (docSnapshot.exists()) {
          const userData = docSnapshot.data();
          setLevel(userData.level);
          setExperience(userData.experience);
        }
      });
  
      // 認証状態 or スナップショットの解除
      return () => unsubscribeSnapshot();
    });
  
    // auth リスナーもクリーンアップ
    return () => unsubscribeAuth();
  }, []);
  

  return (

    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2 className="title-logo">MyTrophy</h2>

      
      <div className="user-name-container">
        <p className="user-name">USER=NAME</p>
      </div>
      <div style={styles.levelContainer}>
        <div className="level-text" style={styles.levelHeader}>
        
         <span>Lv.{level}</span>
         <span>{experience}/{(level + 1) * 30} EXP</span>
        </div>
      <div style={styles.expBarBackground}>
        <div
        className="exp-bar-fill glowing-bar" 
          style={{
            ...styles.expBarFill,
            width: `${(experience / ((level + 1) * 30)) * 100}%`,
          }}
        />
      </div>
    </div>
        <button className="menu-button" onClick={toggleMenu}>
            MENU
          </button>
          <div className={`menu-dropdown ${isMenuOpen ? "open" : ""}`}>
            <Link to="/trophies" className="menu-item">🏆 トロフィー一覧</Link>
            <div className="menu-item">🔍 検索・ソート</div>
          </div>

          <Link to="/add" className="add-button">
          <span></span>
          <span></span>
          <span></span>
            +AddTrophy
          </Link>
          <RecentTrophies />

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
