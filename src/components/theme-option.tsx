import { useUpdateTheme } from "./theme-switcher/api/use-update-theme";

interface ThemeSwithcerProps {
    theme: "light" | "dark";
    children?: React.ReactNode;
}

export const ThemeOption = ({
    theme,
    children
}: ThemeSwithcerProps) => {

    const { mutate } = useUpdateTheme();
    const setTheme = () => {
        document.querySelector("body")?.setAttribute("data-theme", theme);
        mutate(theme);
    };

    return (
        <div
            className="h-full flex-grow hover:bg-slate-300 flex items-center justify-center rounded-sm"
            onClick={setTheme}
        >
            {children}
        </div>
    );
};
