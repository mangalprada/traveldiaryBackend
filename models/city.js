const mongoose = require('mongoose');
const site = require('./site');
const Schema = mongoose.Schema;

const citySchema = new Schema(
  {
    cityname: {
      type: String,
      //required: true,
      unique: true,
      trim: true,
      minlength: 3
    },
    sites: [site.schema]
  },
  { timestamps: true }
);
const City = mongoose.model('City', citySchema);
module.exports = City;
