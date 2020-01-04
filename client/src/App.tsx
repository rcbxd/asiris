import React from "react";
import { Redirect, Route } from "react-router-dom";
import { IonApp, IonRouterOutlet, IonSplitPane } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { AppPage } from "./declarations";

import Menu from "./components/Menu";
import Home from "./pages/Home";
import Chats from "./pages/Chats";
import Account from "./pages/Account";
import { person, contacts, chatboxes, settings } from "ionicons/icons";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/* Theme variables */
import "./theme/variables.css";
import Login from "./pages/Login";
import Chat from "./pages/Chat";
import Settings from "./pages/Settings";
import SignUp from "./pages/SignUp";

import {
  Plugins,
  PushNotification,
  PushNotificationToken,
  PushNotificationActionPerformed
} from "@capacitor/core";

const { PushNotifications } = Plugins;

const appPages: AppPage[] = [
  {
    title: "Contacts",
    url: "/home/contacts",
    icon: contacts
  },
  {
    title: "Chats",
    url: "/home/chats",
    icon: chatboxes
  },
  {
    title: "You",
    url: "/account",
    icon: person
  },
  {
    title: "Settings",
    url: "/settings",
    icon: settings
  }
];

export interface AppProps {}

export interface AppState {}

class App extends React.Component<AppProps, AppState> {
  constructor(props: any) {
    super(props);
    PushNotifications.register();

    PushNotifications.addListener(
      "registration",
      (token: PushNotificationToken) => {
        alert("Push registration success, token: " + token.value);
      }
    );

    PushNotifications.addListener("registrationError", (error: any) => {
      alert("Error on registration: " + JSON.stringify(error));
    });

    PushNotifications.addListener(
      "pushNotificationReceived",
      (notification: PushNotification) => {
        alert("Push received: " + JSON.stringify(notification));
      }
    );

    PushNotifications.addListener(
      "pushNotificationActionPerformed",
      (notification: PushNotificationActionPerformed) => {
        alert("Push action performed: " + JSON.stringify(notification));
      }
    );
  }
  render() {
    return (
      <IonApp>
        <IonReactRouter>
          <IonSplitPane contentId="main">
            <Menu appPages={appPages} />
            <IonRouterOutlet id="main">
              <Route path="/account" component={Account} exact={true} />
              <Route path="/home/contacts" component={Home} exact={true} />
              <Route path="/home/chats" component={Chats} exact={true} />
              <Route path="/home/chats/:id" component={Chat} exact={true} />
              <Route path="/settings" component={Settings} exact={true} />
              <Route path="/" component={SignUp} exact={true} />
            </IonRouterOutlet>
            <Route path="/account/login" component={Login} exact={true} />
          </IonSplitPane>
        </IonReactRouter>
      </IonApp>
    );
  }
}

export default App;
