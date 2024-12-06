import {
    auth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    sendEmailVerification,
    signOut,
    signInWithPopup,
    GoogleAuthProvider,
    provider,
    getFirestore,
    db,
    collection,
    addDoc,
    getDocs,
    doc,
    setDoc,
    updateDoc, 
    serverTimestamp, 
    arrayUnion, 
    arrayRemove,
    deleteDoc
  } from "./firebase.js";
  
  // Sign Up Function
  let signUp = () => {
    let email = document.getElementById("email").value;
    let password = document.getElementById("pass").value;
    let cPassword = document.getElementById("confirm_pass").value;
    let emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
    let passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;
  
    let name = document.getElementById("name").value;
    let number = document.getElementById("number").value;
    let userData = { name, number, email, password };
    console.log(userData);
  
    if (emailRegex.test(email) && passwordRegex.test(password)) {
      if (password === cPassword) {
        createUserWithEmailAndPassword(auth, email, password)
          .then(async (userCredential) => {
            const user = userCredential.user;
            alert("Account created successfully");
  
            // Store user data in Firestore
            try {
              await setDoc(doc(db, "users", user.uid), {
                ...userData,
                uId: user.uid,
              });
              console.log("Document written with ID: ", user.uid);
  
              // Redirect to dashboard after successful sign-up
              window.location.href = "dashboard.html";  // Redirect to dashboard.html
            } catch (e) {
              console.error("Error adding document: ", e);
            }
          })
          .catch((error) => {
            console.log(error.message);
            alert(error.code);
          });
      } else {
        alert("Passwords should be identical");
      }
    } else {
      alert("Invalid email or Password");
    }
  };
  
  // Sign-Up Button Event Listener
  let signUp_btn = document.getElementById("signUp_btn");
  signUp_btn.addEventListener("click", signUp);
  
  // Login Function
  let logIn = () => {
    let email = document.getElementById("email").value;
    let password = document.getElementById("pass").value;
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        alert("Login Successful");
        window.location.href = "dashboard.html";  // Redirect to dashboard.html after login
      })
      .catch((error) => {
        alert(error.code);
      });
  };
  
  if (window.location.pathname == "/loginSignup/login.html") {
    let login_btn = document.getElementById("login_btn");
    login_btn.addEventListener("click", logIn);
  }
  
  // Google SignUp
  let googleSignup = () => {
    signInWithPopup(auth, provider)
      .then(async (result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        const user = result.user;
  
        try {
          await setDoc(doc(db, "users", user.uid), {
            uid: user.uid,
            name: user.displayName,
            email: user.email,
            image: user.photoURL,
            number: user.phoneNumber,
          });
          console.log("Document written with ID: ", user.uid);
  
          // Redirect to dashboard after Google sign-up
          window.location.href = "dashboard.html";  // Redirect to dashboard.html
        } catch (e) {
          console.error("Error adding document: ", e);
        }
      })
      .catch((error) => {
        const email = error.customData.email;
        const credential = GoogleAuthProvider.credentialFromError(error);
        console.log(email, credential);
      });
  };
  
  if (window.location.pathname == "/loginSignup/index.html") {
    let googleBtn = document.getElementById("googleBtn");
    googleBtn.addEventListener("click", googleSignup);
  }
  