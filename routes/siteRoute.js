const router = require('express').Router();
let Site = require('../models/site');
let city = require('../models/city');

router.route('/').get((req, res) => {
  Site.find()
    .then(sites => res.json(sites))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id').get((req, res) => {
  Site.findById(req.params.id)
    .then(Site => res.json(Site))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id').delete((req, res) => {
  Site.findByIdAndDelete(req.params.id)
    .then(() => res.json('Site deleted.'))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/update/:id').post((req, res) => {
  Site.findById(req.params.id)
    .then(Site => {
      Site.city = req.body.city;
      Site.sitename = req.body.sitename;
      Site.description = req.body.description;
      Site.date = Date(req.body.date);

      Site.save()
        .then(() => res.json('Site updated!'))
        .catch(err => res.status(400).json('Error: ' + err));
    })
    .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;
