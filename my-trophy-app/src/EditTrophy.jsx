// EditTrophy.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";

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
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const docRef = doc(db, "trophies", id);
      await updateDoc(docRef, {
        ...formData,
        date: new Date(formData.date),
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
            {/* const [name, setName] = useState(""); */}

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

        <button type="submit" style={styles.button}>登録</button>
        <button type="button" onClick={() => navigate("/home")} style={{ ...styles.button, backgroundColor: "#ccc", marginLeft: "10px" }}>
          キャンセル
        </button>
      </form>
    </div>
  );
}

const styles = {
    form: {
      maxWidth: "600px",
      margin: "50px auto",
      padding: "20px",
      backgroundColor: "#fff",
      borderRadius: "8px",
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
    },
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
