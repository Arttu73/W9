if (document.readyState !== "loading") {
    initializeCode();
  } else {
    document.addEventListener("DOMContentLoaded", function () {
      initializeCode();
    });
  }
  
  function initializeCode() {
    document.getElementById('login').addEventListener('submit', login);;
}

async function login(event) {
    event.preventDefault();
    const errormsg = document.getElementById('errormessage');
    const token = localStorage.getItem('auth_token');
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    try {
        const response = await fetch('/login.html', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ email, password }),
        })
            .then((response) => response.json())
            .then((data) => {
                if(data.token) {
                    localStorage.setItem("auth_token", data.token);
                    window.location.href="/";
                } else {
                    if (data.message) {
                        errormsg.innerHTML = data.message;
                    }  else {
                        errormsg.innerHTML = "Invalid credentials";
                    }
                }
            })
    } catch (error) {
        console.error('Login error', error)
    }
}
