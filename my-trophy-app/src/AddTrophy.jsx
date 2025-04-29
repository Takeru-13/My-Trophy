import React, { useState, useEffect } from "react";
import { db, auth } from "./firebase";
import { collection, addDoc, Timestamp, getDocs } from "firebase/firestore";
import { Link } from "react-router-dom";
import { doc, updateDoc } from "firebase/firestore";
import {
  fetchTrophiesByUser,
  calculatePoints,
  calculateLevel
} from "./utils/firestoreUtils";

function AddTrophy() {
  const [trophyName, setTrophyName] = useState("");
  const [category, setCategory] = useState("");
  const [rank, setRank] = useState("");
  const [episode, setEpisode] = useState("");
  const [date, setDate] = useState("");
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
  }, []); // ← マウント時に一度だけ実行！


  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("ログイン中のユーザー:", auth.currentUser);
    if (!auth.currentUser) {
      alert("ログインしていません！");
      return;
    }
  

    try {
      await addDoc(collection(db, "users", auth.currentUser.uid, "trophies"), {
        name: trophyName,
        category: category,
        rank: rank,
        episode: episode,
        date: Timestamp.fromDate(new Date(date)),
      });
      

      alert("トロフィーを保存しました！");
      setTrophyName("");
      setCategory("");
      setRank("");
      setEpisode("");
      setDate("");


      // ✅ const trophies = await fetchTrophiesByUser(auth.currentUser.uid);
      const trophies = await fetchTrophiesByUser(auth.currentUser.uid);
      const points = calculatePoints(trophies);
      const userLevel = calculateLevel(points);
      setLevel(userLevel);

      const userRef = doc(db, "users", auth.currentUser.uid);
      await updateDoc(userRef, {
        experience: points,
        level: userLevel,
      });

    } catch (error) {
      console.error("保存エラー:", error);
      alert("トロフィーの保存に失敗しました");
    }
  };

  async function fetchTrophiesByUser(userId) {
    const querySnapshot = await getDocs(collection(db, "users", userId, "trophies"));
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  }

  return (
    <div style={styles.container}>
      <h2>🏆 トロフィーを追加</h2>
      <p>🎮 あなたの現在のレベル: <strong>Lv.{level}</strong></p>      {/* ✅ ここにレベル表示を追加 */}


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

        <button type="submit" style={styles.button}>登録</button>
        <Link to="/home" style={styles.linkButton}>ホームに戻る</Link>

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
