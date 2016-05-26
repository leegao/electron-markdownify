// Handling file saving through IPCRenderer
function saveAs() {
  storage.get('markdown-savefile', function(error, data) {
    options = {};
    if ('filename' in data) {
      options.defaultPath = data.filename;
    }
    dialog.showSaveDialog(options, function (fileName) {
      if (fileName === undefined){
          console.log("You didn't save the file");
          return;
      }

      storage.set('markdown-savefile', {'filename' : fileName}, function(error) { if (error) alert(error); });

      var mdValue = cm.getValue();
      // fileName is a string that contains the path and filename created in the save file dialog.
      fs.writeFile(fileName, mdValue, function (err) {
         if(err){
             alert("An error ocurred creating the file "+ err.message)
         }
         alert("The file has been succesfully saved", "Markdownify");
      });
    });
  });
}

ipc.on('file-new', function() {
  storage.set('markdown-savefile', {}, function(error) { if (error) alert(error); });
  cm.getDoc().setValue("");
});

ipc.on('file-save', function() {
  storage.get('markdown-savefile', function(error, data) {
    if (error) {
      saveAs();
      return;
    }
    if ('filename' in data) {
      var fileName = data.filename;
      if (fileName === undefined){
          console.log("You didn't save the file");
          return;
      }

      storage.set('markdown-savefile', {'filename' : fileName}, function(error) { if (error) alert(error); });

      var mdValue = cm.getValue();
      // fileName is a string that contains the path and filename created in the save file dialog.
      fs.writeFile(fileName, mdValue, function (err) {
         if(err){
             alert("An error ocurred creating the file "+ err.message)
         }
      });
    } else {
      saveAs();
    }
  });
});

ipc.on('file-save-as', saveAs);

// Handling file opening through IPCRenderer
ipc.on('file-open', function() {
  storage.get('markdown-savefile', function(error, data) {
    if (error) alert(error);

    var options = {'properties' : ['openFile']};
    if ('filename' in data) {
      options.defaultPath = data.filename;
    }

    dialog.showOpenDialog(options, function (fileName) {
      if (fileName === undefined){
          console.log("You didn't open the file");
          return;
      }

      storage.set('markdown-savefile', {'filename' : fileName[0]}, function(error) { if (error) alert(error); });

      var mdValue = cm.getValue();
      // fileName is a string that contains the path and filename created in the save file dialog.
      fs.readFile(fileName[0], 'utf-8', function (err, data) {
         if(err){
             alert("An error ocurred while opening the file "+ err.message)
         }
         cm.getDoc().setValue(data);
      });
    });
  });
});
