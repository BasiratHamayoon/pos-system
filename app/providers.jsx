"use client";

import { Provider } from "react-redux";
import { store } from "@/store/store";
import { useEffect } from "react";
import { useSelector } from "react-redux";

function ThemeInitializer({ children }) {
  const { mode } = useSelector((state) => state.theme);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(mode);
    localStorage.setItem("theme", mode);
  }, [mode]);

  return children;
}

export default function Providers({ children }) {
  return (
    <Provider store={store}>
      <ThemeInitializer>{children}</ThemeInitializer>
    </Provider>
  );
}