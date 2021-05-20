const User = require("../models/user");

module.exports.renderRegister = (req, res) => {
    res.render("users/register");
}

module.exports.register = async (req, res) => {
    try {
        const { username, password, email } = req.body;
        const user = new User({ username, email });
        // Convenience method to register a new user instance with a given password. 
        // Also checks if username is unique.
        const registeredUser = await User.register(user, password);
        console.log(registeredUser);
        // login automatically by passport helper method
        req.login(registeredUser, err => {
            if (err) {
                console.log("There's been an error @/register POST");
                return next(err);
            }
            req.flash("success", "Welcome to Yelp Camp!");
            res.redirect("/campgrounds");
        });
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/register");
    }
};

module.exports.renderLogin = (req, res) => {
    res.render("users/login");
};

module.exports.login = (req, res) => {
    req.flash("success", "Welcome back!");
    // return behaviour 
    const redirectUrl = req.session.returnTo || "/campgrounds";
    // delete req.session.returnTo from session object 
    delete req.session.returnTo;
    res.redirect(redirectUrl);
};

module.exports.logout = (req, res) => {
    req.logout();
    req.flash("success", "Goodbye!");
    res.redirect("/campgrounds");
};