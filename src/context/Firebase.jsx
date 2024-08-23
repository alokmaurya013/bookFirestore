import {createContext, useContext,useState,useEffect} from 'react';
import {initializeApp} from 'firebase/app';

import {getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup,
    onAuthStateChanged
} from 'firebase/auth';

import {addDoc, collection, getFirestore,getDocs,doc, getDoc,query,where} from 'firebase/firestore';
import {getStorage,ref,uploadBytes,getDownloadURL} from 'firebase/storage';
import {getMessaging} from "firebase/messaging";

const FirebaseContext=createContext(null);

const firebaseConfig = {
    apiKey: "AIzaSyDF0dppikx4R3jfwZJ0UirXPf4koo5MltQ",
    authDomain: "booklibrary-4d739.firebaseapp.com",
    projectId: "booklibrary-4d739",
    storageBucket: "booklibrary-4d739.appspot.com",
    messagingSenderId: "257459817313",
    appId: "1:257459817313:web:fea0763ede23a5bc0bd320"
};

export const useFirebase=()=>useContext(FirebaseContext);

const firebaseApp=initializeApp(firebaseConfig);
const firebaseAuth=getAuth(firebaseApp);
const firestore=getFirestore(firebaseApp);
const storage=getStorage(firebaseApp);
const googleProvider=new GoogleAuthProvider();

export const FirebaseProvider=(props)=>{
    const [user,setUser]=useState(null);

    useEffect(()=>{
       onAuthStateChanged(firebaseAuth,(user)=>{
          if(user){
            setUser(user);
          }else{
            setUser(null);
          }
       })
    },[]);
    const signupWithEmailAndPassword=(email,password)=>
    createUserWithEmailAndPassword(firebaseAuth,email,password);

    const signinWithEmailAndPassword=(email,password)=>
    signInWithEmailAndPassword(firebaseAuth,email,password);

    const signinWithGoogle=()=>
    signInWithPopup(firebaseAuth,googleProvider);

    const handleCreateNewListing=async (name,isbn,price,cover)=>{
        const imageRef=ref(storage,`uploads/images/${Date.now()}-${cover.name}`);
       const uploadResult=await uploadBytes(imageRef,cover);
       return await addDoc(collection(firestore,'books'),{
            name,
            isbn,
            price,
            imageURL:uploadResult.ref.fullPath,
            userId:user.uid,
            userEmail:user.email,
            displayName:user.displayName,
            photoURL:user.photoURL

       });
    };
    const listAllBooks=()=>{
        return getDocs(collection(firestore,'books'));
    }
    const getImageURL=(path)=>{
        return getDownloadURL(ref(storage,path));
    }
    
    const isLoggedIn=user?true:false;

    const getBookById=async(id)=>{
       const docRef=doc(firestore,'books',id);
       const result=await getDoc(docRef);
       return result;
    }

    const placeOrder=async (bookId,qty)=>{
        const collectionRef=collection(firestore,'books',bookId,'orders');
        const result=await addDoc(collectionRef,{
            userID:user.uid,
            userEmail:user.email,
            displayName:user.displayName,
            photoURL:user.photoURL,
            qty:Number(qty)
        });
        return result;
    }
    const fetchMyBooks=async(userId)=>{
        const collectionRef=collection(firestore,'books');
        const q=query(collectionRef,where("userId",'==',userId));
        const result=await getDocs(q);
        return result;
    }   
   const getOrders=async(bookId)=>{
      const collectionRef=collection(firestore,'books',bookId,'orders');
      const result=await getDocs(collectionRef);
      return result;
   }
   const messaging=getMessaging(firebaseApp);

    return <FirebaseContext.Provider 
    value={{signupWithEmailAndPassword,
    signinWithEmailAndPassword,
    signinWithGoogle,
    isLoggedIn,
    handleCreateNewListing,
    listAllBooks,
    getImageURL,
    getBookById,
   placeOrder,
   getOrders,
   fetchMyBooks,
   messaging,
   user
    }}>{props.children}
    </FirebaseContext.Provider>    
};
