import React, { useEffect, useState } from "react";
import { Modal, Alert, Button, Form } from "react-bootstrap";
import { notificationService } from "../config/notificationConfig";
import { BASE_URL } from "../config/fetchConfig";

export default ({ show, setProductModalShow, item, incNumOfItems }) => {
  let {
    title,
    image,
    price,
    rate,
    desc,
    type,
    numOfBuyers,
    numOfVoters
  } = item;
  let [comments, setComments] = useState([]);
  let [showRate, setShowRate] = useState(true);
  let [newRate, setRate] = useState(rate);
  let [voters, setVoters] = useState(numOfVoters);

  useEffect(() => {
    if (item === {}) return;
    fetch(`${BASE_URL}/comment/${item._id}`, {
      method: "GET",
      headers: {
        "x-access-token": localStorage.getItem("token")
      }
    })
      .then(data => data.json())
      .then(comments => {
        setComments(comments);
      });
  }, [show]);

  useEffect(() => {
    if (item === {}) return;
    fetch(`${BASE_URL}/item/isRated/${item._id}`, {
      method: "GET",
      headers: {
        "x-access-token": localStorage.getItem("token")
      }
    })
      .then(data => data.json())
      .then(data => {
        setShowRate(data.res);
      });
  }, [show]);

  const addToCart = () => {
    incNumOfItems(item);
    notificationService.success(`${title} - добавлено в корзину!`);
  };

  const postRate = () => {
    var numOfVoters = Number(item.numOfVoters);
    var rate = Number(item.rate);
    var amount = Number(
      document.getElementById("sendrate").innerText.split(" ")[2]
    );
    rate = (rate * numOfVoters + Number(amount)) / (numOfVoters + 1);
    setRate(rate);
    setVoters(voters + 1);
    document.getElementById(
      "numVote"
    ).innerText = `Средняя оценка ${numOfVoters + 1} покупателей:`;
    fetch(`${BASE_URL}/item/rate/${item._id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": localStorage.getItem("token")
      },
      body: JSON.stringify({
        amount: Number(
          document.getElementById("sendrate").innerText.split(" ")[2]
        )
      })
    })
      .then(data => data.json())
      .then(data => {
        console.log(data);
        notificationService.success(
          `Вы оценили ${title} на ${Number(
            document.getElementById("sendrate").innerText.split(" ")[2]
          )}`
        );
        setShowRate(true);
      });
  };

  const send = () => {
    const date = new Date();
    const com = document.getElementById("exampleFormControlTextarea1").value;
    if (com.trim().length < 10) {
      notificationService.error(
        "Комментарий должен составлять минимум 10 символов!"
      );
      return;
    }
    document.getElementById("exampleFormControlTextarea1").value = "";
    setComments([
      ...comments,
      {
        text: com,
        userName: localStorage.getItem("name"),
        creationDate:
          date.toLocaleDateString() + " " + date.toLocaleTimeString()
      }
    ]);
    fetch(`${BASE_URL}/comment/`, {
      method: "POST",
      headers: {
        "x-access-token": localStorage.getItem("token"),
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        itemId: item._id,
        text: com,
        creationDate:
          date.toLocaleDateString() + " " + date.toLocaleTimeString()
      })
    })
      .then(data => data.json())
      .then(comments => {
        fetch(`${BASE_URL}/comment/${item._id}`, {
          method: "GET",
          headers: {
            "x-access-token": localStorage.getItem("token")
          }
        })
          .then(data => data.json())
          .then(comments => {
            setComments(comments);
          });
      });
  };
  return (
    <Modal
      dialogClassName="modal-90w"
      show={show}
      onHide={() => setProductModalShow(false, item)}
      aria-labelledby="example-modal-sizes-title-lg"
    >
      <Modal.Header closeButton>
        <Modal.Title id="example-modal-sizes-title-lg">
          Подробнее о товаре {title}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div class="container">
          <h1 class="my-4">{title}</h1>
          <Alert variant="primary">Товар относится к категории "{type}"</Alert>

          <div class="row">
            <div class="col-md-8">
              <img class="img-fluid" src={image} alt="" />
            </div>

            <div class="col-md-4">
              <h3 class="my-3">Описание товара</h3>
              <p>{desc}</p>
              <Alert variant="success">
                Данный товар покупали <h1>{numOfBuyers} раз</h1>
              </Alert>
              <Alert variant="warning">
                <span id="numVote">
                  Средняя оценка {voters ? voters : numOfVoters} покупателей:
                </span>{" "}
                <h1>
                  {newRate ? newRate.toFixed(1) : rate && rate.toFixed(1)} из 5
                </h1>
              </Alert>
              {!showRate && (
                <>
                  {" "}
                  <Alert variant="error">
                    <Form.Control
                      id="rate"
                      type="range"
                      min="1"
                      max="5"
                      defaultValue="4"
                      onChange={e =>
                        (document.getElementById("sendrate").innerText =
                          "Оценить на " + e.target.value)
                      }
                    />
                  </Alert>
                  <Button className="send" id="sendrate" onClick={postRate}>
                    Оценить на 4
                  </Button>
                </>
              )}
              {showRate && (
                <Alert variant="primary">Вы уже оценили этот товар</Alert>
              )}
              <Button variant="success" id="buyModal" onClick={addToCart}>
                Купить за {price}₽
              </Button>
            </div>
          </div>

          <h3 class="my-4">Оставить комментарий</h3>
          <textarea
            class="form-control"
            id="exampleFormControlTextarea1"
            rows="5"
          ></textarea>

          <Button className="send" onClick={send}>
            Отправить
          </Button>
        </div>
        <div class="container">
          <div class="comments">
            <h3 class="title-comments">Комментарии ({comments.length})</h3>
            <ul class="media-list">
              {comments.map(comment => (
                <li class="media" key={comment._id}>
                  <div class="media-body">
                    <div class="media-heading">
                      <div
                        class="author"
                        style={{ display: "inline", marginRight: "5px" }}
                      >
                        {comment.userName}
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
      </Modal.Body>
    </Modal>
  );
};
