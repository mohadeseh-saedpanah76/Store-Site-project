const bar = document.getElementById('bar');
const close = document.getElementById('close');
const navbar = document.getElementById('navbar');
const MainImg = document.querySelector('#MainImg')
const smallimg = document.querySelectorAll('.small-img')
const productDom = document.querySelector('.pro-container')





if(bar) {
    bar.addEventListener('click' , () =>{
        navbar.classList.add('active')
    })
}

if(close) {
    close.addEventListener('click' , () =>{
        navbar.classList.remove('active')
    })
}

smallimg.forEach(item =>item.addEventListener('click' ,() =>{
    MainImg.src = item.src
}))

let cart = []

class Product {
    async getProducts() {
        try {
            const result = await fetch('/products.json')
            const data = await result.json()

            let products = data.items

            products = products.map((item)=>{
                const {brand ,title , price} = item.fields
                const {id} = item.sys
                const image = item.fields.image.fields.file.url

                return {brand , title , price , id , image}
            })

        return products
        
        } catch (err) {
            console.log(err)
        }
    }
}

class View {
    displayProduct(products) {
        let result =''
        products.forEach((item)=>{
            result +=`
            <div class="pro">
                <img src=${item.image} alt=${item.title}>
                <div class="des">
                    <span>${item.brand}</span>
                    <h5>${item.title}</h5>
                    <div class="star">
                        <i class="fa-solid fa-star"></i>
                        <i class="fa-solid fa-star"></i>
                        <i class="fa-solid fa-star"></i>
                        <i class="fa-solid fa-star"></i>
                        <i class="fa-solid fa-star"></i>
                    </div>
                    <h4>${item.price}</h4>
                </div>
                <a href="#" class="cart bag-btn" data-id=${item.id}><i class="fa fa-cart-shopping" ></i></a>
            </div>
            `
        })
        productDom.innerHTML = result

    }
    
    getCartButton() {
        const button = [...document.querySelectorAll('.bag-btn')]
        button.forEach((item)=>{
            let id = item.dataset.id 
            item.addEventListener('click' ,(e)=>{
            let cartItem = {...Storage.getProduct(id) , amount : 1}

            cart = [...cart , cartItem]
            Storage.saveCart(cart)

            this.setCartValue(cart)

            //ورودی این تابع اون مقدار جدیده که به سبد خرید اضافه میشه
            this.addCartItem(cartItem)
            //با زدن دکمه سایدبار ساخته میشه
            this.showCart()
            })
        })

    }
}
class Storage {
    static saveProduct(products) {
      localStorage.setItem('products', JSON.stringify(products))
    }

    static getProduct(id) {
      let products = JSON.parse(localStorage.getItem('products'))
  
      return products.find((item) => item.id === id)
    }
  
    static saveCart(cart) {
      localStorage.setItem('cart', JSON.stringify(cart))
    }
  
    static getCart() {
      return localStorage.getItem('cart')
        ? JSON.parse(localStorage.getItem('cart'))
        : []
    }
  }
document.addEventListener('DOMContentLoaded', () => {
    const view = new View()
    const product = new Product()
  
    // view.initApp()
  
    product.getProducts()
      .then((data) => {
        view.displayProduct(data)
        Storage.saveProduct(data)
      })
      .then(() => {
        view.getCartButton()
        view.cartProces()
      })
  })
  