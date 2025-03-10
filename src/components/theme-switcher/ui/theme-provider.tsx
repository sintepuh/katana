"use client";

import { useEffect } from "react";
import { useGetTheme } from "../api/use-get-theme";

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
    const { data: theme, refetch } = useGetTheme();

    useEffect(() => {
        refetch();
    }, []);

    useEffect(() => {
        if (theme) {
            document.querySelector("body")?.setAttribute("data-theme", theme);
        }
    }, [theme]);

    return <>{children}</>;
}
