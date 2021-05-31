'use strict';

// File Upload
const uploadFile = (fileName, file, emulator) => {
      // Browser FileReader API
       const reader = new FileReader();
       reader.onload = function() {
        var output = reader.result;
        var buffer = new Uint8Array(output.length);
        buffer.set(output.split("").map(function (chr) { return chr.charCodeAt(0); }));
        emulator.create_file(fileName, buffer, function (error) {
            if (error) throw error;
        });
       };
       reader.readAsBinaryString(file);
 }
 

// File Download
const readFile = (inputFile, emulator) => {
  emulator.read_file(inputFile, function (error, uint8array) {
    if (error) {
      alert('File not found! Verify path and filename.')
      return;
    }
    if (uint8array) {
        var fileName = inputFile.replace(/\/$/, "").split("/");
        fileName = fileName[fileName.length - 1];
        console.log('uint ' + fileName);
        downloadFile(fileName, uint8array);
        document.querySelector('#vm_downpath').value = '';
    }
});
// Browser anchor download
function downloadFile(fileName, content) {
  console.log('downfilename' + fileName);
  console.log('content' + content);
  var a = document.createElement("a");
  a.download = fileName;
  a.href = window.URL.createObjectURL(new Blob([content]));
  a.dataset.downloadurl = "application/octet-stream:" + a.download + ":" + a.href;
  a.click();
}

};


// Welcome files placement in filesystem
// function welcome(emulator) {
//   const readme = `Welcome to Digital Twin! You can access mounted files /mnt using upload and download options. This Digital Twin is a compilation of Embedded Linux system, SPRECON specific process, Filer filesystem, and I/O.`;
//   emulator.create_file('/README.txt', readme, (err) => {
//     if(err) console.error(err);   
//   });
// };

module.exports = {
  uploadFile,
  readFile
  //welcome
};
