import { createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, updatePassword, sendEmailVerification } from "firebase/auth";
import { auth } from "./config";

// ** Thin wrappers for sign-up / sign-in / sign-out. **

//create user with email and password
export const docCreateUserWithEmailAndPassword = async (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
};

//sign in useing email and passwrod
export const doSignInWithEmailAndPassword = (email,password) => {
    return signInWithEmailAndPassword(auth, email, password);
};

//sign in with google
export const doSignInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    return result
};

// sign out
export const doSignOut = () => {
    return auth.signOut();
};

//reset password
export const doPasswordReset = (email) => {
    return sendPasswordResetEmail(auth, email);
};


//send email varification
export const doSendEmailVerification = () => {
    return sendEmailVerification(auth.currentUser, {
        url: `${window.location.origin}/home`,
    });
};



