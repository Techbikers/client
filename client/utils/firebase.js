import firebase from "firebase/app";
import "firebase/auth";

import { FIREBASE_API_KEY, FIREBASE_AUTH_DOMAIN } from "techbikers/config";

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp({
    apiKey: FIREBASE_API_KEY,
    authDomain: FIREBASE_AUTH_DOMAIN
  });
}

const auth = firebase.auth();
// set local persistence
// so state is only cleared on signout
auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);

export { auth };
