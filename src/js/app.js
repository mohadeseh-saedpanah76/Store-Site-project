const bar = document.getElementById('bar');
const close = document.getElementById('close');
const navbar = document.getElementById('navbar');
const MainImg = document.querySelector('#MainImg')
const smallimg = document.querySelectorAll('.small-img')



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