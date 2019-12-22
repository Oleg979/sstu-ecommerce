import React from "react";
import { Line } from "react-chartjs-2";

const processOrders = orders => {
  orders.forEach(o => (o.creationDate = o.creationDate.split(" ")[0]));
  const orderSums = {};
  orders.map(o => {
    if (orderSums[o.creationDate]) {
      orderSums[o.creationDate] += o.sum;
    } else {
      orderSums[o.creationDate] = o.sum;
    }
  });
  console.log(orderSums);
  return [Object.keys(orderSums), Object.values(orderSums)];
};

export default ({ orders }) => {
  const [orderLabels, orderSums] = processOrders(orders);
  const data = {
    labels: orderLabels,
    datasets: [
      {
        label: "Выручка в данный день",
        fill: false,
        lineTension: 0.1,
        backgroundColor: "rgba(75,192,192,0.4)",
        borderColor: "rgba(75,192,192,1)",
        borderCapStyle: "butt",
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: "miter",
        pointBorderColor: "rgba(75,192,192,1)",
        pointBackgroundColor: "#fff",
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: "rgba(75,192,192,1)",
        pointHoverBorderColor: "rgba(220,220,220,1)",
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data: orderSums
      }
    ]
  };
  return (
    <div>
      <Line data={data} />
    </div>
  );
};
