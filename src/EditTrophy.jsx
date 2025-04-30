import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "./firebase";
import { calculateLevel } from "./utils/firestoreUtils";

function EditTrophy() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    rank: "",
    episode: "",
    date: "",
  });

  const rankPoints = {
    "ブロンズ": 1,
    "シルバー": 5,
    "ゴールド": 10,
    "レインボー": 25,
  };

  useEffect(() => {
    const fetchTrophy = async () => {
      try {
        const docRef = doc(db, "trophies", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setFormData({
            name: data.name,
            category: data.category,
            rank: data.rank,
            episode: data.episode,
            date: data.date.toDate().toISOString().split("T")[0],
          });
        }
      } catch (error) {
        console.error("読み込みエラー:", error);
      }
    };

    fetchTrophy();
  }, [id]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const currentUserId = auth.currentUser?.uid;
    if (!currentUserId) {
      alert("ログインしていません！");
      return;
    }

    try {
      const docRef = doc(db, "trophies", id);
      const trophySnapshot = await getDoc(docRef);

      if (!trophySnapshot.exists()) {
        alert("トロフィーが見つかりません！");
        return;
      }

      const oldTrophy = trophySnapshot.data(); // 編集前のトロフィーデータ
      const oldRankPoints = rankPoints[oldTrophy.rank] || 0; // 編集前のランクポイント
      const newRankPoints = rankPoints[formData.rank] || 0; // 編集後のランクポイント
      const pointDifference = newRankPoints - oldRankPoints; // 差分を計算

      console.log("編集前のランクポイント:", oldRankPoints);
      console.log("編集後のランクポイント:", newRankPoints);
      console.log("ポイント差分:", pointDifference);
  

      // トロフィーを更新
      await updateDoc(docRef, {
        ...formData,
        date: new Date(formData.date),
      });

      // Firestoreから現在の経験値を取得
      const userRef = doc(db, "users", currentUserId);
      const userSnapshot = await getDoc(userRef);
      const currentPoints = userSnapshot.exists() ? userSnapshot.data().experience || 0 : 0;

      // 差分を経験値に反映
      const updatedPoints = currentPoints + pointDifference;

      // Firestoreのユーザーデータを更新
      await updateDoc(userRef, {
        experience: updatedPoints,
        level: calculateLevel(updatedPoints),
      });

      alert("更新しました！");
      navigate("/home");
    } catch (error) {
      console.error("更新エラー:", error);
      alert("更新に失敗しました");
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "50px auto", padding: "20px" }}>
      <h2>🏗 トロフィーを編集</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="トロフィー名"
          name="name"
          value={formData.name}
          onChange={handleChange}
          style={styles.input}
        />
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
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
          name="rank"
          value={formData.rank}
          onChange={handleChange}
          style={styles.input}
        >
          <option value="">ランクを選択</option>
          <option value="ブロンズ">ブロンズ</option>
          <option value="シルバー">シルバー</option>
          <option value="ゴールド">ゴールド</option>
          <option value="レインボー">レインボー</option>
        </select>
        <textarea
          name="episode"
          placeholder="エピソード（自由記述）"
          value={formData.episode}
          onChange={handleChange}
          style={{ ...styles.input, height: "80px" }}
        />
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          style={styles.input}
        />
        <button type="submit" style={styles.button}>
          登録
        </button>
        <button
          type="button"
          onClick={() => navigate("/trophies")}
          style={{ ...styles.button, backgroundColor: "#ccc", marginLeft: "10px" }}
        >
          キャンセル
        </button>
      </form>
    </div>
  );
}

const styles = {
  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "15px",
    fontSize: "16px",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },
  button: {
    padding: "10px 20px",
    fontSize: "16px",
    backgroundColor: "#4caf50",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
};

export default EditTrophy;