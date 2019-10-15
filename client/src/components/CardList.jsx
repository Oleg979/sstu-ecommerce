import React, { Component } from "react";
import FoodCard from "./Card";
import SearchBar from "./SearchBar";
import { notificationService } from "../config/notificationConfig";
import ItemModal from "./ItemModal";
import { BASE_URL } from "../config/fetchConfig";

export default class CardList extends Component {
  state = {
    items: [],
    searchedItems: [],
    search: false,
    productModalShow: false,
    modalItem: {}
  };

  setProductModalShow = (bool, item) => {
    this.setState({ productModalShow: bool, modalItem: item ? item : {} });
    if (!bool)
      fetch(`${BASE_URL}/item`, {
        method: "GET"
      })
        .then(data => data.json())
        .then(items => {
          this.setState({ items });
          localStorage.setItem("items", JSON.stringify(items));
        });
  };

  noSearch = () => {
    this.setState({ search: false, searchedItems: [] });
    notificationService.info("Поиск сброшен.");
  };

  search = ({ name, price, type, onlyComments }) => {
    let items = this.state.items;
    items = items.filter(item => item.price <= price);
    if (name !== "") {
      items = items.filter(
        item => item.title.toLowerCase().indexOf(name.toLowerCase()) !== -1
      );
    }
    if (type) {
      items = items.filter(item => item.type === type);
    }

    this.setState({
      search: true,
      searchedItems: items
    });
    notificationService.info("Найдено товаров: " + items.length);
  };
  componentDidMount() {
    let cache = localStorage.getItem("items");
    if (cache)
      this.setState({ items: JSON.parse(cache) }, () => {
        fetch(`${BASE_URL}/item`, {
          method: "GET"
        })
          .then(data => data.json())
          .then(items => {
            this.setState({ items });
            localStorage.setItem("items", JSON.stringify(items));
          });
      });
    else
      fetch(`${BASE_URL}/item`, {
        method: "GET"
      })
        .then(data => data.json())
        .then(items => {
          this.setState({ items });
          localStorage.setItem("items", JSON.stringify(items));
        });
  }
  render() {
    return (
      <>
        <div>
          <SearchBar search={this.search} noSearch={this.noSearch} />

          <div className="cardlist">
            {this.state.search &&
              this.state.searchedItems.map(item => (
                <FoodCard
                  setProductModalShow={this.setProductModalShow}
                  incNumOfItems={this.props.incNumOfItems}
                  {...item}
                  key={item._id}
                  wholeItem={item}
                />
              ))}
            {!this.state.search &&
              this.state.items.map(item => (
                <FoodCard
                  setProductModalShow={this.setProductModalShow}
                  incNumOfItems={this.props.incNumOfItems}
                  {...item}
                  key={item._id}
                  wholeItem={item}
                />
              ))}
          </div>
          {}
        </div>
        <ItemModal
          show={this.state.productModalShow}
          setProductModalShow={this.setProductModalShow}
          item={this.state.modalItem}
          incNumOfItems={this.props.incNumOfItems}
        />
      </>
    );
  }
}
