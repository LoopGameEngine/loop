var CLIENT_ID = '129246923501-4lk4rkmhin21kcaoul91k300s9ar9n1t.apps.googleusercontent.com';
var API_KEY = 'AIzaSyCfXON-94Onk-fLyihh8buKZcFIjynGRTc';
var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"];
var SCOPES = 'https://www.googleapis.com/auth/drive ';
var tokenClient;
var gapiInited = false;
var gisInited = false;
var openWindows = {};
var appFolderName = "Loop Games";
var appFolderID;
var signinButton = document.getElementsByClassName('signin')[0];
var signoutButton = document.getElementsByClassName('signout')[0];
var newgameButton = document.getElementsByClassName('newgame')[0];
var listcontainer = document.querySelector('.list ul');
var expandContainer = document.querySelector('.expand-container');
var expandContainerUl = document.querySelector('.expand-container ul');

function gapiLoad() {
  gapi.load('client', gapiInit);
}

function gapiInit() {
  gapi.client.init({
    apiKey: API_KEY,
    discoveryDocs: DISCOVERY_DOCS
  }).then(function () {
    gapiInited = true;
    maybeEnableButtons();
  });
}

function gisInit() {
  tokenClient = google.accounts.oauth2.initTokenClient({
    client_id: CLIENT_ID,
    scope: SCOPES
  });
  gisInited = true;
  maybeEnableButtons();
}

function maybeEnableButtons() {
  if (gapiInited && gisInited) signinButton.style.display = 'block';
}

function signOut() {
  google.accounts.id.disableAutoSelect();
  listcontainer.innerHTML = '';
  signinButton.style.display = 'block'
  signoutButton.style.display = newgameButton.style.display = 'none';
}

function signIn() {
  tokenClient.callback = (token) => {
    if (token.error !== undefined) { throw (token); }
    localStorage.setItem("token", JSON.stringify(token));
    signinButton.style.display = 'none';
    signoutButton.style.display = newgameButton.style.display = 'block';
    checkDriveFolder(appFolderName).then(function (folderId) {
      appFolderID = folderId;
      listDriveGames(appFolderID);
    }).catch(function (error) {
      console.error(error);
    });
  };
  tokenClient.requestAccessToken();
}

function checkDriveFolder(appFolderName) {
  return new Promise(function (resolve, reject) {
    gapi.client.drive.files.list({
      q: "name ='" + appFolderName + "' and trashed=false",
    }).then(function (response) {
      var files = response.result.files;
      if (files && files.length > 0) {
        resolve(files[0].id);
      } else {
        createFolder(appFolderName, 'root').then(function (folderId) {
          resolve(folderId);
        }).catch(function (error) {
          reject(new Error('Failed to create folder: ' + error.message));
        });
      }
    }).catch(function (error) {
      reject(new Error('Failed to list files: ' + error.message));
    });
  });
}

function listDriveGames(appFolderID) {
  if (appFolderID)
    gapi.client.drive.files.list({
      'q': `parents in "${appFolderID}"` // list user games
    }).then(function (response) {
      var files = response.result.files;
      if (files && files.length > 0) {
        listcontainer.innerHTML = '';
        for (var i = files.length - 1; i >= 0; i--) {
          listcontainer.innerHTML += `
                <li data-id="${files[i].id}" data-name="${files[i].name}" >
                    <span  onclick=editGame(this.parentNode)>${files[i].name}</span>
                    <svg onclick="expand(this.parentNode)" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M24 24H0V0h24v24z" fill="none" opacity=".87"/><path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6-1.41-1.41z"/></svg>
                </li>`;
        }
      }
    })
}

function newGame() {
  var gameID; // Variable local para almacenar gameID
  createFolder("Untitled Game", appFolderID).then(function (folderId) {
    gameID = folderId; // Asignar el valor de folderId a gameID
    createEmptyJson(gameID);
    var imageUrl = "/white.jpg";
    return uploadImage(gameID, imageUrl);
  }).then(function (imageFileId) {
    return createFolder("images", gameID);
  }).then(function () {
    return createFolder("sounds", gameID);
  }).then(function () {
    listDriveGames(appFolderID);
  }).catch(function (error) {
    console.error("Failed to create game:", error);
  });
}

function editGame(gameHTML) {
  var game = { appFolderID: appFolderID, id: "", name: "" };
  if (gameHTML) game = { appFolderID: appFolderID, id: gameHTML.getAttribute('data-id'), name: gameHTML.getAttribute('data-name') }
  localStorage.setItem("game"+game.id, JSON.stringify(game));
  var url = "editor/?id=" + game.id;
  if (openWindows[url] && !openWindows[url].closed) openWindows[url].focus();
  else openWindows[url] = window.open(url, "_blank");
  expandContainer.style.display = 'none';
  expandContainerUl.setAttribute('data-id', '');
  expandContainerUl.setAttribute('data-name', '');
}

function playGame(gameHTML) {
  var game = { appFolderID: appFolderID, id: "", name: "" };
  if (gameHTML) game = { appFolderID: appFolderID, id: gameHTML.getAttribute('data-id'), name: gameHTML.getAttribute('data-name') }
  localStorage.setItem("game", JSON.stringify(game));
  var url = "engine/?id=" + game.id;
  if (openWindows[url] && !openWindows[url].closed) openWindows[url].focus();
  else openWindows[url] = window.open(url, "_blank");
  expandContainer.style.display = 'none';
  expandContainerUl.setAttribute('data-id', '');
  expandContainerUl.setAttribute('data-name', '');
}

function createFolder(folderName, parent) {
  return new Promise(function (resolve, reject) {
    var request = gapi.client.request({
      path: '/drive/v3/files',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem("token")).access_token,
      },
      body: {
        'name': folderName,
        'mimeType': 'application/vnd.google-apps.folder',
        'parents': [parent]
      }
    });
    request.execute(function (response) {
      if (response.error) {
        reject(new Error('Failed to create folder: ' + response.error.message));
      } else if (response.id) {
        resolve(response.id);
      } else {
        reject(new Error('Failed to create folder.'));
      }
    });
  });
}

function createEmptyJson(gameID) {
  return new Promise(function (resolve, reject) {
    var request = gapi.client.request({
      path: '/drive/v3/files',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem("token")).access_token,
      },
      body: {
        'name': 'game.json',
        'mimeType': 'application/json',
        'parents': [gameID]
      }
    });

    request.execute(function (response) {
      if (response.error) {
        reject(new Error('Failed to create JSON file: ' + response.error.message));
      } else if (response.id) {
        resolve(response.id);
      } else {
        reject(new Error('Failed to create JSON file.'));
      }
    });
  });
}


function uploadImage(gameID, imageUrl) {
  return new Promise(function (resolve, reject) {
    var accessToken = JSON.parse(localStorage.getItem('token')).access_token;

    var metadata = {
      'name': 'image.jpg',
      'parents': [gameID]
    };

    fetch(imageUrl)
      .then(function (response) {
        return response.blob();
      })
      .then(function (fileData) {
        var reader = new FileReader();
        reader.readAsDataURL(fileData);

        reader.onload = function (e) {
          var requestData = reader.result.split(',')[1];
          var boundary = '-------314159265358979323846';
          var delimiter = '\r\n--' + boundary + '\r\n';
          var close_delim = '\r\n--' + boundary + '--';

          var multipartRequestBody =
            delimiter +
            'Content-Type: application/json\r\n\r\n' +
            JSON.stringify(metadata) +
            delimiter +
            'Content-Type: image/jpeg\r\n' +
            'Content-Transfer-Encoding: base64\r\n' +
            '\r\n' +
            requestData +
            close_delim;

          gapi.client.request({
            path: '/upload/drive/v3/files',
            method: 'POST',
            params: {
              'uploadType': 'multipart'
            },
            headers: {
              'Content-Type': 'multipart/related; boundary="' + boundary + '"',
              'Authorization': 'Bearer ' + accessToken
            },
            body: multipartRequestBody
          }).then(function (response) {
            var fileId = response.result.id;
            resolve(fileId);
          }).catch(function (error) {
            reject(new Error('Failed to upload image: ' + error.result.error.message));
          });
        };

        reader.onerror = function (e) {
          reject(new Error('Failed to read image data.'));
        };
      })
      .catch(function (error) {
        reject(new Error('Failed to fetch image: ' + error));
      });
  });
}

function expand(v) {
  var click_position = v.children[1].getBoundingClientRect();
  if (expandContainer.style.display == 'block') {
    expandContainer.style.display = 'none';
    expandContainerUl.setAttribute('data-id', '');
    expandContainerUl.setAttribute('data-name', '');
  } else {
    expandContainer.style.display = 'block';
    expandContainer.style.left = (click_position.left + window.scrollX) - 120 + 'px';
    expandContainer.style.top = (click_position.top + window.scrollY) + 25 + 'px';
    // get data name & id and store it to the options
    expandContainerUl.setAttribute('data-id', v.getAttribute('data-id'));
    expandContainerUl.setAttribute('data-name', v.getAttribute('data-name'));
  }
}

function deleteGame(v) {
  var gameId = v.getAttribute('data-id');
  var element = document.querySelector('[data-id="' + gameId + '"]');
  console.log(element);
  var request = gapi.client.drive.files.delete({
    'fileId': gameId
  });
  request.execute(function (res) {
    console.log('File Deleted');
    expandContainer.style.display = 'none';
    expandContainerUl.setAttribute('data-id', '');
    expandContainerUl.setAttribute('data-name', '');
    listDriveGames(appFolderID);
  })
}