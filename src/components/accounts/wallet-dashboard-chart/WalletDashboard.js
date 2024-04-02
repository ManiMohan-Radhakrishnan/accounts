import { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

import {
  currencyFormat,
  roundDown,
  userBalanceDetailFormat,
} from "../../../utils/common";

const WalletDashboardChart = ({ ChartData, handleDeposit }) => {
  ChartJS.register(ArcElement, Tooltip, Legend);
  const { total_amount = 0 } = ChartData;
  const [redraw, setRedraw] = useState(false);
  const options = {
    cutout: "70%",
    plugins: {
      legend: {
        display: false,
        position: "right",
      },
      tooltip: {
        displayColors: false,
      },
    },

    elements: {
      arc: {
        borderWidth: 0,
      },
    },
    title: {
      text: "right",
    },
  };

  const data = {
    maintainAspectRatio: false,
    responsive: true,
    labels: ChartData?.labels,

    datasets: [
      {
        data: ChartData?.data,
        backgroundColor: ChartData?.chartColors,
        hoverBackgroundColor: ChartData?.chartColors,
      },
    ],
  };

  const plugins = [
    {
      beforeDraw: function (chart) {
        var width = chart.width,
          height = chart.height,
          ctx = chart.ctx;
        ctx.restore();
        ctx.font = "bold 1.5em proxima-nova";
        ctx.textBaseline = "top";
        var text = "$" + userBalanceDetailFormat(total_amount),
          textX = Math.round((width - ctx.measureText(text).width) / 2),
          textY = height / 2;
        ctx.fillText(text, textX, textY);
        ctx.textBaseline = "bottom";
        ctx.font = "0.9em proxima-nova";
        var text1 = "Total Funds ",
          textX = Math.round((width - ctx.measureText(text1).width) / 2),
          textY = height / 2;
        ctx.fillText(text1, textX, textY);

        ctx.save();
      },
    },
  ];

  useEffect(() => {
    setRedraw(true);
    setTimeout(() => setRedraw(false), 100);
  }, [total_amount]);

  return (
    <>
      {total_amount > 0 ? (
        <Doughnut
          data={data}
          options={options}
          plugins={plugins}
          width={"100%"}
          height={"100%"}
          redraw={redraw}
        />
      ) : (
        <div className="chart-no-funds">
          <div className="balance-block">
            <span>Total Funds</span>
            <h4>{currencyFormat(total_amount)}</h4>
          </div>
          <button onClick={handleDeposit}>Add Funds</button>
        </div>
      )}
    </>
  );
};

export default WalletDashboardChart;
