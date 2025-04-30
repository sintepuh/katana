import { useUpdateTheme } from "./theme-switcher/api/use-update-theme";

interface ThemeOptionProps {
  theme: "light" | "dark" | "system";
  activeTheme: "light" | "dark" | "system";
  onClick: (theme: "light" | "dark" | "system") => void;
  children?: React.ReactNode;
}

export const ThemeOption = ({ theme, activeTheme, onClick, children }: ThemeOptionProps) => {
  const { mutate } = useUpdateTheme();
  const isActive = theme === activeTheme;

  const handleClick = () => {
    onClick(theme);
    mutate(theme);
  };

  return (
    <div
      className={`h-full flex-grow flex items-center justify-center rounded-sm cursor-pointer transition hover:bg-accent ${
        isActive ? "border-2 border-[#e13a60]" : ""
      }`}
      onClick={handleClick}
    >
      {children}
    </div>
  );
};
