//////////////////////////////////////////////////////////////////////////////////////

var express = require("express");
var router = express.Router();
var bodyParser = require("body-parser");

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
var config = require("../config/jwt.config");

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

var VerifyToken = require("../services/tokenVerification.service");
var User = require("../models/user.model");
var sendMail = require("../services/mail.service");
var verifyAdmin = require("../services/adminVerification.service");
//////////////////////////////////////////////////////////////////////////////////////

router.post("/register", (req, res) => {
  User.findOne({ email: req.body.email }, (err, user) => {
    if (user)
      return res.status(401).send({
        auth: false,
        text: "Пользователь с такой почтой уже существует!"
      });
    else {
      var hashedPassword = bcrypt.hashSync(req.body.password, 8);
      var random = Math.floor(Math.random() * 99999);
      User.create(
        {
          name: req.body.name,
          email: req.body.email,
          password: hashedPassword,
          isEmailVerified: false,
          verificationCode: random
        },

        (err, user) => {
          if (err)
            return res.status(500).send({
              auth: false,
              text: "Возникла проблема на сервере, попробуйте позже."
            });

          sendMail(
            user.email,
            `<!doctype html>
                        <html>
                          <head>
                            <meta name="viewport" content="width=device-width" />
                            <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
                            <title>Simple Transactional Email</title>
                            <style>
                              /* -------------------------------------
                                  GLOBAL RESETS
                              ------------------------------------- */
                              
                              /*All the styling goes here*/
                              
                              img {
                                border: none;
                                -ms-interpolation-mode: bicubic;
                                max-width: 100%; 
                              }
                        
                              body {
                                background-color: #f6f6f6;
                                font-family: sans-serif;
                                -webkit-font-smoothing: antialiased;
                                font-size: 14px;
                                line-height: 1.4;
                                margin: 0;
                                padding: 0;
                                -ms-text-size-adjust: 100%;
                                -webkit-text-size-adjust: 100%; 
                              }
                        
                              table {
                                border-collapse: separate;
                                mso-table-lspace: 0pt;
                                mso-table-rspace: 0pt;
                                width: 100%; }
                                table td {
                                  font-family: sans-serif;
                                  font-size: 14px;
                                  vertical-align: top; 
                              }
                        
                              /* -------------------------------------
                                  BODY & CONTAINER
                              ------------------------------------- */
                        
                              .body {
                                background-color: #f6f6f6;
                                width: 100%; 
                              }
                        
                              /* Set a max-width, and make it display as block so it will automatically stretch to that width, but will also shrink down on a phone or something */
                              .container {
                                display: block;
                                margin: 0 auto !important;
                                /* makes it centered */
                                max-width: 580px;
                                padding: 10px;
                                width: 580px; 
                              }
                        
                              /* This should also be a block element, so that it will fill 100% of the .container */
                              .content {
                                box-sizing: border-box;
                                display: block;
                                margin: 0 auto;
                                max-width: 580px;
                                padding: 10px; 
                              }
                        
                              /* -------------------------------------
                                  HEADER, FOOTER, MAIN
                              ------------------------------------- */
                              .main {
                                background: #ffffff;
                                border-radius: 3px;
                                width: 100%; 
                              }
                        
                              .wrapper {
                                box-sizing: border-box;
                                padding: 20px; 
                              }
                        
                              .content-block {
                                padding-bottom: 10px;
                                padding-top: 10px;
                              }
                        
                              .footer {
                                clear: both;
                                margin-top: 10px;
                                text-align: center;
                                width: 100%; 
                              }
                                .footer td,
                                .footer p,
                                .footer span,
                                .footer a {
                                  color: #999999;
                                  font-size: 12px;
                                  text-align: center; 
                              }
                        
                              /* -------------------------------------
                                  TYPOGRAPHY
                              ------------------------------------- */
                              h1,
                              h2,
                              h3,
                              h4 {
                                color: #000000;
                                font-family: sans-serif;
                                font-weight: 400;
                                line-height: 1.4;
                                margin: 0;
                                margin-bottom: 30px;
                                text-align: center;
                              }
                        
                              h1 {
                                font-size: 35px;
                                font-weight: 300;
                                text-align: center;
                                text-transform: capitalize; 
                              }
                        
                              p,
                              ul,
                              ol {
                                font-family: sans-serif;
                                
                                font-size: 14px;
                                font-weight: normal;
                                margin: 0;
                                margin-bottom: 15px; 
                              }
                                p li,
                                ul li,
                                ol li {
                                  list-style-position: inside;
                                  margin-left: 5px; 
                              }
                        
                              a {
                                color: #3498db;
                                text-decoration: underline; 
                                font-size: 30px;
                                display: block;
                              }
                        
                              /* -------------------------------------
                                  BUTTONS
                              ------------------------------------- */
                              .btn {
                                box-sizing: border-box;
                                width: 100%; }
                                .btn > tbody > tr > td {
                                  padding-bottom: 15px; }
                                .btn table {
                                  width: auto; 
                              }
                                .btn table td {
                                  background-color: #ffffff;
                                  border-radius: 5px;
                                  text-align: center; 
                              }
                                .btn a {
                                  background-color: #ffffff;
                                  border: solid 1px #3498db;
                                  border-radius: 5px;
                                  box-sizing: border-box;
                                  color: #3498db;
                                  cursor: pointer;
                                  display: inline-block;
                                  font-size: 14px;
                                  font-weight: bold;
                                  margin: 0;
                                  padding: 12px 25px;
                                  text-decoration: none;
                                  text-transform: capitalize; 
                              }
                        
                              .btn-primary table td {
                                background-color: #3498db; 
                              }
                        
                              .btn-primary a {
                                background-color: #3498db;
                                border-color: #3498db;
                                color: #ffffff; 
                              }
                        
                              /* -------------------------------------
                                  OTHER STYLES THAT MIGHT BE USEFUL
                              ------------------------------------- */
                              .last {
                                margin-bottom: 0; 
                              }
                        
                              .first {
                                margin-top: 0; 
                              }
                        
                              .align-center {
                                text-align: center; 
                              }
                        
                              .align-right {
                                text-align: right; 
                              }
                        
                              .align-left {
                                text-align: left; 
                              }
                        
                              .clear {
                                clear: both; 
                              }
                        
                              .mt0 {
                                margin-top: 0; 
                              }
                        
                              .mb0 {
                                margin-bottom: 0; 
                              }
                        
                              .preheader {
                                color: transparent;
                                display: none;
                                height: 0;
                                max-height: 0;
                                max-width: 0;
                                opacity: 0;
                                overflow: hidden;
                                mso-hide: all;
                                visibility: hidden;
                                width: 0; 
                              }
                        
                              .powered-by a {
                                text-decoration: none; 
                              }
                        
                              hr {
                                border: 0;
                                border-bottom: 1px solid #f6f6f6;
                                margin: 20px 0; 
                              }
                        
                              /* -------------------------------------
                                  RESPONSIVE AND MOBILE FRIENDLY STYLES
                              ------------------------------------- */
                              @media only screen and (max-width: 620px) {
                                table[class=body] h1 {
                                  font-size: 28px !important;
                                  margin-bottom: 10px !important; 
                                }
                                table[class=body] p,
                                table[class=body] ul,
                                table[class=body] ol,
                                table[class=body] td,
                                table[class=body] span,
                                table[class=body] a {
                                  font-size: 16px !important; 
                                }
                                table[class=body] .wrapper,
                                table[class=body] .article {
                                  padding: 10px !important; 
                                }
                                table[class=body] .content {
                                  padding: 0 !important; 
                                }
                                table[class=body] .container {
                                  padding: 0 !important;
                                  width: 100% !important; 
                                }
                                table[class=body] .main {
                                  border-left-width: 0 !important;
                                  border-radius: 0 !important;
                                  border-right-width: 0 !important; 
                                }
                                table[class=body] .btn table {
                                  width: 100% !important; 
                                }
                                table[class=body] .btn a {
                                  width: 100% !important; 
                                }
                                table[class=body] .img-responsive {
                                  height: auto !important;
                                  max-width: 100% !important;
                                  width: auto !important; 
                                }
                              }
                        
                              /* -------------------------------------
                                  PRESERVE THESE STYLES IN THE HEAD
                              ------------------------------------- */
                              @media all {
                                .ExternalClass {
                                  width: 100%; 
                                }
                                .ExternalClass,
                                .ExternalClass p,
                                .ExternalClass span,
                                .ExternalClass font,
                                .ExternalClass td,
                                .ExternalClass div {
                                  line-height: 100%; 
                                }
                                .apple-link a {
                                  color: inherit !important;
                                  font-family: inherit !important;
                                  font-size: inherit !important;
                                  font-weight: inherit !important;
                                  line-height: inherit !important;
                                  text-decoration: none !important; 
                                }
                                #MessageViewBody a {
                                  color: inherit;
                                  text-decoration: none;
                                  font-size: inherit;
                                  font-family: inherit;
                                  font-weight: inherit;
                                  line-height: inherit;
                                }
                                .btn-primary table td:hover {
                                  background-color: #34495e !important; 
                                }
                                .btn-primary a:hover {
                                  background-color: #34495e !important;
                                  border-color: #34495e !important; 
                                } 
                              }
                        
                            </style>
                          </head>
                          <body class="">
                            <span class="preheader">Аккаунт требует подтверждения.</span>
                            <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="body">
                              <tr>
                                <td>&nbsp;</td>
                                <td class="container">
                                  <div class="content">
                        
                                    <!-- START CENTERED WHITE CONTAINER -->
                                    <table role="presentation" class="main">
                        
                                      <!-- START MAIN CONTENT AREA -->
                                      <tr>
                                        <td class="wrapper">
                                          <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                                            <tr>
                                              <td>
                                                <h1>Привет, ${req.body.name}!</h1>
                                                <h2>Спасибо за регистрацию. Твой код подтверждения:</h2>
                                                <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="btn btn-primary">
                                                  <tbody>
                                                    <tr>
                                                      <td align="center">
                                                        <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                                                          <tbody>
                                                            <tr>
                                                              <td rowspan="2"> <a><span style="font-size:30px;">${random}</span></a> </td>
                                                            </tr>
                                                          </tbody>
                                                        </table>
                                                      </td>
                                                    </tr>
                                                  </tbody>
                                                </table>
                                                
                                               
                                              </td>
                                            </tr>
                                          </table>
                                        </td>
                                      </tr>
                        
                                    <!-- END MAIN CONTENT AREA -->
                                    </table>
                                    <!-- END CENTERED WHITE CONTAINER -->
                        
                                    <!-- START FOOTER -->
                                    <div class="footer">
                                      <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                                        <tr>
                                          <td class="content-block">
                                            <span class="apple-link">Automatic mail from FoodStore</span>
                        
                                          </td>
                                        </tr>
                                        <tr>
                                         
                                        </tr>
                                      </table>
                                    </div>
                                    <!-- END FOOTER -->
                        
                                  </div>
                                </td>
                                <td>&nbsp;</td>
                              </tr>
                            </table>
                          </body>
                        </html>
                        `,
            `Ваш код: ${random}`
          );

          res.status(200).send({ auth: true, text: "Успешная регистация!" });
        }
      );
    }
  });
});

//////////////////////////////////////////////////////////////////////////////////////

router.get("/me", VerifyToken, (req, res) => {
  User.findById(req.userId, { password: 0 }, (err, user) => {
    if (err)
      return res.status(500).send({
        res: false,
        text: "Произошла ошибка на сервере, попробуйте позже."
      });

    if (!user)
      return res
        .status(404)
        .send({ res: false, text: "Пользователь не существует." });

    res.status(200).send({ res: true, user });
  });
});

//////////////////////////////////////////////////////////////////////////////////////

router.post("/login", (req, res) => {
  User.findOne({ email: req.body.email }, (err, user) => {
    if (err)
      return res.status(500).send({
        auth: false,
        text: "Произошла ошибка на сервере, попробуйте позже."
      });
    if (!user)
      return res.status(404).send({
        auth: false,
        text: "Пользователя с такой почтой не существует!"
      });

    var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);

    if (!passwordIsValid)
      return res
        .status(401)
        .send({ auth: false, token: null, text: "Неправильный пароль!" });

    if (!user.isEmailVerified)
      return res.status(401).send({
        auth: false,
        token: null,
        text:
          "Ваша почта не подтверждена. Проверьте почтовый ящик, мы отправили Вам код потверждения."
      });

    var token = jwt.sign({ id: user._id }, config.secret, {
      expiresIn: "24h"
    });

    res.status(200).send({
      auth: true,
      token,
      name: user.name,
      isAdmin: user.isAdmin,
      user
    });
  });
});

//////////////////////////////////////////////////////////////////////////////////////

router.post("/verify", (req, res) => {
  User.findOne({ email: req.body.email }, (err, user) => {
    if (err)
      return res.status(500).send({
        success: false,
        text: "Произошла ошибка на сервере, попробуйте позже."
      });
    if (!user)
      return res
        .status(404)
        .send({ success: false, text: "Неверный адрес электронной почты." });
    if (user.verificationCode !== req.body.verificationCode)
      return res
        .status(401)
        .send({ success: false, text: "Неправильный код подтверждения!" });
    User.findByIdAndUpdate(
      user._id,
      { $set: { isEmailVerified: true } },
      (err, user) => {
        res.status(200).send({ success: true, text: "Успешая верификация!" });
        sendMail(
          user.email,
          `<!doctype html>
                        <html>
                          <head>
                            <meta name="viewport" content="width=device-width" />
                            <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
                            <title>Simple Transactional Email</title>
                            <style>
                              /* -------------------------------------
                                  GLOBAL RESETS
                              ------------------------------------- */
                              
                              /*All the styling goes here*/
                              
                              img {
                                border: none;
                                -ms-interpolation-mode: bicubic;
                                max-width: 100%; 
                              }
                        
                              body {
                                background-color: #f6f6f6;
                                font-family: sans-serif;
                                -webkit-font-smoothing: antialiased;
                                font-size: 14px;
                                line-height: 1.4;
                                margin: 0;
                                padding: 0;
                                -ms-text-size-adjust: 100%;
                                -webkit-text-size-adjust: 100%; 
                              }
                        
                              table {
                                border-collapse: separate;
                                mso-table-lspace: 0pt;
                                mso-table-rspace: 0pt;
                                width: 100%; }
                                table td {
                                  font-family: sans-serif;
                                  font-size: 14px;
                                  vertical-align: top; 
                              }
                        
                              /* -------------------------------------
                                  BODY & CONTAINER
                              ------------------------------------- */
                        
                              .body {
                                background-color: #f6f6f6;
                                width: 100%; 
                              }
                        
                              /* Set a max-width, and make it display as block so it will automatically stretch to that width, but will also shrink down on a phone or something */
                              .container {
                                display: block;
                                margin: 0 auto !important;
                                /* makes it centered */
                                max-width: 580px;
                                padding: 10px;
                                width: 580px; 
                              }
                        
                              /* This should also be a block element, so that it will fill 100% of the .container */
                              .content {
                                box-sizing: border-box;
                                display: block;
                                margin: 0 auto;
                                max-width: 580px;
                                padding: 10px; 
                              }
                        
                              /* -------------------------------------
                                  HEADER, FOOTER, MAIN
                              ------------------------------------- */
                              .main {
                                background: #ffffff;
                                border-radius: 3px;
                                width: 100%; 
                              }
                        
                              .wrapper {
                                box-sizing: border-box;
                                padding: 20px; 
                              }
                        
                              .content-block {
                                padding-bottom: 10px;
                                padding-top: 10px;
                              }
                        
                              .footer {
                                clear: both;
                                margin-top: 10px;
                                text-align: center;
                                width: 100%; 
                              }
                                .footer td,
                                .footer p,
                                .footer span,
                                .footer a {
                                  color: #999999;
                                  font-size: 12px;
                                  text-align: center; 
                              }
                        
                              /* -------------------------------------
                                  TYPOGRAPHY
                              ------------------------------------- */
                              h1,
                              h2,
                              h3,
                              h4 {
                                color: #000000;
                                font-family: sans-serif;
                                font-weight: 400;
                                line-height: 1.4;
                                margin: 0;
                                text-align: center;
                                margin-bottom: 30px; 
                              }
                        
                              h1 {
                                font-size: 35px;
                                font-weight: 300;
                                text-align: center;
                                text-transform: capitalize; 
                              }
                        
                              p,
                              ul,
                              ol {
                                font-family: sans-serif;
                                
                                font-size: 14px;
                                font-weight: normal;
                                margin: 0;
                                margin-bottom: 15px; 
                              }
                                p li,
                                ul li,
                                ol li {
                                  list-style-position: inside;
                                  margin-left: 5px; 
                              }
                        
                              a {
                                color: #3498db;
                                text-decoration: underline; 
                                font-size: 30px;
                                display: block;
                              }
                        
                              /* -------------------------------------
                                  BUTTONS
                              ------------------------------------- */
                              .btn {
                                box-sizing: border-box;
                                width: 100%; }
                                .btn > tbody > tr > td {
                                  padding-bottom: 15px; }
                                .btn table {
                                  width: auto; 
                              }
                                .btn table td {
                                  background-color: #ffffff;
                                  border-radius: 5px;
                                  text-align: center; 
                              }
                                .btn a {
                                  background-color: #ffffff;
                                  border: solid 1px #3498db;
                                  border-radius: 5px;
                                  box-sizing: border-box;
                                  color: #3498db;
                                  cursor: pointer;
                                  display: inline-block;
                                  font-size: 14px;
                                  font-weight: bold;
                                  margin: 0;
                                  padding: 12px 25px;
                                  text-decoration: none;
                                  text-transform: capitalize; 
                              }
                        
                              .btn-primary table td {
                                background-color: #3498db; 
                              }
                        
                              .btn-primary a {
                                background-color: #3498db;
                                border-color: #3498db;
                                color: #ffffff; 
                              }
                        
                              /* -------------------------------------
                                  OTHER STYLES THAT MIGHT BE USEFUL
                              ------------------------------------- */
                              .last {
                                margin-bottom: 0; 
                              }
                        
                              .first {
                                margin-top: 0; 
                              }
                        
                              .align-center {
                                text-align: center; 
                              }
                        
                              .align-right {
                                text-align: right; 
                              }
                        
                              .align-left {
                                text-align: left; 
                              }
                        
                              .clear {
                                clear: both; 
                              }
                        
                              .mt0 {
                                margin-top: 0; 
                              }
                        
                              .mb0 {
                                margin-bottom: 0; 
                              }
                        
                              .preheader {
                                color: transparent;
                                display: none;
                                height: 0;
                                max-height: 0;
                                max-width: 0;
                                opacity: 0;
                                overflow: hidden;
                                mso-hide: all;
                                visibility: hidden;
                                width: 0; 
                              }
                        
                              .powered-by a {
                                text-decoration: none; 
                              }
                        
                              hr {
                                border: 0;
                                border-bottom: 1px solid #f6f6f6;
                                margin: 20px 0; 
                              }
                        
                              /* -------------------------------------
                                  RESPONSIVE AND MOBILE FRIENDLY STYLES
                              ------------------------------------- */
                              @media only screen and (max-width: 620px) {
                                table[class=body] h1 {
                                  font-size: 28px !important;
                                  margin-bottom: 10px !important; 
                                }
                                table[class=body] p,
                                table[class=body] ul,
                                table[class=body] ol,
                                table[class=body] td,
                                table[class=body] span,
                                table[class=body] a {
                                  font-size: 16px !important; 
                                }
                                table[class=body] .wrapper,
                                table[class=body] .article {
                                  padding: 10px !important; 
                                }
                                table[class=body] .content {
                                  padding: 0 !important; 
                                }
                                table[class=body] .container {
                                  padding: 0 !important;
                                  width: 100% !important; 
                                }
                                table[class=body] .main {
                                  border-left-width: 0 !important;
                                  border-radius: 0 !important;
                                  border-right-width: 0 !important; 
                                }
                                table[class=body] .btn table {
                                  width: 100% !important; 
                                }
                                table[class=body] .btn a {
                                  width: 100% !important; 
                                }
                                table[class=body] .img-responsive {
                                  height: auto !important;
                                  max-width: 100% !important;
                                  width: auto !important; 
                                }
                              }
                        
                              /* -------------------------------------
                                  PRESERVE THESE STYLES IN THE HEAD
                              ------------------------------------- */
                              @media all {
                                .ExternalClass {
                                  width: 100%; 
                                }
                                .ExternalClass,
                                .ExternalClass p,
                                .ExternalClass span,
                                .ExternalClass font,
                                .ExternalClass td,
                                .ExternalClass div {
                                  line-height: 100%; 
                                }
                                .apple-link a {
                                  color: inherit !important;
                                  font-family: inherit !important;
                                  font-size: inherit !important;
                                  font-weight: inherit !important;
                                  line-height: inherit !important;
                                  text-decoration: none !important; 
                                }
                                #MessageViewBody a {
                                  color: inherit;
                                  text-decoration: none;
                                  font-size: inherit;
                                  font-family: inherit;
                                  font-weight: inherit;
                                  line-height: inherit;
                                }
                                .btn-primary table td:hover {
                                  background-color: #34495e !important; 
                                }
                                .btn-primary a:hover {
                                  background-color: #34495e !important;
                                  border-color: #34495e !important; 
                                } 
                              }
                        
                            </style>
                          </head>
                          <body class="">
                            <span class="preheader">Теперь ты можешь авторизоваться.</span>
                            <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="body">
                              <tr>
                                <td>&nbsp;</td>
                                <td class="container">
                                  <div class="content">
                        
                                    <!-- START CENTERED WHITE CONTAINER -->
                                    <table role="presentation" class="main">
                        
                                      <!-- START MAIN CONTENT AREA -->
                                      <tr>
                                        <td class="wrapper">
                                          <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                                            <tr>
                                              <td>
                                                <h1>Привет, ${user.name}!</h1>
                                                <h2>Твой аккаут подтвержден. Теперь ты можешь авторизоваться, используя свою почту:</h2>
                                                <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="btn btn-primary">
                                                  <tbody>
                                                    <tr>
                                                      <td align="center">
                                                        <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                                                          <tbody>
                                                            <tr>
                                                              <td rowspan="2"> <a><span style="font-size:30px; text-transform:lowercase">${user.email.toLowerCase()}</span></a> </td>
                                                            </tr>
                                                          </tbody>
                                                        </table>
                                                      </td>
                                                    </tr>
                                                  </tbody>
                                                </table>
                                                
                                               
                                              </td>
                                            </tr>
                                          </table>
                                        </td>
                                      </tr>
                        
                                    <!-- END MAIN CONTENT AREA -->
                                    </table>
                                    <!-- END CENTERED WHITE CONTAINER -->
                        
                                    <!-- START FOOTER -->
                                    <div class="footer">
                                      <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                                        <tr>
                                          <td class="content-block">
                                            <span class="apple-link">Automatic mail from FoodStore</span>
                        
                                          </td>
                                        </tr>
                                        <tr>
                                         
                                        </tr>
                                      </table>
                                    </div>
                                    <!-- END FOOTER -->
                        
                                  </div>
                                </td>
                                <td>&nbsp;</td>
                              </tr>
                            </table>
                          </body>
                        </html>
                        `,
          `Аккаунт подтвержден!`
        );
      }
    );
  });
});

//////////////////////////////////////////////////////////////////////////////////////

router.get("/logout", (req, res) => {
  res.status(200).send({ auth: false, token: null });
});

//////////////////////////////////////////////////////////////////////////////////////

module.exports = router;

//////////////////////////////////////////////////////////////////////////////////////
