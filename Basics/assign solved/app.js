const http= require("http")

// createServer takes a function that will be executed on every incoming request.
const server= http.createServer((req,res)=>{
    const url=req.url
    const method=req.method
    if(url=="/"){
        res.setHeader("Content-type","text/html")
        res.write('<html><head><title>Assignment 1</title></head><body><form action="/create-user" method="POST"><input type="text" name="username"></input><button type="submit">Submit</button></form></body></html>')
        return res.end()
    }
    if(url=="/users"){
        res.setHeader("Content-type","text/html")
        res.write('<html><head><title>Assignment 1</title></head><body><ul><li>User 1</li><li>User 2</li></ul></body></html>')
        return res.end()
    }
    if(url=="/create-user"&&method=="POST"){
        const body=[]
        req.on('data',(chunk)=>{
            body.push(chunk)
        })
        req.on('end',()=>{
            const parsedBody=Buffer.concat(body).toString();
            console.log(parsedBody.split("=")[1])
        })
        res.statusCode=302
        res.setHeader("Location","/")
        return res.end()
    }
    // Send html response with page not found
    res.setHeader("Content-type","text/html")
    res.write('<html><head><title>Page not Found</title></head><body><h1>Page not found</h1></body></html>')
    res.end()
})

server.listen(3000);