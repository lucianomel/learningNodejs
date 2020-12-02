const products=[];

const fs=require('fs')
const path=require('path')

const getProductsFromFile=(cb)=>{
    const myPath = path.join(
        path.dirname(process.mainModule.filename),
        'data',
        'products.json'
      );
      fs.readFile(myPath, (err, fileContent) => {
        if (err) {
          cb([]);
        }else{
          cb(JSON.parse(fileContent),myPath);
        }
      });
}

module.exports=class Product {
    constructor(t){
        this.title=t;
    }
    save(){
        getProductsFromFile((products,myPath)=>{
            products.push(this) //as we use arrow function, this refers to the class instance
            fs.writeFile(myPath,JSON.stringify(products),(err)=>{
                console.log(err)
            })
        })
        // products.push(this);
    }
    static fetchAll(cb) {
        getProductsFromFile(cb)
      }
}