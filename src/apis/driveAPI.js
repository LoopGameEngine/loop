// /apis/driverAPI.js
/* global gapi */

export async function folderExists(folderName) {
  try {
    const response = await gapi.client.drive.files.list({
      q: `name='${folderName}' and trashed=false`,
      fields: 'files(id)',
    });
    if (response.result.files && response.result.files.length > 0) {
      return response.result.files[0].id;
    } else {
      return undefined;
    }
  } catch (error) {
    console.error('Error checking folder existence:', error.message);
    throw error;
  }
}

export async function createFolder(folderName, parent) {
  try {
    const requestBody = {
      name: folderName,
      mimeType: 'application/vnd.google-apps.folder',
      parents: [parent],
    };
    const response = await gapi.client.drive.files.create({
      resource: requestBody,
      fields: 'id',
    });
    const createdFolderId = response.result.id;
    if (!createdFolderId) {
      throw new Error('Failed to create folder: No ID returned');
    }
    if (folderName === "Public") {
      const permissionsRequestBody = {
        role: 'reader',
        type: 'anyone',
      };
      await gapi.client.drive.permissions.create({
        fileId: createdFolderId,
        resource: permissionsRequestBody,
      });
    }
    return createdFolderId;
  } catch (error) {
    console.error(`Error creating folder '${folderName}' with parent '${parent}':`, error.message || error);
    throw new Error(`Error creating folder '${folderName}': ${error.message || error}`);
  }
}

export async function listDriveGames(folderID) {
  if (!folderID) return [];
  const files = [];
  try {
    const response = await gapi.client.drive.files.list({
      q: `"${folderID}" in parents`,
      fields: 'files(id, name)',
    });
    const gameFiles = response.result.files;
    if (gameFiles && gameFiles.length > 0) {
      const imageAndPermissionPromises = gameFiles.map(async (file) => {
        try {
          // Obtener la URL de la imagen
          file.imageUrl = await getImageDownloadUrl(file.id);

          // Obtener permisos del archivo
          const permissionsResponse = await gapi.client.drive.permissions.list({
            fileId: file.id,
            fields: 'permissions(id, type, role)'
          });
          file.isShared = permissionsResponse.result.permissions.some(perm => perm.type === 'anyone' && perm.role === 'reader');
        } catch (imageError) {
          console.error(`Error obtaining data for file ${file.id}: ${imageError}`);
          file.imageUrl = ''; // Proporcionar una URL de imagen predeterminada o dejar vacío
          file.isShared = false; // Asumir no compartido si hay un error
        }
      });
      await Promise.all(imageAndPermissionPromises);
      files.push(...gameFiles);
    }
    return files;
  } catch (error) {
    console.error('Error listing Google Drive games:', error.message || error);
    throw error;
  }
}


export async function createGame(appFolderID) {
  try {
    const newDirectoryId = await createFolder("Untitled Game", appFolderID);
    await Promise.all([
      createFolder("images", newDirectoryId),
      createFolder("sounds", newDirectoryId),
      createEmptyJson(newDirectoryId),
      createEmptyImage(newDirectoryId)
    ]);
    return { id: newDirectoryId, name: "Untitled Game", imageUrl: "" };
  } catch (error) {
    console.error("Failed to create game:", error);
    throw error;
  }
}

export async function duplicateGame(handleShowFile, folderID, originalGameID, gameName) {
  try {
    const newGameName = `${gameName} - Copy`;
    const newGameID = await createFolder(newGameName, folderID);
    await Promise.all([
      await copyFile(originalGameID, newGameID, 'game.json', newGameName),
      await copyFile(originalGameID, newGameID, 'image.jpg'),
      duplicateSubdirectory(handleShowFile, originalGameID, newGameID, 'images'),
      duplicateSubdirectory(handleShowFile, originalGameID, newGameID, 'sounds'),
    ]);
    return { id: newGameID, name: newGameName };  // Devuelve el ID y nombre del nuevo juego
  } catch (error) {
    console.error(`Failed to duplicate game '${originalGameID}':`, error);
    throw error;
  }
}

// export async function copySharedGame(handleShowFile, folderID, originalGameID, gameName) {
//   try {
//     const newGameName = `${gameName} Game - Copy`;
//     const newGameID = await createFolder(newGameName, folderID);
//     await Promise.all([
//       await copyFile(originalGameID, newGameID, 'game.json', newGameName),
//       await copyFile(originalGameID, newGameID, 'image.jpg'),
//       duplicateSubdirectory(handleShowFile, originalGameID, newGameID, 'images'),
//       duplicateSubdirectory(handleShowFile, originalGameID, newGameID, 'sounds'),
//     ]);
//     return { id: newGameID, name: newGameName };  // Devuelve el ID y nombre del nuevo juego
//   }
//   catch (error) {
//     console.error(`Failed to duplicate game '${originalGameID}':`, error);
//     throw error;
//   }
// }

export async function deleteGame(gameID) {
  try {
    await gapi.client.drive.files.delete({
      'fileId': gameID
    });
  } catch (error) {
    console.error('Error deleting game:', error.message);
  }
}

export async function shareGame(gameID) {
  try {
    const permission = {
      resource: {
        'type': 'anyone',
        'role': 'reader',
      },
      fileId: gameID
    };
    await gapi.client.drive.permissions.create(permission);
    console.log("Juego compartido:", gameID);
  } catch (error) {
    console.error("Error al compartir el juego:", error);
    throw error;
  }
}

export async function unshareGame(gameID) {
  try {
    const response = await gapi.client.drive.permissions.list({
      fileId: gameID,
    });

    const permissions = response.result.permissions;
    const permissionToRemove = permissions.find(permission => permission.role === 'reader' && permission.type === 'anyone');

    if (!permissionToRemove) {
      console.warn("El juego no está compartido:", gameID);
      return;
    }

    await gapi.client.drive.permissions.delete({
      fileId: gameID,
      permissionId: permissionToRemove.id,
    });

    console.log("Juego dejado de compartir:", gameID);
  } catch (error) {
    console.error("Error al dejar de compartir el juego:", error);
    throw error;
  }
}

async function getImageDownloadUrl(gameFolderID) {
  try {
    const listResponse = await gapi.client.drive.files.list({
      'q': `name='image.jpg' and '${gameFolderID}' in parents`,
      'fields': 'files(id)',
    });
    const imageFiles = listResponse.result.files;
    if (!imageFiles || imageFiles.length === 0) {
      throw new Error('No se encontró el archivo de imagen en el directorio del juego.');
    }
    const imageFileId = imageFiles[0].id;
    const getResponse = await gapi.client.drive.files.get({
      'fileId': imageFileId,
      'alt': 'media',
    });
    const type = "image/jpeg";
    const blob = new Blob([new Uint8Array(getResponse.body.length).map((_, i) => getResponse.body.charCodeAt(i))], { type });
    const objectUrl = URL.createObjectURL(blob);
    return objectUrl;
  } catch (error) {
    console.error('Error obteniendo la URL de descarga de la imagen:', error.message);
    throw error;
  }
}

async function changeNameInJson(fileId, newName) {
  try {
    const res = await gapi.client.drive.files.get({
      fileId: fileId,
      alt: 'media'
    });
    let gameJsonContent;
    if (res.body) gameJsonContent = JSON.parse(res.body);
    else throw new Error('game.json content could not be retrieved.');
    gameJsonContent.name = newName; // Asume que 'name' es la propiedad a cambiar.
    const updatedJsonString = JSON.stringify(gameJsonContent);
    await gapi.client.request({
      path: `/upload/drive/v3/files/${fileId}`,
      method: 'PATCH',
      params: { uploadType: 'media' },
      headers: { 'Content-Type': 'application/json' },
      body: updatedJsonString
    });
  } catch (error) {
    console.error('Error updating game.json:', error.message);
    throw error;
  }
}

async function createEmptyJson(gameID) {
  try {
    const response = await gapi.client.drive.files.create({
      resource: {
        name: 'game.json',
        mimeType: 'application/json',
        parents: [gameID],
      },
      fields: 'id',
    });
    const fileId = response.result.id;
    await gapi.client.request({
      path: `/upload/drive/v3/files/${fileId}`,
      method: 'PATCH',
      params: {
        uploadType: 'media',
      },
      body: JSON.stringify({ name: 'Untitled Game' }),
    });
    return fileId;
  } catch (error) {
    console.error('Failed to create JSON file:', error.message || error);
    throw error;
  }
}

async function createEmptyImage(gameID) {
  try {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    const context = canvas.getContext('2d');
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, 1, 1);

    const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg'));

    const base64Data = await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result.split(',')[1]);
      reader.readAsDataURL(blob);
    });
    const boundary = '-------314159265358979323846';
    const multipartRequestBody =
      `--${boundary}\r\n` +
      `Content-Type: application/json; charset=UTF-8\r\n\r\n` +
      JSON.stringify({ name: 'image.jpg', parents: [gameID], mimeType: 'image/jpeg' }) +
      `\r\n--${boundary}\r\n` +
      `Content-Type: image/jpeg\r\n` +
      `Content-Transfer-Encoding: base64\r\n\r\n` +
      base64Data +
      `\r\n--${boundary}--`;
    const response = await gapi.client.request({
      path: '/upload/drive/v3/files',
      method: 'POST',
      params: { uploadType: 'multipart' },
      headers: {
        'Content-Type': `multipart/related; boundary="${boundary}"`,
      },
      body: multipartRequestBody,
    });
    if (response.result.id) {
      return response.result.id;
    } else {
      throw new Error('Failed to create image file: No ID returned.');
    }
  } catch (error) {
    console.error('Failed to create image file:', error.message || error);
    throw error;
  }
}

async function duplicateSubdirectory(handleShowFile, originalGameID, newGameID, subdirectoryName) {
  try {
    const newSubdirectoryId = await createFolder(subdirectoryName, newGameID);
    const dirResponse = await gapi.client.drive.files.list({
      q: `name='${subdirectoryName}' and '${originalGameID}' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false`,
      fields: 'files(id)',
    });
    if (dirResponse.result.files.length === 0) {
      console.error(`Subdirectory '${subdirectoryName}' not found.`);
      return;
    }
    const subdirectoryId = dirResponse.result.files[0].id;
    const filesResponse = await gapi.client.drive.files.list({
      q: `'${subdirectoryId}' in parents and trashed=false`,
      fields: 'files(id, name)',
    });
    const totalFiles = filesResponse.result.files.length;
    let fileNumber = 0;
    for (const file of filesResponse.result.files) {
      await gapi.client.drive.files.copy({
        fileId: file.id,
        parents: [newSubdirectoryId],
      });
      fileNumber++;
      handleShowFile(`copying ${subdirectoryName} (${fileNumber}/${totalFiles})`);
    }
  } catch (error) {
    console.error(`Error duplicando el subdirectorio '${subdirectoryName}':`, error);
    throw error;
  }
}

async function copyFile(originalGameID, newGameID, fileName, gameName) {
  try {
    const searchResponse = await gapi.client.drive.files.list({
      q: `name='${fileName}' and '${originalGameID}' in parents and trashed=false`,
      fields: 'files(id, name)',
      spaces: 'drive',
    });
    const fileId = searchResponse.result.files[0].id;
    const copyResponse = await gapi.client.drive.files.copy({
      fileId: fileId,
      parents: [newGameID],
    });
    if (fileName === 'game.json') {
      await changeNameInJson(copyResponse.result.id, `${gameName}`);
    }
  } catch (error) {
    console.error(`Error copying file '${fileName}':`, error);
    throw error;
  }
}
