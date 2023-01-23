const login = async (email, password) => {

  const url = "/login";

  const user = {
    email: email,
    password: password,
  };
  const response = await sendHttpRequest(url, "POST", user);

  const responseJson = await response.json();

  const userFullName = responseJson.userFullName;

  localStorage.setItem("userFullName", userFullName);
  localStorage.setItem("password", responseJson.encryptedPassword);

  const isSuccess = response.status === 200;
  return isSuccess;
};

const signup = async (user, recaptcha) => {

  const url = "/sign-up";

  const data = {
    user: user,
    recaptcha: recaptcha,
  };
  const response = await sendHttpRequest(url, "POST", data);

  const responseJson = await response.json();

  const isSuccess = response.status === 200;

  if (isSuccess) {
    location.href = "login";
  }

  document.querySelector("#recaptcha-error").style.display = isSuccess ? "none" : "block";
  document.querySelector("#recaptcha-error").textContent = responseJson.msg;
  document.querySelector("#recaptcha-error").innerHTML = responseJson.msg;
  return isSuccess;
};

const resetPassword = async (email) => {
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

  return response;
};
