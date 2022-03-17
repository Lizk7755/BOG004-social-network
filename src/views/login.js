export default () => {
  const viewLogin = `  
    <section id="login-user">
    <div class="section-left">

      <img src="img/logo.png" alt="logo-mommi" class="logo-mommi">
      <h1 class="welcome-text">Te damos la bienvenida a mommi</h1>
      <h2 class="slogan">Maternidad y crianza</h2>

      <form onsubmit="return false;" class="form-validation">

        <input id= "loginEmail" type="text" placeholder="Ingrese su correo electrónico" class="btn input-validation"><br>
        <input id= "loginPassword" type="password" placeholder="Ingrese su contraseña" class="btn input-validation">
        <p>¿Olvidaste tu contraseña?</p>
        <button id="loginBtn" class="btn btn-login">Iniciar Sesión</button>

        <p>O</p>

        <button class="btn btn-continue-with btn-goo">
          <img src="img/google.png" alt="google">
          Continuar con Google
        </button>

        <button class="btn btn-continue-with btn-face">
          <img src="img/facebook.png" alt="facebook">
          Continuar con Facebook
        </button>

        <p>¿Aún no estás en mommi? Regístrate</p>

      </form>
    </div>

    <div class="section-picture-picture">
      <img src="img/picturemom.png" alt="logo-mommi" class="poster-mommi">
    </div>
    </section>
          `;
  const divElement = document.createElement('section');
  divElement.innerHTML = viewLogin;
  return divElement;
};
