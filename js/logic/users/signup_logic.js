
const signupForm = document.getElementById('signup-form');
const signupBtn = document.getElementById('signup-btn')

signupBtn.addEventListener('click', (e) => {
    e.preventDefault()

    const firstName = signupForm.firstName.value
    const lastName = signupForm.lastName.value
    const emailAddress = signupForm.emailAddress.value

    const password = signupForm.password.value
    const passwordConfirm = signupForm.passwordConfirm.value

    const recaptcha = document.querySelector('#g-recaptcha-response').value

    var isValid = validateInputs(firstName, lastName, emailAddress, password, passwordConfirm)

    if (isValid) {
        const user = {
            firstName : firstName,
            lastName : lastName,
            email : emailAddress,
            password : password,
        }

        signup(user, recaptcha)
    }
})



function validateInputs(firstName, lastName, email, password, passwordConfirm) {
    var isValid = true;

    clearBorders()
    if (!isValidName(firstName)) {
        console.log("First name is invalid - " + firstName)
        signupForm.firstName.style.borderColor = 'red';
        isValid = false;
    }

    if (!isValidName(lastName)) {
        console.log("Last name is invalid - " + lastName)
        signupForm.lastName.style.borderColor = 'red';
        isValid = false;
    }

    if (!isValidEmail(email)) {
        console.log("Email is invalid - " + email)
        signupForm.emailAddress.style.borderColor = 'red';
        isValid = false;
    }

    if (!isValidPasswords(password, passwordConfirm) || !isValidPassword(passwordConfirm) || !isValidPassword(password)) {
        console.log("Passwords are invalid - " + password + " , " + passwordConfirm)
        signupForm.password.style.borderColor = 'red';
        signupForm.passwordConfirm.style.borderColor = 'red';
        isValid = false;
    }

    return isValid;
}

function clearBorders() {
    var borderColor = "#d1d3e2"

    signupForm.firstName.style.borderColor = borderColor;
    signupForm.lastName.style.borderColor = borderColor;
    signupForm.emailAddress.style.borderColor = borderColor;
    signupForm.password.style.borderColor = borderColor;
    signupForm.passwordConfirm.style.borderColor = borderColor;
}