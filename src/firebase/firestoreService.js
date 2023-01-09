import {
  query,
  getDocs,
  collection,
  where,
  addDoc,
  deleteDoc,
  doc,
  setDoc,
  getDoc,
  onSnapshot,
  deleteField,
  updateDoc,
  getFirestore,
} from "firebase/firestore";
import { firebase_app } from ".";

const db = getFirestore(firebase_app);

export class FirestoreService {
  table;
  constructor(table) {
    this.table = table;
  }

  getRealtime() {
    return onSnapshot(collection(db, this.table), (docsSnap) => {
      const data = [];
      docsSnap.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() });
      });
      return data;
    });
  }

  // get all document
  async getAll() {
    try {
      const q = query(collection(db, this.table));
      const docsSnap = await getDocs(q);
      const data = [];
      docsSnap.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() });
      });
      return data;
    } catch (err) {
      return err;
    }
  }

  // get all document where
  async getAllAndWhere(key, ope, val) {
    try {
      const q = query(collection(db, this.table), where(key, ope, val));
      const docsSnap = await getDocs(q);
      const data = [];
      docsSnap.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() });
      });
      return data;
    } catch (err) {
      return err;
    }
  }

  async getById(id) {
    try {
      const docSnap = await getDoc(doc(db, this.table, id));
      if (docSnap.exists()) {
        return docSnap.data();
      } else {
        throw new Error("No data");
      }
    } catch (error) {
      console.log(error);
    }
  }

  async create(data) {
    try {
      const resp = await addDoc(collection(db, this.table), {
        createdAt: new Date().toISOString(),
        updateAt: "",
        ...data,
      });
      return resp;
    } catch (err) {
      return false;
    }
  }

  async update(id, data) {
    try {
      const q = doc(db, this.table, id);
      await setDoc(q, {
        updateAt: new Date().toISOString(),
        ...data,
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  async delete(id) {
    try {
      await deleteDoc(doc(db, this.table, id));
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async deleteField(id, field) {
    try {
      const data = {
        [field]: deleteField(),
      };
      await updateDoc(doc(db, this.table, id), data);
      return true;
    } catch (error) {
      return false;
    }
  }
}
