import * as React from "react";
import { setInStorage } from "../util/storage";
import { Redirect } from "react-router-dom";
import {
  IonItem,
  IonLabel,
  IonList,
  IonButton,
  IonInput,
  IonText,
  IonPage,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonMenuButton,
  IonTitle,
  IonContent
} from "@ionic/react";

export interface LoginProps {}

export interface LoginState {
  password: string;
  email: string;
  loggedIn: boolean;
}

class Login extends React.Component<LoginProps, LoginState> {
  constructor(props: LoginProps) {
    super(props);
    this.state = {
      email: "",
      password: "",
      loggedIn: false
    };
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
  }
  handleEmailChange(event: any) {
    this.setState({
      email: event.target.value
    });
  }
  handlePasswordChange(event: any) {
    this.setState({
      password: event.target.value
    });
  }
  handleSubmit = (e: any) => {
    e.preventDefault();
    fetch("http://localhost:5000/api/account/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: this.state.email,
        password: this.state.password
      })
    })
      .then(res => res.json())
      .then(async json => {
        console.log(json);
        await setInStorage("auth", json.token);
        this.setState({ loggedIn: true });
      });
  };
  render() {
    if (this.state.loggedIn) return <Redirect to="/home/chats" />;
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Login</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <form onSubmit={this.handleSubmit}>
            <IonList lines="full" class="ion-no-margin ion-no-padding">
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
                  Login
                </IonButton>
              </div>
            </IonList>
          </form>
        </IonContent>
      </IonPage>
    );
  }
}

export default Login;
