const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }))
app.use(express.static("public"));
app.use(cors())



var AWS = require("aws-sdk");
// var uuid = require('uuid');

// AWS.config.getCredentials(function(err) {
//     // displays the accessKey
//     if (err) console.log(err.stack);
//     else {
//         console.log("Access key:", AWS.config.credentials.accessKeyId);
//     }
// });



// List the set Objects of S3
var s3 = new AWS.S3();
try {
    const res = s3.listObjectsV2({
            Bucket: "bookmyshowpresidio"
        })
        // console.log(res);

} catch (error) {
    console.log(error);
}


con = false;

// database Host
let port = process.env.PORT || 9000;
mongoose.connect("mongodb+srv://sowbi:1234@cluster0.hdb8s.mongodb.net/bookMyShow?retryWrites=true&w=majority", { useNewUrlParser: true });

const theatreSchema = new mongoose.Schema({
    theatreName: String,
    capacity: { type: Number, default: 50 },
    location: String,
    movie: String,
    certification: String,
    language: String,
    cost: Number,
    shows: [{ timing: String, ticketsBooked: { type: Number, default: 0 } }],
})
const Theatre = new mongoose.model("Theatre", theatreSchema);

const ticketSchema = new mongoose.Schema({
    name: String,
    movieName: String,
    certification: String,
    language: String,
    timing: String,
    cost: Number,
    theatreName: String,
    location: String,
    noOfTickets: Number
});
const Ticket = new mongoose.model("Ticket", ticketSchema);

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    ticketsBooked: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ticket'
    }]
});
const User = mongoose.model("User", userSchema);

if (con) {

    // list of threaters
    var theatre1 = new Theatre({
        theatreName: "Asskar Theatre",
        location: "place1",
        movie: "spider",
        certification: "A",
        language: "English",
        cost: 100,
        shows: [
            { timing: "10:00am - 01:00pm" },
            { timing: "02:00pm - 05:00pm" },
            { timing: "06:00pm - 09:00pm" },
        ]
    });
    theatre1.save();
    var theatre2 = new Theatre({
        theatreName: "ARRS Theatre",
        location: "place2",
        movie: "RRR",
        certification: "UA",
        language: "Tamil",
        cost: 150,
        shows: [
            { timing: "10:00am - 01:00pm" },
            { timing: "02:00pm - 05:00pm" },
            { timing: "06:00pm - 09:00pm" },
        ]
    });
    theatre2.save();
    var theatre3 = new Theatre({
        theatreName: "Multiplex Theatre",
        location: "place3",
        movie: "baahubali",
        certification: "U/A",
        language: "Tamil",
        cost: 80,
        shows: [
            { timing: "10:00am - 01:00pm" },
            { timing: "02:00pm - 05:00pm" },
            { timing: "06:00pm - 09:00pm" },
        ]
    });
    theatre3.save();
    var theatre4 = new Theatre({
        theatreName: "Imax Theatre",
        location: "place4",
        movie: "uncharted",
        certification: "s",
        language: "english",
        cost: 90,
        shows: [
            { timing: "10:00am - 01:00pm" },
            { timing: "02:00pm - 05:00pm" },
            { timing: "06:00pm - 09:00pm" },
        ]
    })
    theatre4.save();
    con = false;
}

// Home
app.get("/", function(req, res) {
    Theatre.find({}, { theatreName: 1, location: 1 }, (err, output) => {
        if (!err) {


            var b64;
            var b642;
            var b643;
            var b644;

            // GetObject
            var getParams = {
                Bucket: 'bookmyshowpresidio', // your bucket name,
                Key: '1.jpg' // path to the object you're looking for
            }

            s3.getObject(getParams, function(err, data) {
                // Handle any error and exit
                if (err)
                    return err;
                else {
                    b64 = Buffer.from(data.Body).toString('base64');
                    const mimeType = 'png'; // e.g., image/png
                    // oneOver

                    var getParams2 = {
                        Bucket: 'bookmyshowpresidio', // your bucket name,
                        Key: '2.jpg' // path to the object you're looking for
                    }
                    s3.getObject(getParams2, function(err, data2) {
                        if (err)
                            return err;
                        else {
                            b642 = Buffer.from(data2.Body).toString('base64');
                            // Two Over


                            var getParams3 = {
                                Bucket: 'bookmyshowpresidio', // your bucket name,
                                Key: '3.jpg' // path to the object you're looking for
                            }
                            s3.getObject(getParams3, function(err, data3) {
                                // Handle any error and exit
                                if (err)
                                    return err;
                                else {
                                    b643 = Buffer.from(data3.Body).toString('base64');
                                    // three Over


                                    var getParams = {
                                        Bucket: 'bookmyshowpresidio', // your bucket name,
                                        Key: '4.jpg' // path to the object you're looking for
                                    }
                                    s3.getObject(getParams, function(err, data4) {
                                        // Handle any error and exit
                                        if (err)
                                            return err;
                                        else {
                                            const b644 = Buffer.from(data4.Body).toString('base64');
                                            res.render("index", { theatres: output, b64: b64, b642: b642, b643: b643, mimeType: mimeType, b644: b644 });

                                        }
                                    });




                                }
                            });

                        }
                    });
                }
            });

        }
    });
});

//Individual Theatre
app.post("/getShows", function(req, res) {
    Theatre.findOne({ _id: req.body.id }, (err, output) => {
        if (!err) {
            res.render("shows", { Theatre: output });
        }
    });
});

//Ticket Booking
app.post("/bookTicket", function(req, res) {

    User.findOne({ email: req.body.email }, (err, foundUser) => {
        Theatre.findOne({ _id: req.body.id }, (err, foundTheatre) => {
            // newTicket
            const newTicket = new Ticket({
                name: req.body.name,
                movieName: foundTheatre.movie,
                theatreName: foundTheatre.theatreName,
                certification: foundTheatre.certification,
                language: foundTheatre.language,
                timing: req.body.time,
                cost: foundTheatre.cost,
                location: foundTheatre.location,
                noOfTickets: req.body.number
            });
            var errorMsg = "";
            //Timing iteration
            for (var i in foundTheatre.shows)
                console.log(i);
            if (foundTheatre.shows[i].timing == req.body.time) {
                var c = parseInt(foundTheatre.shows[i].ticketsBooked);
                if (c + parseInt(req.body.number) <= 50) {
                    errorMsg = "Booking Done!!"
                    console.log("Done");
                    foundTheatre.shows[i].ticketsBooked = c + parseInt(req.body.number);
                } else {
                    errorMsg = "Booking Over!!"
                    foundTheatre.shows[i].ticketsBooked = c;
                }
            }
            //Save the Theatre info
            foundTheatre.save().then(() => {
                //Save the ticket info
                newTicket.save().then(() => {
                    // newUser
                    if (foundUser == null) {
                        const newUser = new User({
                            name: req.body.name,
                            email: req.body.email,
                            ticketsBooked: [newTicket]
                        });
                        // save the userdate
                        newUser.save();
                        res.render("confirm", { ticket: newTicket, errorMsg: errorMsg });
                    } else {
                        //OldUser
                        foundUser.ticketsBooked.push(newTicket);
                        foundUser.save();
                        res.render("confirm", { ticket: newTicket, errorMsg: errorMsg });
                    }
                });
            });
        });
    })
});

app.listen(port, function() {
    console.log("Server running in " + port);
});