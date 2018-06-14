"use strict";

// Routes, with inline controllers for each route.
var express = require('express');
var router = express.Router();
var Project = require('./models').Project;
var strftime = require('strftime');

// Example endpoint
router.get('/create-test-project', function(req, res) {
  var project = new Project({
    title: 'I am a test project'
  });
  project.save(function(err) {
    if (err) {
      res.status(500).json(err);
    } else {
      res.send('Success: created a Project object in MongoDb');
    }
  });
});

// Part 1: View all projects
// Implement the GET / endpoint.
router.get('/', function(req, res) {
  // YOUR CODE HERE
  Project.find({}, function(err, array) {
    res.render('index', {items: array});
  });
});

// Part 2: Create project
// Implement the GET /new endpoint
router.get('/new', function(req, res) {
  // YOUR CODE HERE
  res.render('new', {
  });
});

// Part 2: Create project
// Implement the POST /new endpoint
router.post('/new', function(req, res) {
  // YOUR CODE HERE
  var allPass = true;
  var myTitle = "";
  if (!req.body.title || req.body.title.trim() === "") {
    myTitle = "Error";
    allPass = false;
  } else {
    myTitle = req.body.title;
  }
  var myGoal = "";
  if (!req.body.goal || req.body.goal.trim() === "") {
    myGoal = "Error";
    allPass = false;
  } else {
    myGoal = req.body.goal;
  }
  var myD = "";
  if (!req.body.description || req.body.description.trim() === "") {
    myD = "Error";
    allPass = false;
  } else {
    myD = req.body.description;
  }
  var myStart = "";
  if (!req.body.start || req.body.start.trim() === "") {
    myStart = "Error";
    allPass = false;
  } else {
    myStart = req.body.start;
  }
  var myEnd = "";
  if (!req.body.end || req.body.end.trim() === "") {
    myEnd = "Error";
    allPass = false;
  } else {
    myEnd = req.body.end;
  }

  if (!allPass) {
    res.render('new', {
      title: myTitle,
      goal: myGoal,
      description: myD,
      start: myStart,
      end: myEnd
    });
  } else {
    var newProject = new Project({
      title: myTitle,
      goal: myGoal,
      description: myD,
      start: myStart,
      end: myEnd,
      category: req.body.category
    });
    newProject.save(function(error) {
      if (error) {
        console.log("Project not created", error);
      } else {
        res.redirect('/');
      }
    });
  }
});

// Part 3: View single project
// Implement the GET /project/:projectid endpoint
router.get('/project/:projectid', function(req, res) {
  // YOUR CODE HERE
  Project.findById(req.params.projectid, function(err, user) {
    if (err) {
      console.log(':(');
    } else {
      var sum = 0;
      user.contributions.forEach(function(element) {
        sum += element.amount;
      });
      var p = sum / user.goal * 100;
      res.render('project', {project: user, percent: p, pid: user._id});
    }
  });
});

// Part 4: Contribute to a project
// Implement the GET /project/:projectid endpoint
router.post('/project/:projectid', function(req, res) {
  // YOUR CODE HERE
  Project.findById(req.params.projectid, function(err, user) {
    if (err) {
      console.log(':(');
    } else {
      user.contributions.push({name: req.body.name, amount: req.body.amount});
      user.save(function(error) {
        if (error) {
          console.log('error');
        } else {
          res.redirect('/project/' + req.params.projectid);
        }
      });
    }
  });
});

// Part 6: Edit project
// Create the GET /project/:projectid/edit endpoint
// Create the POST /project/:projectid/edit endpoint

module.exports = router;
