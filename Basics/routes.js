const fs=require('fs');

const requestHandler = (req,res)=>{
    const url= req.url;
    const method= req.method;

    if(url==="/"){
        res.setHeader("Content-Type","text/html")
        res.write("<html>")
        res.write("<head><title>MyFirstPage</title></head>")
        res.write('<body><form action="/message" method="POST"><input type="text" name="mesg"><button type="submit">Send</button></form><body>')
        res.write("</html>")
        return res.end();
    }
    if(url==="/message"&&method==='POST'){
        // Redirect user to / and create new file with user input
        const body=[];
        req.on('data',(chunk)=>{
            console.log(chunk);
            body.push(chunk);
        });
        return req.on('end',()=>{
            const parsedBody=Buffer.concat(body).toString();
            const message=parsedBody.split("=")[1]
            fs.writeFile('message.txt',message,()=>{
                res.statusCode=302;
                res.setHeader('Location','/');
                return res.end();
            });
    
        })
    }
    res.setHeader('Content-Type', 'text/html');
    res.write('<html>');
    res.write('<head><title>My First Page</title><head>');
    res.write('<body><h1>Hello from my Node.js Server!</h1></body>');
    res.write('</html>');
    res.end();
}

// module.exports =requestHandler;
// module.exports={
//     handler:requestHandler,
//     someText:"Some ahrd coded text"
// }

exports.handler=requestHandler;