const menu =document.querySelector(".account-info .menu")
const toggleMenu = ()=>{
    if(menu.style.display == "none")
        menu.style.display = "block"
    else
        menu.style.display = "none"
}
const openProfile = userID=>{
    location.href = "/profile/"+userID
}
const logout = ()=>{
    if(confirm("Are you sure you want to logout?"))
        location.href = "/logout"
}
const deleteAccount = ()=>{
    if(confirm("Are you sure you want to delete the account?"))
        location.href = "/logout"
}