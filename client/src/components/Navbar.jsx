import React from "react";
import { Navbar, Form, Button, Nav } from "react-bootstrap";
import { useHistory } from "react-router-dom";

export default ({ logOut, cartPrice, setPage, isAdmin }) => {
  console.log("is admin " + isAdmin);
  const history = useHistory();
  return (
    <>
      <Navbar bg="light" expand="lg" className="navbar-fixed">
        <Navbar.Brand onClick={() => history.push("/")}>
          <img
            alt=""
            src={require("../assets/burger.png")}
            width="30"
            height="30"
            className="d-inline-block align-top"
            style={{ marginRight: "10px" }}
          />
          {"FoodStore"}
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link onClick={() => history.push("/")}>Главная</Nav.Link>
            <Nav.Link onClick={() => history.push("/catalog")}>
              Каталог
            </Nav.Link>
            {isAdmin && (
              <>
                <Nav.Link onClick={() => history.push("/admin-orders")}>
                  Заказы
                </Nav.Link>
                <Nav.Link onClick={() => history.push("/admin-users")}>
                  Пользователи
                </Nav.Link>
                <Nav.Link onClick={() => history.push("/admin-items")}>
                  Товары
                </Nav.Link>
              </>
            )}
          </Nav>
          <Form inline>
            <Button variant="success" onClick={() => history.push("/cart")}>
              Корзина {cartPrice === 0 ? "(пусто)" : `(${cartPrice}₽)`}
            </Button>
            <Button
              variant="outline-success"
              onClick={() => {
                history.push("/profile");
              }}
            >
              Мой профиль
            </Button>
            <Button variant="outline-danger" onClick={() => logOut()}>
              Выход из профиля
            </Button>
          </Form>
        </Navbar.Collapse>
      </Navbar>
      <Navbar bg="light" expand="lg" className="not-fixed">
        <Navbar.Brand href="#home">
          <img
            alt=""
            src={require("../assets/burger.png")}
            width="30"
            height="30"
            className="d-inline-block align-top"
            style={{ marginRight: "10px" }}
          />
          {"FoodStore"}
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-naadasdv" />
        <Navbar.Collapse id="basic-navbar-naasdsadv"></Navbar.Collapse>
      </Navbar>
    </>
  );
};
