const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const siteSchema = new Schema(
  {
    sitename: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    imageData: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);
const Site = mongoose.model('Site', siteSchema);
module.exports = Site;
