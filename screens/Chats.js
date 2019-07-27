import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { db } from "../src/config";
import firebase from "firebase";

export default class Chats extends React.Component {
  constructor() {
    super();
    this.state = {
      chats: [],
      userName: ""
    };
  }

  componentDidMount() {
    const userId = firebase.auth().currentUser.uid;
    db.collection("Chats")
      .where("members", "array-contains", userId)
      .onSnapshot(querySnapshot => {
        let chats = [];
        querySnapshot.docs.forEach(doc => {
          doc = doc.data();
          chats.push(doc);
        });
        this.setState({ chats: chats });
      });

    db.collection("Users")
      .where("userId", "==", userId)
      .get()
      .then(snapshot => {
        snapshot.docs.forEach(doc => {
          doc = doc.data();
          this.setState({ userName: doc.name });
        });
      });
  }

  handlePress = chatId => {
    this.props.navigation.navigate("Chat", {
      chatId: chatId,
      userName: this.state.userName
    });
  };

  render() {
    const chats = this.state.chats;
    return (
      <View style={styles.container}>
        {chats.map(chat => {
          return (
            <View style={styles.chat} key={chat.chatId}>
              <Text
                style={styles.text}
                onPress={() => this.handlePress(chat.chatId)}
              >
                {" "}
                {chat.name}{" "}
              </Text>
            </View>
          );
        })}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start"
  },
  chat: {
    padding: 20,
    borderWidth: 2,
    marginBottom: 1
  },
  text: {
    fontSize: 20,
    fontWeight: "bold"
  }
});
