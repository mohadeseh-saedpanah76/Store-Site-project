const bar = document.getElementById('bar');
const close = document.getElementById('close');
const navbar = document.getElementById('navbar');
const MainImg = document.querySelector('#MainImg')
const smallimg = document.querySelectorAll('.small-img')
const productDom = document.querySelector('.pro-container')
const newproductDom = document.querySelector('.pro-container-1')


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

   async getnewProduct(){
     try {
        const result =  await fetch('/products.json')
        const data =  await result.json()
        let newproduct = data.items2
   
       newproduct = newproduct.map((item)=>{
           const {brand , title , price} = item.fields
           const {id} = item.sys
           const image = item.fields.image.fields.file.url
           return {brand , title , price , id , image}
        })
   
        return newproduct
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
            <button  data-id=${item.id}><a href="#" class="cart"><i class="fa fa-cart-shopping" ></i></a></button>
        </div>
            `
        })

        productDom.innerHTML = result
    }

    displaynewProducts(newproduct){
        let result = ''
        newproduct.forEach((item)=>{
            result +=`
            <div class="pro">
            <img src=${item.image} alt="${item.title}">
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
            <button  data-id=${item.id}><a href="#" class="cart"><i class="fa fa-cart-shopping" ></i></a></button>
        </div>
            `
        })
        newproductDom.innerHTML = result
    }
    
    
}

// مدیریت ذخیره ی اطالاعات در لوکال استورج
class Storage {
   static saveProducts(products){
    localStorage.setItem('products' ,JSON.stringify(products))
    }
    static savenewProducts(newproducts){
        localStorage.setItem('newproducts' ,JSON.stringify(newproducts))
    }
  }

  
//  وقتی کلاس میسازی در نهایت باید از کلاس ها شی بسازی
document.addEventListener('DOMContentLoaded', () => {
    //  زمان لود شدن دام این دو شی ساخته میشن تا بشه از متد داخل کلاس ها استفاده کرد
    const view = new View()
    const product = new Product()

    // حالا می خواهیم زمان لود شدن دام اطالاعات از جیسون گرفته بشه
    // پس باید تابع گت پروداکت صدا زده بشه 
    //  پس پرامیس برمیگردونهasync await در گت پروداکت 


    // میخواهیم هنگام اجرای گت پروداکت در زمان لود شدن صفحه هم تابع دیسپلی در کلاس ویو اجرا بشه تا محصولات در دام نمایش داده بشن
    // هم تابع سیو پروداکت در کلاس استورج اجرا بشه تا محصولات در لوکال استورج ذخیره بشن
    product.getProduct().then((data)=>{
        view.displayProducts(data)
        Storage.saveProducts(data)
    })
    product.getnewProduct().then((data)=>{
        view.displaynewProducts(data)
        Storage.savenewProducts(data)
    })
  })
  