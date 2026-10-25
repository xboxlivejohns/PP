document.querySelectorAll('.comparison input').forEach((input) => {
  input.addEventListener('input', () => input.closest('.comparison').style.setProperty('--position', `${input.value}%`));
});
document.querySelector('#preview-form')?.addEventListener('submit', (event) => {
  event.preventDefault();
  document.querySelector('#form-status').textContent = 'Preview complete. No enquiry or photos have been sent.';
});
