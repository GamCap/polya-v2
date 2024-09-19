"use client";
import { useTheme } from "next-themes";
import { memo, useEffect } from "react";

const ThemeChanger = ({ theme }: { theme: "light" | "dark" }) => {
  const { setTheme } = useTheme();

  useEffect(() => {
    setTheme(theme);
  }, [setTheme, theme]);

  return null;
};

export default memo(ThemeChanger);
