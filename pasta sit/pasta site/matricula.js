function finalizarMatricula() {
  const campos = document.querySelectorAll('input[required], select[required]');
  for (const campo of campos) {
    if (!campo.value.trim()) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      campo.focus();
      return;
    }
  }

  alert("✅ Matrícula finalizada com sucesso!\nVocê será redirecionado para a página principal.");

  setTimeout(() => {
    window.location.href = "pagina-principal.html";
  }, 2000);
}
