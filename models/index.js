require('dotenv').config()   
//using mongoose to ease the implementation
const mongoose = require("mongoose")

//address of mongo database
connection_String = "mongodb+srv://user:<password>@cluster0.njbyb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
//Contact Back End team if unable to create your own account
dbAddress = connection_String.replace("user",process.env.MONGO_USERNAME).replace("<password>",process.env.MONGO_PASSWORD)

//connect to database if database address is active, or else connect to local host
mongoose.connect( dbAddress || "mongodb://localhost", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  dbName: "PersonalCRM"
})

const db = mongoose.connection

db.on("error", err => {
  console.error(err);
  process.exit(1)
})

db.once("open", async () => {
  console.log("Connected on " + db.host + ":" + db.port)
})

require("./db")
