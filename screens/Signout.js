import React from 'react';
import {View, Button, InteractionManager, Text, StyleSheet } from 'react-native'
import * as FirebaseAPI from '../modules/firebaseAPI'
import firebase from 'firebase'
import {db} from '../src/config'

export default class Signout extends React.Component {

    constructor(){
        super()
        this.state = {
            user: {}
        }
    }

    componentWillMount(){
       const userId = firebase.auth().currentUser.uid;
        db.collection('Users').where('userId', '==', userId).get()
        .then(snapshot => {
            snapshot.docs.forEach(doc => {
                doc = doc.data()
                this.setState({user: doc})
            })
        })
    }

  _signOutAsync = async () => {
    await FirebaseAPI.logout()
    // this.props.navigation.navigate('Auth');
    InteractionManager.runAfterInteractions(() => {
        this.props.navigation.navigate('Auth');
    })
  };

   render() {
       const user = firebase.auth().currentUser;
     return(
        <View style = {styles.container}>
            <View style = {styles.chat}>
            <Text style = {styles.text}>Name: {this.state.user.name}</Text>
            </View>
            <View style = {styles.chat}>
            <Text style = {styles.text}>Email: {user.email}</Text>
            </View>
            
          <Button onPress = {this._signOutAsync}  title = 'Sign Out' />
        </View>
     )
   } 
   
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start'
    },
    chat: {
        padding: 20,
        borderWidth: 2,
        marginBottom: 1
    },
    text: {
        fontSize: 20,
        fontWeight: 'bold'
    }
})