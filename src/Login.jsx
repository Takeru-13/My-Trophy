import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase";
import { Link } from "react-router-dom";
import "./styles/Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/home");
    } catch (err) {
      setError("ログインに失敗しました。");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">ログイン</h2>
        <form onSubmit={handleLogin} className="login-form">
          <input
            type="email"
            placeholder="メールアドレス"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="login-input"
            required
          />
          <input
            type="password"
            placeholder="パスワード"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="login-input"
            required
          />
          <button type="submit" className="login-button">
            ログイン
          </button>
          {error && <p className="login-error">{error}</p>}
        </form>

        <p className="login-text">
          アカウントをお持ちでない方は
        </p>
        <Link to="/register" className="login-link">
          新規登録
        </Link>

        <p className="login-text">
          パスワードを忘れた方は
        </p>
        <Link to="/reset-password" className="login-link">
          こちら
        </Link>
      </div>
    </div>
  );
}

export default Login;