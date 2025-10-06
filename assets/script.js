document.getElementById('ctaButton').addEventListener('click', () => {
  const contact = document.getElementById('contact');
  contact.scrollIntoView({ behavior: 'smooth' });
});

document.getElementById('contactForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const status = document.getElementById('formStatus');
  status.textContent = 'Thanks! We will reach out shortly.';
});


