"use client";

import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setTheme } from "@/store/slices/themeSlice";

export function useThemeMode() {
  const { mode } = useSelector((state) => state.theme);
  const dispatch = useDispatch();

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(mode);
  }, [mode]);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved) {
      dispatch(setTheme(saved));
    }
  }, [dispatch]);

  useEffect(() => {
    localStorage.setItem("theme", mode);
  }, [mode]);

  return mode;
}