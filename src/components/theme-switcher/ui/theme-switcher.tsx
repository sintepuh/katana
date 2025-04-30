import { useEffect, useState } from "react";
import { MdLightMode } from "react-icons/md";
import { MdDarkMode } from "react-icons/md";
import { TbSunMoon } from "react-icons/tb";
import { ThemeOption } from "@/components/theme-option";

export const ThemeSwitcher = () => {
  const [activeTheme, setActiveTheme] = useState<"light" | "dark" | "system">("system");

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    if (stored === "light" || stored === "dark") {
      setActiveTheme(stored);
    } else {
      setActiveTheme("system");
    }
  }, []);

  const handleChangeTheme = (newTheme: "light" | "dark" | "system") => {
    if (newTheme === "system") {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.body.setAttribute("data-theme", prefersDark ? "dark" : "light");
      localStorage.removeItem("theme");
    } else {
      document.body.setAttribute("data-theme", newTheme);
      localStorage.setItem("theme", newTheme);
    }

    setActiveTheme(newTheme);
  };

  return (
    <div className="h-10 flex justify-around gap-2">
      <ThemeOption theme="light" activeTheme={activeTheme} onClick={handleChangeTheme}>
        <MdLightMode />
      </ThemeOption>
      <ThemeOption theme="dark" activeTheme={activeTheme} onClick={handleChangeTheme}>
        <MdDarkMode />
      </ThemeOption>
      <ThemeOption theme="system" activeTheme={activeTheme} onClick={handleChangeTheme}>
        <TbSunMoon />
      </ThemeOption>
    </div>
  );
};
