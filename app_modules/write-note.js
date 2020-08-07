const fs = require('fs');
const path = require('path');

module.exports = function(qdata, response){
    //console.log(qdata.note_topic)
    let Topic = qdata.note_topic
    let Title = qdata.note_title
    let Body = qdata.note_body

    let topicPath = path.join(__dirname, '../directories', Topic)
    if (! fs.existsSync(topicPath)) {
        fs.mkdirSync(topicPath)
    }

    let userpath = path.join(__dirname, '../directories', Topic, `${Title}.txt`)
    let responseMessage;

    fs.writeFile(userpath, Body, function(err){        
        if(err){
            console.log(err)
            responseMessage = {
                'status': 'failed',
                'message': `Couldn't write note. Please try again. Refresh page if problem persists.`
            }

            return 
        }
        
        console.log("note saved!");
        responseMessage = {
            'status': 'success',
            'message': `Note saved successfully`
        }
        
    })

    setTimeout(() => {
        response.writeHead(200, {'Content-Type': 'application/json'})
        response.end(JSON.stringify(responseMessage))    
    }, 1500);
}
