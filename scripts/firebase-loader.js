const firebasePromise = new Promise((resolve,reject)=>{
	if(typeof document!== "undefined"){
		document.onreadystatechange = function () {
			if (document.readyState === "interactive" || document.readyState === "complete") {
				require.ensure(['firebase/app.js','firebase/auth.js'], (require) => {
          var config = {
            apiKey: "AIzaSyDuORZGj2iaTTrs4LXJGNyUjfGHy1HudlY",
            authDomain: "hopgame-ecdb5.firebaseapp.com",
            databaseURL: "https://hopgame-ecdb5.firebaseio.com",
            projectId: "hopgame-ecdb5",
            storageBucket: "hopgame-ecdb5.appspot.com",
            messagingSenderId: "920974504447"
          };
					const initFirebase = function() {
						window.firebase = require('firebase/app.js');
						firebase.auth = require('firebase/auth.js');
						firebase.initializeApp(config);
					};

					resolve(initFirebase);
				}, 'firebase');
			}
		}
	}
});

export default firebasePromise;