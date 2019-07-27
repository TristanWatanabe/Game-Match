import React from 'react'
import {StyleSheet,View, Text, TextInput, Button} from 'react-native'
import MainTabNavigator from '../navigation/MainTabNavigator';
import * as FirebaseAPI from '../modules/firebaseAPI';


export default class Signup extends React.Component{
    constructor(){
        super();
        this.state = {
            name: '',
            email: '',
            password: ''
        }
    }

    handleOnChange = (evt) => {
        this.setState({
            [evt.target.name]: evt.target.value
        })
    }

    handleSignup = () => {
        FirebaseAPI.signup(this.state.email, this.state.password, this.state.name)
        this.props.navigation.navigate('App')
    }


    render() {
        return (
            <View style = {styles.container}>

                <TextInput 
                style = {styles.textInput} 
                value = {this.state.name} 
                onChangeText = {(text) => this.setState({name: text})} 
                placeholder = 'name' 
                />

                <TextInput 
                style = {styles.textInput} 
                value = {this.state.email} 
                onChangeText = {(text) => this.setState({email: text})} 
                placeholder = 'email' 
                />
            
                <TextInput 
                style = {styles.textInput} 
                value = {this.state.password} 
                onChangeText = {(text) => this.setState({password: text})} 
                placeholder = 'password' 
                />
                <Button onPress = {this.handleSignup} title = 'Signup' />
                <Button
                    title="Already have an account? Login"
                    onPress={() => this.props.navigation.navigate('Login')}
                />
            </View>
        )
    }

}

const styles = StyleSheet.create({
    container: {
        flex:1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    textInput: {
        padding: 20
    }
})