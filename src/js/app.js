const bar = document.getElementById('bar');
const close = document.getElementById('close');
const navbar = document.getElementById('navbar');
const MainImg = document.querySelector('#MainImg')
const smallimg = document.querySelectorAll('.small-img')

const productDom = document.querySelector('.pro-container')
const newproductDom = document.querySelector('.pro-container-1')
const cartItems = document.querySelector('.cart-items')
const cartTotal = document.querySelector('.cart-total')
const cartContent = document.querySelector('.cart-content')
const cartDom = document.querySelector('.cart')
const cartOverlay =document.querySelector('.cart-overlay')
const proDetails = document.querySelector('.details-product')
const closeCart = document.querySelector('.close-cart')
const cartShopping = document.querySelector('.cart-shopping')
const removeItem = document.querySelector('.remove-item')
const removeCart = document.querySelector('#clear-cart')
const blogDom = document.querySelector('.home-blog-container')


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

// یک سبد خرید با مقدار اولیه ی خالی
let cart = []

// apiیک کلاس تعریف میکنیم تا اطلاعات محصولات از فایل جیسون گرفته بشه مثل یک درخواست
class Product {
   async getProduct(){
       try {
        const result  = await fetch('/products.json')
     //    مقدار ریزالت باید اکسترکت بشه
        const data =await result.json()

        let products = data.items

        // اطالاعات داخل ایتمس رو دونه دونه خارج میکنیم تا بعدا بشه روی اونا پردازش کرد
        products = products.map((item)=>{
         const {brand , title , price} = item.fields
         const {id} = item.sys
         const image = item.fields.image.fields.file.url
         return {brand , title , price , id , image}
        })
        
        return products

       } catch (error) {
            console.log(error)
       }
 
    }

    async getBlog(){
    try {
        const result = await fetch('/products.json')
        const data =  await result.json()
        let blogs = data.items2
    
        blogs = blogs.map((item)=>{
        const {date , title , description} = item.fields
        const {id} = item.sys
        const image = item.fields.image.fields.file.url
    
        return {date , title , description , id , image}
      })
    
        return blogs
    } catch (error) {
        console.log(error)
    }

   }
}

// با استفاده از کلاس ویو اطلاعات  گرفته شده در کلاس پروداکت در دام نمایش داده میشه
class View {
    displayProducts(products){
        let result = ''
        products.forEach((item)=>{
            result+=`
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
            <button  data-id=${item.id} class="bag-btn"><a href="#" class="cart-shopping"><i class="fa fa-cart-shopping" ></i></a></button>
        </div>
            `
        })

        productDom.innerHTML = result
    }

    displayblogs(blogs){
        let result = ''

        blogs.forEach((item)=>{
            result+=`
            <div class="home-blog-box">
            <div class="home-blog-img">
                <img src=${item.image} alt=${item.title}" id="img-blog">
            </div>
            <div class="home-blog-details">
                <h4>${item.title}</h4>
                <p>${item.description}</p>
                <a href="#">CONTINUE READING</a>
            </div>
            <h1>${item.date}</h1>
        </div>
            `
        })

        blogDom.innerHTML = result
    }
    
     // تابعی تعریف میکنیم برای  گرفتن دکمه ی افزودن به سبد خرید
    // یا دکمه های افزودن به سبد خرید رو سلکت میکنه
    getCartButtons(){
        const buttons = [...document.querySelectorAll('.bag-btn')]
        
        buttons.forEach((item)=>{
            //   میگه ایدی اون محصولی که دکمه ی افزودن به سبد خرید و براش زدیم کدومهitem.dataset.id این عبارت 
            // ایدی همان ایدی محصولی است که روی اون کلیک شده

            //   ایدی هر محصول رو میریزه توی متغیر ایدیitem.dataset.id بطور کلی
            let id = item.dataset.id

            item.addEventListener('click' , (e)=>{
            e.preventDefault()
            // حالا میگه روی هر دکمه ای که کلیک کردی تابع گت پروداکت اجرا میشه
            // و براساس ایدی اون محصول کلیک شده مشخصات محصول رو برای ما از لوکال استورج میاره
            let cartItem = {...Storage.getProduct(id), amount:1}
            // وقتی در توسط استورج اطالاعات محصول اورده میشه میخاهیم به اون اطالاعات یک مقدار جدید برای هر محصول اضافه بشه
            // چون مشخصات هرمحصول در ابجکته از اسپرید استفاده میکنیم و مقدار جدید رو مینویسیم
            
            //  حالا مقدار کارت ایتم که شامل مشخصات همون محصولیه ک روش کلیک شده
            // اضافه میشه به ارایه ی محصولات قبلی
            // ینی اگه قبلا روی محصولاتی کلیک کردیم تا به سبد خرید اضافه بشه
            // محصول جدید هم باید به قبلیا اضافه بشه
            // پس دراینجا سبد خرید جدید ایجاد میشه
            cart = [...cart , cartItem]
            Storage.saveCart(cart)

            this.setcartValues(cart)
            this.addCartItem(cartItem)
            this.showCart()
            this.closeCart()
            })
        })

    }

    // این متد برای محاسبه تعداد محصولات سبد خرید و جمع کل قیمت ها در سبد خرید است 
    setcartValues(cart){
        let totalPrice = 0
        let totalItems = 0 
    
        cart.map((item)=>{
            totalPrice = totalPrice + item.price*item.amount
            totalItems = totalItems + item.amount
        })

        cartTotal.innerText = totalPrice
        cartItems.innerText = totalItems



        //این تابع باید در جایی فراخوانی بشه که سبد خرید ساخته میشه یعنی در تابع گت کارت باتن
    }

    // این متد برای اضافه کردن و ساختن ایتم های داخل سبد خرید است
    //ورودی این تابع همان محصول جدیدیه که به سبد خرید اضافه میشه
    addCartItem(item){
        const div = document.createElement('div')
        div.classList.add('cart-item')

        div.innerHTML = `
            <img src=${item.image} alt=${item.title}>
            <div>
                <h4>${item.title}</h4>
                <h5>${item.price}</h5>
                <span class="remove-item" data-id=${item.id}>delete</span>
            </div>
            <div>
                <i class="fa-solid fa-chevron-up" data-id=${item.id}></i>
                <p class="item-amount">${item.amount}</p>
                <i class="fa-solid fa-chevron-down" data-id=${item.id}></i>
            </div>
        `
        // حالا دیو ساخته شده باید به عنوان فرزند کارت ایتم نمایش داده بشه
        cartContent.appendChild(div)

        // این تابع در جایی که سبد خرید ساخته میشه باید فراخوانی بشه
    }

    // این متد باعث میشه سبد خرید وقتی روی دکمه ی افزودن کلیک کنی نمایش داده بشه
    showCart(){
        cartDom.classList.add('showCart')
        cartOverlay.classList.add('transparentBcg')

        // این متد جایی که سبد خرید ساخته میشه باید فراخوانی بشه
    }

    // showSingleProduct(products){
    //     let result = ''
    //     products.forEach((item)=>{
    //         result += `
    //         <div class="single-pro-image">
    //         <img src=${item.imge} alt="item.title"id="MainImg" width="100%">
    //         <div class="small-img-group">
    //             <div class="small-img-col">
    //                 <img src="/images/products/f1.jpg" alt="" width="100%" class="small-img">
    //             </div>
    //             <div class="small-img-col">
    //                 <img src="/images/products/f2.jpg" alt="" width="100%" class="small-img">
    //             </div>
    //             <div class="small-img-col">
    //                 <img src="/images/products/f3.jpg" alt="" width="100%" class="small-img">
    //             </div>
    //             <div class="small-img-col">
    //                 <img src="/images/products/f4.jpg" alt="" width="100%" class="small-img">
    //             </div>
    //         </div>
    //     </div>

    //     <div class="single-pro-details">
    //         <h6>Home / T-Shirt</h6>
    //         <h4>${item.title}</h4>
    //         <h2>${item.price}</h2>
    //         <select>
    //             <option>Select Size</option>
    //             <option>XL</option> 
    //             <option>XXl</option>
    //             <option>Small</option>
    //             <option>Large</option>
    //         </select>
    //         <input type="number" value="1">
    //         <button class="normal">Add To Cart</button>
    //         <h4>Product Detalis</h4>
    //         <span>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
    //               ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
    //               laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in 
    //               voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat
    //               non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</span>
    //     </div>
    //         `
    //     })
    //     proDetails.innerHTML = result
    //     console.log(result)
    // }

    initApp(){
        //اینیشیال اپ یعنی هنگامی که برنامه لود میشه
        // این متد باعث میشه زمانی که برنامه ی ما لود میشه
        // بره از لوکال استورج مقادیر کارت رو بگیره
        // محاسبات داخل سبد خرید رو براساس مقادیر داخل کارت انجام بدهsetcartvalue و بعد به کمک تابع 

       cart = Storage.getCart()
       this.setcartValues(cart)

    // در نهایت این تابع باعث میشه تمام ایتم های کارت که از لوکال گرفته میشه در سبد خرید نشون داده بشه
       this.populate(cart)

       cartShopping.addEventListener('click' , this.showCart)
       closeCart.addEventListener('click' ,this.closeCart)
    }

    // باید اجرا بشه تا هر ایتم در سبدخرید نشون داده بشهaddcartitem برای هر ایتم داخل کارت تابع 
    // یعنی هر محصول یا ایتم رو جداگانه به سبد خرید اضافه کنه 
    populate(cart){
        cart.forEach((item)=>{
            return this.addCartItem(item)
        })
    }

    closeCart(){
        cartDom.classList.remove('showCart')
        cartOverlay.classList.remove('transparentBcg')
    }

    // این متد فرایند های داخل سبد خرید رو انجام میده
    // این فرایند ها شامل حذف یک محصول، حذف کل محصولات، زیاد و کم شدن تعداد محصولات
    cartProcess(){
        removeCart.addEventListener('click',()=>{
            this.clearCart()
        })
        //کارت کانتنت همون بدنه ی سبد خریده
        cartContent.addEventListener('click',(e)=>{
            if(e.target.classList.contains('remove-item')){
              let removeItem =  e.target
              let id = removeItem.dataset.id
              
              //حالا که ایدی و تارگت ریمووآیتم پیدا شد
              //حذف محصولات هم باید از دام اتفاق بیوفته هم از لوکال استورج

              //حذف از دام
              //میره از کارت کانتنت فرزندی که ریمووایتمه المنت های بالاتر از خودش و خودش رو پاک میکنه
              cartContent.removeChild(removeItem.parentElement.parentElement)

              //حذف از لوکال استورج
              this.removeProduct(id)
            }

            if(e.target.classList.contains('fa-chevron-up')){
              let addAmount = e.target
              let id = addAmount.dataset.id
              
            // براساس آیدی اون محصولی که روش برای افزایش کلیک شده
            //  اون محصول رو پیدا میکنیم و توی پروداکت میریزیم
              let product = cart.find((item)=>{
                return item.id ===id
              })

              product.amount+=1

              this.setcartValues(cart)
              Storage.saveCart(cart)

            //   افزایش عدد یک محصول بلافاصله در سبد خرید اتافق نمیوفته 
            // و باید یبار رفرش کرد تا تعداد بره بالا برای اینکه بلافاصله زیاد شه از مفهوم زیر استفاده میکنیم
            addAmount.nextElementSibling.innerText = product.amount
            }

            if(e.target.classList.contains('fa-chevron-down')){
                let lowerAmount = e.target
                let id = lowerAmount.dataset.id
                
              // براساس آیدی اون محصولی که روش برای افزایش کلیک شده
              //  اون محصول رو پیدا میکنیم و توی پروداکت میریزیم
                let product = cart.find((item)=>{
                  return item.id ===id
                })
  
                product.amount-=1
                
                if(product.amount>0){
                    
                this.setcartValues(cart)
                Storage.saveCart(cart)

                // کد زیر یعنی یدونه قبلتر رو برگردون
                //و کم شدن رو بلافاصله در سبد خرید نشون میده
                lowerAmount.previousElementSibling.innerText = product.amount
                }else{
                    //وقتی یک محصولی رو انقدر کم میکنی تا به صفر برسه
                    //هم باید از دام حذف بشه
                    cartContent.removeChild(lowerAmount.parentElement.parentElement)
                    //هم از لوکال استورج
                    this.removeProduct(id)
                }
              }

        })
    }

    // متدی برای حذف همه ی محصولات
    clearCart(){
        // در ابتدا آیدی تمام محصولات داخل کارت رو پیدا میکنیم
      let cartItems = cart.map((item)=>{
          return item.id
        })

        // بعد ایتم های داخل کارت رو به تابع ریمووپروداکت میدیم که دونه دونه میاد ایدی های داخل کارت ایتمز رو پاک میکنه
        //و در نهایت کل سبد خرید پاک میشه
       cartItems.forEach((item)=>{
        return this.removeProduct(item)
       })

       //این شرط برای اینه که زمانی که روی حذف همه ی محصولات که کلیک میکنیم
       //جمع کل صفر میشه اما محصولات از سبد خرید پاک نمیشن
       //حالا ما میگیم زمانی که کارت کانتنت یعنی همون سبد خرید هنوز فرزندی داشت بیا از خونه ی اول اونارو پاک کن
       //کارت کانتنت دات چیلدرن یک ارایه برمیگردونه
       while(cartContent.children.length>0){
        cartContent.removeChild(cartContent.children[0])
       }
    }


    // این متد داینامیکه هم برای حذف یک محصول میشه استفاده کرد هم حذف همه ی محصولات
    removeProduct(id){
      cart  = cart.filter((item)=>{
            return item.id !== id
        })
    
        // حالا که ارایه ی جدید ساخته شد و یک محصول پاک شد
        //هم مقادیر جدید کارت باید ست بشن در سبد خرید
        //هم مقدار کارت جدید در لوکال باید ذخیره بشه
        this.setcartValues(cart)
        Storage.saveCart(cart)
    }

    


    
}

// // مدیریت ذخیره ی اطالاعات در لوکال استورج
class Storage {
   static saveProducts(products){
    localStorage.setItem('products' ,JSON.stringify(products))
    }
    static saveBlogs(blogs){
        localStorage.setItem('blogs' , JSON.stringify(blogs))
    }

    static getProduct(id){
    // می خواهیم از لوکال استورج بر اساس ایدی یک محصول اوتو از لوکال بیاریم بیرون و به سبد خرید ببریم
    //  پس ابتدا محصولات رو از لوکال بیرون میاریم
    let products =  JSON.parse(localStorage.getItem('products'))

    // بعد محصولی که ایدی اون با ایدی وارد شده یکی هست رو پیدا میکنیم 
    // آیدی وارد شده برای همون محصولیه که روش کلیک شده
    return products.find((item)=>item.id === id)
    }
    //getproduct for newproduct notdefind

    static saveCart(cart){
        localStorage.setItem('cart' , JSON.stringify(cart))
    }

    static getCart(){
        return localStorage.getItem('cart')
        ? JSON.parse(localStorage.getItem('cart'))
        : []
    }
    
  }

  
//  وقتی کلاس میسازی در نهایت باید از کلاس ها شی بسازی
document.addEventListener('DOMContentLoaded', () => {
    
    //  زمان لود شدن دام این دو شی ساخته میشن تا بشه از متد داخل کلاس ها استفاده کرد
    const product = new Product()
    const view = new View()

    

    view.initApp()
    // حالا می خواهیم زمان لود شدن دام اطالاعات از جیسون گرفته بشه
    // پس باید تابع گت پروداکت صدا زده بشه 
    //  پس پرامیس برمیگردونهasync await در گت پروداکت 
    // میخواهیم هنگام اجرای گت پروداکت در زمان لود شدن صفحه هم تابع دیسپلی در کلاس ویو اجرا بشه تا محصولات در دام نمایش داده بشن
    // هم تابع سیو پروداکت در کلاس استورج اجرا بشه تا محصولات در لوکال استورج ذخیره بشن
    product.getProduct()
        .then((data)=>{
            view.displayProducts(data)
            Storage.saveProducts(data)
    })
        .then(()=>{
            view.getCartButtons()
            view.cartProcess()
        })
    product.getBlog()
            .then((data)=>{
                view.displayblogs(data)
                Storage.saveBlogs(data)
            })
  })
  