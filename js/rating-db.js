      // Your web app's Firebase configuration
      const firebaseConfig = {
        apiKey: "AIzaSyA8rnh14BWMO5eeWcPUdRI7x5vSB3lB7NU",
        authDomain: "si99vc.firebaseapp.com",
        databaseURL: "https://si99vc-default-rtdb.firebaseio.com",
        projectId: "si99vc",
        storageBucket: "si99vc.firebasestorage.app",
        messagingSenderId: "925356100766",
        appId: "1:925356100766:web:be985d257ca88d1bbc3f8f"
      };

      let app, db;

      try {
        app = firebase.initializeApp(firebaseConfig);
        db = firebase.database();
      } catch (error) {
        console.error("Error initializing Firebase:", error);
        alert("Failed to initialize Firebase. Check the console for errors.");
      }
