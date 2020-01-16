const router = require('express').Router();
const multer = require('multer');

let Site = require('../models/site');
let City = require('../models/city.js');

router.route('/').get((req, res) => {
  City.find()
    .then(cities => res.json(cities))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/sites/:id').get((req, res) => {
  City.findOne({ _id: req.params.id })
    .then(city => res.json(city))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/delete/:id/:siteid').delete((req, res) => {
  City.findOneAndUpdate(
    { _id: req.params.id },
    { $pull: { sites: { _id: req.params.siteid } } }
  )
    .then(() => res.json('success'))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/editsite/:id/:siteid').get((req, res) => {
  City.findOne({ _id: req.params.id })
    .then(city => {
      //console.log(city.sites.filter(site => site._id == req.params.siteid));
      res.json(city.sites.filter(site => site._id == req.params.siteid)[0]);
    })
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id').delete((req, res) => {
  City.findByIdAndDelete(req.params.id)
    .then(() => res.json('City deleted.'))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/city/:id').get((req, res) => {
  City.findOne({ _id: req.params.id })
    .then(city => res.json(city))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/add').post((req, res) => {
  const cityname = req.body.cityname;
  const sites = req.body.sites;

  const newCity = new City({ cityname, sites });

  newCity
    .save()
    .then(() => res.json('City added!'))
    .catch(err => res.status(400).json('Error: ' + err));
});

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    // rejects storing a file
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: fileFilter
});

router.route('/addsite/:id').patch(upload.single('imageData'), (req, res) => {
  const sitename = req.body.sitename;
  const description = req.body.description;
  const imageData = req.file.path;
  //const date = Date.parse(req.body.date);

  const newSite = new Site({
    sitename,
    description,
    imageData
    //date
  });
  City.findOneAndUpdate({ _id: req.params.id }, { $push: { sites: newSite } })
    .then(() => res.json('success'))
    .catch(err => res.status(400).json('Error: ' + err));
});

router
  .route('/editsite/:id/:siteid')
  .patch(upload.single('imageData'), (req, res) => {
    const sitename = req.body.sitename;
    const description = req.body.description;
    const imageData = req.file.path;
    //const date = Date.parse(req.body.date);

    // const newSite = new Site({
    //   sitename,
    //   description,
    //   //imageData
    //   //date
    // });
    City.findOneAndUpdate(
      { _id: req.params.id, 'sites._id': req.params.siteid },
      {
        $set: {
          'sites.$.sitename': sitename,
          'sites.$.description': description,
          'sites.$.imageData': imageData
        }
      }
    )
      .then(() => res.json('success'))
      .catch(err => res.status(400).json('Error: ' + err));
  });

router.route('/editcity/:id').patch((req, res) => {
  const cityname = req.body.cityname;

  City.findOneAndUpdate(
    { _id: req.params.id },
    { $set: { cityname: cityname } }
  )
    .then(() => res.json('success'))
    .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;
