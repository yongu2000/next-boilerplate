"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// 보호된 라우트를 감싸는 컴포넌트
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login"); // 🔥 로그인되지 않은 경우 로그인 페이지로 리다이렉트
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, router]);

  if (loading) return null; // ✅ 리다이렉트 중 화면 깜빡임 방지 (로딩 상태)

  return <>{children}</>;
};

export default ProtectedRoute;