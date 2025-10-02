const passwordFeadback = document.querySelector(".signup .password-container .err.main-password")
const repeatedFeedback = document.querySelector(".signup .password-container .err.repeated-password")
const repeatPasswordField = document.querySelector(".signup .repeat-pass")

document.querySelector("input[type='password']").onkeyup = e=>{
    repeatPasswordField.pattern = e.target.value
    repeatPasswordField.onkeyup()

    if(!e.target.value.match(/.*[a-z]/g)) passwordFeadback.innerText = "password should contan at least one lowercase"
    else if(!e.target.value.match(/.*\d/g)) passwordFeadback.innerText = "password should contan at least one number"
    else if(!e.target.value.match(/.*[A-Z]/g)) passwordFeadback.innerText = "password should contan at least one uppercase"
    else if(e.target.value.match(/^.{0,7}$/g)) passwordFeadback.innerText = "password should be at least 8 or more characters"
    else passwordFeadback.innerText = ""
}
repeatPasswordField.onkeyup = ()=>{
    if(repeatPasswordField.checkValidity())
            repeatedFeedback.innerText = ""
        else
            repeatedFeedback.innerText = "The password not matched"
}

document.querySelector("input[type='checkbox']").onchange = e=>{
    if(e.target.checked)
        document.querySelector(".signup .err.licence").innerText = "";
    else
        document.querySelector(".signup .err.licence").innerText = "You must agree before submitting.";
}