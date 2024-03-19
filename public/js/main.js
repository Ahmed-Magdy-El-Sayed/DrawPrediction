const MenuIcon = document.querySelector(".navbar .menu .icon")
const links = document.querySelector(".navbar .menu ul")
let isOpened = false
MenuIcon.onclick = ()=>{
    isOpened?
        links.style.display = "none"
    :
        links.style.display = "block"

    isOpened = !isOpened
}

