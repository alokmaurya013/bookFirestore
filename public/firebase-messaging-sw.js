
importScripts("https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js");
importScripts(
  "https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js"
);

const firebaseConfig = {
    apiKey: "AIzaSyDF0dppikx4R3jfwZJ0UirXPf4koo5MltQ",
    authDomain: "booklibrary-4d739.firebaseapp.com",
    projectId: "booklibrary-4d739",
    storageBucket: "booklibrary-4d739.appspot.com",
    messagingSenderId: "257459817313",
    appId: "1:257459817313:web:fea0763ede23a5bc0bd320"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.image,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});