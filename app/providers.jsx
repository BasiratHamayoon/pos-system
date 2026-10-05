"use client";

import { Provider, useDispatch, useSelector } from "react-redux";
import { store } from "@/store/store";
import { useEffect, useState } from "react";
import { loginSuccess } from "@/store/slices/authSlice";

function ThemeAndAuthInitializer({ children }) {
  const { mode } = useSelector((state) => state.theme);
  const dispatch = useDispatch();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(mode);
    localStorage.setItem("theme", mode);
  }, [mode]);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      dispatch(loginSuccess(JSON.parse(user)));
    }
    setMounted(true);
  }, [dispatch]);

  if (!mounted) return null;

  return children;
}

export default function Providers({ children }) {
  return (
    <Provider store={store}>
      <ThemeAndAuthInitializer>{children}</ThemeAndAuthInitializer>
    </Provider>
  );
}