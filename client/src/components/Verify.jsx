import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { BASE_URL } from "../config/fetchConfig";
import { notificationService } from "../config/notificationConfig";
import { useHistory } from "react-router-dom";

export default ({ setPage }) => {
  let [code, setCode] = useState("");

  const history = useHistory();

  const verify = () => {
    if (code.trim().length < 1) {
      notificationService.error("Код слишком короткий!");
      return;
    }

    fetch(`${BASE_URL}/auth/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        verificationCode: code,
        email: localStorage.getItem("email"),
      }),
    })
      .then((data) => data.json())
      .then((data) => {
        console.log(data);
        if (!data.success) {
          notificationService.error(data.text);
          return;
        }
        history.push("/login");
        notificationService.success(
          "Успешная верификация! Теперь вы можете войти."
        );
      });
  };

  return (
    <div className="verify">
      <h1>Подтвердите свою почту</h1>
      <Form>
        <Form.Group>
          <Form.Label>Код подтверждения</Form.Label>
          <Form.Control
            type="number"
            placeholder="123456"
            onChange={(e) => setCode(e.target.value)}
          />
          <Form.Text className="text-muted">
            Код был отправлен на вашу почту {localStorage.getItem("email")}
          </Form.Text>
        </Form.Group>

        <Button variant="primary" onClick={verify}>
          Подтвердить
        </Button>
      </Form>
    </div>
  );
};
