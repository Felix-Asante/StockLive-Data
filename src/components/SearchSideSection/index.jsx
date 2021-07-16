import React from "react";
import { Menu, Dropdown, Button, InputNumber, Radio } from "antd";
import { useSetRecoilState } from "recoil";
import { useMutation } from "react-query";
import { FiSettings } from "react-icons/fi";
import { FaSearch } from "react-icons/fa";

import { useGetAllSymbols, useGetAllUserAddedSymbols } from "../../hooks";
import { addFundToWallet } from "../../services/funds";
import { userProfileData } from "../../recoils/profile";
import { SearchedOrAllSymbolLists, UserAddedSymbolLists } from "./SymbolList";

import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";

export default function SearchComponent() {
  const token = localStorage.getItem("nseAuthToken");
  const [searchQuery, setSearchQuery] = React.useState(undefined);
  const [isSymbolListOpen, setIsSymbolListOpen] = React.useState(false);
  const [isDropdownVisible, setDropdownVisible] = React.useState(false);
  const [fundValue, setFundValue] = React.useState(0);
  const setUpdatedProfile = useSetRecoilState(userProfileData);
  const { data: getAllSymbols } = useGetAllSymbols();
  const { data: userAddedSymbols } = useGetAllUserAddedSymbols();
  const {
    mutate: addFundsMutation,
    data: fundData,
    isSuccess: fundAddedSucessfully,
  } = useMutation((data) => addFundToWallet(data));

  React.useEffect(() => {
    if (fundAddedSucessfully && fundData) {
      setUpdatedProfile(fundData?.user);
    }
  }, [fundAddedSucessfully, fundData, setUpdatedProfile]);

  function handleAddFunds() {
    if (fundValue > 0 && fundValue !== "") {
      const query = {
        params: { Credit: fundValue },
        token: token,
      };
      addFundsMutation(query);
    }
    setDropdownVisible(false);
    setFundValue(0);
  }

  const handleDropdownVisibility = (show) => {
    setDropdownVisible(show);
  };

  const menuItems = (
    <Menu style={{ width: 200, paddingLeft: "20px" }}>
      <Menu.Item key={"icon"}>
        <span className="dim">Change</span>{" "}
        <span
          className="help"
          data-balloon="Price change can be either calculated based on previous close price or day open price."
          data-balloon-pos="up"
          data-balloon-length="large"
        >
          <span className="icon icon-info"></span>
        </span>
      </Menu.Item>
      <Menu.Item key={"Openprice"}>
        <Radio>
          <label htmlFor="radio-240" className="su-radio-label">
            Open price
          </label>
        </Radio>
      </Menu.Item>
      <Menu.Item key={"ClosePrice"}>
        <Radio>
          <label htmlFor="radio-240" className="su-radio-label">
            Close price
          </label>
        </Radio>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key={"ChangeFormat"}>
        <span className="dim">Change Format</span>
      </Menu.Item>
      <Menu.Item key={"percentage"}>
        <label htmlFor="radio-243" className="su-radio-label">
          Percentage
        </label>
      </Menu.Item>
      <Menu.Item key={"absolute"}>
        <label htmlFor="radio-243" className="su-radio-label">
          absolute
        </label>
      </Menu.Item>
      <Menu.Item key={"AddFundsValue"}>
        <InputNumber
          min={1}
          value={fundValue}
          onChange={(enteredValue) => setFundValue(enteredValue)}
        />
      </Menu.Item>
      <Menu.Item key={"AddFunds"}>
        <Button type="primary" size="default" onClick={handleAddFunds}>
          Add Funds
        </Button>
      </Menu.Item>
    </Menu>
  );

  const handleSearchInput = (e) => {
    setSearchQuery(e.target.value);
    setIsSymbolListOpen(true);
  };

  const filteredSymbolListData = React.useMemo(() => {
    if (searchQuery && getAllSymbols) {
      const query = searchQuery.toUpperCase();
      if (searchQuery === " ") {
        return getAllSymbols?.data;
      } else if (searchQuery !== " " || searchQuery !== undefined) {
        return getAllSymbols?.data.filter((i) => i.Description.includes(query));
      } else {
        return getAllSymbols?.data;
      }
    }
  }, [searchQuery, getAllSymbols]);

  return (
    <div className="marketwatch-sidebar marketwatch-wrap">
      <div className="omnisearch-wrap">
        <span className="icon-search">
          <FaSearch />
        </span>
        <div className="omnisearch">
          <div className="search">
            <input
              type="text"
              id="search-input"
              placeholder="Search eg: infy bse, nifty fut weekly, gold mcx"
              autoComplete="off"
              className="search-input-field"
              onChange={(e) => handleSearchInput(e)}
            />
            <span className="counts">
              {userAddedSymbols?.data?.length} / {getAllSymbols?.data?.length}
            </span>
          </div>
        </div>
      </div>
      {filteredSymbolListData !== undefined && isSymbolListOpen && (
        <div className="instruments">
          <div className="vddl-list list-flat">
            <SearchedOrAllSymbolLists
              filteredSymbolListData={filteredSymbolListData}
            />
          </div>
        </div>
      )}
      {(!isSymbolListOpen || searchQuery === "") && (
        <div className="instruments">
          <div className="vddl-list list-flat">
            <UserAddedSymbolLists userAddedSymbols={userAddedSymbols?.data} />
          </div>
        </div>
      )}
      <ul className="marketwatch-selector list-flat">
        <li
          className="block"
          style={{ paddingBottom: "3px", paddingRight: "20px", float: "right" }}
        >
          <Dropdown
            overlay={menuItems}
            trigger={["click"]}
            placement="topCenter"
            onVisibleChange={handleDropdownVisibility}
            visible={isDropdownVisible}
          >
            <FiSettings color="grey" />
          </Dropdown>
        </li>
      </ul>
    </div>
  );
}
