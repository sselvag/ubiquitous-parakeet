const loginFormHandler = async function (event) {
    // Stop the browser from submitting the form so we can do so with JavaScript
    event.preventDefault();
  
    console.log("Function is running")
    // Gather the data from the form elements on the page
    const email = document.querySelector('#loginInputEmail').value.trim();
    const password = document.querySelector('#loginInputPassword').value.trim();

    console.log(email)
    console.log(password)
  
    if (email && password) {
      // Send the e-mail and password to the server
      const response = await fetch('/api/users/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
        headers: { 'Content-Type': 'application/json' },
      });
  
      if (response.ok) {
        document.location.replace('/');
      } else {
        alert('Failed to log in');
      }
    }
  };
  
  document
    .querySelector('.login-form')
    .addEventListener('submit', loginFormHandler);