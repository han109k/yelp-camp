module.exports.isLoggedIn = (req, res, next) => {
    console.log("REQ.USER...", req.user);
    // Checking if user authenticated
    if(!req.isAuthenticated()) {
        // return behavior 
        //console.log(req.path, req.originalUrl);
        req.session.returnTo = req.originalUrl;
        req.flash("error", "You must be signed in!");
        return res.redirect("/login");
    }
    next();
}
