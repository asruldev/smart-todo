import {
  createUserWithEmailAndPassword,
  getAuth,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { firebase_app } from ".";
import { FirestoreService } from "./firestoreService";

class AuthService {
  auth = getAuth(firebase_app);
  googleProvider = new GoogleAuthProvider();
  userTable = new FirestoreService("users");

  async signInWithGoogle() {
    try {
      const res = await signInWithPopup(this.auth, this.googleProvider);
      const user = res.user;

      const docs = await this.userTable.getAllAndWhere("uid", "==", user.uid);
      const userData = docs?.[0]; // {id: 'Ri1phM22KBJC97nFcYMj', name: 'Asrul Dev', email: 'talkasrul@gmail.com', uid: 'vPXqZ3NNhng0MoEaxZT9Z3AXHbr2', authProvider: 'google'}
      const data = {
        uid: user.uid,
        name: user.displayName,
        authProvider: "google",
        email: user.email,
      }
      if (!userData) {
        this.addUserData(data);
      }
      return data;
    } catch (error) {
      let errorMessage = error.message;
      return errorMessage;
    }
  }

  async addUserData(user) {
    try {
      await this.userTable.create(user);
      return true;
    } catch (error) {
      let errorMessage = error.message;
      return errorMessage;
    }
  }

  async logout() {
    try {
      signOut(this.auth);
      return true;
    } catch (error) {
      return false;
    }
  }

  async signInwithEmail(email, password) {
    try {
      const userData = await signInWithEmailAndPassword(
        this.auth,
        email,
        password
      );
      if (userData) {
        return userData;
      }
    } catch (error) {
      let errorMessage = error.message;
      return errorMessage;
    }
  }

  async registerEmail(email, password, name = "") {
    try {
      const userData = await createUserWithEmailAndPassword(
        this.auth,
        email,
        password
      );
      if (userData) {
        this.addUserData({
          uid: userData.uid,
          name: name,
          authProvider: "email",
          email: email,
        });
      }
      return true;
    } catch (error) {
      let errorMessage = error.message;
      return errorMessage;
    }
  }

  getUserLogin() {
    return this.auth.currentUser;
  }
}

export default new AuthService();
