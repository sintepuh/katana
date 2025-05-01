import { useUpdateProfile } from "@/features/profile/api/use-update-profile";

interface ThemeOptionProps {
  theme: "light" | "dark" | "system";
  activeTheme: "light" | "dark" | "system";
  onClick: (theme: "light" | "dark" | "system") => void;
  children?: React.ReactNode;
}

export const ThemeOption = ({ theme, activeTheme, onClick, children }: ThemeOptionProps) => {
  const { mutate } = useUpdateProfile();
  const isActive = theme === activeTheme;

  const handleClick = () => {
    onClick(theme);
    mutate({ form: { theme } });
  };

  return (
    <div
      className={`h-full flex-grow flex items-center justify-center rounded-sm cursor-pointer transition hover:bg-accent ${isActive ? "border-2 border-[#e13a60]" : ""
        }`}
      onClick={handleClick}
    >
      {children}
    </div>
  );
};
