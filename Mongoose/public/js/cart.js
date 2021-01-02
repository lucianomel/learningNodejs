const inputQtys=document.querySelectorAll('#qty')
const tableQtys=document.querySelectorAll('.table__qty')
const subtotals=document.querySelectorAll(".subtotal")
const productPrice=document.querySelectorAll('.product__price')
const totalPrice=document.querySelectorAll('.totalPrice')
const checkoutForm=document.querySelector('.checkout__form')
const productsIds=document.querySelectorAll('.prodIdNoDisplay')

// const replaceValues=(tQElem,cb)=>{
//     cb(tQElem.id.replace("__table__qty",""),tQElem)
// }

const updateTable=(inputQtys,tableQtys)=>{
    const products=[]
    inputQtys.forEach(input_qty=>{
        products.push({qty:input_qty.value})
    })
    for(let i=0;i<tableQtys.length;i++){
        tableQtys[i].innerHTML=products[i].qty
        let sbt=Math.round(productPrice[i].innerHTML.match(/[\d,]+(\.\d+)?/g, '')*products[i].qty*100)/100
        subtotals[i].innerHTML=sbt
    }
    let sumPrices=0
    for (let i = 0; i < subtotals.length; i++) {     
        sumPrices+=parseFloat(subtotals[i].innerHTML)
    }
    sumPrices=Math.round(sumPrices*100)/100
    totalPrice.forEach(tp=>{
        tp.innerHTML=sumPrices
    })
}
checkoutForm.addEventListener('submit',(event)=>{
    // event.preventDefault()
    const totalPrc=parseFloat(totalPrice[0].innerHTML.match(/[\d,]+(\.\d+)?/g, ''))
    const checkout={products:[],totalPrice:totalPrc}
    for (let i = 0; i < subtotals.length; i++) {
        checkout.products.push({id:productsIds[i].innerText,qty: tableQtys[i].innerHTML})
    }
    event.target[0].value=JSON.stringify(checkout)
    // console.log(event.target[0].value)
})
inputQtys.forEach(qty => {
    qty.addEventListener('change',(ev)=>{
        updateTable(inputQtys,tableQtys)
    })
});