/* ============================================================================
   biometria.js — autenticação biométrica via WebAuthn / Passkeys
   Suporte a Face ID, Touch ID, Impressão Digital (Android / iOS / Mac / Windows)
   ========================================================================== */
(function (global) {
  'use strict';

  var BIO_KEY = 'fin.biometria.v1';
  var BIO_AUTOPROMPT_KEY = 'fin.bio.autoprompt.v1';

  function b64e(buf) {
    var b = new Uint8Array(buf), s = '';
    for (var i = 0; i < b.length; i++) s += String.fromCharCode(b[i]);
    return btoa(s);
  }

  function b64d(str) {
    var s = atob(str), b = new Uint8Array(s.length);
    for (var i = 0; i < s.length; i++) b[i] = s.charCodeAt(i);
    return b;
  }

  /** Chave de proteção local do cofre biométrico */
  var SAL_BIO = new Uint8Array([
    0x3a, 0x7c, 0x91, 0x4f, 0xb2, 0x18, 0x6e, 0xd0,
    0x55, 0xa3, 0x27, 0x88, 0xc1, 0x9e, 0x44, 0x0f
  ]);

  function derivarChaveCofreBio(credIdB64) {
    var baseMaterial = 'fin-bio-vault::' + credIdB64 + '::' + (global.location ? global.location.hostname : 'app');
    return crypto.subtle.importKey('raw', new TextEncoder().encode(baseMaterial), 'PBKDF2', false, ['deriveKey'])
      .then(function (base) {
        return crypto.subtle.deriveKey(
          { name: 'PBKDF2', salt: SAL_BIO, iterations: 120000, hash: 'SHA-256' },
          base, { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt']);
      });
  }

  var Biometria = {
    /** Verifica se o navegador e o aparelho suportam biometria nativa */
    suportada: function () {
      return !!(
        global.window &&
        global.window.PublicKeyCredential &&
        typeof global.window.PublicKeyCredential === 'function' &&
        global.navigator &&
        global.navigator.credentials &&
        global.isSecureContext !== false
      );
    },

    /** Verifica se o hardware biométrico (Touch ID / Face ID / Digital) está disponível */
    verificarDisponibilidade: function () {
      if (!this.suportada()) return Promise.resolve(false);
      if (typeof PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable !== 'function') {
        return Promise.resolve(true);
      }
      return PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()
        .catch(function () { return false; });
    },

    /** Retorna se há biometria cadastrada neste navegador/aparelho */
    estaAtiva: function () {
      try {
        var d = JSON.parse(localStorage.getItem(BIO_KEY) || 'null');
        return !!(d && d.credId && d.pacote);
      } catch (e) {
        return false;
      }
    },

    /** Configuração de solicitação automática ao abrir */
    temAutoPrompt: function () {
      return localStorage.getItem(BIO_AUTOPROMPT_KEY) !== 'false';
    },

    setAutoPrompt: function (ativo) {
      localStorage.setItem(BIO_AUTOPROMPT_KEY, ativo ? 'true' : 'false');
    },

    /** Cadastra a biometria do usuário no aparelho e guarda a senha mestre cifrada */
    cadastrar: function (senhaMestre, emailUsuario) {
      var self = this;
      if (!this.suportada()) {
        return Promise.reject(new Error('Autenticação biométrica não suportada neste navegador.'));
      }
      if (!senhaMestre || typeof senhaMestre !== 'string') {
        return Promise.reject(new Error('Informe a senha mestre para vincular à biometria.'));
      }

      var email = emailUsuario || 'acasendey@gmail.com';
      var challenge = crypto.getRandomValues(new Uint8Array(32));
      var userId = new TextEncoder().encode('casendey-' + Date.now());
      var hostname = global.location.hostname || 'localhost';

      var opcoesCriacao = {
        publicKey: {
          challenge: challenge,
          rp: {
            name: 'Financeiro Servidor MG',
            id: (hostname === 'localhost' || hostname === '127.0.0.1') ? undefined : hostname
          },
          user: {
            id: userId,
            name: email,
            displayName: 'Aristides Casendey'
          },
          pubKeyCredParams: [
            { type: 'public-key', alg: -7 },   // ES256 (padrão iOS / Android / Mac)
            { type: 'public-key', alg: -257 }, // RS256 (Windows Hello)
            { type: 'public-key', alg: -8 }    // Ed25519
          ],
          authenticatorSelection: {
            authenticatorAttachment: 'platform', // Touch ID / Face ID / Leitor de Digital
            userVerification: 'required',
            residentKey: 'preferred'
          },
          timeout: 60000,
          attestation: 'none'
        }
      };

      return navigator.credentials.create(opcoesCriacao)
        .then(function (cred) {
          if (!cred || !cred.rawId) {
            throw new Error('Cadastro biométrico cancelado ou recusado.');
          }

          var credIdB64 = b64e(cred.rawId);

          // Cifra a senha mestre associando à credencial biométrica
          return derivarChaveCofreBio(credIdB64).then(function (chaveCofre) {
            var iv = crypto.getRandomValues(new Uint8Array(12));
            var dados = new TextEncoder().encode(JSON.stringify({
              senha: senhaMestre,
              criadoEm: new Date().toISOString(),
              dispositivo: navigator.userAgent || 'Aparelho'
            }));

            return crypto.subtle.encrypt({ name: 'AES-GCM', iv: iv }, chaveCofre, dados)
              .then(function (cifrado) {
                var payload = {
                  versao: 1,
                  credId: credIdB64,
                  pacote: {
                    iv: b64e(iv),
                    ct: b64e(cifrado)
                  },
                  criadoEm: new Date().toISOString()
                };
                localStorage.setItem(BIO_KEY, JSON.stringify(payload));
                return { ok: true, credId: credIdB64 };
              });
          });
        });
    },

    /** Solicita biometria e recupera a senha mestre para desbloqueio */
    autenticar: function () {
      var self = this;
      if (!this.estaAtiva()) {
        return Promise.reject(new Error('Nenhuma biometria cadastrada neste aparelho.'));
      }

      var bioData;
      try {
        bioData = JSON.parse(localStorage.getItem(BIO_KEY));
      } catch (e) {
        return Promise.reject(new Error('Registro biométrico corrompido.'));
      }

      var challenge = crypto.getRandomValues(new Uint8Array(32));
      var hostname = global.location.hostname || 'localhost';
      var rawCredId = b64d(bioData.credId);

      var opcoesGet = {
        publicKey: {
          challenge: challenge,
          rpId: (hostname === 'localhost' || hostname === '127.0.0.1') ? undefined : hostname,
          allowCredentials: [{
            id: rawCredId,
            type: 'public-key'
          }],
          userVerification: 'required',
          timeout: 60000
        }
      };

      return navigator.credentials.get(opcoesGet)
        .then(function (assertion) {
          if (!assertion) {
            throw new Error('Autenticação biométrica cancelada.');
          }

          return derivarChaveCofreBio(bioData.credId).then(function (chaveCofre) {
            var iv = b64d(bioData.pacote.iv);
            var ct = b64d(bioData.pacote.ct);
            return crypto.subtle.decrypt({ name: 'AES-GCM', iv: iv }, chaveCofre, ct)
              .then(function (buf) {
                var json = JSON.parse(new TextDecoder().decode(buf));
                return json.senha;
              })
              .catch(function () {
                throw new Error('Falha ao decifrar chave biométrica local.');
              });
          });
        });
    },

    /** Remove a biometria cadastrada neste aparelho */
    desativar: function () {
      localStorage.removeItem(BIO_KEY);
      return Promise.resolve(true);
    }
  };

  global.Biometria = Biometria;
})(window);
