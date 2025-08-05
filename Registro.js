function showLogin() {
  document.getElementById("login-form").classList.add("active");
  document.getElementById("register-form").classList.remove("active");
  document.querySelectorAll(".toggle-btn")[0].classList.add("active");
  document.querySelectorAll(".toggle-btn")[1].classList.remove("active");
}

function showRegister() {
  document.getElementById("login-form").classList.remove("active");
  document.getElementById("register-form").classList.add("active");
  document.querySelectorAll(".toggle-btn")[1].classList.add("active");
  document.querySelectorAll(".toggle-btn")[0].classList.remove("active");
}