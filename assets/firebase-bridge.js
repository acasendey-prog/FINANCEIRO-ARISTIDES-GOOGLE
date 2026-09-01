/* ============================================================================
   firebase-bridge.js — Sincronização Online em Nuvem com Firebase Firestore e Auth
   Permite login online com Google / Email ou Anônimo permanente, com gravação
   em tempo real e persistência 100% online sem depender de arquivos locais.
   ========================================================================== */
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js';
import {
  getAuth,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInAnonymously,
  onAuthStateChanged,
  signOut
} from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  onSnapshot
} from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js';

(async function () {
  'use strict';

  let config = null;
  try {
    const res = await fetch('/firebase-applet-config.json');
    if (res.ok) config = await res.json();
  } catch (e) {
    console.warn('Firebase config local não carregado via fetch', e);
  }

  if (!config || !config.apiKey) {
    console.warn('Firebase não configurado');
    return;
  }

  const app = initializeApp(config);
  const auth = getAuth(app);
  const db = config.firestoreDatabaseId
    ? getFirestore(app, config.firestoreDatabaseId)
    : getFirestore(app);
  const googleProvider = new GoogleAuthProvider();

  let currentUser = null;
  let unsubscribeDoc = null;
  let saveTimer = null;
  let isReceivingRemoteUpdate = false;

  window.FirebaseCloud = {
    app,
    auth,
    db,
    user: null,
    status: 'conectando', // conectando | logado | deslogado | sincronizando | sincronizado | erro
    erro: null,

    async loginGoogle() {
      try {
        window.FirebaseCloud.status = 'conectando';
        emitStatus();
        return await signInWithPopup(auth, googleProvider);
      } catch (err) {
        if (err.code === 'auth/popup-blocked' || err.code === 'auth/cancelled-popup-request') {
          return await signInWithRedirect(auth, googleProvider);
        }
        window.FirebaseCloud.erro = err.message;
        window.FirebaseCloud.status = 'erro';
        emitStatus();
        throw err;
      }
    },

    async loginEmail(email, senha, criarConta) {
      window.FirebaseCloud.status = 'conectando';
      emitStatus();
      try {
        if (criarConta) {
          return await createUserWithEmailAndPassword(auth, email, senha);
        } else {
          return await signInWithEmailAndPassword(auth, email, senha);
        }
      } catch (err) {
        window.FirebaseCloud.erro = err.message;
        window.FirebaseCloud.status = 'erro';
        emitStatus();
        throw err;
      }
    },

    async loginAnonimo() {
      window.FirebaseCloud.status = 'conectando';
      emitStatus();
      try {
        return await signInAnonymously(auth);
      } catch (err) {
        window.FirebaseCloud.erro = err.message;
        window.FirebaseCloud.status = 'erro';
        emitStatus();
        throw err;
      }
    },

    async logout() {
      if (unsubscribeDoc) {
        unsubscribeDoc();
        unsubscribeDoc = null;
      }
      currentUser = null;
      window.FirebaseCloud.user = null;
      window.FirebaseCloud.status = 'deslogado';
      emitStatus();
      return await signOut(auth);
    },

    async salvarNaNuvem(dbData, force) {
      if (!currentUser) return false;
      const userRef = doc(db, 'users', currentUser.uid);
      window.FirebaseCloud.status = 'sincronizando';
      emitStatus();
      try {
        const payload = {
          atualizadoEm: new Date().toISOString(),
          dispositivo: navigator.userAgent.slice(0, 80),
          userEmail: currentUser.email || 'anônimo',
          db: dbData
        };
        await setDoc(userRef, payload, { merge: true });
        window.FirebaseCloud.status = 'sincronizado';
        window.FirebaseCloud.erro = null;
        emitStatus();
        return true;
      } catch (err) {
        console.error('Erro ao salvar no Firestore:', err);
        window.FirebaseCloud.status = 'erro';
        window.FirebaseCloud.erro = err.message;
        emitStatus();
        return false;
      }
    },

    async puxarDaNuvem() {
      if (!currentUser) return null;
      const userRef = doc(db, 'users', currentUser.uid);
      try {
        const snap = await getDoc(userRef);
        if (snap.exists()) {
          const data = snap.data();
          return data.db || null;
        }
        return null;
      } catch (err) {
        console.error('Erro ao ler Firestore:', err);
        return null;
      }
    },

    agendarSalvar(dbData) {
      if (!currentUser) return;
      if (isReceivingRemoteUpdate) return;
      clearTimeout(saveTimer);
      window.FirebaseCloud.status = 'sincronizando';
      emitStatus();
      saveTimer = setTimeout(() => {
        window.FirebaseCloud.salvarNaNuvem(dbData);
      }, 1000);
    }
  };

  function emitStatus() {
    document.dispatchEvent(new CustomEvent('fin:firebase_status', {
      detail: {
        status: window.FirebaseCloud.status,
        user: window.FirebaseCloud.user,
        erro: window.FirebaseCloud.erro
      }
    }));
  }

  // Ouvir mudanças de autenticação
  onAuthStateChanged(auth, async (u) => {
    currentUser = u;
    window.FirebaseCloud.user = u;
    if (unsubscribeDoc) {
      unsubscribeDoc();
      unsubscribeDoc = null;
    }

    if (u) {
      window.FirebaseCloud.status = 'sincronizando';
      emitStatus();
      const userRef = doc(db, 'users', u.uid);

      // Ouvir atualizações em tempo real do documento na nuvem
      unsubscribeDoc = onSnapshot(userRef, (docSnap) => {
        if (docSnap.exists()) {
          const cloudData = docSnap.data();
          if (cloudData && cloudData.db && window.Store) {
            const localMod = window.Store.db?.meta?.modificadoEm || '';
            const cloudMod = cloudData.atualizadoEm || cloudData.db?.meta?.modificadoEm || '';
            
            // Se a nuvem tem versão mais nova ou a base local ainda não existe
            if (!window.Store.db || cloudMod >= localMod) {
              isReceivingRemoteUpdate = true;
              window.Store.adotar(cloudData.db, 'nuvem');
              if (window.App && typeof window.App.render === 'function') {
                window.App.render();
              }
              setTimeout(() => { isReceivingRemoteUpdate = false; }, 500);
            }
          }
          window.FirebaseCloud.status = 'sincronizado';
          window.FirebaseCloud.erro = null;
          emitStatus();
        } else {
          // Documento novo na nuvem: envia base local inicial se existir
          if (window.Store && window.Store.db) {
            window.FirebaseCloud.salvarNaNuvem(window.Store.db);
          } else {
            window.FirebaseCloud.status = 'sincronizado';
            emitStatus();
          }
        }
      }, (err) => {
        console.error('Erro no snapshot do Firestore:', err);
        window.FirebaseCloud.status = 'erro';
        window.FirebaseCloud.erro = err.message;
        emitStatus();
      });
    } else {
      window.FirebaseCloud.status = 'deslogado';
      emitStatus();
    }
  });

  // Checar redirect de login
  try {
    await getRedirectResult(auth);
  } catch (e) {
    console.warn('Erro getRedirectResult', e);
  }
})();
