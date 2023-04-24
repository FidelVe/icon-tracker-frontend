import React, { useState, Component } from "react";
import { withRouter } from "react-router-dom";
import TxBottomTitle from "./TxBottomTitle";
import { TxTableHead, TxTableBody, LoadingComponent, NoBox } from "../../../components";
import { getBondList } from "../../../redux/store/iiss";
import BondersModal from "../../BondersUpdateModal/bondersUpdateModal";
import customStyles from "./TxBottomComponent.module.css";

class TxBottomComponent extends Component {
  render() {
    const { 
      txData,
      txType,
      goAllTx,
      address,
      tableClassName,
      noBoxText,
      tokenTotal,
      onClickTab
    } = this.props;
    const { data, listSize, totalSize, loading } = txData;

    let totalCount = txData.headers ? txData.headers["x-total-count"] : 0;

    let tableBodyData;

    if (txTypeIsBonder(txType)) {
      tableBodyData = txData.filter((f) => {
        return this.props.bondMap[f] !== null
      });
      totalCount = tableBodyData.length;
    } else if (txType === "addressdelegations") {
      tableBodyData = txData.delegations;
    } else tableBodyData = txData.data;

    const Content = () => {
      console.log(txType, "tx comp props bonder");
      if (loading) {
        return <LoadingComponent height="349px" />;
      } else if (txTypeIsBonder(txType)) {
        return (
          <div className="contents">
            <CustomHeader
              txData={txData}
              txType={txType}
              totalCount={totalCount}
              goAllTx={goAllTx}
              bondMap={this.props.bondMap}
              address={this.props.address}
            />
            <div className="table-box">
              <table className={tableClassName}>
                <thead>
                  <TxTableHead txType={txType} />
                </thead>
                <tbody>
                  {tableBodyData.map((item, index) => (
                    <TxTableBody
                      key={`${index}-${address}`}
                      bondMap={this.props.bondMap}
                      totalSupply={tokenTotal}
                      rank={index + 1}
                      data={item}
                      txType={txType}
                      address={address}
                      tokenTotal={tokenTotal}
                      onClickTab={onClickTab}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      } else if ((!tableBodyData || tableBodyData.length === 0) && txType !== "addressBonded") {
        return <NoBox text={noBoxText} />;
      } else {
        const { from_address, to_address } = tableBodyData[0] || this.props.txData;

        return (
          <div className="contents">
            <TxBottomTitle
              txType={txType}
              total={this.props.total}
              listSize={Number(tableBodyData.length)}
              totalSize={
                txType === "addressvoters" ||
                txType === "addressreward" ||
                txType === "addresstokentx" ||
                txType === "addressinternaltx"
                  ? totalCount
                  : totalSize
              }
              goAllTx={goAllTx}
              fromAddr={from_address || tableBodyData[0].token_contract_address}
              toAddr={to_address}
            />

            <div className="table-box">
              <table className={tableClassName}>
                <thead>
                  <TxTableHead txType={txType} />
                </thead>
                <tbody>
                  {(tableBodyData || []).map((item, index) => {
                    return (
                      <TxTableBody
                        key={index}
                        totalSupply={tokenTotal}
                        rank={index + 1}
                        data={item}
                        txType={txType}
                        address={address}
                        tokenTotal={tokenTotal}
                      />
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        );
      }
    };
    return Content();
  }
}

export default withRouter(TxBottomComponent);

function txTypeIsBonder(txType) {
  const ar = [
    "addressbonded",
    "addressbonders",
    "addressBonded",
    "addressBonders"
  ];

  return ar.includes(txType);
}

function CustomHeader({ txData, txType, totalCount, goAllTx, bondMap, address }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  function toggleModal() {
    console.log('click on modal');
    setIsModalOpen(!isModalOpen);
  }
  return (
    <>
      <BondersModal
        bondMap={bondMap}
        address={address}
        isOpen={isModalOpen}
        onClose={toggleModal}
      />
      <div className={customStyles.headerContainer}>
        <TxBottomTitle
          txType={txType}
          listSize={Number(txData.length)}
          totalSize={txType === "addressBonders" ? totalCount : Number(txData.length)}
          goAllTx={goAllTx}
          fromAddr={"hello"}
        />
        <button onClick={toggleModal}>Update</button>
      </div>
    </>
  )
}
