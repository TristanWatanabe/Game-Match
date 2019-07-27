import * as firebase from 'firebase'

const firebaseConfig = {
    apiKey: "AIzaSyDg_8pu-RrcnEZNf-qhFN8OHlaVHd4SgHY",
    authDomain: "react-native-boardgame.firebaseapp.com",
    databaseURL: "https://react-native-boardgame.firebaseio.com",
    projectId: "react-native-boardgame",
    storageBucket: "react-native-boardgame.appspot.com",
    messagingSenderId: "617698400744",
    appId: "1:617698400744:web:9c3bb740a3a6eef4"
  };


export const Firebase = () => {
    firebase.initializeApp(firebaseConfig);
    Firebase.auth = firebase.auth()
}