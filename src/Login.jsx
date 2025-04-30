import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase";
import { Link } from "react-router-dom";

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
    <div style={styles.container}>
      <h2>ログイン</h2>
      <form onSubmit={handleLogin} style={styles.form}>
        <input
          type="email"
          placeholder="メールアドレス"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
        />
        <input
          type="password"
          placeholder="パスワード"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />
        <button type="submit" style={styles.button}>ログイン</button>
        {error && <p style={styles.error}>{error}</p>}
      </form>

      <p style={{ marginTop: "20px", marginBottom: "20px" }}>
        アカウントをお持ちでない方は
      </p>
      <Link
  to="/register"
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
  新規登録
</Link>

    
      <p style={{ marginTop: "20px", marginBottom: "20px" }}>
        パスワードを忘れた方は
      </p>

      <Link
  to="/reset-password"
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
  こちら
</Link>

      
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
    backgroundColor: "#4CAF50",
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

export default Login;