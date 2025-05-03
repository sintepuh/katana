"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { motion } from "framer-motion"

export function ModeToggle() {
    const { setTheme, theme } = useTheme();

    // Проверяем, что тема была загружена
    if (theme === undefined) return null;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                    {/* Анимированная иконка Sun */}
                    <motion.div
                        className="relative"
                        initial={{ rotate: 0, scale: 1 }}
                        animate={{
                            rotate: theme === "dark" ? -90 : 0,
                            scale: theme === "dark" ? 0 : 1,
                        }}
                        transition={{ duration: 0.3 }}
                    >
                        <Sun className="h-[1.2rem] w-[1.2rem]" />
                    </motion.div>

                    {/* Анимированная иконка Moon */}
                    <motion.div
                        className="absolute top-0 left-0"
                        initial={{ rotate: 90, scale: 0 }}
                        animate={{
                            rotate: theme === "dark" ? 0 : 90,
                            scale: theme === "dark" ? 1 : 0,
                        }}
                        transition={{ duration: 0.3 }}
                    >
                        <Moon className="h-[1.2rem] w-[1.2rem]" />
                    </motion.div>

                    <span className="sr-only">Toggle theme</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTheme("light")}>
                    Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>
                    Dark
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>
                    System
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}