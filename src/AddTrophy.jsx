import React, { useState, useEffect } from "react";
import { db, auth } from "./firebase";
import { collection, addDoc, Timestamp, getDoc, getDocs } from "firebase/firestore";
import { Link } from "react-router-dom";
import {
  setDoc,
  doc,
  updateDoc,
  serverTimestamp
} from "firebase/firestore";
import {
  fetchTrophiesByUser,
  calculatePoints,
  calculateLevel
} from "./utils/firestoreUtils";
import "./styles/AddTrophies.css";



function AddTrophy() {
  const [trophyName, setTrophyName] = useState("");
  const [category, setCategory] = useState("");
  const [rank, setRank] = useState("");
  const [episode, setEpisode] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [level, setLevel] = useState(1); 

  useEffect(() => {
    const loadLevel = async () => {
      const user = auth.currentUser;
      if (!user) return;
      const trophies = await fetchTrophiesByUser(user.uid);
      const points = calculatePoints(trophies);
      const userLevel = calculateLevel(points);
      setLevel(userLevel);
    };
    loadLevel();
    
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("ログイン中のユーザー:", auth.currentUser);
    if (!auth.currentUser) {
      alert("ログインしていません！");
      return;
    }
    try {
      const user = auth.currentUser;
  
      const trophyData = {
        name: trophyName,
        category: category,
        rank: rank,
        episode: episode,
        date: Timestamp.fromDate(new Date(date)),
        ownerId: user.uid,
        createdAt: serverTimestamp(),
        goodUsers: [],
        comments: [],
      };
  
    // トロフィーをFirestoreに追加
    const newDocRef = await addDoc(collection(db, "trophies"), trophyData);

    // ユーザーのサブコレクションにも保存
    await setDoc(doc(db, "users", user.uid, "trophies", newDocRef.id), trophyData);

    // 経験値とレベルを計算
    const trophies = await fetchTrophiesByUser(user.uid);
    const totalPoints = calculatePoints(trophies);
    console.log("計算された経験値:", totalPoints); // デバッグ用
    const userLevel = calculateLevel(totalPoints);
    console.log("計算されたレベル:", userLevel); // デバッグ用

    // Firestoreのユーザーデータを更新
    const userRef = doc(db, "users", user.uid);
    await updateDoc(userRef, {
      experience: totalPoints,
      level: userLevel,
    });
    console.log("Firestoreに保存した経験値:", totalPoints);
console.log("Firestoreに保存したレベル:", userLevel);

    // ローカルステートを更新
    setLevel(userLevel);

    alert("トロフィーを保存しました！");
    setTrophyName("");
    setCategory("");
    setRank("");
    setEpisode("");
    setDate("");
  } catch (error) {
    console.error("トロフィーの保存中にエラーが発生しました:", error);
    alert("エラーが発生しました。もう一度試してね！");
  }
};



  
  return (
    <div style={styles.container}>
      <h2 className="add-title">トロフィーを追加</h2>
      <p className = "add-dic">あなたの現在のレベル: <strong>Lv.{level}</strong></p>      {/* ✅ ここにレベル表示を追加 */}


      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          placeholder="トロフィー名"
          value={trophyName}
          onChange={(e) => setTrophyName(e.target.value)}
          style={styles.input}
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={styles.input}
        >
          <option value="">カテゴリを選択</option>
          <option value="仕事">仕事</option>
          <option value="趣味">趣味</option>
          <option value="学習">学習</option>
          <option value="旅行">旅行</option>
          <option value="運">運</option>
          <option value="努力">努力</option>
        </select>

        <select
          value={rank}
          onChange={(e) => setRank(e.target.value)}
          style={styles.input}
        >
          <option value="">ランクを選択</option>
          <option value="ブロンズ">ブロンズ</option>
          <option value="シルバー">シルバー</option>
          <option value="ゴールド">ゴールド</option>
          <option value="レインボー">レインボー</option>
        </select>

        <textarea
          placeholder="エピソード（自由記述）"
          value={episode}
          onChange={(e) => setEpisode(e.target.value)}
          style={{ ...styles.input, height: "80px" }}
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          style={styles.input}
        />

        <button type="submit" className="submit-button">GET</button>
        <Link to="/home" className="go-to-home">HOME</Link>

      </form>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "400px",
    margin: "50px auto",
    textAlign: "center",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  input: {
    padding: "10px",
    fontSize: "16px",
  },
  button: {
    padding: "10px",
    fontSize: "16px",
    backgroundColor: "#4CAF50",
    color: "#fff",
    border: "none",
    cursor: "pointer",
  },
  linkButton: {
    display: "inline-block",
    marginTop: "15px",
    padding: "10px",
    fontSize: "16px",
    backgroundColor: "#2196F3",
    color: "#fff",
    textDecoration: "none",
    borderRadius: "5px",
  },
};


export default AddTrophy;
