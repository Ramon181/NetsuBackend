const {Router} = require("express");
const abilityRoute = require("./ability/ability.js");
const personageRoute = require("./personage/personage.js")
const userRoute = require("./user/user.js")
const genderRoute = require("./gender/gender.js")
const serieRoute = require("./serie/serie.js")
const postRoute = require("./post/post.js")
const reviewRoute = require("./reviews/reviews.js")

const router = Router();

router.use("/ability", abilityRoute);
router.use("/personage", personageRoute)
router.use("/gender", genderRoute);
router.use("/user", userRoute)
router.use("/serie", serieRoute)
router.use("/post", postRoute)
router.use("/review", reviewRoute)

module.exports = router;