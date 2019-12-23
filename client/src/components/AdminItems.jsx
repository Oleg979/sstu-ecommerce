import React, { useState, useEffect } from "react";
import { BASE_URL } from "../config/fetchConfig.js";
import { Alert, Form } from "react-bootstrap";
import { ITEM_TYPES } from "../config/constants";
import { notificationService } from "../config/notificationConfig.js";
import axios from "axios";

export default function AdminItems() {
  const [items, setItems] = useState(
    JSON.parse(localStorage.getItem("items")) || []
  );
  const [currentItem, setCurrentItem] = useState(items[0]);
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(99);
  const [type, setType] = useState(ITEM_TYPES[0]);
  useEffect(() => {
    fetch(`${BASE_URL}/item`, {
      method: "GET"
    })
      .then(data => data.json())
      .then(items => {
        setItems(items);
        localStorage.setItem("items", JSON.stringify(items));
      });
  }, []);
  const deleteItem = item => {
    fetch(`${BASE_URL}/item/${item._id}`, {
      method: "DELETE",
      headers: {
        "x-access-token": localStorage.getItem("token")
      }
    })
      .then(res => res.json())
      .then(({ res }) => {
        if (res) {
          setItems(items.filter(i => i._id != item._id));
          notificationService.success(`Товар ${item.title} успешно удален.`);
        }
      });
  };
  const onFileSelected = e => {
    setFile(e.target.files[0]);
  };
  const addItem = () => {
    if (!file || !title || !price || !description || !type) return;
    const data = new FormData();
    data.append("file", file);
    data.append("title", title);
    data.append("description", description);
    data.append("price", price);
    data.append("type", type);

    axios
      .post(`${BASE_URL}/item`, data, {
        headers: {
          "x-access-token": localStorage.getItem("token")
        }
      })
      .then(res => {
        fetch(`${BASE_URL}/item`, {
          method: "GET"
        })
          .then(data => data.json())
          .then(items => {
            notificationService.success(`Товар ${title} успешно добавлен.`);
            setItems(items);
            localStorage.setItem("items", JSON.stringify(items));
            setPrice(99);
            setType(ITEM_TYPES[0]);
            setTitle("");
            setDescription("");
          });
      });
  };
  return (
    <>
      <div style={{ padding: "5%" }}>
        <button
          type="button"
          class="btn btn-primary"
          style={{ fontSize: "x-large", display: "block", margin: "0 auto" }}
          data-toggle="modal"
          data-target="#addModal"
        >
          Добавить новый товар
        </button>
        <h1>Всего товаров: {items.length}</h1>
        {ITEM_TYPES.map(type => (
          <>
            <h3>
              Из них {type}: {items.filter(item => item.type == type).length}
            </h3>
            {items
              .filter(item => item.type == type)
              .map(item => (
                <Alert
                  variant="success"
                  className="admin-item"
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                  }}
                >
                  <div className="item-title">{item.title}</div>
                  <div>
                    <button
                      type="button"
                      class="btn btn-warning"
                      style={{ marginRight: 15 }}
                      data-toggle="modal"
                      data-target="#editModal"
                      onClick={() => setCurrentItem(item)}
                    >
                      Изменить
                    </button>
                    <button
                      type="button"
                      class="btn btn-danger"
                      data-toggle="modal"
                      data-target="#deleteModal"
                      onClick={() => setCurrentItem(item)}
                    >
                      Удалить
                    </button>
                  </div>
                </Alert>
              ))}
          </>
        ))}
      </div>
      {currentItem && (
        <>
          <div
            class="modal fade"
            id="deleteModal"
            tabindex="-1"
            role="dialog"
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
          >
            <div class="modal-dialog modal-dialog-centered" role="document">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title" id="exampleModalLabel">
                    Удалить товар {currentItem.title}
                  </h5>
                  <button
                    type="button"
                    class="close"
                    data-dismiss="modal"
                    aria-label="Close"
                  >
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div class="modal-body">
                  Вы уверены? Данное действие нельзя будет отменить.
                </div>
                <div class="modal-footer">
                  <button
                    type="button"
                    class="btn btn-secondary"
                    data-dismiss="modal"
                  >
                    Отмена
                  </button>
                  <button
                    type="button"
                    class="btn btn-primary"
                    data-dismiss="modal"
                    onClick={() => deleteItem(currentItem)}
                  >
                    Удалить
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div
            class="modal fade"
            id="editModal"
            tabindex="-1"
            role="dialog"
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
          >
            <div class="modal-dialog modal-dialog-centered" role="document">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title" id="exampleModalLabel">
                    Изменить товар {currentItem.title}
                  </h5>
                  <button
                    type="button"
                    class="close"
                    data-dismiss="modal"
                    aria-label="Close"
                  >
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div class="modal-body">
                  <form id="form-add">
                    <div class="form-group">
                      <label for="exampleFormControlInput1">Название</label>
                      <input
                        type="text"
                        class="form-control"
                        id="exampleFormControlInput1"
                        value={currentItem.title}
                      />
                    </div>
                    <div class="form-group">
                      <label for="exampleFormControlSelect1">Категория</label>
                      <select
                        class="form-control"
                        id="exampleFormControlSelect1"
                        value={currentItem.type}
                      >
                        {ITEM_TYPES.map(type => (
                          <option value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                    <div class="form-group">
                      <label for="exampleFormControlTextarea1">Описание</label>
                      <textarea
                        class="form-control"
                        id="exampleFormControlTextarea1"
                        rows="3"
                        value={currentItem.desc}
                      ></textarea>
                    </div>
                    <div class="form-group">
                      <label for="exampleFormControlTextarea1">
                        Цена: {currentItem.price}₽
                      </label>
                      <Form.Control
                        id="pr"
                        type="range"
                        min="49"
                        max="599"
                        value={currentItem.price}
                      />
                    </div>
                    <div class="form-group">
                      <label for="exampleFormControlFile1">Изображение</label>
                      <input
                        type="file"
                        class="form-control-file"
                        id="exampleFormControlFile1"
                        accept="image/jpeg,image/png,image/gif"
                      />
                    </div>
                  </form>
                </div>
                <div class="modal-footer">
                  <button
                    type="button"
                    class="btn btn-secondary"
                    data-dismiss="modal"
                  >
                    Отмена
                  </button>
                  <button
                    type="button"
                    class="btn btn-primary"
                    data-dismiss="modal"
                  >
                    Сохранить
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      <div
        class="modal fade"
        id="addModal"
        tabindex="-1"
        role="dialog"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog modal-dialog-centered" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLabel">
                Добавить новый товар
              </h5>
              <button
                type="button"
                class="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <form id="form-add">
                <div class="form-group">
                  <label for="exampleFormControlInput1">Название</label>
                  <input
                    type="text"
                    class="form-control"
                    id="exampleFormControlInput1"
                    placeholder="Бургер с курицей"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                  />
                </div>
                <div class="form-group">
                  <label for="exampleFormControlSelect1">Категория</label>
                  <select
                    class="form-control"
                    id="exampleFormControlSelect1"
                    value={type}
                    onChange={e => setType(e.target.value)}
                  >
                    {ITEM_TYPES.map(type => (
                      <option value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                <div class="form-group">
                  <label for="exampleFormControlTextarea1">Описание</label>
                  <textarea
                    class="form-control"
                    id="exampleFormControlTextarea1"
                    rows="3"
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                  ></textarea>
                </div>
                <div class="form-group">
                  <label for="exampleFormControlTextarea1">
                    Цена: {price}₽
                  </label>
                  <Form.Control
                    id="pr"
                    type="range"
                    min="49"
                    max="599"
                    defaultValue={price}
                    value={price}
                    onChange={e => setPrice(+e.target.value)}
                  />
                </div>
                <div class="form-group">
                  <label for="exampleFormControlFile1">Изображение</label>
                  <input
                    type="file"
                    class="form-control-file"
                    id="exampleFormControlFile1"
                    accept="image/jpeg,image/png,image/gif"
                    onChange={onFileSelected}
                  />
                </div>
              </form>
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-secondary"
                data-dismiss="modal"
              >
                Отмена
              </button>
              <button
                type="button"
                class="btn btn-primary"
                onClick={addItem}
                data-dismiss="modal"
              >
                Добавить
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
