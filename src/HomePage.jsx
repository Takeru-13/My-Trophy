import React from "react";
import { Link } from "react-router-dom";
import './styles/Home-page.css';

function HomePage() {
  return (
    <div>
      <div className="title-logo">
        <img src="/images/trophy-logo.png" alt="Trophy Logo" />
      </div>

      <div className="contents">
        <h1>
          人生の中で得た珍しい経験や努力の成果を、「トロフィー」として可視化・記録・整理・共有。
        </h1>
        <p>
          トロフィーを追加して、あなたの成果を記録しましょう。
        </p> 
        <Link to="/login">
          ログイン
        </Link>
        <Link to="/register">
          新規登録
        </Link>

        <div className="images-contents">
          <img src="/images/bronze.png" alt="ブロンズトロフィー" />
          <img src="/images/silver.png" alt="シルバートロフィー" />
          <img src="/images/gold.png" alt="ゴールドトロフィー" />
          <img src="/images/rainbow.png" alt="レインボートロフィー" />
        </div>

        <div className="how">
          <img className="explanation-image" src="/images/explanation-image1.png" alt="トロフィー追加方法" />
          <p>
            +ADDTROPHYからトロフィーを追加できます。
          </p>
          
          <img className="explanation-image" src="/images/explanation-image2.png" alt="フォーム入力" />
          <p>
            フォームに「トロフィータイトル」「カテゴリ」「トロフィーランク」「エピソード」「日付」
            を入力。
          </p>
          <p>
            「トロフィーランク」は自分の思いのまま選びましょう。GETを押せば完了です。
          </p>

          <img className="explanation-image" src="/images/explanation-image4.png" alt="トロフィー一覧" />
          <p>
            MENU➡トロフィー一覧からトロフィーリスト全体が見れます。
          </p>
          
          <img className="explanation-image" src="/images/explanation-image5.png" alt="他のユーザー" />
          <p>
            他のユーザーのトロフィーも見ることができます。
          </p>
        </div>
      </div>
    </div>
  );
}

export default HomePage;