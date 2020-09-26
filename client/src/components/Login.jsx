import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { BASE_URL } from "../config/fetchConfig";
import { notificationService } from "../config/notificationConfig";
import { useHistory } from "react-router-dom";

export default ({ setPage }) => {
  let [email, setEmail] = useState("");
  let [pass, setPass] = useState("");

  const history = useHistory();

  const logIn = () => {
    if (email.trim().length < 10 || pass.trim().length < 5) {
      if (email.trim().length < 10)
        notificationService.error(
          "Адрес электронной почты должен быть не менее 10 символов!"
        );
      if (pass.trim().length < 5)
        notificationService.error("Пароль должен быть не менее 5 символов!");
      return;
    }

    fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password: pass,
      }),
    })
      .then((data) => data.json())
      .then((data) => {
        console.log(data);
        if (!data.auth) {
          notificationService.error(data.text);
          if (
            data.text ===
            "Ваша почта не подтверждена. Проверьте почтовый ящик, мы отправили Вам код потверждения."
          )
            history.push("/verify");
          return;
        }
        localStorage.setItem("token", data.token);
        localStorage.setItem("name", data.name);
        localStorage.setItem("isAdmin", data.isAdmin);
        localStorage.setItem("userId", data.user._id);
        history.push("/");
        notificationService.success("Успешная авторизация!");
      });
  };

  return (
    <div className="login">
      <h1>Авторизация</h1>
      <Form>
        <Form.Group controlId="formBasicEmail">
          <Form.Label>Электронная почта</Form.Label>
          <Form.Control
            type="email"
            placeholder="example@gmail.com"
            onChange={(e) => setEmail(e.target.value)}
          />
          <Form.Text className="text-muted">
            Ваш адрес электронной почты будет виден другим пользователям
          </Form.Text>
        </Form.Group>

        <Form.Group controlId="formBasicPassword">
          <Form.Label>Пароль</Form.Label>
          <Form.Control
            type="password"
            placeholder="123456"
            onChange={(e) => setPass(e.target.value)}
          />
        </Form.Group>
        <Button variant="primary" onClick={logIn}>
          Войти
        </Button>
        <Button variant="secondary" onClick={() => history.push("/register")}>
          Создать аккаунт
        </Button>
      </Form>
    </div>
  );
};
