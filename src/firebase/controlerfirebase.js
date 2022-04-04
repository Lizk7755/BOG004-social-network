import {
  getAuth, createUserWithEmailAndPassword,
  signInWithEmailAndPassword, onAuthStateChanged, signOut, signInWithPopup, GoogleAuthProvider,
  getDocs, collection, addDoc, getFirestore, doc, setDoc, increment,
} from './firebase-utils.js';

const createUser = (email, password) => {
  const auth = getAuth();
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in
      // const user = userCredential.user;
      // eslint-disable-next-line no-console
      console.log(`El usuario ${userCredential} fue creado!!!`);
    })
    .catch((error) => {
      const getDivError = document.getElementById('id-message-error-record');
      const errorCode = error.code === undefined ? '' : error.code;
      const errorMessage = error.message === undefined ? '' : error.message;
      // eslint-disable-next-line no-console
      console.log(errorCode);
      console.log(errorMessage);
      if (errorCode === 'auth/email-already-in-use') {
        getDivError.innerHTML = '<p>El usuario ya existe, inicie sesión</p>';
      } else {
        getDivError.innerHTML = '<p>Por favor ingresar correo electronico y/o contraseña validos</p>';
      }
    });
};

function existingUser(email, password) {
  const auth = getAuth();
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      console.log(`El usuario ${user} se ha autenticado!!!`);
      // ...
    })
    .catch((error) => {
      const getDivError = document.getElementById('id-message-error-login');
      const errorCode = error.code === undefined ? '' : error.code;
      const errorMessage = error.message === undefined ? '' : error.message;
      // eslint-disable-next-line no-console
      console.log(errorCode);
      console.log(errorMessage);
      getDivError.innerHTML = '<p>Usuario o contraseña invalidos, por favor ingresar nuevamente</p>';
    });
}

let usuario;

function getUser() {
  return usuario;
}

function observerUserState() {
  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    usuario = user;
    if (user) {
      // console.table(user);
      window.location.hash = '#wall';
    } else if (window.location.hash === '#wall') {
      // User is signed out
      window.location.hash = '';
    }
  });
}

const closeSession = () => {
  const auth = getAuth();
  signOut(auth)
    .then(() => {
    })
    .catch((error) => {
      console.error(error);
    });
};

const provider = new GoogleAuthProvider();
console.log('provider: ', provider);

const signInWithGoogle = () => {
  const auth = getAuth();
  signInWithPopup(auth, provider)
    .then((result) => {
      const user = result.user;
      console.log(`El usuario ${user} se ha autenticado!!!`);
    // ...
    }).catch((error) => {
      // eslint-disable-next-line no-console
      console.error(error);
    });
};

/* FIRESTORE
 * Esta funcion va a conectarse a firestore
 * Luego con el resultado que es una suscripcion (aun no sabes)
 * va a pintar en pantalla el resultado
 */

const getPostList = async () => {
  const db = getFirestore();
  const querySnapshot = await getDocs(collection(db, 'posts'));
  const getDivPosts = document.getElementById('posts');
  let Posts = '';
  let PostJS = '';

  querySnapshot.forEach((document) => {
    const data = document.data();
    console.log(data);

    /* const getDivUser = document.getElementById('user-thinking');
    const user = data.user;
    getDivUser.innerHTML = user;
    const getDivThinking = document.getElementById('space-thinking');
    const thinking = data.thinking;
    getDivThinking.innerHTML = thinking; */
    Posts += `
      <section class="post-container">
        <div class="post-avatar">
          <img class="avatar" src="${data.photoUrl}" />
        </div>
        <div class="post-content">
          <h3>${data.user}</h4> 
          <h4>${data.email}</h4>
          <p>${data.thinking}</p>
        </div>
        </section>
        <div class="posticons">
        <i id="doLikeImg${document.id}" class="fa-solid fa-heart posticon"></i>
        <i class="fa-solid fa-comment posticon"></i>
        <i class="fa-solid fa-bookmark posticon"></i>
        </div>
      
    `;

    PostJS += `
      document.getElementById('doLikeImg${document.id}').addEventListener('click', () => {doLike('${document.id}');});
    `;
  });

  getDivPosts.innerHTML = Posts;
  // eslint-disable-next-line no-eval
  eval(PostJS);
};
// El primer parametro es el uid del post y el segundo el pensamiento editado
const editPosts = (id, thinking) => {
  // usuario.displayName
  // usuario.email
  console.log(`${id} ${thinking}`);
};

const addPost = async (thinking) => {
  try {
    const db = getFirestore();
    const docRef = await addDoc(collection(db, 'posts'), {
      user: usuario.displayName,
      email: usuario.email,
      photoUrl: usuario.photoURL,
      thinking,
    });
    console.log('Document written with ID: ', docRef.id);
    getPostList();
  } catch (e) {
    console.error('Error adding document: ', e);
    // TODO: escribir la causa del error en la pantalla o algo asi como en los de auth
  }
  getPostList();
};

function doLike(idPost) {
  console.log(idPost);
  try {
    const db = getFirestore();
    const docRef = doc(collection(db, 'posts'), idPost);
    setDoc(
      docRef,
      {
        countLikes: increment(1),
      },
      { merge: true },
    );
    console.log('Document updated with ID: ', docRef.id);
    getPostList();
  } catch (e) {
    console.error('Error adding document: ', e);
    // TODO: escribir la causa del error en la pantalla o algo asi como en los de auth
  }
  getPostList();
}

export {
  createUser, existingUser, observerUserState, signInWithGoogle, closeSession, getPostList,
  addPost, editPosts, getUser, doLike,
};
