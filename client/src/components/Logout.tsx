import * as React from "react";
import { Component } from "react";

export interface LogoutProps {}

export interface LogoutState {}

class Logout extends React.Component<LogoutProps, LogoutState> {
  constructor(props: LogoutProps) {
    super(props);
  }
  render() {
    return <h1>Hello world</h1>;
  }
}

export default Logout;
