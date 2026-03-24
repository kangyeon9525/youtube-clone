import React, { useState } from "react";
import LeftMenu from "./Sections/LeftMenu";
import RightMenu from "./Sections/RightMenu";
import { Drawer, Button, Icon } from "antd";
import "./Sections/Navbar.css";
import logoImage from "../../../assets/Youtube_logo.png";

function NavBar() {
  const [visible, setVisible] = useState(false);

  const showDrawer = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };

  return (
    <nav
      className="menu"
      style={{ position: "fixed", zIndex: 5, width: "100%" }}
    >
      <div className="menu__logo">
        <a href="/">
          <img src={logoImage} alt="Logo" className="logo-img" />
        </a>
      </div>
      <div className="menu__container">
        <div className="menu_left">
          <LeftMenu mode="horizontal" />
        </div>
        <div className="menu_rigth">
          <RightMenu mode="horizontal" />
        </div>

        {/* 이 버튼이 CSS의 justify-content: flex-end에 의해 오른쪽으로 밀립니다 */}
        <Button className="menu__mobile-button" onClick={showDrawer}>
          <Icon type="menu" />{" "}
          {/* align-right 대신 menu를 쓰면 더 유튜브 느낌이 납니다 */}
        </Button>

        <Drawer
          title="Menu"
          placement="right"
          className="menu_drawer"
          closable={true} // X 버튼을 보이게 하면 사용자가 닫기 편합니다
          onClose={onClose}
          visible={visible}
        >
          <LeftMenu mode="inline" />
          <RightMenu mode="inline" />
        </Drawer>
      </div>
    </nav>
  );
}

export default NavBar;
