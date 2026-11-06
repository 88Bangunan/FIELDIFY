import { createContext, useState } from "react";

export const ThemeProvider = ({children}) => {

    const [theme, setTheme] = useState('light')

    return (
        <ThemeContext value={{theme, setTheme}}>
            {children}
        </ThemeContext>
    )
}
// eslint-disable-next-line react-refresh/only-export-components
export const ThemeContext = createContext('light')