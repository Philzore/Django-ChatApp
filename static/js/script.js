async function sendMessage(token, user) {
    let date = new Date();
    let month = date.toLocaleString('en-GB', { month: 'short' });
    let day = date.getDate();
    let year = date.getFullYear();
    let fd = new FormData();
    let displaySideClass = '';
    
    fd.append('textmessage', messageField.value);
    fd.append('csrfmiddlewaretoken', token)
    try {
        messageContainer.innerHTML += `
        <div id="deleteMessage">
            <span class="color-gray">[${month}. ${day}, ${year}]</span> ${user}: <i class="color-gray"> ${messageField.value} </i>
        </div>
        `;
        let response = await fetch('/chat/', {
            method: 'POST',
            body: fd,
        });
        deleteMessage.remove();

        let responseAsJson = await parseToJSON(response);

        if (user == responseAsJson.fields.author) {
            displaySideClass = 'show-right';
        } else {
            displaySideClass = 'show-right';
        }

        messageContainer.innerHTML += `
        <div class=${displaySideClass}>
            <span class="color-gray">[${month}. ${day}, ${year}]</span> 
            <span><b>${user}:</b>  ${messageField.value} </span>
        </div>
        <hr>
        `;

        messageField.value = '';
    } catch (err) {
        console.log('Error ', err);
        messageContainer.innerHTML += `
        <div class=${displaySideClass}>
            <span class="color-red">Nachricht konnte nicht gesendet werden!</span> 
        </div>
        `;
    }
}

async function parseToJSON(response) {
    let responseAsString = await response.json();
    let responseAsJson = await JSON.parse(responseAsString);
    return responseAsJson;

}

async function login(token) {
    let fd = new FormData();
    fd.append('username', userName.value);
    fd.append('userpassword', userPassword.value);
    fd.append('csrfmiddlewaretoken', token);

    loginBtn.classList.add('d-none');
    loginSpinner.classList.remove('d-none');

    try {
        let response = await fetch('/login/', {
            method: 'POST',
            body: fd,
        });

        let responseAsJson = await response.json();

        loginBtn.classList.remove('d-none');
        loginSpinner.classList.add('d-none');

        if (responseAsJson.success == true) {
            location.href = 'http://127.0.0.1:8000/chat/';
        } else {
            wrongLogin.classList.remove('d-none');
        }
    } catch (err) {
        console.log('Error', err);
    }
}

async function register(token) {
    let fd = new FormData();
    fd.append('username', registerName.value);
    fd.append('userfirstname', registerFirstName.value);
    fd.append('userlastname', registerLastName.value);
    fd.append('useremail', registerEmail.value);
    fd.append('userpassword', registerPassword.value);
    fd.append('csrfmiddlewaretoken', token);

    registerBtn.classList.add('d-none');
    registerSpinner.classList.remove('d-none');
    wrongConf.classList.add('d-none');

    
    if (checkPasswordConfirm()) {
        try {
            let response = await fetch('/register/', {
                method: 'POST',
                body: fd,
            });
            let responseAsJson = await response.json();

            registerBtn.classList.remove('d-none');
            registerSpinner.classList.add('d-none');

            if (responseAsJson.success == true) {
                location.href = 'http://127.0.0.1:8000/login/';
            } else {
                wrongConf.classList.add('d-none');
                userExist.classList.remove('d-none');
                registerBtn.classList.remove('d-none');
                registerSpinner.classList.add('d-none');
            }
        } catch (err) {
            console.log('Error', err);
        }
    }
}

function checkPasswordConfirm() {
    if (registerPassword.value === registerPasswordConfirm.value) {
        return true;
    } else {
        userExist.classList.add('d-none');
        wrongConf.classList.remove('d-none');
        registerBtn.classList.remove('d-none');
        registerSpinner.classList.add('d-none');
        return false;
    }
}