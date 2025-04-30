import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { Link } from "react-router-dom";
import { auth, db } from "./firebase"; // dbを追加
import IconSelector from "./IconSelector";
import './styles/login.css';

function Register() {
  const [email, setEmail] = useState("");
  const [userName, setuserName] = useState(""); 
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [selectedIcon, setSelectedIcon] = useState("icon1.png");

  const isValidPassword = (password) => {
    return /^(?=.*[a-zA-Z])(?=.*\d)[A-Za-z\d]{8,}$/.test(password);
  };
  

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!isValidPassword(password)) {
      setError("パスワードは8文字以上の半角英数字を含めてください。");
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

// Firestoreにユーザー情報を追加
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name:  userName,//ユーザーネームを決定
        email: email, // メールアドレスを追加
        level: 1, // 初期レベル
        experience: 0, // 初期経験値
        icon: selectedIcon, // ここで保存！
// 他の必要なフィールドを追加
      });

      navigate("/home");
    } catch (err) {
      console.error("登録エラー:", err);
      setError("登録に失敗しました：" + err.message); // エラー内容も表示
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
          value={userName}
          onChange={(e) => setuserName(e.target.value)}
          style={styles.input}
        />
        <input
          type="password"
          placeholder="パスワード(半角英数字8桁以上)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />

        <div className="icon-selection">
          <p>アイコン選択</p>
          {["icon1.png", "icon2.png", "icon3.png", "icon4.png","icon5.png"].map((icon) => (
            <img
              key={icon}
              src={`/user-icon/${icon}`}
              alt={icon}
              className={`icon-option ${selectedIcon === icon ? "selected" : ""}`}
              onClick={() => setSelectedIcon(icon)}
              style={{ width: 50, cursor: "pointer", border: selectedIcon === icon ? "2px solid aqua" : "none" }}
            />
          ))}
        </div>
        


        <button type="submit" style={styles.button}>登録</button>

        <p style={{ marginTop: "20px" }}>
          すでにアカウントをお持ちの方は
        </p>
        <Link
  to="/login"
  style={styles.link}
  onMouseEnter={(e) => {
    e.target.style.backgroundColor = styles.linkHover.backgroundColor;
    e.target.style.color = styles.linkHover.color;
  }}
  onMouseLeave={(e) => {
    e.target.style.backgroundColor = "transparent";
    e.target.style.color = styles.link.color;
  }}
>
  ログインページへ
</Link>
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
    marginTop: "20px",
    fontSize: "16px",
    backgroundColor: "#2196F3",
    color: "#fff",
    border: "none",
    cursor: "pointer",
  },
  link: {
    color: "aqua",
    textDecoration: "none",
    padding: "20px 30px",
    transition: "all 0.3s ease",
  },
  linkHover: {
    backgroundColor: "aqua",
    color: "black",
  },
  error: {
    color: "red",
    marginTop: "10px",
  },
};

export default Register;
