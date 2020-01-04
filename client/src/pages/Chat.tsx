import * as React from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonTitle,
  IonContent,
  IonItem,
  IonLabel,
  IonButton,
  IonInput,
  IonFooter,
  IonCard,
  IonIcon
} from "@ionic/react";

import { arrowBack } from "ionicons/icons";

import { messageListener, send, connectRoom } from "../util/chat";
import { Redirect } from "react-router-dom";
import { getFromStorage } from "../util/storage";
import checkAuth from "../util/checkAuth";

export interface ChatProps {}

export interface ChatState {
  loggedIn: boolean;
  chatID: number;
  currentMessage: string;
  messages: any;
  contactID: number;
  contactName: string;
  isLoading: boolean;
  goBack: boolean;
  userID: number;
  userFirstName: string;
  userLastName: string;
  months: any;
}

class Chat extends React.Component<ChatProps, ChatState> {
  constructor(props: any) {
    super(props);
    this.state = {
      userID: 0,
      userFirstName: "",
      userLastName: "",
      loggedIn: true,
      chatID: props.match.params.id,
      currentMessage: "",
      messages: [],
      isLoading: true,
      goBack: false,
      contactID: 0,
      contactName: "",
      months: [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
      ]
    };
    connectRoom(this.state.chatID);
    this.sendMsg = this.sendMsg.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.redirectBack = this.redirectBack.bind(this);
    messageListener((msg: any) => {
      let flow = this.state.messages;
      flow.push(msg);
      if (msg.from !== this.state.userID) {
      }
      this.setState({ messages: flow });
    });
  }
  async componentDidMount() {
    let token = await getFromStorage("auth");
    let authInfo = await checkAuth(token);
    console.log(authInfo);
    if (!authInfo.loggedIn)
      this.setState({ loggedIn: false, isLoading: false });
    else {
      this.setState({
        userID: authInfo.uid,
        userFirstName: authInfo.firstName,
        userLastName: authInfo.lastName,
        loggedIn: true,
        isLoading: false
      });
    }
    fetch(`http://localhost:5000/api/chat/${this.state.chatID}/?token=${token}`)
      .then(data => data.json())
      .then(json => {
        if (json.success) {
          console.log(json);
          this.setState({
            messages: json.messages,
            contactName: json.contactName,
            contactID: json.contactID,
            isLoading: false
          });
        } else {
          console.log("Failed");
        }
      });
  }
  sendMsg(event: any) {
    event.preventDefault();
    let msg = {
      body: this.state.currentMessage,
      chatID: this.state.chatID,
      from: this.state.userID,
      contactID: this.state.contactID
    };
    send(msg);
  }
  handleChange(event: any) {
    this.setState({ currentMessage: event.target.value });
  }
  redirectBack(event: any) {
    this.setState({
      goBack: true
    });
  }
  render() {
    if (this.state.isLoading) return "";
    if (!this.state.loggedIn) return <Redirect to="/account/login" />;
    if (this.state.goBack) return <Redirect to="/home/chats" />;
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonButton
                onClick={this.redirectBack}
                shape="round"
                size="large"
                fill="clear"
              >
                <IonIcon icon={arrowBack}></IonIcon>
              </IonButton>
            </IonButtons>
            <IonTitle>{this.state.contactName}</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          {this.state.messages.map((msg: any) => {
            return (
              <IonCard
                style={{
                  width: "60%",
                  float: msg.from === this.state.contactID ? "left" : "right"
                }}
              >
                <IonItem
                  color={this.state.contactID === msg.from ? "dark" : "primary"}
                >
                  <IonLabel>{msg.body}</IonLabel>
                  <br />
                </IonItem>
                <IonItem>
                  <small>
                    {new Date(msg.createdAt).getDate()}{" "}
                    {this.state.months[new Date(msg.createdAt).getMonth()]}{" "}
                    {new Date(msg.createdAt).getHours()}:
                    {new Date(msg.createdAt).getMinutes()}
                  </small>
                </IonItem>
              </IonCard>
            );
          })}
        </IonContent>
        <IonFooter>
          <IonItem>
            <IonInput
              placeholder="Your Message"
              onInput={this.handleChange}
            ></IonInput>
            <IonButton slot="end" size="default" onClick={this.sendMsg}>
              Send
            </IonButton>
          </IonItem>
        </IonFooter>
      </IonPage>
    );
  }
}

export default Chat;
