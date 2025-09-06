const mongoose = require("mongoose");
const initData = require("./data");
const Listing = require("../models/listing");

const MONGO_URL = "mongodb://127.0.0.1:27017/wonderLust";

//! Creating connection with db
main()
  .then(() => {
    console.log("connection created!");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  await Listing.deleteMany({});
  initData.data=initData.data.map((obj)=>({
    ...obj, 
    owner:"68a8cde875f69e1ae3a5dc66" //dummy user id from db
  }))
  await Listing.insertMany(initData.data);
  console.log("Data was inserted in db");
};

initDB();
