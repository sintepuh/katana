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
import { useUpdateTheme } from "@/features/profile/api/use-update-theme"
import { motion } from "framer-motion"

export function ThemeSwitcher() {
  const { setTheme, resolvedTheme } = useTheme()
  const { mutate } = useUpdateTheme();



  const handleThemeChange = (theme: "light" | "dark" | "system") => {
    setTheme(theme)
    mutate({ form: { theme } });
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="circle" size="icon" className="relative">
          <span className="relative flex items-center justify-center w-[1.2rem] h-[1.2rem]">
            {/* Солнце */}
            <motion.div
              className="absolute"
              initial={false}
              animate={{
                rotate: resolvedTheme === "dark" ? -90 : 0,
                scale: resolvedTheme === "dark" ? 0 : 1,
                opacity: resolvedTheme === "dark" ? 0 : 1,
              }}
              transition={{ duration: 0.3 }}
            >
              <Sun className="h-[1.2rem] w-[1.2rem]" />
            </motion.div>

            <motion.div
              className="absolute"
              initial={false}
              animate={{
                rotate: resolvedTheme === "dark" ? 0 : 90,
                scale: resolvedTheme === "dark" ? 1 : 0,
                opacity: resolvedTheme === "dark" ? 1 : 0,
              }}
              transition={{ duration: 0.3 }}
            >
              <Moon className="h-[1.2rem] w-[1.2rem]" />
            </motion.div>
          </span>

          <span className="sr-only">Toggle theme</span>
        </Button>

      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleThemeChange("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleThemeChange("dark")}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleThemeChange("system")}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
