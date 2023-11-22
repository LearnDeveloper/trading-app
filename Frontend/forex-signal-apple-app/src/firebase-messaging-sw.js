importScripts("https://www.gstatic.com/firebasejs/9.1.3/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.1.3/firebase-messaging-compat.js");
firebase.initializeApp(
  {
    apiKey: "AIzaSyCBOnz2ezyZdY9HwuQ2KFAIkyhrNbJp-iQ",
    authDomain: "forexsignal-9d44c.firebaseapp.com",
    projectId: "forexsignal-9d44c",
    storageBucket: "forexsignal-9d44c.appspot.com",
    messagingSenderId: "737077328099",
    appId: "1:737077328099:web:d8af353fc6aa6d6d592dd6",
    measurementId: "G-8NCFSCBNYE",
    vapidKey:"BA_3AI492NwvTpHPHZvILvq_A95isnMHjBDQvm1b5XMdW4Cfyfm80OyBIJcfleQ1reZ4zkil1FxeLXht-JmlXIs"
  }
);
const messaging = firebase.messaging();