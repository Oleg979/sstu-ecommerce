import React, { Component } from "react";
import { Alert, Accordion, Card } from "react-bootstrap";
import { BASE_URL } from "../config/fetchConfig";
import Order from "./Order";

export default class Profile extends Component {
  state = {
    user: null,
    orders: [],
    items: []
  };
  componentDidMount() {
    const user = localStorage.getItem("user");
    if (user != null && user != undefined) {
      this.setState({ user: JSON.parse(user) });
    }
    const orders = localStorage.getItem("orders");
    if (orders != null && orders != undefined) {
      this.setState({ orders: JSON.parse(orders) });
    }
    const items = localStorage.getItem("items");
    if (items != null && items != undefined) {
      this.setState({ items: JSON.parse(items) });
    }
    this.fetchUser();
    this.fetchOrders();
    this.fetchItems();
  }
  fetchUser = () => {
    fetch(`${BASE_URL}/auth/me`, {
      headers: {
        "x-access-token": localStorage.getItem("token")
      }
    })
      .then(res => res.json())
      .then(res => {
        this.setState({ user: res.user });
        localStorage.setItem("user", JSON.stringify(res.user));
      });
  };
  fetchOrders = () => {
    fetch(`${BASE_URL}/order/`, {
      headers: {
        "x-access-token": localStorage.getItem("token")
      }
    })
      .then(res => res.json())
      .then(res => {
        this.setState({ orders: res.orders });
        localStorage.setItem("orders", JSON.stringify(res.orders));
      });
  };
  fetchItems = () => {
    fetch(`${BASE_URL}/item/`, {
      method: "GET"
    })
      .then(data => data.json())
      .then(items => {
        this.setState({ items });
        localStorage.setItem("items", JSON.stringify(items));
      });
  };
  processRegistrationDate = () => {
    const [year, month, day] = this.state.user.registrationDate
      .split("T")[0]
      .split("-");
    return `${day}.${month}.${year}`;
  };
  render() {
    const { user, orders } = this.state;
    return (
      <div>
        {user && (
          <>
            <div style={{ padding: "5%" }}>
              <h1>Профиль клиента: {user.name}</h1>
              <h6 style={{ marginBottom: "30px" }}>({user.email})</h6>
              <Alert variant="primary">
                {`Вы являетесь нашим клиентом с ${this.processRegistrationDate()}.`}
              </Alert>
              <Alert variant="success">
                {`За это время Вы сделали ${user.numOfOrders} заказов.`}
              </Alert>
              <Alert variant="warning">
                {`Ваш уровень привилегий: ${
                  user.isAdmin ? "Администратор" : "Обычный пользователь"
                }.`}
              </Alert>
              <h3 style={{ marginBottom: "20px", marginTop: "20px" }}>
                Ваши заказы, ожидающие подтверждения:
              </h3>
              <Accordion defaultActiveKey="0">
                {orders.length > 0 &&
                  orders
                    .filter(order => order.payload.length > 0)
                    .filter(order => order.status === "New")
                    .map((order, idx) => (
                      <Card className="card1">
                        <Accordion.Toggle as={Card.Header} eventKey={idx}>
                          <h5>
                            Заказ от <b>{order.creationDate.split(" ")[0]}</b>{" "}
                            на сумму <b>{order.sum}₽</b>
                          </h5>
                        </Accordion.Toggle>
                        <Accordion.Collapse eventKey={idx}>
                          <Order {...order} items={this.state.items} />
                        </Accordion.Collapse>
                      </Card>
                    ))}
                {orders
                  .filter(order => order.payload.length > 0)
                  .filter(order => order.status === "New").length == 0 && (
                  <Alert variant="danger">
                    У Вас нет ни одного ожидающего заказа.
                  </Alert>
                )}
              </Accordion>
              <h3 style={{ marginBottom: "20px", marginTop: "20px" }}>
                Ваши завершенные заказы:
              </h3>
              <Accordion defaultActiveKey="0">
                {orders.length > 0 &&
                  orders
                    .filter(order => order.payload.length > 0)
                    .filter(order => order.status === "Accepted")
                    .map((order, idx) => (
                      <Card className="card1">
                        <Accordion.Toggle as={Card.Header} eventKey={idx}>
                          <h5>
                            Заказ от <b>{order.creationDate.split(" ")[0]}</b>{" "}
                            на сумму <b>{order.sum}₽</b>
                          </h5>
                        </Accordion.Toggle>
                        <Accordion.Collapse eventKey={idx}>
                          <Order {...order} items={this.state.items} />
                        </Accordion.Collapse>
                      </Card>
                    ))}
                {orders
                  .filter(order => order.payload.length > 0)
                  .filter(order => order.status === "Accepted").length == 0 && (
                  <Alert variant="danger">
                    У Вас нет ни одного завершенного заказа.
                  </Alert>
                )}
              </Accordion>
            </div>
          </>
        )}
      </div>
    );
  }
}
