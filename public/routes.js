module.exports = {

    urlPaths : ['/', '/write'],

    imageExtensions : ['gif', 'jpeg', 'jpg', 'png'],

    route(url){

        let htmlFile;
    
        switch (url) {
            case '/':
                htmlFile = 'index.html'
                break;
        
            default:
                htmlFile = 'notFound.html'
                //console.log('not found')
                break;
        }
    
        return htmlFile;
    
    }

}