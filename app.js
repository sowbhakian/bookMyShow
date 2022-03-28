const express = require("express");
const mongoose = require("mongoose");
const _ = require('lodash');
const { forEach } = require("lodash");
const app = express();

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }))
app.use(express.static("public"));

con = true;

// database Host
let port = process.env.PORT || 9000;
mongoose.connect("mongodb://localhost:27017/BookMyShow", { useNewUrlParser: true });


const theatreSchema = new mongoose.Schema({
    theatreName: String,
    movieName: String,
    certification: String,
    Lang: String,
    time1: String,
    time2: String,
    time3: String,
    ticketAvaiable: { type: Number, default: 10 }
})
const theatre = mongoose.model("theatre", theatreSchema)

// const ticketsSchema = new mongoose.Schema({
//     Name: String,
//     theatreName: String,
//     movieName: String,
//     timming: String,
//     seatNo: Number,
//     NoOfTickets: Number,
//     cost: Number
// })
// const Bookingtickets = mongoose.model("Bookingtickets", ticketsSchema)

const seateSchema = new mongoose.Schema({
    threatername: String,
    seatno: Number
})
const seate = mongoose.model("seate", seateSchema)



if (!con) {

    // list of threaters
    var theatreadd = new theatre({
        theatreName: "Asskar Theatre",
        movieName: "RRR",
        certification: "A",
        Lang: "English",
        time1: "10.00am to 12.00pm",
        time2: "2.00am to 4.00pm",
        time3: "6.00am to 8.00pm",
    })
    theatreadd.save();
    var theatreadd = new theatre({
        theatreName: "ARRS Theatre",
        movieName: "asd",
        certification: "UA",
        Lang: "Tamil",
        time1: "10.00am to 12.00pm",
        time2: "2.00am to 4.00pm",
        time3: "6.00am to 8.00pm",
    })
    theatreadd.save();
    var theatreadd = new theatre({
        theatreName: "Multiplex Theatre",
        movieName: "qwe",
        certification: "U/A",
        Lang: "Tamil",
        time1: "10.00am to 12.00pm",
        time2: "2.00am to 4.00pm",
        time3: "6.00am to 8.00pm",
    })
    theatreadd.save();
    var theatreadd = new theatre({
        theatreName: "Imax Theatre",
        movieName: "zxc",
        certification: "s",
        Lang: "English",
        time1: "10.00am to 12.00pm",
        time2: "2.00am to 4.00pm",
        time3: "6.00am to 8.00pm",
    })
    theatreadd.save();
    con = false;
}

// Home
app.get("/", function(req, res) {

    theatre.find({}, (err, output) => {
        if (!err) {
            // console.log(output);
            res.render("index", { threater: output });
        }
    })
});
app.get("/contact", function(req, res) {
    res.render("contact");
});

// app.get("/seats", function(req, res) {

//     res.render("seats");
// });


app.post("/seateAvaible", function(req, res) {
    var theatername = req.body.theatername;
    var movieName = req.body.movieName;
    var certification = req.body.certification;
    var Lang = req.body.Lang;
    var time1 = req.body.time1;
    var time2 = req.body.time2;
    var time3 = req.body.time3;
    var count;


    theatre.find({}, (err, output) => {
        if (!err) {
            output.forEach(e => {
                // console.log(e.theatreName + "" + theatername);
                if (e.theatreName == theatername) {
                    // console.log("asd");
                    count = e.ticketAvaiable;
                    console.log(count);
                }
            });
            // count = 10 - output.length;
            res.render("seats", { theatername: theatername, movieName: movieName, certification: certification, Lang: Lang, time1: time1, time2: time2, time3: time3, count: count })
        }
    })

});

app.post("/bookingDone", function(req, res) {
    var theatername = req.body.theatername;
    var time = req.body.time;
    var number = req.body.number;
    var mail = req.body.mail;


    theatre.find({ theatreName: theatername }, (err, output) => {
        if (!err) {
            console.log(output);
            var count = 10 - (parseInt(output.length) + parseInt(number));
            var conditions = { theatreName: theatername }
            var update = { ticketAvaiable: count }

            theatre.findOneAndUpdate(conditions, update, (err, out) => {
                if (!err) {

                    theatre.find({}, (err, output) => {
                        if (!err) {
                            console.log(output);
                            res.redirect("/");
                        }
                    })

                }
            });
        }
    })


});





app.listen(port, function() {
    console.log("Server running in 9000")
});