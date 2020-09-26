import React, { Component } from "react";
import Navbar from "./Navbar";
import LoginPage from "./Login";
import RegisterPage from "./Register";
import VerifyPage from "./Verify";
import CardList from "./CardList";
import Cart from "./Cart";
import Main from "./Main";
import Profile from "./Profile";
import { BASE_URL } from "../config/fetchConfig";
import AdminOrders from "./AdminOrders";
import AdminUsers from "./AdminUsers";
import AdminItems from "./AdminItems";
import { Switch, Route } from "react-router-dom";
import { withRouter } from "react-router";

class App extends Component {
  state = {
    loggedIn: false,
    isAdmin: false,
    page: "main",
    cartPrice: 0,
    cart: {},
  };

  componentDidMount() {
    const token = localStorage.getItem("token");

    if (token == null || token == undefined) this.props.history.push("/login");
    else this.setPage(this.state.page);
    const price = localStorage.getItem("cartPrice");
    if (price != null && price != undefined)
      this.setState({ cartPrice: price });
    const db = JSON.parse(localStorage.getItem("cartItems"));
    if (db != null && db != undefined) this.setState({ cart: db });

    fetch(`${BASE_URL}/auth/me`, {
      headers: {
        "x-access-token": localStorage.getItem("token"),
      },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.auth === false) {
          this.props.history.push("/login");
          localStorage.removeItem("token");
        } else {
          this.setState({
            isAdmin: res.user.isAdmin,
          });
        }
      });
  }

  setPage = (page) => {
    this.setState({
      page,
      isAdmin: localStorage.getItem("isAdmin") === "true",
    });
  };

  incNumOfItems = (price) => {
    this.setState({ cartPrice: Number(this.state.cartPrice) + price }, () => {
      localStorage.setItem("cartPrice", this.state.cartPrice);
    });
  };

  decNumOfItems = (price) => {
    this.setState({ cartPrice: Number(this.state.cartPrice) - price }, () => {
      localStorage.setItem("cartPrice", this.state.cartPrice);
    });
  };

  addToCart = (item) => {
    const id = item._id;
    this.incNumOfItems(item.price);
    this.state.cart[id]
      ? this.setState(
          { cart: { ...this.state.cart, [id]: this.state.cart[id] + 1 } },
          () => {
            localStorage.setItem("cartItems", JSON.stringify(this.state.cart));
          }
        )
      : this.setState({ cart: { ...this.state.cart, [id]: 1 } }, () => {
          localStorage.setItem("cartItems", JSON.stringify(this.state.cart));
        });
  };

  removeFromCart = (item) => {
    const id = item._id;
    this.decNumOfItems(item.price);
    if (this.state.cart[id] == 1) {
      const tmp = { ...this.state.cart };
      delete tmp[id];
      this.setState({ cart: tmp }, () => {
        localStorage.setItem("cartItems", JSON.stringify(this.state.cart));
      });
      return;
    }

    this.setState(
      { cart: { ...this.state.cart, [id]: this.state.cart[id] - 1 } },
      () => {
        localStorage.setItem("cartItems", JSON.stringify(this.state.cart));
      }
    );
  };

  clearCart = () => {
    this.setState({ cart: {}, cartPrice: 0 });
    localStorage.removeItem("cartItems");
    localStorage.removeItem("cartPrice");
  };

  logOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    this.props.history.push("/login");
  };

  setProductModalShow = (bool) => this.setState({ productModalShow: bool });

  render = () => (
    <div className="app">
      <Switch>
        <Route path="/catalog">
          <Navbar
            logOut={this.logOut}
            cartPrice={this.state.cartPrice}
            setPage={this.setPage}
            isAdmin={this.state.isAdmin}
          />
          <CardList incNumOfItems={this.addToCart} />
          <footer className="page-footer font-small blue">
            <div className="footer-copyright text-center py-3">
              © 2020 Copyright:
              <a href="https://vk.com/siltstrider"> FoodStore.com</a>
            </div>
          </footer>
        </Route>
        <Route path="/login">
          <LoginPage setPage={this.setPage} />
        </Route>
        <Route path="/register">
          <RegisterPage setPage={this.setPage} />
        </Route>
        <Route path="/verify">
          <VerifyPage setPage={this.setPage} />
        </Route>
        <Route path="/cart">
          <Navbar
            logOut={this.logOut}
            cartPrice={this.state.cartPrice}
            setPage={this.setPage}
            isAdmin={this.state.isAdmin}
          />
          <Cart
            cartPrice={this.state.cartPrice}
            items={JSON.parse(localStorage.getItem("items"))}
            amounts={this.state.cart}
            add={this.addToCart}
            remove={this.removeFromCart}
            clearCart={this.clearCart}
          />
        </Route>
        <Route path="/" exact>
          <Navbar
            logOut={this.logOut}
            cartPrice={this.state.cartPrice}
            setPage={this.setPage}
            isAdmin={this.state.isAdmin}
          />
          <Main incNumOfItems={this.addToCart} />
        </Route>
        <Route path="/profile">
          <Navbar
            logOut={this.logOut}
            cartPrice={this.state.cartPrice}
            setPage={this.setPage}
            isAdmin={this.state.isAdmin}
          />
          <Profile />
        </Route>
        <Route path="/admin-orders">
          <Navbar
            logOut={this.logOut}
            cartPrice={this.state.cartPrice}
            setPage={this.setPage}
            isAdmin={this.state.isAdmin}
          />
          <AdminOrders />
        </Route>
        <Route path="/admin-users">
          <Navbar
            logOut={this.logOut}
            cartPrice={this.state.cartPrice}
            setPage={this.setPage}
            isAdmin={this.state.isAdmin}
          />
          <AdminUsers />
        </Route>

        <Route path="/admin-items">
          <Navbar
            logOut={this.logOut}
            cartPrice={this.state.cartPrice}
            setPage={this.setPage}
            isAdmin={this.state.isAdmin}
          />
          <AdminItems />
        </Route>
      </Switch>
    </div>
  );
}

export default withRouter(App);
