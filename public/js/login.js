// login.js

document.addEventListener('DOMContentLoaded', () => {
    const forgotPasswordLink = document.querySelector('.forgot-pass');
  
    if (forgotPasswordLink) {
      forgotPasswordLink.addEventListener('click', () => {
        // Redirect to the forgot password page
        window.location.href = 'forgotpwd.html';
      });
    }
  
    async function formSubmit(e) {
      try {
        e.preventDefault();
        const details = {
          email: e.target.email.value,
          password: e.target.password.value,
        };
  
        const response = await axios.post('http://54.210.69.239:3100/user/login', details);
  
        if (response.data.success) {
          // Store the token in localStorage upon successful login
          localStorage.setItem('token', response.data.token);
  
          console.log('Login successful');
          window.location.href = 'addexpense.html'; 
        } else {
          console.log('Login failed');
        }
      } catch (err) {
        console.log(err.message);
        document.body.innerHTML += `<div style="color:red;">${err.message}</div>`;
      }
    }
  
    const form = document.getElementById('Data-form');
    const pwShowHide = document.querySelectorAll('.eye-icon');
    form.addEventListener('submit', formSubmit);
  
    pwShowHide.forEach(eyeIcon => {
      eyeIcon.addEventListener('click', () => {
        let pwFields = eyeIcon.parentElement.parentElement.querySelectorAll('.password');
  
        pwFields.forEach(password => {
          if (password.type === 'password') {
            password.type = 'text';
            eyeIcon.classList.replace('bx-hide', 'bx-show');
            return;
          }
          password.type = 'password';
          eyeIcon.classList.replace('bx-show', 'bx-hide');
        });
      });
    });
  });