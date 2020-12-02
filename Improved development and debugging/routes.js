// const { format } = require("path");
// const { title } = require("process");

const reqHandler =(req,res)=>{
    const url=req.url;
    const method=req.method;
    
    if(url==="/"){
        res.setHeader("Content-type","text/html");
        res.write("<html><head><title>The assignment</title></head><body><h1>Hey there! This is my assignment</h1>");
        res.write('<form method="POST" action="/create-user"><input type="text" name="msg"></input><button type="submit">Submit</button></form>');
        res.write("</body></html>");
        return res.end();
    } 
    
    if(url=="/user"){
        res.setHeader("Content-type","text/html");
        res.write("<html><head><title>The lists</title></head><body><ul><li>User 1</li><li>User 2</li></ul></body></html>");
        return res.end();
    }
    if(url=="/create-user"&&method=="POST"){
        const body=[];
        req.on('data',(chunk)=>{
            console.log(chunk);
            body.push(chunk);
        });
        return req.on("end",()=>{
            const parsedBody=Buffer.concat(body).toString();
            const msg=parsedBody.   split('=')[1];
            console.log(msg);
            res.statusCode=302;

            res.setHeader('Location','/user');
            return res.end();
        })
    }
}
module.exports=reqHandler;