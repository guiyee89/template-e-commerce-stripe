import { initializeApp } from "firebase/app";
import { collection, getDocs, getFirestore, /*  getAnalytics, arrayUnion  */ } from "firebase/firestore";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, GoogleAuthProvider, signOut, sendPasswordResetEmail, signInWithPopup } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject, listAll } from "firebase/storage"
//import { v4 } from "uuid"


///////////////////////////////////////////////////////////////////////////////
//configuracion de VITE para proteger la informacion de variables de entorno (.env)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY, //objetos
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING,
  appId: import.meta.env.VITE_APP_ID,
  measurementId: import.meta.env.VITE_MEASUREMENT_ID
};


///////////////////////////////////////////////////////////////////////////////
/****   Inicializamos app   ****/
const app = initializeApp(firebaseConfig);
/* const analytics = getAnalytics(app);  */

///////////////////////////////////////////////////////////////////////////////
/* traemos el metodo getFirestore y lo exportamos a la app con "db" (database) */
export const db = getFirestore(app)


///////////////////////////////////////////////////////////////////////////////
/*********   AUTH   ********/
const auth = getAuth(app)

//Login
export const onLogin = async ({ email, password }) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    return { user };
  } catch (error) {
    return { error }; // Return the error object
  }
};
export const onRegister = async ({ email, password }) => {
  try {
    return await createUserWithEmailAndPassword(auth, email, password)
  } catch (error) {
    return error
  }
}

//Google Authenticator
const googleAuth = new GoogleAuthProvider()

export const loginWithGoogle = async () => {
  const res = await signInWithPopup(auth, googleAuth)
  return res
}

//Log out session
export const logout = () => {
  signOut(auth)
}
export const forgotPassword = async (email) => {
  try {
    let res = await sendPasswordResetEmail(auth, email)
    return res
  } catch (error) {
    return error
  }
}


///////////////////////////////////////////////////////////////////////////////
// /******   STORAGE   ******/
const storage = getStorage(app)

export const uploadFile = async (file, retries = 3) => {
  const uploadAttempt = async (attempt) => {
    return new Promise((resolve, reject) => {
      const fileName = file.name;
      const storageRef = ref(storage, fileName);

      setTimeout(async () => {
        try {
          await uploadBytes(storageRef, file);
          const url = await getDownloadURL(storageRef);
          resolve(url);
        } catch (error) {
          if (attempt < retries) {
            resolve(uploadAttempt(attempt + 1));
          } else {
            reject(error);
          }
        }
      }, 2000);
    });
  };
  return uploadAttempt(0);
};

// export const deleteFile = async (file) => {
//   const storageRef = ref(storage, v4())
//   await deleteFile(storageRef, file)
//   let url = await getDownloadURL(storageRef)
//   return url
// };

const getAllImageUrlsFromFirestore = async () => {
  const itemsCollection = collection(db, "products");
  const productsSnapshot = await getDocs(itemsCollection);
  const imageUrls = new Set();

  productsSnapshot.forEach((doc) => {
    const product = doc.data();
    product.img.forEach((url) => {
      if (url) imageUrls.add(url.split("?alt=media")[0]); // Strip access token
    });
  });
  return imageUrls;
};

const getResizedImageUrl = (url) => {
  return url.replace(/(\.[^.]*)?$/, "_982x1243$1");
};

//Delete images from Firestore
export const deleteUnusedImages = async () => {
  try {
    // Get all image URLs currently used in Firestore
    const usedImageUrls = await getAllImageUrlsFromFirestore();
    const usedResizedUrls = new Set(
      Array.from(usedImageUrls).map((url) => getResizedImageUrl(url))
    );

    // Introduce a delay to ensure data is fetched and analyzed properly
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // List all files in the Firebase Storage
    const storageRef = ref(storage);
    const filesSnapshot = await listAll(storageRef);
    const deletePromises = filesSnapshot.items.map(async (fileRef) => {
      const fileUrl = (await getDownloadURL(fileRef)).split("?alt=media")[0]; // Strip access token

      if (!usedImageUrls.has(fileUrl) && !usedResizedUrls.has(fileUrl)) {
        console.log("Deleting unused image name:", fileRef.name); // Log deleted image name
        // If the image URL is not used in Firestore, delete it from Storage
        await deleteObject(fileRef);
      }
    });

    await Promise.all(deletePromises);

  } catch (error) {
    console.error("Error deleting unused images:", error);
  }
};


