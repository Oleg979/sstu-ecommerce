import React from "react";
import { Card, Button } from "react-bootstrap";
import { notificationService } from "../config/notificationConfig";
import { BASE_URL } from "../config/fetchConfig";

export default ({
  setProductModalShow,
  incNumOfItems,
  title,
  price,
  desc,
  image,
  id,
  wholeItem
}) => {
  const addToCart = () => {
    incNumOfItems(wholeItem);
    notificationService.success(`${title} - добавлено в корзину!`);
  };
  return (
    <Card>
      <Card.Img variant="top" src={`${BASE_URL}/${image}`} />
      <Card.Body>
        <Card.Title>{title}</Card.Title>
        <Card.Text>{desc}</Card.Text>
        <div className="buttons">
          <Button
            variant="info"
            onClick={() => setProductModalShow(true, wholeItem)}
          >
            Подробнее
          </Button>
          <Button variant="success" onClick={addToCart}>
            Купить за {price}₽
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};
