import { Link } from "react-router-dom";

export default function Register() {
  return (
    <div
      style={{
        maxWidth: 400,
        margin: "2rem auto",
        padding: "1rem",
        border: "1px solid #ccc",
        borderRadius: 6,
      }}
    >
      <h1>Registro</h1>
      <form>
        <label>
          Nombre:
          <input
            type="text"
            placeholder="Tu nombre"
            required
            style={{ width: "100%", padding: "8px", margin: "8px 0" }}
          />
        </label>
        <label>
          Email:
          <input
            type="email"
            placeholder="tuemail@example.com"
            required
            style={{ width: "100%", padding: "8px", margin: "8px 0" }}
          />
        </label>
        <label>
          Contraseña:
          <input
            type="password"
            placeholder="Contraseña"
            required
            style={{ width: "100%", padding: "8px", margin: "8px 0" }}
          />
        </label>
        <button
          type="submit"
          style={{ padding: "10px 15px", cursor: "pointer" }}
        >
          Registrarse
        </button>
      </form>
      <p style={{ marginTop: "1rem" }}>
        ¿Ya tenés cuenta? <Link to="/login">Ingresá acá</Link>
      </p>
    </div>
  );
}
