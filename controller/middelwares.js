module.exports={
    isLoggedOut: (req, res, next)=>{
        req.session.user? res.status(301).redirect('/') : next();
    },
    isLoggedIn: (req, res, next)=>{
        req.session.user? next() : res.status(301).redirect('/');
    }
}