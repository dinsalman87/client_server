const forgotPasswordBtn = document.getElementById("forgot-password-btn");
const forgotPasswordEmailInput = document.getElementById("forgot-password-input");

const message = document.getElementById("email-sent-message");

forgotPasswordBtn.addEventListener("click", (e) => {
  e.preventDefault();

  const emailAddress = forgotPasswordEmailInput.value;

  console.log("emailAddress = " + emailAddress);
  var isValid = isValidEmail(emailAddress);

  if (!isValid) {
    showMessage("Invalid Email, Please try again", 2000);
    return;
  }

  const isSuccess = resetPassword(emailAddress);

  if (!isSuccess) {
    showMessage("Email not found, Please try again", 2000);
    return;
  }

  showMessage("Mail Sent Successfully, Check your password", 2000);

  setTimeout(() => {
    location.href = "/login";
  }, 2000);
});

function showMessage(messageText, delay) {
  console.log(message, delay);
  message.innerText = messageText;

  clearTimeout();

  setTimeout(() => {
    message.innerHTML = "";
  }, delay);
}
