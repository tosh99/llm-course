/* eslint-disable react-refresh/only-export-components */
import * as React from "react"

type ThemeProviderProps = {
  children: React.ReactNode
}

const ThemeProviderContext = React.createContext<undefined>(undefined)

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  React.useEffect(() => {
    document.documentElement.classList.remove("light")
    document.documentElement.classList.add("dark")
  }, [])

  return (
    <ThemeProviderContext.Provider {...props} value={undefined}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => ({ theme: "dark" as const, setTheme: () => {} })
