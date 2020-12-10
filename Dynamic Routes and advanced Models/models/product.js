const products=[];

const fs=require('fs')
const path=require('path')
const uuid=require('uuid')
const Cart=require('./cart')

const getProductsFromFile=(cb)=>{
    const productPath = path.join(
        path.dirname(require.main.filename),
        'data',
        'products.json'
      );
      fs.readFile(productPath, (err, fileContent) => {
        if (err) {
          cb([],productPath);
        }else{
          cb(JSON.parse(fileContent),productPath);
        }
      });
}

module.exports=class Product {
    constructor(id,title,imageUrl,description,price){
        this.id=id;
        this.title=title;
        this.imageUrl=imageUrl;
        this.description=description;
        this.price=price;
    }
    save(cb){
      getProductsFromFile((products,productPath)=>{
        if(this.id){
          const existingProductIndex=products.findIndex(product=>product.id==this.id)
          products[existingProductIndex]=this
        }else{
          this.id=uuid.v4()
          products.push(this) //as we use arrow function, this refers to the class instance
        }
        fs.writeFile(productPath,JSON.stringify(products),(err)=>{
          console.log(err)
          cb()
        })
      })
        // products.push(this);
    }
    static fetchAll(cb) {
        getProductsFromFile(cb)
      }
    static findById(id,cb){
      getProductsFromFile(products=>{
        const product= products.find(p=> p.id==id )
        cb(product)
      })
    }
    static delete(id,cb){
      const updatedProducts=[];
      getProductsFromFile((products,productPath)=>{
        // let updatedProducts = products.filter(prod=>prod.id!=id) does the same
        let productDeleted
        products.forEach(product=>{
          if(product.id!=id){
            updatedProducts.push(product);
          }else{
            productDeleted=product
          }
        })
        Cart.deleteProduct(id,productDeleted.price,()=>{
          fs.writeFile(productPath,JSON.stringify(updatedProducts),(err)=>{
            console.log(err)
            cb(productDeleted)
          })
        })
      })
    }
    static fetchAllFromCart(cb){
      Cart.fetchAllProducts(cart=>{
        if(cart){
          getProductsFromFile(allProducts=>{
            let productsInCartToDisplay=[]
            cart.products.forEach(productInCart=>{
              let productToDisplay= allProducts.find(p=> p.id==productInCart.id )
              if(productToDisplay){
                productToDisplay.qty=productInCart.qty
                productsInCartToDisplay.push(productToDisplay)
              }
            })
            return cb(productsInCartToDisplay,cart.totalPrice)
          })
        }else{
          cb()
        }
      })
    }
    // static updateProduct(updatedProduct){
    //   getProductsFromFile((products,productPath)=>{
    //     let updateProductIndex=products.findIndex(productSearch=>updatedProduct.id==productSearch.id)
    //     if(updateProductIndex!=-1){
    //       products[updateProductIndex]=updatedProduct //update product in object
    //     fs.writeFile(productPath,JSON.stringify(products),(err)=>{ //write new product object in file
    //       console.log(err)
    //       return err
    //     })
    //       return ""
    //     }else{
    //       return 'Product not found'
    //     }
    //   })
    // }
}