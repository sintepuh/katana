"use client";

import { RootState } from "@/app/store/store";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

// const getTheme = async () => {
//     const { account } = await createSessionClient();
//     const theme = await account.getPrefs()
//     return theme
// }


export default function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [appliedTheme, setAppliedTheme] = useState<string | null>(null);
    const themeFromServer = useSelector((state: RootState) => state.user.user?.prefs.theme)


    useEffect(() => {
        const storedTheme = localStorage.getItem("theme");
        if (storedTheme) {
            document.body.setAttribute("data-theme", storedTheme);
            setAppliedTheme(storedTheme);
        }
    }, []);

    useEffect(() => {
        if (themeFromServer && themeFromServer !== appliedTheme) {
            document.body.setAttribute("data-theme", themeFromServer);
            localStorage.setItem("theme", themeFromServer);
            setAppliedTheme(themeFromServer);
        }
    }, [themeFromServer, appliedTheme]);

    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

        const handleChange = () => {
            const newSystemTheme = mediaQuery.matches ? 'dark' : 'light';
            const storedTheme = localStorage.getItem("theme");

            if (!storedTheme) {
                document.body.setAttribute("data-theme", newSystemTheme);
                setAppliedTheme(newSystemTheme);
            }
        };

        mediaQuery.addEventListener("change", handleChange);
        return () => mediaQuery.removeEventListener("change", handleChange);
    }, []);

    return <>{children}</>;
}
