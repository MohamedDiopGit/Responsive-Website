const txtAnim = document.querySelector('.h2')

console.log(new Typewriter(txtAnim));
new Typewriter(txtAnim,{
    deleteSpeed: 200
})

.typeString('Welcome to my website')
.pauseFor(300)
.typeString(', :)')
.pauseFor(300)
.deleteChars(4)
.pauseFor(300)
.start()