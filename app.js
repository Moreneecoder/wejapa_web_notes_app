const http = require('http');
const nStatic = require('node-static');
const fs = require('fs');
const path = require('path');
const url = require('url')
const routeRenderer = require('./public/routes.js')
const writeNote = require('./app_modules/write-note.js')
const TopicOptions = require('./app_modules/fetch-options.js');

let fileServer = new nStatic.Server('./public');

let cssFiles = new nStatic.Server('./css');

const server = http.createServer((req, res) => {
        
    //check if x-requested-with is XMLHttpRequest
    if(req.headers['x-requested-with'] === 'XMLHttpRequest'){
                                         
        var q = url.parse(req.url, true)
        var qdata = q.query;
        
        if(q.pathname === '/write'){            
            writeNote(qdata, res)            
        }

        if(q.pathname === '/fetch_options'){
            TopicOptions._fetch()            

            setTimeout(() => {
                let options = TopicOptions.allTopics;
                TopicOptions.allTopics = [];                
                res.writeHead(200, {'Content-Type': 'application/json'})
                res.end(JSON.stringify(options))
            }, 1500);
            
        }

        if(q.pathname === '/get_note_by_topic'){            
            TopicOptions._load_notes(qdata, res)
            
        }

        if(q.pathname === '/read_note'){
            TopicOptions._read_notes(qdata, res)
            
        }

        if(q.pathname === '/update_note'){
            TopicOptions._update_note(qdata, res)
            
        }

        if(q.pathname === '/delete_note'){
            TopicOptions._delete_note(qdata, res)
            
        }
                

    }else{        
        if(req.method === 'GET'){            
            processHtml(req, res)
        }            
    }
    
        
})

server.listen(3000, (error) => {
    if(error){
        console.log('Something went wrong');
    }
    else{
        console.log('Listening on port 3000')
    }
    
})


function processHtml(request, response){

    let route = routeRenderer.route(request.url)
    
    if(routeRenderer.urlPaths.includes(request.url)){        
        
        fs.readFile(`./public/${route}`, 'UTF-8', function(err, html){            
            //response.setHeader('_method', request.method)
            response.writeHead(200, {"Content-Type": "text/html"})      
            //response.write(html)            
            response.end(html)    
                        
        })
        
    }    
    else if(request.url.match(`\.css$`)){
        let cssPath = path.join(__dirname, request.url)
        const filestream = fs.createReadStream(cssPath, 'UTF-8');
        response.writeHead(200, {'Content-Type': 'text/css'})
        filestream.pipe(response);
    }
    else if(request.url.match(`\.js$`)){
        let jsPath = path.join(__dirname, request.url)
        const filestream = fs.createReadStream(jsPath, 'UTF-8');
        response.writeHead(200, {'Content-Type': 'text/javascript'})
        filestream.pipe(response);
    }    

    /*routeRenderer.imageExtensions.forEach(extension => {
        if(extension === )
    })*/
    

    //console.log(request.url)

}