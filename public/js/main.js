const menuIcon = document.querySelector(".navbar .menu .icon")
const linksContainer = document.querySelector(".navbar .menu .links")
let menuIsOpened = false
menuIcon.onclick = ()=>{
    menuIsOpened?
        linksContainer.style.display = null
    :
        linksContainer.style.display = "block"

    menuIsOpened = !menuIsOpened
}

const links = document.querySelectorAll(".navbar .menu .links a");
for(let i = 0; i < links.length; i++){
    links[i].classList.remove("active")
    if(links[i].href === window.location.href)
        links[i].classList.add("active")
}
window.onresize = ()=>{
    if(window.innerWidth > 580 && menuIsOpened)
        menuIcon.click()
}