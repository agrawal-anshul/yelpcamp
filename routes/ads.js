var express = require("express");
var fs = require("fs");
var router = express.Router({ mergeParams: true });
var path = require("path");
var multer = require("multer");
var imgModel = require("../models/image");
require("dotenv").config();

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        //destination
        cb(null, "uploads");
    },
    filename: (req, file, cb) => {
        console.log("inside multer---->" + file);

        cb(null, file.fieldname + "-" + Date.now());
    },
});

var upload = multer({ storage: storage });

// Retrieving the image

router.get("/", (req, res) => {
    imgModel.find({}, (err, items) => {
        if (err) {
            console.log(err);
        } else {
            // console.log(items);
            // res.render("ads/index", { items: items });

            var image = items[Math.floor(Math.random() * items.length)];
            const tempsrc =
                "data:image/" +
                image.img.contentType +
                ";base64," +
                image.img.data.toString("base64");

            res.send({ image: tempsrc });
            // res.render("partials/sidebanner", { items: items });
        }
    });
});

router.get("/new", (req, res) => {
    res.render("ads/new");
});

router.get("/test", (req, res) => {
    res.render("ads/test");
});

// Uploading the image
router.post("/", upload.single("image"), (req, res, next) => {
    console.log("in post route");
    // console.log(req.body);
    // console.log(req.file.filename);
    // console.log(process.cwd());
    // console.log(__dirname);

    const obj = {
        name: req.body.name,
        desc: req.body.desc,
        img: {
            data: fs.readFileSync(
                path.join(process.cwd() + "/uploads/" + req.file.filename)
                // path.join("/uploads/" + req.file.filename)
            ),
            contentType: "image/png",
        },
    };
    imgModel.create(obj, (err, item) => {
        if (err) {
            console.log(err);
        } else {
            // item.save();
            res.redirect("/ads");
        }
    });
});

module.exports = router;
