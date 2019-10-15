import { Toastme } from "toastmejs";
const config =
  document.body.clientWidth <= 630
    ? {
        timeout: 2000,
        positionY: "bottom",
        positionX: "center",
        distanceY: 20,
        distanceX: 20,
        zIndex: 10000,
        theme: "default"
      }
    : {
        timeout: 2000,
        positionY: "bottom",
        positionX: "right",
        distanceY: 20,
        distanceX: 20,
        zIndex: 10000,
        theme: "default"
      };
export const notificationService = new Toastme(config);
