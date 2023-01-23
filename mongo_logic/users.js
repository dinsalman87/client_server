import User from "../models/user.js";
import nodeMailer from "nodemailer";
import { stringify } from "querystring";
import fetch from "node-fetch";
import bcrypt from "bcrypt";

export const login = async (req, res) => {
  console.log(`Controllers: Users.login() - body = ${JSON.stringify(req.body)}`);

  const invalidMessage = "User or password are invalid.";
  const loginData = req.body;
  try {
    const usersWithSameEmails = await User.find({ email: loginData.email }).limit(1);
    const isUserAlreadyExist = usersWithSameEmails.length > 0;
    if (!isUserAlreadyExist) {
      console.log("login !isUserAlreadyExist: invalidMessage = " + invalidMessage);
      res.status(404).send(invalidMessage);
      return;
    }

    const savedPassword = usersWithSameEmails[0].password;
    const isPasswordCorrect = await compare(loginData.password, savedPassword);

    if (!isPasswordCorrect && loginData.password !== savedPassword) {
      console.log("login !isPasswordCorrect: invalidMessage = " + invalidMessage);

      res.status(404).send(invalidMessage);
      return;
    }

    const userFullName = usersWithSameEmails[0].firstName + " " + usersWithSameEmails[0].lastName;
    res
      .status(200)
      .json({ message: "Login Successfully", userFullName: userFullName, encryptedPassword: savedPassword });
  } catch (err) {
    console.log("login catch: err.message = " + err.message);
    res.status(500).send(err.message);
  }
};

export const signup = async (req, res) => {
  console.log(`Controllers: Users.signup() - body = ${JSON.stringify(req.body)}`);
  const userData = req.body.user;
  const recaptcha = req.body.recaptcha;

  try {
    if (!recaptcha) {
      res.status(404).json({ msg: "Please enter your recaptcha" });
      return;
    }

    const isRecaptchaValid = await validateRecaptcha(recaptcha, req.connection.remoteAddress);
    if (!isRecaptchaValid) {
      res.status(404).json({ msg: "Please enter your recaptcha" });
      return;
    }

    const usersWithSameEmails = await User.find({ email: userData.email }).limit(1);
    const isUserAlreadyExist = usersWithSameEmails.length > 0;

    if (isUserAlreadyExist) {
      res.status(401).json({ msg: "Email already exists" });
      return;
    }

    userData.password = await encrypte(userData.password);
    const newUser = new User(userData);
    await newUser.save();

    sendEmail(userData.email, "Car Services - Welcome " + userData.firstName, "Welcome to our service");

    res.status(200).json({ msg: "OK" });
  } catch (err) {
    res.status(500).json({ msg: err.msg });
  }
};

async function validateRecaptcha(recaptcha, remoteAddress) {
  console.log("validateRecaptcha: recaptcha = " + recaptcha + ", remoteAddress = " + remoteAddress);

  try {
    const query = stringify({
      secret: "6LfNvhokAAAAAPvWCdjd62FGzuV9KNFCwx7hrnu-",
      response: recaptcha,
      remoteip: remoteAddress,
    });

    const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?${query}`;
    return await fetch(verifyUrl)
      .then((res) => res.json())
      .then((data) => {
        console.log("validateRecaptcha: data = " + JSON.stringify(data));

        return data.success;
      });
  } catch (err) {
    console.log(err.message);
  }
}

export const sendForgotPasswordEmail = async (req, res) => {
  try {
    const email = req.body.email;

    console.log("sendForgotPasswordEmail: email = " + email);
    const user = await User.findOne({ email: email });
    if (user == null) {
      console.log("sendForgotPasswordEmail: user not found");
      res.status(404).send("Email not found...");
      return;
    }

    var newPassword = generateValidPassword();
    user.password = await encrypte(newPassword);
    await user.save();

    console.log("decryptedPassword = " + newPassword);
    await sendEmail(email, "Forgot Password", "Your password is " + newPassword);

    res.status(200).send("Email with password sent...");
  } catch (err) {
    res.status(500).send(err.message);
  }
};

export const resetPassword = async (req, res) => {};

const generateValidPassword = () => {
  var chars = "0123456789abcdefghijklmnopqrstuvwxyz!@#$%^&*()ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  var passwordLength = 12;
  var password = "";

  for (var i = 0; i <= passwordLength; i++) {
    var randomNumber = Math.floor(Math.random() * chars.length);
    password += chars.substring(randomNumber, randomNumber + 1);
  }

  if (!isValidPassword(password)) {
    return generateValidPassword();
  }

  return password;
};

function isValidPassword(password) {
  if (password.length < 8) {
    return false;
  }

  if (password.split("").filter((el) => el >= "a" && el <= "z").length == 0) {
    return false;
  }

  if (password.split("").filter((el) => el >= "A" && el <= "Z").length == 0) {
    return false;
  }

  if (password.split("").filter((el) => el >= "0" && el <= "9").length == 0) {
    return false;
  }

  var spaicelChar = "!@#$%^&*()";
  if (password.split("").filter((el) => spaicelChar.includes(el)).length == 0) {
    return false;
  }

  return true;
}

const encrypte = async (value) => {
  const encrypted = await bcrypt.hash(value, 12);
  return encrypted.toString();
};

const compare = async (value, hashedValue) => {
  const isCompared = await bcrypt.compare(value, hashedValue);

  return isCompared;
};

const sendEmail = async (recipientEmail, subject, message) => {
  try {
    let transporter = await nodeMailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: "dinsalman87@gmail.com",
        pass: "DinSalman1403",
      },
    });

    let info = await transporter.sendMail({
      from: "dinsalman87@gmail.com",
      to: recipientEmail,
      subject: subject,
      text: message,
    });

    console.log(`Message sent: ${info.messageId}`);
  } catch (err) {
    console.log(`UtilMailer.sendEmail() - ${err.message}`);
  }
};
