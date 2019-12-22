import React, { Component } from "react";
import { BASE_URL } from "../config/fetchConfig";
import { Accordion, Card, Alert } from "react-bootstrap";
import Order from "./Order";
import { notificationService } from "../config/notificationConfig";
import OrderStat from "./OrderStat";

export default class AdminOrders extends Component {
  state = {
    orders: [],
    items: [],
    chartData: {
      labels: ["January", "February", "March", "April", "May", "June", "July"],
      datasets: [
        {
          label: "My First dataset",
          backgroundColor: "rgba(255,99,132,0.2)",
          borderColor: "rgba(255,99,132,1)",
          borderWidth: 1,
          hoverBackgroundColor: "rgba(255,99,132,0.4)",
          hoverBorderColor: "rgba(255,99,132,1)",
          data: [65, 59, 80, 81, 56, 55, 40]
        }
      ]
    }
  };
  componentDidMount() {
    const orders = localStorage.getItem("orders");
    if (orders != null && orders != undefined) {
      this.setState({ orders: JSON.parse(orders) });
    }
    const items = localStorage.getItem("items");
    if (items != null && items != undefined) {
      this.setState({ items: JSON.parse(items) });
    }
    let users = localStorage.getItem("users");
    if (users != null && users != undefined)
      this.setState({ users: JSON.parse(users) });
    this.fetchUsers();
    this.fetchOrders();
    this.fetchItems();
  }
  fetchOrders = () => {
    fetch(`${BASE_URL}/order/all`, {
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
  fetchUsers = () => {
    fetch(`${BASE_URL}/user`, {
      headers: {
        "x-access-token": localStorage.getItem("token")
      }
    })
      .then(res => res.json())
      .then(({ users }) => {
        this.setState({ users });
        localStorage.setItem("users", JSON.stringify(users));
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
  acceptOrder = id => {
    fetch(`${BASE_URL}/order/accept/${id}`, {
      headers: {
        "x-access-token": localStorage.getItem("token")
      }
    })
      .then(res => res.json())
      .then(res => {
        if (res.res === true) {
          notificationService.success("Вы приняли заказ клиента!");
          let neededOrder = this.state.orders.filter(
            order => order._id == id
          )[0];
          neededOrder = {
            ...neededOrder,
            status: "Accepted",
            acceptorId: localStorage.getItem("userId")
          };
          this.setState({
            orders: [
              ...this.state.orders.filter(order => order._id != id),
              neededOrder
            ]
          });
        }
      });
  };
  render() {
    const { orders, items, users } = this.state;
    return (
      <div style={{ padding: "5%" }}>
        <h3 style={{ marginBottom: "20px", marginTop: "20px" }}>
          Ожидающие заказы:
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
                      Заказ клиента{" "}
                      {users &&
                        users.length > 0 &&
                        users.filter(user => user._id == order.customerId)[0]
                          .name}
                      <b>
                        (
                        {users &&
                          users.length > 0 &&
                          users.filter(user => user._id == order.customerId)[0]
                            .email}
                      </b>
                      ) от <b>{order.creationDate.split(" ")[0]}</b> на сумму{" "}
                      <b>{order.sum}₽</b>
                    </h5>
                  </Accordion.Toggle>
                  <Accordion.Collapse eventKey={idx}>
                    <Order
                      {...order}
                      items={items}
                      users={users}
                      isAcceptingVisible={true}
                      accept={id => this.acceptOrder(id)}
                    />
                  </Accordion.Collapse>
                </Card>
              ))}
          {orders
            .filter(order => order.payload.length > 0)
            .filter(order => order.status === "New").length == 0 && (
            <Alert variant="danger">
              На данный момент нет ни одного ожидающего заказа.
            </Alert>
          )}
        </Accordion>
        <h3 style={{ marginBottom: "20px", marginTop: "20px" }}>
          Принятые заказы:
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
                      Заказ клиента{" "}
                      {users &&
                        users.length > 0 &&
                        users.filter(user => user._id == order.customerId)[0]
                          .name}
                      <b>
                        (
                        {users &&
                          users.length > 0 &&
                          users.filter(user => user._id == order.customerId)[0]
                            .email}
                      </b>
                      ) от <b>{order.creationDate.split(" ")[0]}</b> на сумму{" "}
                      <b>{order.sum}₽</b>
                    </h5>
                  </Accordion.Toggle>
                  <Accordion.Collapse eventKey={idx}>
                    <Order
                      {...order}
                      items={items}
                      users={users}
                      isAcceptedVisible={true}
                    />
                  </Accordion.Collapse>
                </Card>
              ))}
          {orders
            .filter(order => order.payload.length > 0)
            .filter(order => order.status === "Accepted").length == 0 && (
            <Alert variant="danger">
              На данный момент нет ни одного принятого заказа.
            </Alert>
          )}
        </Accordion>
        <h3 style={{ marginBottom: "20px", marginTop: "20px" }}>
          Статистика заказов:
        </h3>
        <OrderStat orders={this.state.orders} />
      </div>
    );
  }
}
