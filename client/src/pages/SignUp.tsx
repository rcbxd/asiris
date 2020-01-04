import * as React from "react";
import { Component } from "react";

export interface SignUpProps {}

export interface SignUpState {}

class SignUp extends React.Component<SignUpProps, SignUpState> {
  constructor(props: SignUpProps) {
    super(props);
    this.state = {};
  }
  render() {
    return <h1>Hello</h1>;
  }
}

export default SignUp;
