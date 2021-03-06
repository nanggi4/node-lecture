/*
* Library for storing and editing data
*/

const fs = require('fs');
const path = require('path');

let lib = {};

lib.baseDir = path.join(__dirname, '/../.data/');

// Create
lib.create = (dir, file, data, callback) => {
  fs.open(lib.baseDir+dir+'/'+file+'.json','wx',(err, fileDescriptor) => {
    if(!err && fileDescriptor) {
      const stringData = JSON.stringify(data);
      fs.writeFile(fileDescriptor, stringData, (err) => {
        if(!err){
          fs.close(fileDescriptor, (err) => {
            if(!err) {
              callback(false);
            } else {
              callback('Error closing new file');              
            }
          })
        } else {
          callback('Error writing to new file');
        }
      });
    } else {
      callback('Could not create new file, it may already exist');
    }
  });
};

// Read
lib.read = (dir, file, callback) => {
  fs.readFile(lib.baseDir+dir+'/'+file+'.json','utf8',(err, data) => {
    callback(err, data);
  });
};

// Update
lib.update = (dir, file, data, callback) => {
  fs.open(lib.baseDir+dir+'/'+file+'.json','r+',(err, fileDescriptor) => {
    if(!err && fileDescriptor){
      const stringData = JSON.stringify(data);
      fs.ftruncate(fileDescriptor, (err) => {
        if(!err){
          fs.writeFile(fileDescriptor,stringData,(err) => {
            if(!err){
              fs.close(fileDescriptor, (err) => {
                if(!err) {
                  callback(false);
                } else {
                  callback('Error closing file');
                }
              });
            } else {
              callback('Error writing to existing file');
            }
          });
        } else {
          callback('Error truncating file');
        }
      })
    } else {
      callback('Could not open the file for updating, it may not exist yet');
    }
  });
};

// Delete
lib.delete = (dir, file, callback) => {
  fs.unlink(lib.baseDir+dir+'/'+file+'.json', (err) => {
    if(!err) {
      callback(false);
    } else {
      callback('Error deleting file');
    }
  });
};

module.exports = lib;