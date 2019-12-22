import React from "react";
import { Navbar, Form, Button, Nav } from "react-bootstrap";

export default ({ logOut, cartPrice, setPage, isAdmin }) => {
  console.log("is admin " + isAdmin);
  return (
    <>
      <Navbar bg="light" expand="lg" className="navbar-fixed">
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
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link href="#home" onClick={() => setPage("title")}>
              Главная
            </Nav.Link>
            <Nav.Link href="#link" onClick={() => setPage("main")}>
              Каталог
            </Nav.Link>
            {isAdmin && (
              <>
                <Nav.Link href="#link" onClick={() => setPage("admin-orders")}>
                  Заказы
                </Nav.Link>
                <Nav.Link href="#link" onClick={() => setPage("admin-users")}>
                  Пользователи
                </Nav.Link>
                <Nav.Link href="#link" onClick={() => setPage("admin-items")}>
                  Товары
                </Nav.Link>
              </>
            )}
          </Nav>
          <Form inline>
            <Button variant="success" onClick={() => setPage("cart")}>
              Корзина {cartPrice === 0 ? "(пусто)" : `(${cartPrice}₽)`}
            </Button>
            <Button
              variant="outline-success"
              onClick={() => {
                setPage("profile");
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
