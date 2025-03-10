
import { TbSunMoon } from "react-icons/tb";
import { MdLightMode } from "react-icons/md";
import { MdDarkMode } from "react-icons/md";
import { ThemeOption } from "@/components/theme-option";
export const ThemeSwithcer = () => {

    return (
        <div className="h-10 flex justify-around gap-2">
            <ThemeOption theme='light'>
                <MdLightMode />
            </ThemeOption>
            <ThemeOption theme='dark'>
                <MdDarkMode />
            </ThemeOption>
            <ThemeOption theme='dark'>
                <TbSunMoon />
            </ThemeOption>
        </div>
    )
}