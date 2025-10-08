# my-trophy-app
##人生の中で得た珍しい経験や努力の成果を、「トロフィー」として可視化・記録・整理・共有。
<img src="https://github.com/user-attachments/assets/bbdc5c19-4258-4450-8695-17446b1512ad" alt="MyTrophy Banner" style="width:100%;height:auto;" />
[🔗 アプリを見る](https://mytrophy.netlify.app/) | [💻 ソースコード](https://github.com/Takeru-13/My-Trophy)  

## 📌 アプリ概要
My Trophyは、日常の経験や達成を「トロフィー」としてコレクションできるWebアプリです。  
ゲームの実績のように、自分の思い出や成果を可視化して残すことを目的にしています。  

---

## 🎯 ターゲット
- 自分の成長や思い出をゲーム感覚で記録したい人  
- 達成感を形にして残したい人


## ✨ 主な機能と特徴
- Firebase認証によるユーザーログイン  
- トロフィーの追加 / 編集 / 削除  
- ランク別ポイント計算（ブロンズ, シルバー, ゴールド, レインボー）  
- レベルシステムによる進行度表示  
- 最新のトロフィーをホーム画面に表示
- 他のユーザーのトロフィーをホーム画面に表示(いいね機能付き)
- Firestoreによるデータ永続化
- blenderを用いた自作トロフィーデザイン

---

## 📌 制作経緯
「日々の経験や小さな達成を、ゲームのように楽しく記録できたら面白いのでは？」
そんな発想から、このアプリは生まれました。

ある日のこと。深夜に友人とドライブをしながら人生について語り合っていたとき、
ふと友人がこんなことを口にしました。

「人生って、トロフィー集めみたいなところあるよな」

その言葉に私は思わず返しました。

「じゃあレインボートロフィーって、何をしたら手に入るんだろうか。超資産家のおじいさんを事故から助けるとか?」

と、そのような何気ないやりとりが心に残り、「人生をトロフィーとして可視化するアプリ」というアイデアへと繋がっていき、My Trophy の開発が始まりました。

Web開発の学習を兼ねて、**React + Firebaseによる基本的なCRUDアプリ構築**を目標に制作。  
ログイン、データ保存、ポイント計算、一覧表示といったWebアプリの基礎要素を体験できる内容になっています。  

---

## 📸 スクリーンショット
## 🏆 MyTrophy – Screenshots

<div align="center">

<!-- 1段目：ホーム / 一覧 -->
<table>
  <tr>
    <td align="center">
      <!-- Home（レベルバー & 最近トロフィー） -->
      <img src="https://github.com/user-attachments/assets/043816f9-7c46-4335-8831-c0a5f00c3c78" width="430" alt="MyTrophy Home – レベルバーと最近のトロフィー" />
      <div><sub>ホーム：レベル・経験値バー / 最近のトロフィー</sub></div>
    </td>
    <td align="center">
      <!-- List（並び替え・検索） -->
      <img src="https://github.com/user-attachments/assets/30a90441-4433-4dd8-80ef-936c7c178051" width="430" alt="MyTrophy List – 並び替えと検索" />
      <div><sub>一覧：並び替え / 検索</sub></div>
    </td>
  </tr>
</table>

<!-- 2段目：カード一覧 / 追加フォーム -->
<table>
  <tr>
    <td align="center">
      <!-- Cards（カード装飾 & 詳細） -->
      <img src="https://github.com/user-attachments/assets/49d2326f-bf0a-4df6-bfa4-6d706929368c" width="430" alt="MyTrophy Cards – トロフィーのカード表示" />
      <div><sub>カード：トロフィー詳細カード（装飾付き）</sub></div>
    </td>
    <td align="center">
      <!-- Add Form（追加） -->
      <img src="https://github.com/user-attachments/assets/e8da9b09-7db6-4c4e-b367-d66db7a56a95" width="430" alt="MyTrophy Add – トロフィー追加フォーム" />
      <div><sub>追加フォーム：トロフィーを新規登録</sub></div>
    </td>
  </tr>
</table>

<!-- モバイル縦長は単独で -->
<p align="center">
  <img src="https://github.com/user-attachments/assets/6f0d85ac-ddbb-426e-bd5c-f5d781002ae7" width="360" alt="MyTrophy Feed (Mobile) – 他ユーザーの新着トロフィー" /><br/>
  <sub>モバイル：他ユーザーの新着トロフィー（フィード）</sub>
</p>
---

## 🛠 技術スタック
- **Frontend:** React (CRA) + JavaScript + CSS  
- **Backend & DB:** Firebase Authentication + Firestore  
- **Infra:** Netlify デプロイ  

---
## 🚀 今後のアップデート予定
- 検索・ソート機能：トロフィーをカテゴリーや日付で整理して探せるようにする
- ユーザーアイコン & プロフィール：自分のページを少しSNS的にカスタマイズ
- 他ユーザーとの交流
- デザイン改善：CSSをよりモダンにして、ゲーム風のUIをブラッシュアップ
- 通知機能：達成や追加をリマインドして、記録の継続をサポート
- PWA対応：スマホからもアプリのように使えるようにする

---

## 💡 苦労した点
My Trophy は、私にとって初めて作った本格的なWebアプリでした。
そのため、最初は右も左もわからず、何をどう進めればいいのか迷う連続でした。

「フレームワークって何？」「デプロイってどうやるの？」「DBとfetchの関係は？」
といった基礎的な疑問に立ち止まりながら、少しずつ理解を積み重ねていきました。

特に苦労したのは以下の点です：

JavaScriptやCSSの基礎理解：仕組みをきちんと把握できていなかったため、ちょっとしたエラーでも立ち止まってしまう

Reactとは何か：コンポーネントやHooksの概念を手探りで学びつつ開発を進めた

Firebaseとの接続：ログインやFirestoreへのデータ保存の仕組みに何度もつまずいた

デザイン：Tailwind導入に挑戦したがうまくいかず、結局はシンプルなCSSで整える形に落ち着いた

デプロイやGitHub運用：リポジトリのpushやNetlifyでの公開も最初は分からないことだらけだった

こうした一つひとつの壁に時間をかけながらも、試行錯誤する中で確実に理解を深めていくことができました。
結果として、このアプリは 「学習の記録そのもの」 でもあり、初めての挑戦として大きな意味を持っています。
