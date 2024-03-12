// import crypto from 'crypto';

const domain = 'aerobi.us.auth0.com';
const clientId = 'uIf7NB5q3NkryxLMj3CEce6CvZ11sLbm'

function base64URLEncode (str) {
    return str.toString('base64')
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=/g, '');
}
  
function make_random_string(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
 }

async function sha256(message) {
    // // encode as UTF-8
    // const msgBuffer = new TextEncoder().encode(message);                    

    // // hash the message
    // const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);

    // // convert ArrayBuffer to Array
    // const hashArray = Array.from(new Uint8Array(hashBuffer));

    // // convert bytes to hex string                  
    // const hashHex = hashArray.map(b => ('00' + b.toString(16)).slice(-2)).join('');
    // return hashHex;
    const encoder = new TextEncoder();
    const data = encoder.encode(message);
    let digestBuffer = await window.crypto.subtle.digest('SHA-256', data);
    return digestBuffer;
}

async function generateCodeChallenge(codeVerifier) {
    const encoder = new TextEncoder();
    const data = encoder.encode(codeVerifier);
    const digest = await window.crypto.subtle.digest("SHA-256", data);
    const base64Digest = window.btoa(digest);
    // you can extract this replacing code to a function
    return base64Digest
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=/g, "");
}

async function generateRandomChallengePair () {
    // secret = crypto.getRandomValues(new Uint8Array(128));
    // secret = base64URLEncode(secret);
    // hashed = await sha256(secret);
    // hashed = base64URLEncode(hashed);

    let secret = make_random_string(128);
    let code_challenge = await generateCodeChallenge(secret);
    return [secret, secret];
}

async function getAuthResult (url, interactive) {
    return new Promise((resolve, reject) => {
        chrome.identity.launchWebAuthFlow({url, interactive}, (callbackURL) => {
          if (chrome.runtime.lastError) {
            return reject(new Error(chrome.runtime.lastError.message))
          }
          resolve(callbackURL);
        });
      });
  }

function getRedirectURL() {
    return chrome.identity.getRedirectURL('auth0');
}

async function exchangeCodeForToken (code, verifier) {
    const body = JSON.stringify({
      redirect_uri: getRedirectURL(),
      grant_type: 'authorization_code',
      code_verifier: verifier,
      client_id: clientId,
      code: code
    });
    const result = await fetch(`https://${domain}/oauth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body
    });

    if(result.ok) {
        return result.json();
    }
    throw Error(result.statusText);
  }

function extractCode (resultUrl) {
var url = new URL(resultUrl);
var code = url.searchParams.get('code');
if (!code ) {
    var error = url.searchParams.get('error');
    var error_description = url.searchParams.get('error_description');
    throw new Error(error_description || error);
}
else
    return code;
}

async function authenticate (options = {}, interactive = true) {
    const code_pair = await generateRandomChallengePair();
    let secret = code_pair[0];
    let codeChallenge = code_pair[1];

    Object.assign(options, {
        client_id: clientId,
        code_challenge: codeChallenge,
        redirect_uri: getRedirectURL(),
        code_challenge_method: 'plain',
        response_type: 'code',
        connection: 'google-oauth2',
        prompt: 'login'

    });

    let searchParams = new URLSearchParams(options).toString();
    const url = `https://${domain}/authorize?${searchParams}`;
    const resultUrl = await getAuthResult(url, interactive).catch(e => { throw e});
    const code = extractCode(resultUrl);

    return exchangeCodeForToken(code, secret);
}

function isValidAuthenticationRequest(request) {
    if (request.type == "SignIn") {
        return true;
    }
    else {
        return false;
    }
}

function authenticationRequestHandler(request, sender, sendResponse) {
    if (request.type == "SignIn") {
        let options = {
            scope: 'openid profile email',
            device: 'chrome-extension'
        };
    
        authenticate(options).then(function (authResult) {
            let authResultDecoded = KJUR.jws.JWS.readSafeJSONString(b64utoutf8(authResult.id_token.split(".")[1]));
            let setSignInInfoRequest = {};
            setSignInInfoRequest.type = 'SetSigninPersonInfo';
            setSignInInfoRequest.firstname = authResultDecoded.given_name;
            setSignInInfoRequest.lastname = authResultDecoded.family_name;
            setSignInInfoRequest.email = authResultDecoded.email;
    
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
                chrome.tabs.sendMessage(tabs[0].id, setSignInInfoRequest, function(response) {
                    sendResponse({
                        success: response.success, 
                        firstname: setSignInInfoRequest.firstname, 
                        lastname: setSignInInfoRequest.lastname, 
                        email: setSignInInfoRequest.email
                    });  
                });
            });
        }).catch(e => { sendResponse({success: false, error: e.toString()}); });;
        return true;
    }
    else {
        throw new Error("AuthenticationRequestHandler - Incorrect message request");
    }
}

