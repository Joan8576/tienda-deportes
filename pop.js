    const form = document.getElementById('formContacto');
    const popup = document.getElementById('mensajeEnviado');
    const cerrarPopup = document.getElementById('cerrarPopup');

    form.addEventListener('submit', e => {
      e.preventDefault();
      popup.classList.remove('hidden');
      form.reset();
    });

    cerrarPopup.addEventListener('click', () => {
      popup.classList.add('hidden');
    });