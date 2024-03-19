const { createUser, authUser, deleteUser } = require('../model/users');
const { getDrawings } = require('../model/drawings');

/* start the functions for signup page */
const getSignup =(req,res)=>{// load the page
    res.render('signup')
}

const postUser = (req,res) =>{//creat the account
    const user = req.body;
    createUser(user).then(result=>{//the function returns object for the user id, string for already used name/email, or throw error
        if(result)
            res.status(400).render('signup', {error: result}) 
        else
            res.render('login')
    }).catch(err=>{
        console.error(err)
        res.status(500).render('error',{error: "internal server error"});
    })
}
/* end the functions for signup page */

/* start the functions for login page */
let loginErr;
const getLogin =(req,res)=>{//load the page
    res.render('login',{
        error: loginErr,
    })
    loginErr = null;
}

const checkUser = async (req, res) =>{//log in the user
    const user = req.body;
    authUser(user).then(async account=>{
        if(typeof account === 'string') {// if get account failed
            loginErr = account;
            res.redirect(301,'/account/login');
        }else {// if get account success
            req.session.user = account
            // res.render('profile',{user: account, drawings});
            res.redirect(301,'/profile/'+account._id);
        }
    }).catch(err=>{
        console.error(err)
        res.status(500).render('error',{error: "internal server error"});
    })
}
/* end the functions for login page */

/* start the function of the main bar */
const logout =(req, res)=>{
    req.session.destroy(err=>{
        if(err){ 
            console.error(err)
            return res.status(500).render("error", {error: "Failed to logout"})
        } 
    });
    res.status(301).redirect('/login')
}

const deleteAccount = (req, res)=>{// button in update profile option
    const user = req.session.user;
    req.session.destroy(err=>{
        if(err){
            res.status(500).render("error",{user: req.session?.user, error: "internal server error"})
            return console.error(err)
        } 
        deleteUser(user._id).then(deleted=>{
            if(deleted) 
                res.redirect(301,"/")
            else 
                res.status(400).render("error",{user: req.session?.user, error: "Account not found!"})
    }).catch(err=>{
            console.log(err)
            res.status(500).render("error",{user: req.session?.user, error: "internal server error"})
        })
    });
}
/* end the functions of main bar */

const getProfile = async (req, res)=>{//load myContent page
    const profileUserID = req.params.id;
    if(!(profileUserID.match(/^[0-9a-fA-F]{24}$/)))
        return res.status(400).render('error', {user: req.session.user, error: "Bad Request! try again."})
    getDrawings(profileUserID).then(async drawings=>{
        res.render('profile',{user: req.session.user, drawings})
    }).catch(err=>{console.log(err);
        res.status(500).render("error",{user: req.session.user, error: "internal server error"})
    });
}
module.exports={
    getSignup, getLogin, 
    getProfile,
    postUser, checkUser,
    logout, deleteAccount
};