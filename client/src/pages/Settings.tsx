import * as React from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonMenuButton,
  IonTitle,
  IonContent
} from "@ionic/react";
import { Link, Redirect } from "react-router-dom";
import { getFromStorage } from "../util/storage";
import checkAuth from "../util/checkAuth";
import Login from "./Login";

export interface SettingsProps {}

export interface SettingsState {
  userID: number;
  userFirstName: string;
  userLastName: string;
  userEmail: string;
  isLoading: boolean;
  loggedIn: boolean;
}

class Settings extends React.Component<any, SettingsState> {
  constructor(props: any) {
    super(props);
    this.state = {
      userID: 0,
      userFirstName: "",
      userLastName: "",
      userEmail: "",
      loggedIn: true,
      isLoading: true
    };
  }
  async componentDidMount() {
    let token = await getFromStorage("auth");
    let authInfo = await checkAuth(token);
    if (!authInfo.loggedIn) {
      this.setState({ loggedIn: false, isLoading: false });
    } else {
      this.setState({
        userID: authInfo.uid,
        userFirstName: authInfo.firstName,
        userLastName: authInfo.lastName,
        loggedIn: true,
        isLoading: false
      });
    }
  }
  render() {
    if (this.state.isLoading) return "";
    if (!this.state.loggedIn) return <Redirect to="/account/login" />;
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonMenuButton />
            </IonButtons>
            <IonTitle>Settings</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <Link to="/account/logout">Logout</Link>
        </IonContent>
      </IonPage>
    );
  }
}

export default Settings;
