import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { Link } from "react-router-dom";
import { auth, db } from "./firebase"; // dbを追加

function Register() {
  const [email, setEmail] = useState("");
  const [UserName, setUserName] = useState(""); 
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

// Firestoreにユーザー情報を追加
      await setDoc(doc(db, "users", user.uid), {
        name:  UserName,//ユーザーネームを決定
        email: email, // メールアドレスを追加
        level: 1, // 初期レベル
        experience: 0, // 初期経験値
// 他の必要なフィールドを追加
      });

      navigate("/home");
    } catch (err) {
      setError("登録に失敗しました。");
    }
  };

  return (
    <div style={styles.container}>
      <h2>新規登録</h2>
      <form onSubmit={handleRegister} style={styles.form}>
        <input
          type="email"
          placeholder="メールアドレス"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
        />
        <input
          type="text"
          placeholder="ユーザーネーム"
          value={UserName}
          onChange={(e) => setUserName(e.target.value)}
          style={styles.input}
        />
        <input
          type="password"
          placeholder="パスワード"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />
        <button type="submit" style={styles.button}>登録</button>

        <p style={{ marginTop: "20px" }}>
          すでにアカウントをお持ちの方は
        </p>
        <Link to="/login">ログインページへ</Link>
        {error && <p style={styles.error}>{error}</p>}
      </form>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "300px",
    margin: "50px auto",
    textAlign: "center",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  input: {
    marginBottom: "10px",
    padding: "8px",
    fontSize: "16px",
  },
  button: {
    padding: "10px",
    fontSize: "16px",
    backgroundColor: "#2196F3",
    color: "#fff",
    border: "none",
    cursor: "pointer",
  },
  error: {
    color: "red",
    marginTop: "10px",
  },
};

export default Register;
