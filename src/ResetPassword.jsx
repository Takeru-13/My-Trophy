
import React, { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "./firebase"; // 自分のfirebase設定ファイルからauthをimportしてね
import { Link } from "react-router-dom";

function ResetPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("パスワードリセット用のメールを送信しました！");
      setError(""); // 成功したらエラーは消す
    } catch (err) {
      console.error("パスワードリセットエラー:", err);
      setError("リセットに失敗しました：" + err.message);
      setMessage(""); // エラーが出たらメッセージは消す
    }
  };

  return (
    <div className="login-container" >
      <h2 style={{ width: "80%", textAlign: "center", margin: "20px auto"}}>パスワードリセット</h2>
      <form onSubmit={handleResetPassword} className="login-form" style={{ width: "80%", textAlign: "center", margin: "20px auto"}}>
        <input
        style={{height: "30px", width: "250px"}}
          type="email"
          placeholder="登録したメールアドレス"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit" style={{height: "35px"}}>リセットメールを送信</button>
      </form>

      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}

      <p>
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
      </p>
    </div>
  );
}
const styles = {

    link: {
      color: "aqua",
      textDecoration: "none",
      transition: "all 0.3s ease",
      textAlign: "center",
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

export default ResetPassword;

