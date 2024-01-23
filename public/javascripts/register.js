if (document.readyState !== "loading") {
    initializeCode();
  } else {
    document.addEventListener("DOMContentLoaded", function () {
      initializeCode();
    });
  }
  
  function initializeCode() {
    document.getElementById('register').addEventListener('submit', register);;
}

async function register(event) {
    event.preventDefault();
    const errormsg = document.getElementById('errormessage');
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    try {
        const response = await fetch('/register.html', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ email, password }),
        })
            .then((response) => response.json())
            .then((data) => {
                if(data.token) {
                    window.location.href="/login.html";
                } else {
                    if (data.message) {
                        errormsg.innerHTML = data.message;
                    }  else {
                        errormsg.innerHTML = "Invalid credentials";
                    }
                }
            })
    } catch (error) {
        console.error('Register error', error)
    }
}
