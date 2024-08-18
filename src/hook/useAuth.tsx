import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { auth } from "../api/setting_firebase";


export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user); // 로그인된 유저가 있으면 상태 업데이트
      } else {
        setUser(null); // 로그인된 유저가 없으면 상태 초기화
      }
      setLoading(false); // 로딩 상태 종료
    });

    // 컴포넌트가 언마운트될 때 구독 해제
    return () => unsubscribe();
  }, []);

  return { user, loading };
};
