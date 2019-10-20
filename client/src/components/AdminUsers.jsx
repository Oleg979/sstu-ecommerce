import React, { Component } from "react";
import { BASE_URL } from "../config/fetchConfig";
import { Alert } from "react-bootstrap";
import UserCard from "./UserCard";
import { notificationService } from "../config/notificationConfig.js";

export default class AdminUsers extends Component {
  state = {
    users: []
  };
  componentDidMount() {
    let users = localStorage.getItem("users");
    if (users != null && users != undefined)
      this.setState({ users: JSON.parse(users) });
    this.fetchUsers();
  }

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

  deleteUser = id => {
    if (localStorage.getItem("userId") == id)
      return notificationService.error("Вы не можете удалить самого себя!");
    fetch(`${BASE_URL}/user/${id}`, {
      method: "DELETE",
      headers: {
        "x-access-token": localStorage.getItem("token")
      }
    })
      .then(res => res.json())
      .then(({ res }) => {
        if (res === true) {
          notificationService.success("Пользователь успешно удален.");
          this.setState({
            users: this.state.users.filter(user => user._id != id)
          });
        }
      });
  };

  toggleAdmin = id => {
    if (localStorage.getItem("userId") == id)
      return notificationService.error(
        "Вы не можете выполнить это действие с самим собой!"
      );
    fetch(`${BASE_URL}/user/grantadmin/${id}`, {
      headers: {
        "x-access-token": localStorage.getItem("token")
      }
    })
      .then(res => res.json())
      .then(({ res }) => {
        notificationService.success("Привилегии успешно изменены.");
        let neededUser = this.state.users.filter(user => user._id == id)[0];
        neededUser = { ...neededUser, isAdmin: !neededUser.isAdmin };
        this.setState({
          users: [
            ...this.state.users.filter(user => user._id != id),
            neededUser
          ]
        });
      });
  };

  render() {
    return (
      <div style={{ padding: "5%" }}>
        {this.state.users.map(user => (
          <UserCard
            {...user}
            deleteUser={id => this.deleteUser(id)}
            toggleAdmin={id => this.toggleAdmin(id)}
          />
        ))}
      </div>
    );
  }
}
