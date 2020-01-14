import {
  IonButtons,
  IonContent,
  IonHeader,
  IonItem,
  IonMenuButton,
  IonPage,
  IonTitle,
  IonToolbar,
  IonLabel,
  IonThumbnail,
  IonButton
} from "@ionic/react";

import * as React from "react";
import { Link } from "react-router-dom";
import { getFromStorage } from "../util/storage";

import {
  Plugins,
  PushNotification,
  PushNotificationToken,
  PushNotificationActionPerformed
} from "@capacitor/core";

const { PushNotifications } = Plugins;

export interface ChatsProps {}

export interface ChatsState {
  collapsed: boolean;
  isLoading: boolean;
  loggedIn: boolean;
  userFirstName: string;
  userLastName: string;
  userEmail: string;
  userContacts: any;
  userDMs: any;
}

class Chats extends React.Component<ChatsProps, ChatsState> {
  constructor(props: ChatsProps) {
    super(props);
    this.state = {
      collapsed: false,
      isLoading: true,
      loggedIn: false,
      userFirstName: "Your",
      userLastName: "Name",
      userEmail: "",
      userContacts: [],
      userDMs: []
    };
  }
  async componentDidMount() {
    // Register with Apple / Google to receive push via APNS/FCM
    PushNotifications.register();

    // On success, we should be able to receive notifications
    PushNotifications.addListener(
      "registration",
      (token: PushNotificationToken) => {
        alert("Push registration success, token: " + token.value);
      }
    );

    // Some issue with our setup and push will not work
    PushNotifications.addListener("registrationError", (error: any) => {
      alert("Error on registration: " + JSON.stringify(error));
    });

    // Show us the notification payload if the app is open on our device
    PushNotifications.addListener(
      "pushNotificationReceived",
      (notification: PushNotification) => {
        alert("Push received: " + JSON.stringify(notification));
      }
    );

    // Method called when tapping on a notification
    PushNotifications.addListener(
      "pushNotificationActionPerformed",
      (notification: PushNotificationActionPerformed) => {
        alert("Push action performed: " + JSON.stringify(notification));
      }
    );
    let token = await getFromStorage("auth");
    if (token) {
      fetch(`http://localhost:5000/api/account/verify?token=${token}`)
        .then(res => res.json())
        .then(json => {
          if (json.success) {
            fetch(
              `http://localhost:5000/api/account/getuserbytoken?token=${token}`
            )
              .then(res => res.json())
              .then(json => {
                this.setState({
                  loggedIn: true,
                  isLoading: false,
                  userEmail: json.email,
                  userFirstName: json.firstName,
                  userLastName: json.lastName
                });
                fetch(`http://localhost:5000/api/chat/get-user-chats/`, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json"
                  },
                  body: JSON.stringify({
                    uid: json.id
                  })
                })
                  .then(data => data.json())
                  .then(json => {
                    if (json.success) {
                      this.setState({
                        userDMs: json.userChats
                      });
                    } else {
                      console.log("Failed");
                    }
                  });
              });
          }
        });
    } else {
      this.setState({
        loggedIn: false,
        isLoading: false
      });
    }
  }
  render() {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonMenuButton />
            </IonButtons>
            <IonTitle>Chats</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          {this.state.userDMs.map((chat: any) => {
            return (
              <React.Fragment>
                <IonItem>
                  <IonThumbnail slot="start">
                    <img
                      src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAAAAACH5BAAAAAAALAAAAAABAAEAAAICTAEAOw=="
                      alt="user"
                    />
                  </IonThumbnail>

                  <Link to={`/home/chats/${chat.chatID}`}>
                    <IonLabel>
                      <h2>{chat.from}</h2>
                      <p>{chat.lastMessage}</p>
                    </IonLabel>
                  </Link>
                  <IonButton fill="outline" slot="end">
                    ...
                  </IonButton>
                </IonItem>
              </React.Fragment>
            );
          })}
        </IonContent>
      </IonPage>
    );
  }
}

export default Chats;
