import React from "react";
import { Table, Alert, Button } from "react-bootstrap";
import { BASE_URL } from "../config/fetchConfig";
import { notificationService } from "../config/notificationConfig";

export default ({ cartPrice, items, amounts, add, remove, clearCart }) => {
  const submitOrder = () => {
    notificationService.info(
      "Ваш заказ оформлен и ожидает подтверждения администратора."
    );
    const date = new Date();
    let payload = [];
    Object.entries(amounts).map(entry => {
      payload.push({
        itemId: entry[0],
        amount: entry[1]
      });
    });
    console.log(payload);
    fetch(`${BASE_URL}/order/`, {
      method: "POST",
      headers: {
        "x-access-token": localStorage.getItem("token"),
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        payload,
        sum: cartPrice,
        creationDate:
          date.toLocaleDateString() + " " + date.toLocaleTimeString()
      })
    })
      .then(data => data.json())
      .then(order => {
        console.log(order);
        clearCart();
      });
  };
  return (
    <div style={{ padding: "5%" }}>
      {Object.keys(amounts).length == 0 ? (
        <Alert variant="danger">Вы не добавили ни одного товара.</Alert>
      ) : (
        <>
          <Table
            striped
            bordered
            hover
            responsive
            small={document.body.clientWidth <= 630}
          >
            <thead>
              <tr>
                <th>Название</th>
                <th>Количество</th>
                <th>Стоимость</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(amounts).map(item => {
                const i = items.filter(i => i._id == item)[0];
                return (
                  <tr>
                    <td>{i.title}</td>
                    <td>
                      <span>{amounts[item]} шт.</span>{" "}
                      <div>
                        <Button variant={"success"} onClick={() => add(i)}>
                          +1
                        </Button>
                        <Button variant={"danger"} onClick={() => remove(i)}>
                          -1
                        </Button>
                      </div>
                    </td>
                    <td className="compute">
                      {i.price} * {amounts[item]} = {i.price * amounts[item]}₽
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </>
      )}
      <Alert variant="primary">
        Общая сумма заказа: <h1>{cartPrice}₽</h1>
      </Alert>
      {Object.keys(amounts).length != 0 && (
        <>
          <Button variant={"success"} id="submit-order" onClick={submitOrder}>
            Оформить заказ
          </Button>{" "}
          <Button variant={"danger"} id="submit-order" onClick={clearCart}>
            Очистить корзину
          </Button>
        </>
      )}
    </div>
  );
};
