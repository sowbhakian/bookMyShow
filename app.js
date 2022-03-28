const express = require("express");
const mongoose = require("mongoose");
const app = express();

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }))
app.use(express.static("public"));

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
            res.render("index", { theatres: output });
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

app.post("/bookTicket", function(req, res) {

    User.findOne({ email: req.body.email }, (err, foundUser) => {
        Theatre.findOne({ _id: req.body.id }, (err, foundTheatre) => {
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
            for (var i in foundTheatre.shows)
                if (foundTheatre.shows[i].timing == req.body.time) {
                    var c = parseInt(foundTheatre.shows[i].ticketsBooked);
                    foundTheatre.shows[i].ticketsBooked = c + parseInt(req.body.number);
                }
                //Save the Theatre info
            foundTheatre.save().then(() => {
                //Save the ticket info
                newTicket.save().then(() => {
                    if (foundUser == null) {
                        const newUser = new User({
                            name: req.body.name,
                            email: req.body.email,
                            ticketsBooked: [newTicket]
                        });
                        // save the userdate
                        newUser.save();
                        res.render("confirm", { ticket: newTicket });
                    } else {
                        foundUser.ticketsBooked.push(newTicket);
                        foundUser.save();
                        res.render("confirm", { ticket: newTicket });
                    }
                });
            });
        });
    })
});

app.listen(port, function() {
    console.log("Server running in " + port);
});