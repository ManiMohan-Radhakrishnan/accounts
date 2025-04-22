import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { Tabs as MiniGameTabs } from "../mini-game/tabs";
import { getMiniGameDetails } from "../../api/methods";

const MiniGameSection = ({ hideMenus }) => {
  const [gameName, setGameName] = useState();
  const [tabInfo, setTabInfo] = useState([]);
  const miniGameInfo = useSelector((state) => state?.user?.miniGameDetails);

  const getMiniGameInfo = async () => {
    try {
      const response = await getMiniGameDetails();
      setTabInfo(response?.data?.data?.celebrities);
      setGameName(response?.data?.data?.celebrities[0]?.game_name);
    } catch (error) {
      console.log("🚀 ~ getMiniGameInfo ~ error:", error);
    }
  };

  useEffect(() => {
    if (miniGameInfo?.length > 0) {
      setTabInfo(miniGameInfo);
      setGameName(miniGameInfo[0]?.game_name);
    } else {
      getMiniGameInfo();
    }
  }, []);

  return (
    <>
      <div className="main-content-block profilepage">
        <div className="container-fluid">
          {tabInfo?.length > 0 ? (
            <div className="about-user">
              <div className="row">
                <div className="col-md-12">
                  <div className="mb-3 mt-4">
                    <div className="internal-heading-sec internal-heading-sec-sm mnft-page">
                      <h3 className="about-title mobile-show">My NFTs</h3>
                      <div className="game-switch">
                        {tabInfo?.map((list, i) => (
                          <span
                            className={`switch ${
                              gameName === list?.name ? "active" : ""
                            }`}
                            onClick={() => {
                              setGameName(list?.name);
                            }}
                            key={i}
                          >
                            {list?.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  {gameName && (
                    <MiniGameNfts hideMenus={hideMenus} gameMode={gameName} />
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div>
              <p className="no-game-section">No Records Found</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default MiniGameSection;

const MiniGameNfts = ({ hideMenus, gameMode }) => (
  <MiniGameTabs hideMenus={hideMenus} gameName={gameMode} />
);
