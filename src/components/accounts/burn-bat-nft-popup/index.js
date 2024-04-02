import React, { useState } from "react";
import { Offcanvas } from "react-bootstrap";
import fusorImage from "../../../images/nft-card.png";
import "./style.scss";
import Stats from "../../my-nfts/stats";
import { batBurnApi } from "../../../api/methods-marketplace";
import { toast } from "react-toastify";
import { currencyFormat } from "../../../utils/common";

const BurnNFTDetail = ({
  showEdit,
  burnBatDetails,
  setShowEdit,
  Reload = () => {},
  details,
}) => {
  const [loading, setLoading] = useState(false);
  const [accepted, setAccepted] = useState(false);

  const handleBurnInitiate = async (slug) => {
    try {
      setLoading(true);
      const result = await batBurnApi(slug);
      if (result.status === 200) {
        if (result?.data?.success) {
          toast.success(result?.data?.data?.response?.message);
          setShowEdit(false);
          Reload();
        }
      }
    } catch (err) {
      setLoading(false);
      setShowEdit(false);

      toast.error(err.response?.data?.message);
    }
  };

  const handleCheckboxChange = () => {
    setAccepted(!accepted);
  };

  return (
    <Offcanvas
      show={showEdit}
      onHide={() => {
        setShowEdit(!showEdit);
      }}
      placement="end"
      className="popup-wrapper-canvas-burnBatNftHistory"
      backdrop={"true"}
    >
      <Offcanvas.Body className="p-0 pop-body-container-burnBatNftHistory">
        <>
          <div className="pop-nft-details-burnBatNftHistory">
            <div className="pop-head-content-burnBatNftHistory">
              <div className="pop-bid-title-burnBatNftHistory">
                Crypto Bat Burn Confirmation
              </div>
              <div
                className="close-button-pop-burnBatNftHistory"
                onClick={() => {
                  setShowEdit(!showEdit);
                }}
              >
                <img
                  alt="close"
                  src="data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='%23000'%3e%3cpath d='M.293.293a1 1 0 011.414 0L8 6.586 14.293.293a1 1 0 111.414 1.414L9.414 8l6.293 6.293a1 1 0 01-1.414 1.414L8 9.414l-6.293 6.293a1 1 0 01-1.414-1.414L6.586 8 .293 1.707a1 1 0 010-1.414z'/%3e%3c/svg%3e"
                ></img>
              </div>
            </div>

            <div className="pop-body-content-burnBatNftHistory burnBat-popup-wrapper p-3">
              <div className="confirmation_popup">
                <div className="burn-nft-card">
                  <div className="img-block">
                    <img
                      src={burnBatDetails?.asset_url}
                      className="img-fluid"
                      alt="image"
                    />
                  </div>
                  <div className="content-block">
                    <h6 className="nft-name">{burnBatDetails?.name}</h6>
                    <Stats statistics={burnBatDetails?.core_statistics} />
                  </div>
                </div>

                <h5 className="burn-hint">
                  <p>
                    Please carefully consider the following points before
                    proceeding further:
                  </p>
                  <ul>
                    {details && (
                      <li>
                        <b>Current Asset Value : {details?.asset_quantity}</b>
                        {"    "}
                        <b>
                          {details?.asset_value === "-"
                            ? "-"
                            : "~" +
                              " " +
                              currencyFormat(details?.asset_value, "USD")}
                        </b>
                      </li>
                    )}
                    <li>
                      <b>Irreversible Action:</b> Burning your NFT is a
                      permanent action that will remove it from circulation.
                      Once burned, the NFT cannot be recovered, transferred, or
                      traded again.
                    </li>
                    <li>
                      <b>Loss of Ownership:</b> By burning your NFT, you will
                      relinquish all ownership rights associated with it,
                      including any potential future benefits or rewards.
                    </li>
                    <li>
                      <b>No Refunds:</b> There is no way to reverse the burning
                      process, and we cannot offer refunds or replacements for
                      burned NFTs. Please make sure you are certain about your
                      decision before proceeding.
                    </li>
                    <li>
                      <b>Cancel Burn:</b> You can cancel your registration for
                      the burn event only till the registration window is open.
                    </li>
                    <li>
                      <b>Can't list for Sale:</b> Once you register your NFT for
                      burn event, you cannot list it for sale. If listed already
                      for sale, you cannot register that NFT for burn. You can
                      still list your NFT for rent even for registering it for
                      burn.
                    </li>
                    <li>
                      <b>USD Credit:</b> The USD credit for the NFT burned will
                      be based on the exchange rate during burn event. The date
                      and time of the burn event will be announced separately.
                    </li>
                  </ul>
                  <p>
                    <input
                      type="checkbox"
                      checked={accepted}
                      onChange={handleCheckboxChange}
                    />{" "}
                    By clicking on <b>"Submit"</b>, you acknowledge that you
                    have read and understood the information provided above. If
                    you have any doubts or questions, we strongly recommend
                    reaching out to our support team before making your final
                    decision.
                  </p>
                </h5>
              </div>
            </div>
          </div>
          <div className="sticky-bottom-box">
            <div className="w-100">
              <button
                disabled={loading || !accepted}
                onClick={() => {
                  handleBurnInitiate(burnBatDetails?.slug);
                  setLoading(true);
                }}
                className="btn btn-dark w-100"
                type="button"
              >
                Submit
              </button>
            </div>
          </div>
        </>
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default BurnNFTDetail;
