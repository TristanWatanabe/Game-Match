import React from "react";
import { StyleSheet, View, Text, TextInput, Button } from "react-native";
import MainTabNavigator from "../navigation/MainTabNavigator";
import * as FirebaseAPI from "../modules/firebaseAPI";
import firebase from "firebase";

export default class Login extends React.Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: ""
    };
  }

  handleLogin = async () => {
    await FirebaseAPI.login(this.state.email, this.state.password);
  };

  render() {
    return (
      <View style={styles.container}>
        <TextInput
          style={styles.textInput}
          value={this.state.name}
          onChangeText={text => this.setState({ email: text })}
          placeholder="email"
        />

        <TextInput
          style={styles.textInput}
          value={this.state.password}
          onChangeText={text => this.setState({ password: text })}
          placeholder="password"
        />
        <Button onPress={this.handleLogin} title="Login" />
        <Button
          title="Don't have an account? Sign Up"
          onPress={() => this.props.navigation.navigate("Signup")}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  textInput: {
    padding: 20
  }
});
