class File {
    static uploadQueue = [];
    static processingQueue = [];
    static uploading = false;
    static processing = false;
    static folderIdCache = {};

    loadJson(gameId, callback) {
        gapi.client.drive.files.list({
            'q': `"${gameId}" in parents and name="game.json" and trashed=false`
        }).then(function (res) {
            if (res.result.files && res.result.files.length > 0) {
                gapi.client.drive.files.get({
                    fileId: res.result.files[0].id,
                    alt: 'media'
                }).then(function (res) {
                    var json;
                    try {
                        json = JSON.parse(res.body || "{}");
                    } catch (e) {
                        console.error("Error parsing game.json:", e);
                        callback({}); 
                        return;
                    }
                    callback(json);
                }).catch(function (error) {
                    console.error("Error fetching game.json file:", error);
                });
            } else {
                console.error("game.json file not found in the specified folder.");
                callback({}); 
            }
        }).catch(function (error) {
            console.error("Error listing files:", error);
            callback({}); 
        });
    }

    loadImages(gameId, loader, callback) {
        loader.init = true;
        loader.onLoad.add((loader, resource) => {
            console.log("Loaded :", resource.name);
            if (!loader.init) Command.addAssetCmd(resource.name, "Image");
        });
        var counter = 0;
        gapi.client.drive.files.list({ // find the images folder in the game folder
            'q': `"${gameId}" in parents and name="images" and mimeType = "application/vnd.google-apps.folder"`
        }).then(function (res) {
            if (res.result.files.length === 0) {
                console.error("No images folder found");
                callback(loader);
                return;
            }
            gapi.client.drive.files.list({ // list the images in the image folder
                'q': `"${res.result.files[0].id}" in parents`,
            }).then(function (response) {
                if (response.result.files.length === 0) {
                    console.log("No images found in the images folder");
                    callback(loader);
                    return;
                }
                Object.entries(response.result.files).forEach(([key, value]) => { // key is the image name and value.id their id in google drive
                    gapi.client.drive.files.get({
                        fileId: value.id,
                        alt: 'media'
                    }).then(function (res) {
                        var type = res.headers["Content-Type"];
                        var blob = new Blob([new Uint8Array(res.body.length).map((_, i) => res.body.charCodeAt(i))]);
                        const objectUrl = URL.createObjectURL(blob, type);
                        const texture = PIXI.Texture.from(objectUrl);
                        loader.add(value.name, objectUrl);
                        loader.resources[value.name] = { "texture": texture, "fileId": value.id };
                        counter++;
                        if (counter === response.result.files.length) {
                            loader.onComplete.once(() => { callback() });
                            loader.load();
                        }
                    })
                })
            })
        })
    }

    loadSounds(gameId, playList, callback) {
        var counter = 0;
        gapi.client.drive.files.list({ // find the sound folder in the game folder
            'q': `"${gameId}" in parents and name="sounds" and mimeType = "application/vnd.google-apps.folder"`
        }).then(function (res) {
            if (res.result.files.length === 0) {
                console.error("No sounds folder found");
                callback(playList);
                return;
            }
            gapi.client.drive.files.list({ // list the sounds in the image folder
                'q': `"${res.result.files[0].id}" in parents`,
            }).then(function (response) {
                if (response.result.files.length === 0) {
                    console.log("No sounds found in the sounds folder");
                    callback(playList);
                    return;
                }
                Object.entries(response.result.files).forEach(([key, value]) => {
                    gapi.client.drive.files.get({
                        fileId: value.id,
                        alt: 'media'
                    }).then(function (res) {
                        var type = res.headers["Content-Type"];
                        var blob = new Blob([new Uint8Array(res.body.length).map((_, i) => res.body.charCodeAt(i))]);
                        var objectUrl = URL.createObjectURL(blob, type);
                        playList[value.name] = {
                            fileId: value.id,
                            howl: new Howl({
                                src: [objectUrl],
                                format: type.split("/")[1],
                                onload: function () {
                                    counter++;
                                    console.log("Loaded : " + value.name);
                                    if (counter == response.result.files.length) { callback(playList) }
                                }
                            })
                        }
                    });
                });
            })
        })
    }

    static save(gameID, gameName, json) {
        return new Promise((resolve, reject) => {
            gapi.client.drive.files.list({
                'q': `parents in "${gameID}" and name="game.json"`
            }).then(function (response) {
                if (response.result.files.length > 0) {
                    var fileId = response.result.files[0].id;
                    gapi.client.request({
                        path: `/drive/v3/files/${gameID}`,
                        method: 'PATCH',
                        body: { name: gameName }
                    }).then(() => {
                        gapi.client.request({
                            path: `/upload/drive/v3/files/${fileId}`,
                            method: 'PATCH',
                            body: json
                        }).then(() => {
                            Command.takeScreenshot();
                            resolve(); 
                        }).catch(reject); 
                    }).catch(reject); 
                } else {
                    reject(new Error("No se encontró el archivo game.json"));
                }
            }, function (error) {
                reject(error); 
            });
        });
    }

    static async delete(assetID, fileName, type) {
        let fileId;
        try {
            if (type == "Image" || type == "Animation") {
                app.loader.resources[fileName].texture.destroy(true);
                fileId = app.loader.resources[fileName]?.fileId;
                delete app.loader.resources[fileName];
            }
            else if (type == "Sound") {
                fileId = app.playList[fileName].fileId;
                delete app.playList[fileName];
            }
            await gapi.client.drive.files.delete({
                fileId: fileId
            });
            Command.removeAssetCmd(assetID, type);
        } catch (error) {
            console.error("Error durante la operación de borrado:", error);
        }
    }

    static uploadScreenShoot(gameId, blob) {
        gapi.client.drive.files.list({
            'q': `parents in "${gameId}" and name="image.jpg"`
        }).then(function (response) {
            if (response.result.files.length > 0) {
                var fileId = response.result.files[0].id;
                var metadata = {
                    "name": "image.jpg",
                    'mimeType': 'image/jpg',
                    'parents': gameId
                };
                var boundary = '-------314159265358979323846';
                var delimiter = "\r\n--" + boundary + "\r\n";
                var close_delim = "\r\n--" + boundary + "--";

                var reader = new FileReader();
                reader.readAsBinaryString(blob);
                reader.onload = function () {
                    var contentType = blob.type;
                    var base64Data = btoa(reader.result);
                    var multipartRequestBody =
                        delimiter + 'Content-Type: application/json\r\n\r\n' + JSON.stringify(metadata) +
                        delimiter + 'Content-Type: ' + contentType + '\r\n' + 'Content-Transfer-Encoding: base64\r\n' +
                        '\r\n' + base64Data + close_delim;

                    gapi.client.request({
                        'path': '/upload/drive/v3/files/' + fileId,
                        'method': 'PATCH',
                        'params': { 'uploadType': 'multipart' },
                        'headers': { 'Content-Type': 'multipart/related; boundary="' + boundary + '"' },
                        'body': multipartRequestBody
                    }).then(function (response) {// console.log("Screenshoot updated");
                    });
                }
            }
        });
    }

    static async upload(gameId, file, type) {
        File.uploadQueue.push({ gameId, file, type });
        if (File.uploading) return;

        File.uploading = true;
        while (File.uploadQueue.length > 0) {
            const { gameId, file, type } = File.uploadQueue.shift();
            try {
                const cacheKey = `${gameId}-${type}`;
                let folderId = File.folderIdCache[cacheKey];
                const folder = type === "Image" || type === "Animation" ? "images" : type === "Sound" ? "sounds" : "";

                if (!folderId) {
                    const response = await gapi.client.drive.files.list({
                        'q': `parents in "${gameId}" and name="${folder}"`,
                        'fields': 'files(id, name)'
                    });

                    if (response.result.files.length > 0) {
                        folderId = response.result.files[0].id;
                        File.folderIdCache[cacheKey] = folderId;
                    } else {
                        throw new Error(`No ${type.toLowerCase()} folder found in the specified 'gameId'.`);
                    }
                }

                const metadata = {
                    'name': file.name,
                    'parents': [folderId]
                };
                const boundary = '-------314159265358979323846';
                const delimiter = "\r\n--" + boundary + "\r\n";
                const close_delim = "\r\n--" + boundary + "--";

                const readerResult = await new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = () => resolve(reader.result);
                    reader.onerror = error => reject(error);
                    reader.readAsBinaryString(file);
                });

                const contentType = file.type || 'application/octet-stream';
                const base64Data = btoa(readerResult);
                const multipartRequestBody = delimiter +
                    'Content-Type: application/json\r\n\r\n' + JSON.stringify(metadata) +
                    delimiter + 'Content-Type: ' + contentType + '\r\n' + 'Content-Transfer-Encoding: base64\r\n' +
                    '\r\n' + base64Data + close_delim;

                const uploadResponse = await gapi.client.request({
                    'path': '/upload/drive/v3/files',
                    'method': 'POST',
                    'params': { 'uploadType': 'multipart' },
                    'headers': { 'Content-Type': `multipart/related; boundary="${boundary}"` },
                    'body': multipartRequestBody
                });

                File.processingQueue.push({ type, fileName: file.name, fileId: uploadResponse.result.id, contentType });
                if (!File.processing) File.download();

            } catch (error) {
                console.error(`Error during ${type.toLowerCase()} file upload for ${file.name}:`, error);
            }
        }
        File.uploading = false;
    }

    static async download() {
        if (File.processing || File.processingQueue.length === 0) return;

        File.processing = true;
        while (File.processingQueue.length > 0) {
            const { type, fileName, fileId, contentType } = File.processingQueue.shift();
            try {
                const fileResponse = await gapi.client.drive.files.get({
                    'fileId': fileId,
                    'alt': 'media'
                });
                const blob = new Blob([new Uint8Array(fileResponse.body.length).map((_, i) => fileResponse.body.charCodeAt(i))], { type: contentType });
                const objectUrl = URL.createObjectURL(blob);
                function tryToAddResource() {
                    if (app.loader.loading) {
                        setTimeout(tryToAddResource, 10);
                    } else {
                        if (type == "Image" || type == "Animation") {
                            const texture = PIXI.Texture.from(objectUrl);
                            app.loader.add(fileName, objectUrl);
                            app.loader.resources[fileName] = { "texture": texture, "fileId": fileId };
                            app.loader.init = false;
                            app.loader.load();
                        } else if (type == "Sound") {
                            app.playList[fileName] = {
                                fileId: fileId,
                                howl: new Howl({
                                    src: [objectUrl],
                                    format: contentType.split("/")[1],
                                    onload: function () {
                                        console.log("Loaded : " + fileName);
                                        Command.addAssetCmd(fileName, "Sound");
                                    }
                                })
                            }
                        }
                    }
                }
                tryToAddResource();
            } catch (error) {
                console.error("Error processing file download and assignment:", error);
            }
        }
        File.processing = false;
    }
}

