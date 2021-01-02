exports.get404=(req,res,next)=>{
    // res.status(404).send('<h1>Page not found</h1>');
    // res.status(404).sendFile(path.join(__dirname,'views','error-page.html'))
    res.status(404).render("404",{pageTitle:"Error page",path:'/error'})
}