const path = require('path')
const fs = require('fs')

module.exports = {
    allTopics : [],

    _fetch(){
        const fs = require('fs');
        const path = require('path');
    
        const directory = path.join(__dirname, '../directories');    
        
        let _this = this;

        fs.readdir(directory, function(err, files){
            if (err) {
                return console.log(err);
            
            }        
    
            files.forEach(file => {
                const innerDirectory = path.join(__dirname, '../directories', file);            
                fs.stat(innerDirectory, function (err, stats) {
                    if(err){
                        console.log(err);
                    }                    
    
                    if(stats.isDirectory()){                        
                        _this.allTopics.push(file)                        
                    }
    
                })  
                            
            })
                    
        })
        
    },

    _load_notes(data, response){  
        console.log(data.topic)   
                   
        const topicPath = path.join(__dirname, '../directories', data.topic);
        console.log(topicPath)

        let Files;

        fs.readdir(topicPath, function(err, files){
            if (err) {
                return console.log(err);
            
            }
            
            Files = files;                         
                    
        })   
        
        setTimeout(() => {
            response.writeHead(200, {'Content-Type': 'application/json'})
            response.end(JSON.stringify(Files))    
        }, 1500);
        
    },

    _read_notes(qdata, response){
        //console.log(qdata)
        let Note;

        const directory = path.join(__dirname, '../directories', qdata.note_topic, qdata.note_body);

        fs.readFile(directory, 'UTF-8', function(err, data){
            if(err) throw err

            Note = data;
            console.log(data)

        })

        setTimeout(() => {
            response.writeHead(200, {'Content-Type': 'text/plain'})
            response.end(JSON.stringify(Note))    
        }, 1500);
        
    },

    _update_note(qdata, response){

        let Topic = qdata.topic
        let Title = qdata.title
        let Body = qdata.body

        let responseMessage;

        let notePath = path.join(__dirname, '../directories', Topic, `${Title}.txt`)

        fs.writeFile(notePath, Body, function(err){        
            if(err){
                console.log(err)
                responseMessage = {
                    'status': 'failed',
                    'message': 'Error occured: Note unable to update, please try again. If error persist, kindly refresh page'
                }
            }
            else{
                console.log("note saved!");
                responseMessage = {
                    'status': 'success',
                    'message': 'Note updated successfully'
                }

            }
        })

        setTimeout(() => {
            response.writeHead(200, {'Content-Type': 'application/json'})
            response.end(JSON.stringify(responseMessage))    
        }, 1500);
    },

    _delete_note(qdata, response){
        const directory = path.join(__dirname, '../directories', qdata.note_topic, qdata.note_body);
        const topicPath = path.join(__dirname, '../directories', qdata.note_topic);

        let responseMessage;

        fs.unlink(directory, (err) => {
            if (err) {
              console.error(err)              
              return
            }

            responseMessage = {
                'status': 'message-deleted',
                'message': 'Note deleted successfully'
            }

            fs.readdir(topicPath, function(err, files) {
                if (err) {
                   console.log(err);
                   return
                }

                if (! files.length) {
                    // directory appears to be empty
                    fs.rmdir(topicPath, function(err) {
                        if (err) {
                            
                          throw err
                        } else {
                          console.log("Successfully removed the empty directory!")
                          responseMessage = {
                              'status': 'topic-deleted',
                              'message': 'Note and Topic deleted successfully'
                          }
                        }
                    })
                }
                
            });
          
            
        })

        setTimeout(() => {
            response.writeHead(200, {'Content-Type': 'application/json'})
            response.end(JSON.stringify(responseMessage))    
        }, 1500);
    }
    

}