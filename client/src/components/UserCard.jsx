import React from "react";
import { Card, Button } from "react-bootstrap";

export default ({
  email,
  isAdmin,
  name,
  registrationDate,
  numOfOrders,
  deleteUser,
  _id,
  toggleAdmin
}) => {
  const processRegistrationDate = () => {
    const [year, month, day] = registrationDate.split("T")[0].split("-");
    return `${day}.${month}.${year}`;
  };
  return (
    <div className="user-card">
      <Card>
        <Card.Header>
          Имя пользователя: {name} ({isAdmin ? "Администратор" : "Клиент"})
        </Card.Header>
        <Card.Body>
          <h4>{email}</h4>
          <Card.Text>Совершил {numOfOrders} заказов.</Card.Text>
          <Button
            variant={isAdmin ? "secondary" : "primary"}
            onClick={() => toggleAdmin(_id)}
          >
            {isAdmin
              ? "Отозвать привилегии администратора"
              : "Назначить администратором"}
          </Button>
          <Button variant="danger" onClick={() => deleteUser(_id)}>
            Удалить из системы
          </Button>
        </Card.Body>
        <Card.Footer className="text-muted">
          Дата регистрации: {processRegistrationDate()}
        </Card.Footer>
      </Card>
    </div>
  );
};
