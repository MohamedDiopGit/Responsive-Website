const txtAnim = document.querySelector('.h2')

console.log(new Typewriter(txtAnim));
new Typewriter(txtAnim,{
    deleteSpeed: 20
})

.typeString('Welcome to my website')
.pauseFor(300)
.typeString('<strong>, I\'m Mohamed Diop</strong>')
.start()