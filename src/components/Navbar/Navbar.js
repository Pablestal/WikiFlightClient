import React, { Component } from "react";
import { Menu } from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";

export default class Navbar extends Component {
  state = { activeItem: "home" };

  handleItemClick = (e, { name }) => this.setState({ activeItem: name });

  render() {
    const { activeItem } = this.state;

    return (
      <div>
        <Menu pointing secondary>
          <Menu.Item name="home" onClick={this.handleItemClick} />
          <Menu.Item
            name="Aircraft list"
            active={activeItem === "Aircraft list"}
            onClick={this.handleItemClick}
          />
          <Menu.Menu position="right">
            <Menu.Item
              name="logout"
              active={activeItem === "logout"}
              onClick={this.handleItemClick}
            />
          </Menu.Menu>
        </Menu>
      </div>
    );
  }
}
