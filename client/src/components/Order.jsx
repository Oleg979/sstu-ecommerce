import React from "react";
import { Table } from "react-bootstrap";

export default ({ status, creationDate, sum, payload, items }) => {
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
    </div>
  );
};
