if (document.readyState !== "loading") {
    initializeCode();
  } else {
    document.addEventListener("DOMContentLoaded", async function () {
        initializeCode();
        const token = localStorage.getItem("auth_token");
        const addItems = document.getElementById("add-item");
        
        if(token) {
            var result = await fetchUserEmail(token);
            const loginLink = document.getElementById("loginLink");
            const registerLink = document.getElementById("registerLink");
            const todoList = document.getElementById("todoList");
            const aList = localStorage.getItem("list");
            console.log(aList);
            todoList.innerHTML = aList;
            
            if(loginLink) {
                loginLink.remove();
                registerLink.remove();
            }

            addItems.addEventListener("keydown", function(event) {
                if (event.key === "Enter") {
                    const newTodo = addItems.value;
                    console.log("NEW TODO ", newTodo);
                    addItem(token, newTodo, result);
                    console.log("Todo adding done")
                }
            });

            const userEmail = document.createElement("p");
            userEmail.id = "email"
            userEmail.innerText = result;
            document.body.appendChild(userEmail);

            const logoutButton = document.createElement("button");
            logoutButton.id = "logout";
            logoutButton.innerText = "Logout";
            document.body.appendChild(logoutButton);
            
            document.getElementById("logout").addEventListener("click", logout);
            
            
        } else {
            const userEmail = document.getElementById("email");
            const logoutBtn = document.getElementById("logout");
            if(userEmail) {
                userEmail.remove();
                logoutBtn.remove();
            }

            const newLoginLink = document.createElement("a");
            newLoginLink.id = "loginLink";
            newLoginLink.href = "/login.html";
            newLoginLink.innerText = "Login";
            document.body.appendChild(newLoginLink);

            const newRegisterLink = document.createElement("a");
            newRegisterLink.id = "registerLink";
            newRegisterLink.href = "/register.html";
            newRegisterLink.innerText = "Register";
            document.body.appendChild(newRegisterLink);
        }
    });
  }
  
  function initializeCode() {
    
}

function logout() {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("list")
    location.reload();
};

function addItem(token, todo, email) {
    console.log("Adding items");
    console.log("Email:", email)
    const todoList = document.getElementById("todoList");
    var itemsList = '';
    const data = {
        "todo": todo,
        "email": email
    };
    console.log("DATA: ", data);
    try {
        fetch('/addTodos', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ data }),
        })
        .then(response => {
            console.log('Response status:', response.status);
            if (response.ok) {
                console.log("Todo added successfully");
                console.log("Response.todo", response.todo)
                return response.json();
            } else {
                const errorText = response
                console.log('Error response text:', errorText);
            }
        })
        .then(data => {
            console.log("This data thing", data.todo);
            console.log(data.items)
            data.todo.items.forEach(item => {
                itemsList += `<li>${item}</li>`;
            });
            localStorage.setItem('list', itemsList);
            todoList.innerHTML = itemsList;
        })
        .catch(error => {
            console.error('Error adding item:', error);
        });
    } catch (error) {
        console.error('Error adding todos', error);
    }
}

async function fetchUserEmail(token) {
    console.log("fetching email");
    try {
        const response = await fetch('/email', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token }),
        });
        if (response.ok) {
            const userEmail = await response.json();
            console.log(userEmail)
            return userEmail;
        } else {
            console.error('Failed to fetch email');
        }
    } catch (error) {
        console.error('Error fetching email', error);
    }
}
