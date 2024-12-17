"use client";

import { Switch } from "@nextui-org/react";
import { MoonIcon, SunIcon } from "@nextui-org/shared-icons";
import { useTheme } from "next-themes";

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  const handleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <Switch
        checked={theme === "dark"}
        size="lg"
        color="success"
        onChange={handleTheme}
        startContent={<SunIcon />}
        endContent={<MoonIcon />}
      />
  )
};
