import * as React from "react";
import { Component } from "react";
import { setInStorage } from "../util/storage";
import { sign } from "crypto";
import { Redirect, Link } from "react-router-dom";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonText,
  IonInput,
  IonButton
} from "@ionic/react";

export interface SignUpProps {}

export interface SignUpState {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  loggedIn: boolean;
  signUpError: string;
  passwordConfirm: string;
}

class SignUp extends React.Component<SignUpProps, SignUpState> {
  constructor(props: SignUpProps) {
    super(props);
    this.state = {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      loggedIn: false,
      signUpError: "",
      passwordConfirm: ""
    };
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handlePasswordConfirmChange = this.handlePasswordConfirmChange.bind(
      this
    );
    this.handleFirstNameChange = this.handleFirstNameChange.bind(this);
    this.handleLastNameChange = this.handleLastNameChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleEmailChange(event: any) {
    this.setState({ email: event.target.value });
  }

  handlePasswordChange(event: any) {
    this.setState({ password: event.target.value });
  }

  handlePasswordConfirmChange(event: any) {
    this.setState({ passwordConfirm: event.target.value });
  }

  handleFirstNameChange(event: any) {
    this.setState({ firstName: event.target.value });
  }

  handleLastNameChange(event: any) {
    this.setState({ lastName: event.target.value });
  }

  async handleSubmit(event: any) {
    event.preventDefault();
    let signup = await fetch("http://localhost:5000/api/account/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        email: this.state.email,
        password: this.state.password
      })
    });

    let json = await signup.json();

    if (json.success) {
      this.setState({ loggedIn: true });
    } else {
      this.setState({ signUpError: json.message });
    }
  }

  render() {
    if (this.state.loggedIn) return <Redirect to="/home/chats" />;
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Sign Up</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <form onSubmit={this.handleSubmit}>
            <IonList lines="full" class="ion-no-margin ion-no-padding">
              <IonItem>
                <IonLabel position="stacked">First Name</IonLabel>
                <IonInput
                  required
                  value={this.state.firstName}
                  onInput={this.handleFirstNameChange}
                ></IonInput>
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Last Name</IonLabel>
                <IonInput
                  required
                  value={this.state.lastName}
                  onInput={this.handleLastNameChange}
                ></IonInput>
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">
                  Email <IonText color="danger">*</IonText>
                </IonLabel>
                <IonInput
                  required
                  type="email"
                  value={this.state.email}
                  onInput={this.handleEmailChange}
                ></IonInput>
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">
                  Password <IonText color="danger">*</IonText>
                </IonLabel>
                <IonInput
                  required
                  type="password"
                  value={this.state.password}
                  onInput={this.handlePasswordChange}
                ></IonInput>
              </IonItem>
              <div className="ion-padding">
                <IonButton expand="block" type="submit" class="ion-no-margin">
                  SignUp
                </IonButton>
                <h3>Have an account?</h3>
                <Link to="/account/login">
                  <IonButton expand="block" class="ion-no-margin">
                    Login
                  </IonButton>
                </Link>
              </div>
            </IonList>
          </form>
        </IonContent>
      </IonPage>
    );
  }
}

export default SignUp;
