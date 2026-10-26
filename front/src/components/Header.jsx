import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext.jsx";

function Header() {
  const { tema, cambiarTema } = useContext(ThemeContext);

  return (
    <header>
      <h2>Mi tienda online</h2>
      <p>Tema actual: {tema}</p>
      <button onClick={cambiarTema}>
        Cambiar tema
      </button>
    </header>
  );
}

export default Header;
