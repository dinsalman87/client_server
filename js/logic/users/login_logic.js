const loginBtn = document.getElementById('login-btn')

const emailInput = document.getElementById('login-email')
const passwordInput = document.getElementById('login-password')

const remeberMeCB = document.getElementById('remember-me-cb')

const loginMessage = document.getElementById('login-message')

loginBtn.addEventListener('click', (e) => {
    e.preventDefault()

    console.log("click login")
    async function handleLogin() {
        const email = emailInput.value
        const password = passwordInput.value


        console.log("handleLogin: " + email + " " + password)
        if (!isValidEmail(email) || !isValidPassword(password)) {
            showMessage("Invalid email or password", 2000)
            return
        }
    
        const isSuccess = await login(email, password)
        if (isSuccess == true) {
            saveEmailAndPasswordToLocalStorage(email, password)
            setTimeout(() => {
                location.href = "index"
            }, 2000)
            return
        }
        
        showMessage("Email or password is incorrect, Please try again.", 2000)   
    }

    handleLogin()
    
})

function showMessage(messageText, delay) {
    console.log(messageText, delay)
    loginMessage.innerText = messageText

    clearTimeout()

    setTimeout(() => {
        loginMessage.innerHTML = ""
    }, delay)
}


remeberMeCB.addEventListener('click', (e) => {
    const cbValue = remeberMeCB.checked
    localStorage.setItem('rememberMeValue', cbValue)
})

function saveEmailAndPasswordToLocalStorage(email, password) {
    localStorage.setItem('email', email)
    localStorage.setItem('isLogin', true)
}