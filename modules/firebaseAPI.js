import * as firebase from "firebase";
import { db } from "../src/config";

export const signup = (email, password, name) => {
  firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .then(currentUser => {
      const userId = currentUser.user.uid;
      db.collection("Users")
        .doc(userId)
        .set({
          userId: userId,
          name: name
        });
    })
    .catch(function(error) {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      if (errorCode == "auth/weak-password") {
        alert("The password is too weak.");
      } else {
        alert(errorMessage);
      }
      alert(error);
    });
};

export const login = (email, password) => {
  firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .catch(function(error) {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      if (errorCode === "auth/wrong-password") {
        alert("Wrong password.");
      } else {
        alert(errorMessage);
      }
    });
};

export const logout = () => {
  firebase
    .auth()
    .signOut()
    .catch(err => console.log(err));
};

const createUser = name => {};
