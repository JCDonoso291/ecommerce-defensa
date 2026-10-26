import { createContext, useState, useEffect } from "react";

export const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [tema, setTema] = useState(
    localStorage.getItem("tema") || "claro"
  );

  useEffect(() => {
    localStorage.setItem("tema", tema);
  }, [tema]);

    const cambiarTema = () => {
    if (tema === "claro") {
        setTema("oscuro");
    } else {
        setTema("claro");
    }
    };

  return (
    <ThemeContext.Provider value={{ tema, cambiarTema }}>
      {children}
    </ThemeContext.Provider>
  );
}

