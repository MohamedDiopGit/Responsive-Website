const menuToggle = document.querySelector('.toggle')
const showcase = document.querySelector('.showcase')
const navigation = document.querySelector('.nav')


menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active')
    showcase.classList.toggle('active')
})

window.addEventListener('scroll', () =>{
    if(window.scrollY > 3){
        navigation.classList.add('anim-nav');
        navigation.classList.add('anim-nav');
    }
    else {
        navigation.classList.remove('anim-nav');
    }

}
);