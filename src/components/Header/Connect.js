import React, { useState, useEffect } from "react";
import { requestAddress } from "../../utils/connect";
import { CopyButton } from "../../components";
import checkIconex from "check-iconex";
import NotificationManager from "../../utils/NotificationManager";
import { LoginModal, utils } from "../LoginComponent/LoginModal";

const LOCAL_KEY = "_UNIQUE_KEY_";

function Connect(props) {
  const [disabled, setDisabled] = useState(false);
  const [walletAddress, setWalletAddress] = useState(props.walletAddress);
    //
    const [loginModalIsOpen, setLoginModalIsOpen] = useState(false);
    const [localData, setLocalData] = useState(utils.getInitLocalData());

  function toggleLogin() {
    // toggles between login and logout
    if (localData.auth.successfulLogin) {
      handleLogout();
    } else {
      handleLogin();
    }
  }

  function handleLogin() {
    // login with ICON
    setLoginModalIsOpen(true);
  }

  function handleLogout() {
    // close user session
    handleLocalDataChange(utils.getInitLocalData());
  }

  function handleLocalDataChange(newLocalData) {
    //
    setLocalData(newLocalData);

    // write login data locally to make user session persistance
    utils.saveDataToLocal(newLocalData, LOCAL_KEY);
  }

  function closeLoginModal() {
    // this function handles the closing of the LoginModal
    // dataFromModal is the login data passed from the component
    // to the parent after the login process
    setLoginModalIsOpen(false);
  }

  function getDataFromLoginModal(loginData) {
    // Callback function that gets called from within LoginModal
    // to pass login data into parent
    const newLocalData = {
      auth: loginData
    };

    handleLocalDataChange(newLocalData);
  }

  //

  useEffect(() => {
    const fetchIconexStatus = async () => {
      const { isChrome, iconexInstalled, hasIconWallet } = await checkIconex(
        1000,
        2000
      );
      setDisabled(!(isChrome && iconexInstalled && hasIconWallet));
    };
    fetchIconexStatus();

    // get local login data on first render
    const userLocalData = utils.getLocalData(LOCAL_KEY);

    // set loginData state
    handleLocalDataChange(userLocalData);
  }, []);

  useEffect(() => {
    if (props.walletAddress !== walletAddress) {
      setWalletAddress(props.walletAddress);
      window.dispatchEvent(
        new CustomEvent("CUSTOM_FX", {
          detail: { type: "SET_WALLET" }
        })
      );
    }
  }, [props.walletAddress]);

  const getWalletAddress = async () => {
    if (disabled) {
      window.open(
        "https://chrome.google.com/webstore/detail/iconex/flpiciilemghbmfalicajoolhkkenfel",
        "_blank"
      );
      return;
    }

    if (walletAddress) {
      return;
    }

    const address = await requestAddress();
    setWalletAddress(address);
    window.dispatchEvent(
      new CustomEvent("CUSTOM_FX", {
        detail: { type: "SET_WALLET" }
      })
    );
    props.setAddress(address);
    props.history.push(`/address/${address}`);
  };

  const disconnect = () => {
    setWalletAddress(undefined);
    props.clearWallet();
    NotificationManager.deregisterServiceWorker();
  };

  return (
    <div className={`connect ${walletAddress ? "join" : ""}`}>
        <LoginModal
          isOpen={loginModalIsOpen}
          onRequestClose={closeLoginModal}
          onRetrieveData={getDataFromLoginModal}
        />
      <span onClick={getWalletAddress}>
        <em className="img" />
      </span>
      {walletAddress ? (
        <div className="sub-menu">
          <p>
            <span>Wallet Address</span>
            <CopyButton
              data={walletAddress}
              title={"Copy Address"}
              wallet={true}
            />
          </p>
          <span className="btn" onClick={disconnect}>
            Disconnect
          </span>
          <span
            className="btn"
            onClick={() => {
              props.history.push(`/address/${walletAddress}`);
            }}
          >
            View Details
          </span>
        </div>
      ) : null}
    </div>
  );
}

// function App() {

//   return (
//     <div className={styles["App"]}>
//       <header className={styles["App-header"]}>
//         <h2>Login with ICON</h2>
//         <button className={styles["App-button-login"]} onClick={toggleLogin}>
//           {localData.auth.successfulLogin ? <p>Log out</p> : <p>Log in</p>}
//         </button>
//         <LoginModal
//           isOpen={loginModalIsOpen}
//           onRequestClose={closeLoginModal}
//           onRetrieveData={getDataFromLoginModal}
//         />
//         <p>Login data: {JSON.stringify(localData)}</p>
//       </header>
//     </div>
//   );
// }

export default Connect;
