import { Route, Routes } from "react-router-dom";
import Register from "@/pages/Register";
import Login from "@/pages/Login";
import UserHeroPage from "@/pages/UserHeroPage";
import GuestHeroPage from "@/pages/GuestHeroPage";
import { useEffect, useState } from "react";
import Success from "@components/stripe/Success";
import PaymentForm from "@components/stripe/PaymentForm";
import TransactionsHistory from "@components/TransactionsHistory";
import Tariff from "@components/tariff/Tariff";
import ResetPassword from "@/pages/ResetPassword";
import Header from "@components/header/Header";
import VideoTranslation from "@components/VideoTranslation";
import TranslatedVideosHistory from "@components/TranslatedVideosHistory";

const MyRoutes = () => {
  const [isLogin, setIsLogin] = useState<string | null>(null);

  useEffect(() => {
    setIsLogin(localStorage.getItem("userId"));
  }, []);

  return (
    <>
      {!["/login", "/register"].includes(window.location.pathname) && (
        <Header />
      )}
      <Routes>
        <Route
          path="/"
          element={isLogin ? <UserHeroPage /> : <GuestHeroPage />}
        />

        {/* Auth routes */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={isLogin ? <UserHeroPage /> : <Login />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* User routes */}
        <Route path="/home" element={<UserHeroPage />} />
        <Route path="/my-transactions" element={<TransactionsHistory />} />
        <Route path="/tariffs" element={<Tariff />} />

        {/* Payment routes */}
        <Route path="/pay/:tariffId" element={<PaymentForm />} />
        <Route path="/success" element={<Success />} />

        {/* Guest routes */}
        <Route path="/guest" element={<GuestHeroPage />} />

        {/*Video translation routes*/}
        <Route path="/video-translation" element={<VideoTranslation />} />
        <Route
          path="/trans-videos-history"
          element={<TranslatedVideosHistory />}
        />
      </Routes>
    </>
  );
};

export default MyRoutes;