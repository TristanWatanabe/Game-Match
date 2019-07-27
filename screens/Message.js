import React from 'react'
import {StyleSheet, Text, View, Dimensions, Image, Animated, Button} from 'react-native'
import {db} from '../src/config'
import firebase, { firestore } from 'firebase'
import { TextInput } from 'react-native-gesture-handler';

export default class Message extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            messenger: ''
        }
    }

    componentDidMount() {
        // this.getMessenger()
    }

    // getMessenger = () => {
    //     const {message} = this.props
    //     db.collection('Users').where('userId', '==', message.userId).get()
    //     .then((snapshot) => {
    //         snapshot.docs.forEach(doc => {
    //             let user = doc.data()
    //             this.setState({messenger: user.name});
    //         })
    //     })
    //     .catch((err) => console.log(err))

    // }

    render() {
        const {message} = this.props;
        console.log('message ', message)
        const userId = firebase.auth().currentUser.uid;
        return message.userId === userId ? (
            <View style = {styles.userMessage} key = {message.messageId}>
                <Text style = {{color: 'white'}}> {message.message}</Text>
            </View>
            ) : 
             (
            <View style = {styles.otherMessage} key = {message.messageId}>
                <View style = {styles.messengerView}>
                <Text style = {styles.messenger}> {message.sender}</Text>
                </View>
                <View>
                <Text style = {{color: 'white'}}> {message.message}</Text>
                </View>
            </View>
            )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        // alignItems: 'center'
    },
    textInput: {
        // top: SCREEN_HEIGHT/2,
        borderWidth: 2,
        padding: 10,
        // alignSelf: 'flex-end'
    },
    button: {
        // top: SCREEN_HEIGHT/2 +
    },
    userMessage: {
        alignSelf: 'flex-end',
        backgroundColor: 'blue',
        borderWidth: 1,
        borderRadius: 10,
        padding: 10,
        marginBottom: 2,
        
    }, 
    otherMessage: {
        alignSelf: 'flex-start',
        backgroundColor: 'gray',
        borderWidth: 1,
        borderRadius: 10,
        padding: 10,
        marginBottom: 2
    },
    messenger: {
        fontSize: 10,
        fontWeight: 'bold'
    },
    messengerView: {
        backgroundColor: 'white',
        marginBottom: 1
    }
})