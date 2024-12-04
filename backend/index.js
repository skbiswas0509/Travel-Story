const express = require("express")
const cors = require("cors");
const { model, default: mongoose } = require("mongoose");
const jwt = require("jsonwebtoken")
require("dotenv").config();
const bcrypt = require("bcrypt")


const secretKey = process.env.JWT_SECRET;
const config = require("./config.json")
const User = require('./models/user.model');
const TravelStory = require('./models/travelStory.model')
const { authenticateToken } = require("./utilities");
const upload = require("./multer");
const fs = require("fs")
const path = require("path");
const travelStoryModel = require("./models/travelStory.model");

mongoose.connect(config.connectionString)

const app = express()
app.use(express.json())
app.use(cors({ origin: "*"}));

app.get("/", async(req, res) =>{
    return res.status(200).json({message: "hello"})
})

//create account
app.post("/create-account", async(req, res) => {
    const { fullName, email, password } = req.body;

    if(!fullName || !email || !password) {
        return res.status(400).json({
            error: true,
            message: "All fields are required",
        })
    }

    const isUser = await User.findOne({ email });
    if(isUser){
        return res.status(400).json({
            error: true,
            message: "User already exists",
        })
    }

    const hashedPassword  = await bcrypt.hash(password, 10);

    const user= new User({
        fullName,
        email,
        password: hashedPassword,
    });

    await user.save();

    const accessToken = jwt.sign({
        userId: user._id},
        secretKey,
        process.env.ACESS_TOKEN_SECRET,
        {
            expiresIn: "72h",
        }
    );

    return res.status(201).json({
        error: false,
        user: { fullName: user.fullName, email: user.email},
        accessToken,
        message: "Registration Successful",
    });
})

//login account
app.post("/login", async(req, res) => {
    const { email, password } = req.body;

    if(!email || !password){
        return res.status(400).json({
            message: 'Email and password are required',
        })
    }

    const user = await User.findOne({ email });

    if(!user){
        return res.status(400).json({
            message: "User not found. Please register",
        })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if(!isPasswordValid){
        return res.status(400).json({
            message: "invalid Credentials",
        })
    }
    const accessToken = jwt.sign(
        {userId: user._id},
        secretKey,
        process.env.ACESS_TOKEN_SECRET,
        {
            expiresIn: "72h",
        }
    );

    return res.status(200).json({
        error: false,
        message: "Login Successful",
        user: { fullName: user.fullName, email: user.email},
        accessToken,
    })
});

//get user
app.get("/get-user", authenticateToken, async(req,res)=>{
    const { userId } =req.user;

    const isUser = await User.findOne({_id: userId});

    if(!isUser){
        return res.sendStatus(401);
    }

    return res.json({
        user: isUser,
        message: "",
    })
})


//route to handle image upload
app.post("/image-upload", upload.single("image"), async(req, res)=>{
    try {
        if(!req.file){
            return res.status(400).json({
                error: true,
                message: "No images uploaded"
            })
        }
        const imageUrl = 'http://localhost:8080/uploads/$(req.file.filename)';
        res.status(200).kson({ imageUrl })
    } catch (error) {
        res.status(500).json({ 
            error: true,
            message: error.message,
        })
    }
})

//delete an image from folder
app.delete("/delete-image", async(req, res)=>{
    const { imageUrl } = req.query;

    if(!imageUrl){
        return res.status(400).json({
            error: true,
            message: "ImageUrl parameter is invalid"
        })
    }
    try {
        // extract the filename from the imageurl
        const filename = path.basename(imageUrl)

        ///define the file path
        const filePath = path.join(__dirname, 'uploads', filename);

        //check if the file exists
        if(fs.existsSync(filePath)){
            //delete the image from the uploads folder
            fs.unlinkSync(filePath)
            res.status(200).json({ message: "Image delete succesfully"});
        }
        else{
            res.status(200).json({
                error: true,
                message: "Image not found"
            })
        }
    } catch (error) {
        res.status(500).json({
            error: true,
            message: error.message,
        })
    }
})

//serve static file ffrom the uploads and assets directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/assets", express.static(path.join(__dirname, "assets")));

// add travel stories
app.post("/add-travel-stroy" ,authenticateToken, async(req, res) => {
    const {title, story, visitedLocation, imageUrl, visitedDate } = req.body;
    const {userId} = req.user;

    //validating required fields
    if(!title || !story || !visitedLocation || !imageUrl || !visitedDate ){
        return res.status(400).json({
            error: true,
            message: "All fields are required",
        })
    }

    //convert visited date from miliseconds to date objects
    const parsedVisitedDate = new Date(parsedInt(visitedDate));

    try {
        const travelStory = new TravelStory({
            title,
            story,
            visitedLocation,
            userId,
            imageUrl,
            visitedDate: parsedVisitedDate
        });

        await travelStory.save();
        return res.status(201).json({
            story: travelStory,
            message: "Added Successfully"
        });
    } catch (error) {
        return res.status(400).json({
            error: true,
            message: error.message,
        })
    }
})

//get all travel stories
app.get("/get-all-travel-stories", authenticateToken, async(req, res) =>{
    const {userId} = req.user
    try {
        const travelStories = await TravelStory.find({ userId: userId}).sort({ isFavorite: -1});
        res.status(200).json({
            stories: travelStories,
    })
    } catch (error) {
        res.status(500).json({
            error: true,
            message: error.message,
        })
    }
})

//edit travel story
app.put("/edit-travel-story", authenticateToken, async(req, res) =>{
    const {id} = req.params;
    const {title, story, visitedLocation, imageUrl, visitedDate } = req.body;
    const { userId } = req.user;

    //validating required fields
    if(!title || !story || !visitedLocation || !visitedDate ){
        return res.status(400).json({
            error: true,
            message: "All fields are required",
        })
    }
    //convert visitedDate from milisecond to date object
    const parsedVisitedDate = new Date(parseInt(visitedDate));

    try {
        //find the travel story by Id and ensure it belongs to the authenticated user
        const travelStory = await TravelStory.findOne({ _id:id, userId: userId});

        if(!travelStory){
            return res.status(400).json({
                error: true,
                message: "Travel story not found",
            });
        }

        const placeholderImageUrl = 'http://localhost:8080/assets/placeholder.png';

        travelStory.title = title;
        travelStory.story = story;
        travelStory.visitedLocation = visitedLocation;
        travelStory.imageUrl = imageUrl || placeholderImageUrl;
        travelStory.visitedDate = parsedVisitedDate;

        await travelStory.save();
        res.status(200).json({
            error: false,
            message: "Updated Successfully",
        })
    } catch (error) {
        res.status(500).json({
            error: true,
            message: error.message,
        })
    }
})

//delete travel story
app.delete("/delete-travel-story", authenticateToken, async(req, res)=>{
    const {id} = req.params;
    const { userId } = req.user;

    try {
        //find the travel strory and ensure it blongs to the authenticated users
        const travelStory = await TravelStory.findOne({ _id: id, userId: userId });

        if(!travelStory){
            return res.status(400).json({
                error: true,
                message: "Travel story not found"
            })
        }
            //delete the travel story from the database
            await travelStory.deleteOne({_id: id, userId: userId});

            //extract the filename from the imageUrl
            const imageUrl = travelStory.imageUrl;
            const fileName = path.basename(imageUrl);

            //define the file path
            const filepath = path.joi(__dir, 'uploads', filename);

            //delete the image file from the uploads folder
            fs.unlink(filepath, (err)=>{
                if(err){
                    console.error("Failed to delete the image file", err);
                }
            })

            res.status(200).json({
                mesage: "Travel story deleted successfully"
            })
    } catch (error) {
        res.status(500).json({
            error: true,
            message: error.message,
        })
    }
})

// update isFavourite
app.put("/update-is-favourite", authenticateToken, async(req, res)=>{
    const {id} = req.params;
    const {isFavourite} = req.body;
    const {userId} = req.user;

    try {
        const travelStory = await TravelStory.findOne({ _id:id, userId: userId})
        if(!travelStory){
            return res.status(400).json({
                error: true,
                message: "Travel story not found",
            })
        }

        travelStory.isFavourite = isFavourite;

        await travelStory.save();
        res.status(200).json({
            story: travelStory,
            message: "Update Successful",
        })
    } catch (error) {
        res.status(500).json({
            error: true,
            message: error.message,
        })
    }
})

//search travel stories
app.put("/search", authenticateToken, async(req, res)=>{
    const { query } = req.query;
    const { userId } = req.user;

    if(!query){
        return res.status(404).json({
            error: true,
            message: "query is required",
        })
    }

    try {
        const searchResults = await TravelStory.find({
            userId: userId,
            $or: [
                {title: { $regex: query, $options: "i"}},
                { story: { $regex: query, $options: "i"}},
                { visitedLocation: { $regex: query, $options: "i"}},
            ]
        }).sort({ isFavourtie: -1 });

        res.status(200).json({stories: searchResults})
    } catch (error) {
        res.status(500).json({
            error: true,
            message: error.message,
        })
    }
})

// filter travel stories by date range
app.get("/travel-stories/filter", authenticateToken, async (req, res) => {
    const { startDate , endDate } =req.query;
    const { userId } = req.user;

    try {
        // convert startdate and endate from miliseconds to date objects
        const start = new Date(parseInt(startDate));
        const end = new Date(parseInt(endDate));

        // find travel stoories that belong to the authenticated user and fall within the data range
        const filteredStories = await TravelStory.find({
            userId: userId,
            visitedDate: { $gte: start, $lte: end},
        }).sort({ isFavourite: -1})

        res.status(400).json({
            stories: filteredStories,
        })
    } catch (error) {
        res.status(500).json({
            error: true,
            message: error.message
        })
    }
})

app.listen(8080)
module.exports = app;