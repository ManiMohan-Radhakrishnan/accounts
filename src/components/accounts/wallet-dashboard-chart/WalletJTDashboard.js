import { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { roundDown, userBalanceDetailFormat } from "../../../utils/common";

const WalletJTDashboardChart = ({ ChartData }) => {
  ChartJS.register([ArcElement, Tooltip, Legend]);
  const { total_amount = 0 } = ChartData;
  const [redraw, setRedraw] = useState(false);
  const options = {
    rotation: -90,
    circumference: 180,
    cutout: "70%",

    plugins: {
      legend: {
        display: false,
        position: "right",
      },
      tooltip: {
        enabled: true,
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
        ctx.font = "bold 1em proxima-nova";
        ctx.textBaseline = "top";
        var text = userBalanceDetailFormat(total_amount),
          textX = Math.round((width - ctx.measureText(text).width) / 2),
          textY = height / 1.55;
        ctx.fillText(text, textX, textY);
        ctx.textBaseline = "bottom";
        ctx.font = "0.6em proxima-nova";
        var text1 = "Total JT Points",
          textX = Math.round((width - ctx.measureText(text1).width) / 2),
          textY = height / 1.65;
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
      <Doughnut
        data={data}
        options={options}
        plugins={plugins}
        width={"100%"}
        height={"100%"}
        redraw={redraw}
      />
    </>
  );
};

export default WalletJTDashboardChart;
