"use client";

import { useEffect, useState } from "react";
import { useGetTheme } from "../api/use-get-theme";

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
    const { data: themeFromServer, refetch } = useGetTheme();
    const [appliedTheme, setAppliedTheme] = useState<string | null>(null);

    useEffect(() => {
        const storedTheme = localStorage.getItem("theme");
        if (storedTheme) {
            document.body.setAttribute("data-theme", storedTheme);
            setAppliedTheme(storedTheme);
        }
    }, []);

    useEffect(() => {
        refetch();
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
