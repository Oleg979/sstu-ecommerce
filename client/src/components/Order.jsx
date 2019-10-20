import React from "react";
import { Table, Button, Alert } from "react-bootstrap";

export default ({
  status,
  creationDate,
  sum,
  payload,
  items,
  users,
  _id,
  acceptorId,
  isAcceptingVisible = false,
  isAcceptedVisible = false,
  accept = () => {}
}) => {
  return (
    <div>
      <Table
        striped
        bordered
        hover
        responsive
        small={document.body.clientWidth <= 630}
        style={{ marginBottom: "0" }}
      >
        <thead>
          <tr>
            <th>Название</th>
            <th>Количество</th>
            <th>Стоимость</th>
          </tr>
        </thead>
        <tbody>
          {payload.map(({ itemId, amount }) => {
            console.log(itemId, amount);
            let item = items.filter(i => i._id == itemId)[0];
            return (
              <tr>
                <td>{item.title}</td>
                <td>
                  <span>{amount} шт.</span>{" "}
                </td>
                <td className="compute">
                  {item.price} * {amount} = {item.price * amount}₽
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
      {isAcceptingVisible && (
        <>
          <Button
            variant="primary"
            style={{ marginBottom: "0" }}
            onClick={() => accept(_id)}
          >
            Принять заказ
          </Button>
        </>
      )}
      {isAcceptedVisible && (
        <Alert variant="primary" style={{marginBottom: "0"}}>
          Принято администратором:{" "}
          {users && users.filter(user => user._id == acceptorId)[0].name}(
          {users && users.filter(user => user._id == acceptorId)[0].email})
        </Alert>
      )}
    </div>
  );
};
