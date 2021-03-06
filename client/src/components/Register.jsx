import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { notificationService } from "../config/notificationConfig";
import { BASE_URL } from "../config/fetchConfig";
import { useHistory } from "react-router-dom";

export default ({ setPage }) => {
  let [email, setEmail] = useState("");
  let [pass, setPass] = useState("");
  let [name, setName] = useState("");
  let [repeatPass, setRepeatPass] = useState("");

  const history = useHistory();

  const register = () => {
    if (
      email.trim().length < 10 ||
      pass.trim().length < 5 ||
      name.trim().length < 3 ||
      pass !== repeatPass
    ) {
      if (email.trim().length < 10)
        notificationService.error(
          "Адрес электронной почты должен быть не менее 10 символов!"
        );
      if (pass.trim().length < 5)
        notificationService.error("Пароль должен быть не менее 5 символов!");
      if (name.trim().length < 3)
        notificationService.error("Имя должно быть не менее 3 символов!");
      if (pass !== repeatPass)
        notificationService.error("Пароли не совпадают!");
      return;
    }

    fetch(`${BASE_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password: pass,
        name,
      }),
    })
      .then((data) => data.json())
      .then((data) => {
        console.log(data);
        if (!data.auth) {
          notificationService.error(data.text);
          return;
        }
        localStorage.setItem("email", email);
        history.push("/verify");
        notificationService.success(
          "Успешная регистрация! Теперь введите код верификации, отправленный на почту " +
            email
        );
      });
  };

  return (
    <div className="register">
      <h1>Регистрация</h1>
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
        <Form.Group>
          <Form.Label>Как вас зовут?</Form.Label>
          <Form.Control
            type="email"
            placeholder="Иван Иванов"
            onChange={(e) => setName(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="formBasicPassword">
          <Form.Label>Пароль</Form.Label>
          <Form.Control
            type="password"
            placeholder="123456"
            onChange={(e) => setPass(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="formBasicPassword">
          <Form.Label>Повторите пароль</Form.Label>
          <Form.Control
            type="password"
            placeholder="123456"
            onChange={(e) => setRepeatPass(e.target.value)}
          />
        </Form.Group>
        <Button variant="primary" onClick={register}>
          Зарегистрироваться
        </Button>
        <Button variant="secondary" onClick={() => history.push("/login")}>
          У меня уже есть аккаунт
        </Button>
      </Form>
    </div>
  );
};
