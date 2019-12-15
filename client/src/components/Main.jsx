import React, { Component } from "react";
import { Alert, Card, Accordion } from "react-bootstrap";
import FoodCard from "./Card";
import ItemModal from "./ItemModal";
import { BASE_URL } from "../config/fetchConfig";

export default class Main extends Component {
  state = {
    items: [],
    productModalShow: false,
    modalItem: {},
    comments: []
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

    fetch(`${BASE_URL}/comment/`, {
      method: "GET"
    })
      .then(data => data.json())
      .then(comments => {
        this.setState({ comments: comments.reverse() });
      });
  }

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

  top3BestScore = () => {
    return [...this.state.items].sort((a, b) => b.rate - a.rate).slice(0, 3);
  };

  top3Cheapest = () => {
    return [...this.state.items].sort((a, b) => a.price - b.price).slice(0, 3);
  };

  render() {
    return (
      <>
        <div className="mainblock">
          <h1>
            Добро пожаловать на FoodStore, {localStorage.getItem("name")}!
          </h1>
          <Alert variant="primary">
            Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean
            commodo ligula eget dolor. Aenean massa. Cum sociis natoque
            penatibus et magnis dis parturient montes, nascetur ridiculus mus.
            Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem.
            Nulla consequat massa quis enim. Donec pede justo, fringilla vel,
            aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut,
            imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede
            mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum
            semper nisi. Aenean vulputate eleifend tellus.
          </Alert>
          <Accordion defaultActiveKey="0">
            <Card className="card1">
              <Accordion.Toggle as={Card.Header} eventKey="0">
                <h2>Топ-3 лучших товаров</h2>
              </Accordion.Toggle>
              <Accordion.Collapse eventKey="0">
                <Card.Body className="body1">
                  <div className="cardlist-main">
                    {this.top3BestScore().map(item => (
                      <FoodCard
                        {...item}
                        key={item._id}
                        wholeItem={item}
                        setProductModalShow={this.setProductModalShow}
                        incNumOfItems={this.props.incNumOfItems}
                      />
                    ))}
                  </div>
                </Card.Body>
              </Accordion.Collapse>
            </Card>
          </Accordion>
          <Accordion defaultActiveKey="0">
            <Card className="card1">
              <Accordion.Toggle as={Card.Header} eventKey="0">
                <h2>Топ-3 дешёвых товаров</h2>
              </Accordion.Toggle>
              <Accordion.Collapse eventKey="0">
                <Card.Body className="body1">
                  <div className="cardlist-main">
                    {this.top3Cheapest().map(item => (
                      <FoodCard
                        {...item}
                        key={item._id}
                        wholeItem={item}
                        setProductModalShow={this.setProductModalShow}
                        incNumOfItems={this.props.incNumOfItems}
                      />
                    ))}
                  </div>
                </Card.Body>
              </Accordion.Collapse>
            </Card>
          </Accordion>
          <div class="container">
            <div class="comments">
              <h3 class="title-comments">Последние комментарии</h3>
              <ul class="media-list">
                {this.state.comments.slice(0, 5).map(comment => (
                  <li
                    class="media"
                    key={comment._id}
                    style={{ textAlign: "initial" }}
                  >
                    <div class="media-body">
                      <div class="media-heading">
                        <div class="author">
                          Покупатель {comment.userName} оставил комментарий к
                          товару{" "}
                          {
                            this.state.items.filter(
                              i => i._id == comment.itemId
                            )[0].title
                          }
                        </div>
                        <img
                          src={require(`../assets/sentiment/${comment.sentiment ||
                            "clock"}.png`)}
                        ></img>
                        <div class="metadata">
                          <span class="date">{comment.creationDate}</span>
                        </div>
                      </div>
                      <div class="media-text text-justify">{comment.text}</div>

                      <hr />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <footer className="page-footer font-small blue">
          <div className="footer-copyright text-center py-3">
            © 2019 Copyright:
            <a href="https://mdbootstrap.com/education/bootstrap/">
              {" "}
              FoodStore.com
            </a>
          </div>
        </footer>
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
