const validEmail = 'user@test.com';
const validPassword = 'Password123';

document.addEventListener('DOMContentLoaded', () => {
  const signInButton = document.querySelector('[data-testid="sign-in-button"]');
  const createAccountButton = document.querySelector('[data-testid="create-account-button"]');
  if (signInButton) {
    signInButton.addEventListener('click', () => {
      window.location.href = '/html/signin.html';
    });
  }
  if (createAccountButton) {
    createAccountButton.addEventListener('click', () => {
      window.location.href = '/html/create-account.html';
    });
  }

  const signinForm = document.getElementById('signin-form');
  if (signinForm) {
    signinForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      const error = document.getElementById('signin-error');
      if (email === validEmail && password === validPassword) {
        window.location.href = 'dashboard.html';
      } else {
        error.textContent = 'Invalid email or password.';
      }
    });
  }

  const createForm = document.getElementById('create-account-form');
  if (createForm) {
    createForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const message = document.getElementById('create-account-message');
      message.textContent = 'Account created successfully!';
    });
  }
});
