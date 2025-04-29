// src/utils/firestoreUtils.js

import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";

// ユーザーごとのトロフィーを取得
export const fetchTrophiesByUser = async (uid) => {
  const q = query(collection(db, "trophies"), where("uid", "==", uid));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => doc.data());
};

// トロフィーの合計ポイントを計算
export const calculatePoints = (trophies) => {
  let points = 0;
  trophies.forEach((trophy) => {
    switch (trophy.rank) {
      case "ブロンズ":
        points += 1;
        break;
      case "シルバー":
        points += 5;
        break;
      case "ゴールド":
        points += 10;
        break;
      case "レインボー":
        points += 25;
        break;
      default:
        break;
    }
  });
  return points;
};

// ポイントに応じたレベルを算出
export const calculateLevel = (points) => {
  return Math.floor(points / 10) + 1;
};
