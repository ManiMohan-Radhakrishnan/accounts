import { useEffect, useRef, useState } from "react";
import { FaCheckCircle } from "react-icons/fa";

import { userOwnedNFTsApi } from "../../api/methods-marketplace";
import { whitelistedCryptoList, withdrawBalanceApi } from "../../api/methods";
import { GAMES } from "../../utils/game-config";

import NFTCardList from "./nft-card-list";
import NoRecord from "./no-record";

import "./styles.scss";

const BurnBatNft = ({ setActiveTab, hideMenus, setCount }) => {
  const [list, setList] = useState([]);
  const [selected, setSelected] = useState([]);

  const [selectedAll, setSelectedAll] = useState(false);

  const [disableRental, setDisableRental] = useState(false);

  const [loading, setLoading] = useState(false);
  const [moreLoading, setMoreLoading] = useState(false);
  const [rentalPop, setRentalPop] = useState(false);
  const [filterCount, setFilterCount] = useState(0);
  const [nextPage, setNextPage] = useState(false);
  const [page, setPage] = useState(1);
  const [burnRequestPage, setBurnRequestPage] = useState(1);
  const filtersRef = useRef({});
  const [selectAllDisabled, setSelectAllDisabled] = useState(false);
  const [key, setKey] = useState("Initiate");
  const [cryptoList, setCryptoList] = useState([]);
  const [networks, setNetworks] = useState([]);
  const [withdrawBalanceList, setWithdrawBalanceList] = useState();

  useEffect(() => {
    list?.length === 0 && getList({ page });
  }, []);

  const batTypes = [
    "DualCryptoUnique",
    "SingleCryptoUnique",
    "SingleCryptoPremium",
    "SingleCryptoSuperior",
    "SingleCryptoStandard",
  ];
  function handleKeyChange(newKey) {
    // Reset the data and loading state when the key changes
    setKey(newKey);
    if (newKey === "Initiate") getList({ page });
    if (newKey === "cancel") {
      setList([]);
      getListedCancel({ burnRequestPage });
    }
  }

  const getList = async ({
    page,
    filters = null,
    load = false,
    filterArePresent = false,
  }) => {
    if (filters) {
      filtersRef.current = filters;
    }
    try {
      if (load) {
        setMoreLoading(true);
      } else {
        setLoading(true);
      }

      const result = await userOwnedNFTsApi(page, {
        sale_kind: "",
        game_names: [GAMES.MCL],
        ...filtersRef.current,
        bat_types: batTypes,
        nft_state: ["created"],
      });
      if (load) {
        setList([...list, ...result?.data?.data?.nfts]);
      } else {
        setList(result?.data?.data?.nfts);
      }
      if (filterArePresent) setFilterCount(result?.data?.data?.total_count);
      else setCount(result?.data?.data?.total_count);

      setNextPage(result?.data?.data?.next_page);
      if (load) {
        setMoreLoading(false);
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
      setMoreLoading(false);
      setNextPage(false);
    }
  };

  const loadMoreRequest = () => {
    getList({ page: page + 1, load: true, filterArePresent: true });
    setPage(page + 1);
  };

  const getListedCancel = async ({
    burnRequestPage,
    filters = null,
    load = false,
    filterArePresent = false,
  }) => {
    if (filters) {
      filtersRef.current = filters;
    }
    try {
      if (load) {
        setMoreLoading(true);
      } else {
        setLoading(true);
      }

      const result = await userOwnedNFTsApi(burnRequestPage, {
        sale_kind: "",
        game_names: [GAMES.MCL],
        ...filtersRef.current,
        bat_types: batTypes,
        nft_state: ["burn_requested"],
      });
      if (load) {
        setList([...list, ...result?.data?.data?.nfts]);
      } else {
        setList(result?.data?.data?.nfts);
      }
      if (filterArePresent) setFilterCount(result?.data?.data?.total_count);
      else setCount(result?.data?.data?.total_count);

      setNextPage(result?.data?.data?.next_page);
      if (load) {
        setMoreLoading(false);
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
      setMoreLoading(false);
      setNextPage(false);
    }
  };

  const loadMoreRequestCancel = () => {
    getListedCancel({
      burnRequestPage: burnRequestPage + 1,
      load: true,
      filterArePresent: true,
    });
    setBurnRequestPage(burnRequestPage + 1);
  };

  const handleFilter = ({
    page,
    filters,
    disabledStatus = false,
    filterArePresent,
  }) => {
    // setSelectedAll(false);
    // setSelected([]);
    setSelectAllDisabled(disabledStatus);
    getList({ page, filters, filterArePresent });
  };

  const checkCryptoList = async () => {
    try {
      const result = await whitelistedCryptoList();
      setCryptoList(result?.data?.data?.payment_methods);
      if (result?.data?.data?.hasOwnProperty("networks"));
      setNetworks(result?.data?.data?.networks);
    } catch (error) {
      console.log(error);
    }
  };

  const getBalance = async () => {
    try {
      const result = await withdrawBalanceApi();
      setWithdrawBalanceList(result?.data?.data);
    } catch (error) {
      setWithdrawBalanceList({});
      console.log(
        "🚀 ~ file: wallet.js ~ line 130 ~ handleWithdraw ~ error",
        error
      );
    }
  };

  useEffect(() => {
    getBalance();
    checkCryptoList();
  }, []);

  return (
    <>
      <div className="mycard-head">
        <div className="flex-block-pill mt-3">
          <div
            role={"button"}
            className={`rounded-pill ps-3 pe-3 mb-3 me-3 pt-1 pb-1 activity-filter-pill ${
              key === "Initiate" ? "active" : ""
            }`}
            onClick={() => handleKeyChange("Initiate")}
          >
            {key === "Initiate" && (
              <FaCheckCircle color={"white"} size={17} className="me-2" />
            )}
            All
          </div>
          <div
            role={"button"}
            className={`rounded-pill ps-3 pe-3 mb-3 me-3 pt-1 pb-1 activity-filter-pill ${
              key === "cancel" ? "active" : ""
            }`}
            onClick={() => handleKeyChange("cancel")}
          >
            {key === "cancel" && (
              <FaCheckCircle color={"white"} size={17} className="me-2" />
            )}
            Burn Request
          </div>
        </div>
      </div>
      {key === "Initiate" && (
        <div className="available-nft">
          <>
            {!loading ? (
              <>
                {list?.length > 0 ? (
                  <>
                    <div className="mynft-card-list">
                      {list?.map((nft, i) => (
                        <NFTCardList
                          nft={nft}
                          key={i}
                          // setSelected={setSelected}
                          // setSelectedAll={setSelectedAll}
                          // selected={selected}
                          // allTab
                          burnBatRequestCreated
                          hideCheckbox
                          // hideMenus={hideMenus}
                          navigation
                          Reload={() => {
                            filtersRef.current = {};

                            setTimeout(async () => {
                              getList({ page });
                            }, 1000);
                          }}
                          cryptoList={cryptoList}
                          networks={networks}
                          withdrawBalanceList={withdrawBalanceList}
                        />
                      ))}
                    </div>
                  </>
                ) : (
                  <NoRecord />
                )}
              </>
            ) : (
              <div className="norecord-found">
                <h5>Loading...</h5>
              </div>
            )}
            {nextPage && !loading && (
              <div className="d-flex justify-content-center w-100">
                <button
                  className="btn btn-outline-dark text-center rounded-pill mt-5 mb-3 loadmore-btn"
                  type="button"
                  disabled={moreLoading}
                  onClick={loadMoreRequest}
                >
                  {moreLoading ? "Loading..." : "Load More"}
                </button>
              </div>
            )}
          </>
        </div>
      )}{" "}
      {key === "cancel" && (
        <>
          {" "}
          <div className="available-nft">
            <>
              {!loading ? (
                <>
                  {list?.length > 0 ? (
                    <>
                      <div className="mynft-card-list">
                        {list?.map((nft, i) => (
                          <NFTCardList
                            nft={nft}
                            key={i}
                            // setSelected={setSelected}
                            // setSelectedAll={setSelectedAll}
                            // selected={selected}
                            // allTab
                            hideCheckbox
                            // hideMenus={hideMenus}
                            navigation
                            Reload={() => {
                              filtersRef.current = {};
                              setTimeout(async () => {
                                getListedCancel({ page });
                              }, 1000);
                            }}
                            cryptoList={cryptoList}
                            networks={networks}
                            withdrawBalanceList={withdrawBalanceList}
                          />
                        ))}
                      </div>
                    </>
                  ) : (
                    <NoRecord />
                  )}
                </>
              ) : (
                <div className="norecord-found">
                  <h5>Loading...</h5>
                </div>
              )}
              {nextPage && !loading && (
                <div className="d-flex justify-content-center w-100">
                  <button
                    className="btn btn-outline-dark text-center rounded-pill mt-5 mb-3 loadmore-btn"
                    type="button"
                    disabled={moreLoading}
                    onClick={loadMoreRequestCancel}
                  >
                    {moreLoading ? "Loading..." : "Load More"}
                  </button>
                </div>
              )}
            </>
          </div>
        </>
      )}
    </>
  );
};

export default BurnBatNft;
