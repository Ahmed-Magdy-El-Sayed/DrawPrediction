module.exports={
    isLoggedOut: (req, res, next)=>{
        req.session.user? res.status(403).redirect('/') : next();
    },
    isLoggedIn: (req, res, next)=>{
        req.session.user? next() : res.status(403).redirect('/');
    }
}