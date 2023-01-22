const login = async (email, password) => {
  console.log("login: email = " + email + ", password = " + password);

  const url = "/login";

  const user = {
    email: email,
    password: password,
  };
  const response = await sendHttpRequest(url, "POST", user);

  const responseJson = await response.json();
  console.log(responseJson);
  const userFullName = responseJson.userFullName;
  console.log("LOGIN - User name = " + userFullName);

  localStorage.setItem("userFullName", userFullName);
  localStorage.setItem("password", responseJson.encryptedPassword);

  const isSuccess = response.status === 200;
  return isSuccess;
};

const signup = async (user, recaptcha) => {
  console.log("signup");

  const url = "/sign-up";

  const data = {
    user: user,
    recaptcha: recaptcha,
  };
  const response = await sendHttpRequest(url, "POST", data);

  const responseJson = await response.json();
  console.log("responseJson: " + JSON.stringify(responseJson));

  const isSuccess = response.status === 200;

  console.log("isSuccess = " + isSuccess);
  if (isSuccess) {
    location.href = "login";
  }

  document.querySelector("#recaptcha-error").style.display = isSuccess ? "none" : "block";
  document.querySelector("#recaptcha-error").textContent = responseJson.msg;
  document.querySelector("#recaptcha-error").innerHTML = responseJson.msg;
  return isSuccess;
};

const resetPassword = async (email) => {
  console.log("api: users.resetPassword - email: " + email);
  const url = "/forgot-password";

  const response = await sendHttpRequest(url, "POST", { email: email });

  const isSuccess = response.status === 200;
  return isSuccess;
};

const sendHttpRequest = async (url, method, body) => {
  const request = {
    method: method,
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  };

  const response = await fetch(url, request);

  console.log("sendHttpRequest: response: " + JSON.stringify(response));
  return response;
};
