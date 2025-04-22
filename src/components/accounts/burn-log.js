import React, { useEffect, useState } from "react";
import { IoIosInformationCircleOutline } from "react-icons/io";
import dayjs from "dayjs";

import { getBurnLogs } from "../../api/methods-marketplace";

import ToolTip from "../tooltip";

import PolygonImage from "../../images/polygon.png";

import "./style.scss";

const BurnLogs = () => {
  const [loading, setLoading] = useState(false);
  const [burnLogsLIst, setBurnLogsList] = useState([]);
  const [page, setPage] = useState(1);
  const [nextPage, setNextPage] = useState(false);
  const [moreLoading, setMoreLoading] = useState(false);

  useEffect(() => {
    getLogsBurnsList(page);
  }, []);

  const getLogsBurnsList = async ({ page, load = false }) => {
    try {
      if (load) {
        setMoreLoading(true);
      } else {
        setLoading(true);
      }

      const result = await getBurnLogs(page ? page : 1);
      if (load) {
        setBurnLogsList([...burnLogsLIst, ...result?.data?.data?.histories]);
      } else {
        setBurnLogsList(result?.data?.data?.histories);
      }
      setNextPage(result?.data?.data?.next_page);
      if (load) {
        setMoreLoading(false);
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.log("🚀 ~ getLogsFuserList ~ error:", error);
      setLoading(false);
      setMoreLoading(false);
    }
  };

  const loadMore = () => {
    getLogsBurnsList({ page: page + 1, load: true });
    setPage(page + 1);
  };

  return (
    <>
      <div className="main-content-block">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-12">
              <div className="wallet-user mt-3">
                <div className="row align-items-center">
                  <div className="col-lg-12">
                    <h3 className="about-title">Burn History</h3>
                  </div>
                </div>
                <div className="row">
                  <div className="col-sm-12">
                    <div className="table-responsive">
                      <table
                        className="display theme-table fusor-history-table"
                        style={{ width: "100%" }}
                      >
                        <thead>
                          <tr className="text-center">
                            <th className="count">#</th>
                            <th className="name">Nft</th>
                            <th className="name d-flex gap-2">
                              Status{" "}
                              <span>
                                {" "}
                                <ToolTip
                                  className="cursor-pointer"
                                  icon={
                                    <IoIosInformationCircleOutline
                                      color="white"
                                      size={20}
                                      className="cursor-pointer"
                                    />
                                  }
                                  content="The status changes once the wrapped asset has been sent to your wallet."
                                  placement="top"
                                />
                              </span>
                            </th>
                            <th className="action">Asset Quantity</th>
                            <th className="action">Asset Type</th>
                            <th className="action">Date</th>
                            <th className="action">Transaction</th>
                          </tr>
                        </thead>
                        <tbody>
                          {burnLogsLIst?.length > 0 ? (
                            <>
                              {burnLogsLIst?.map((burn, index) => {
                                return (
                                  <>
                                    <tr>
                                      <td className="count">{index + 1}</td>
                                      <td className="name nft-name-info">
                                        <div className="fusor-history-info">
                                          {burn?.nft_image ? (
                                            <div className="fusor-img">
                                              <img
                                                src={burn?.nft_image}
                                                alt="nft"
                                              />
                                            </div>
                                          ) : (
                                            <span className="text-center">
                                              -
                                            </span>
                                          )}
                                        </div>
                                        <div className="fusor-content">
                                          <h5>{burn?.nft_name}</h5>
                                        </div>
                                      </td>
                                      <td>
                                        <span
                                          className={` status-pill ${
                                            burn?.burn_status === "pending" &&
                                            "pending"
                                          } ${
                                            burn?.burn_status === "success" &&
                                            "success"
                                          }  ${
                                            burn?.burn_status === "failed" &&
                                            "failed"
                                          }`}
                                        >
                                          {burn?.burn_status}
                                        </span>
                                      </td>
                                      <td className="text-center">
                                        {(burn?.credit_amount &&
                                          `${burn?.credit_amount}`) ||
                                          "-"}
                                      </td>
                                      <td className="text-center asset-type">
                                        {burn?.asset_name
                                          ? `${burn?.asset_name}`
                                          : "-"}
                                      </td>
                                      <td className="">
                                        {dayjs(burn?.burn_requested).format(
                                          "DD MMM YYYY hh:mma"
                                        )}
                                      </td>

                                      {burn?.tx_url ? (
                                        <td
                                          className="transaction-data url-wrap text-center"
                                          onClick={() => {
                                            if (burn && burn.tx_url) {
                                              window.open(
                                                burn.tx_url,
                                                "_blank"
                                              );
                                            }
                                          }}
                                        >
                                          <img
                                            src={PolygonImage}
                                            alt="polygon"
                                            height={20}
                                          />
                                        </td>
                                      ) : (
                                        <td className="text-center">-</td>
                                      )}
                                    </tr>
                                  </>
                                );
                              })}
                            </>
                          ) : (
                            <>
                              <tr>
                                <td colSpan={7}>
                                  <span className="no-record-found">
                                    {loading
                                      ? "Loading..."
                                      : "No Records Found"}
                                  </span>
                                </td>
                              </tr>
                            </>
                          )}
                        </tbody>
                      </table>
                      {nextPage && !moreLoading && (
                        <div className="d-flex justify-content-center w-100">
                          <button
                            className="btn btn-outline-dark text-center rounded-pill mt-5 mb-3 loadmore-btn"
                            type="button"
                            disabled={moreLoading}
                            onClick={loadMore}
                          >
                            {loading ? "Loading..." : "Load More"}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BurnLogs;
