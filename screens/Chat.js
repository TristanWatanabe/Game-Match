import React from "react";
import {
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  View,
  Dimensions,
  ScrollView,
  Image,
  Animated,
  Button,
  FlatList
} from "react-native";
import { db } from "../src/config";
import firebase, { firestore } from "firebase";
import { TextInput } from "react-native-gesture-handler";
import Message from "./Message";

const SCREEN_HEIGHT = Dimensions.get("window").height;

export default class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      chatId: this.props.navigation.state.params.chatId,
      messages: [],
      message: "",
      userName: this.props.navigation.state.params.userName
    };
  }

  getMessages = () => {
    db.collection("Messages")
      .where("chatId", "==", this.state.chatId)
      .orderBy("time")
      .onSnapshot(snapshot => {
        let messages = [];
        snapshot.docs.forEach(doc => {
          const message = doc.data();
          messages.push(message);
        });
        this.setState({ messages: messages });
      });
  };

  componentDidMount() {
    this.getMessages();
  }

  handleSend = event => {
    const userId = firebase.auth().currentUser.uid;
    if (this.state.message) {
      db.collection("Messages")
        .add({
          chatId: this.state.chatId,
          userId: userId,
          message: this.state.message,
          sender: this.state.userName,
          time: firebase.firestore.FieldValue.serverTimestamp()
        })
        .then(() => this.setState({ message: "" }))
        .then(() => this.getMessages())
        .catch(err => console.log(err));
    }
  };

  render() {
    const messages = this.state.messages;
    return (
      // <ScrollView>

      <View style={styles.container}>
        {/* {  
                messages.map((message) => {
                    return (<Message message = {message} />)
                })
                }  */}

        <FlatList
          data={messages}
          renderItem={({ item }) => {
            return <Message message={item} />;
          }}
        />
        <KeyboardAvoidingView behavior="padding">
          <TextInput
            style={styles.textInput}
            value={this.state.message}
            onChangeText={text => this.setState({ message: text })}
          />

          <Button
            style={styles.button}
            onPress={this.handleSend}
            title="Send"
          />
          <View style={{ height: 60 }} />
        </KeyboardAvoidingView>
      </View>
      //    </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column"
    // alignItems: 'center'
  },
  textInput: {
    // top: SCREEN_HEIGHT/2,
    borderWidth: 2,
    padding: 10,
    backgroundColor: "white"
    // alignSelf: 'flex-end'
  },
  button: {
    // top: SCREEN_HEIGHT/2 +
  },
  userMessage: {
    alignSelf: "flex-end",
    backgroundColor: "blue",
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginBottom: 2
  },
  otherMessage: {
    alignSelf: "flex-start",
    backgroundColor: "gray",
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginBottom: 2
  }
});
