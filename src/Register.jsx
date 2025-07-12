import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { Link } from "react-router-dom";
import { auth, db } from "./firebase";
import IconSelector from "./IconSelector";
import './styles/Roguin.css';

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
        name: userName,
        email: email,
        level: 1,
        experience: 0,
        icon: selectedIcon,
      });

      navigate("/home");
    } catch (err) {
      console.error("登録エラー:", err);
      setError("登録に失敗しました：" + err.message);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">新規登録</h2>
        <form onSubmit={handleRegister} className="login-form">
          <input
            type="email"
            placeholder="メールアドレス"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="login-input"
            required
          />
          <input
            type="text"
            placeholder="ユーザーネーム"
            value={userName}
            onChange={(e) => setuserName(e.target.value)}
            className="login-input"
            required
          />
          <input
            type="password"
            placeholder="パスワード(半角英数字8桁以上)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="login-input"
            required
          />

          <div className="icon-selection">
            <p className="icon-selection-title">アイコン選択</p>
            <div className="icon-options">
              {["icon1.png", "icon2.png", "icon3.png", "icon4.png", "icon5.png"].map((icon) => (
                <img
                  key={icon}
                  src={`/user-icon/${icon}`}
                  alt={icon}
                  className={`icon-option ${selectedIcon === icon ? "selected" : ""}`}
                  onClick={() => setSelectedIcon(icon)}
                />
              ))}
            </div>
          </div>

          <button type="submit" className="login-button">登録</button>
        </form>

        <p className="login-text">
          すでにアカウントをお持ちの方は
        </p>
        <Link to="/login" className="login-link">
          ログインページへ
        </Link>
        
        {error && <p className="login-error">{error}</p>}
      </div>
    </div>
  );
}

export default Register;