const bar = document.getElementById('bar');
const navbar = document.getElementById('navbar');

const ShowNavbar = () =>{
    navbar.classList.add('active');
} 

if(bar) {
    bar.addEventListener('click' , ShowNavbar)
}
