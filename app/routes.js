// how we handle different requests coming in routes
// our api's

//MY APP: Job Application Tracker
// Create (post) - Make something: collection(jobs): company , position, appliedDate, interviewDate, notes
// Read (get) - Get Something: ??
// Update (put) - Change something: application status (applied / in-progress / completed )
// Delete (delete) - Remove something: delete job


module.exports = function(app, passport, db) { // all 
const { ObjectID } = require("mongodb")
// normal routes ===============================================================

    // show the home page (will also have our login links)
    app.get('/', function(req, res) {
        res.render('index.ejs');
    });

    // PROFILE SECTION =========================
    app.get('/profile', isLoggedIn, function(req, res) {
        db.collection('jobs').find().toArray((err, jobs) => {
          if (err) return console.log(err)
          res.render('profile.ejs', 
          {
            user : req.user, // user information on every page
            jobs: jobs
          })
        })
    });

    // LOGOUT ==============================
    app.get('/logout', function(req, res) {
        req.logout(() => {
          console.log('User has logged out!')
        });
        res.redirect('/');
    });

// job board routes ===============================================================
    
    // // initial display of added jobs list on login
    // app.get('/profile', isLoggedIn, function(req, res) {
    //   db.collection('jobs').find({ userId: req.user._id }).toArray((err, jobs) => {
    //     if (err) return console.log(err);
        
    //     // Render profile.ejs with user information and jobs data
    //     res.render('profile.ejs', {
    //       user: req.user,
    //       jobs: jobs
    //     });
    //   });
    // });

    // add new jobs
    app.post('/jobs', (req, res) => {
      // object destructuring for values req.body
      const { company, position, appliedDate, status, notes } = req.body;
      db.collection('jobs').save(
        {
          company: company,
          position: position,
          appliedDate: appliedDate,
          status: status,
          notes: notes,
        }, 
        (err, result) => 
        {
          if (err) return console.log(err)
          console.log('Job application saved to database')
          res.redirect('/profile')
        }
  );
});

    // update the status of a job
    app.put('/jobs/status/:id', (req, res) => { 
      const jobId = req.params.id; // Get the job ID from the URL
      const newStatus = req.body.status; // Get the new status from the request body

      db.collection('jobs')
      .findOneAndUpdate(
        { 
          _id: new ObjectID(jobId) 
        },
        { 
          $set: { status: newStatus } 
        },
        (err, result) => 
        {
          if (err) return res.send(err)
          res.send(result)
        }
      )
    })

    app.delete('/jobs', (req, res) => {
      db.collection('jobs').findOneAndDelete(
        { 
          _id: ObjectID(req.body.id) 
        }, 
        (err, result) => 
        {
          if (err) return res.send(500, err)
          res.send('Job deleted!')
        }
      )
    })

// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================

    // locally --------------------------------
        // LOGIN ===============================
        // show the login form
        app.get('/login', function(req, res) {
            res.render('login.ejs', { message: req.flash('loginMessage') });
        });

        // process the login form
        app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

        // SIGNUP =================================
        // show the signup form
        app.get('/signup', function(req, res) {
            res.render('signup.ejs', { message: req.flash('signupMessage') });
        });

        // process the signup form
        app.post('/signup', passport.authenticate('local-signup', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/signup', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

// =============================================================================
// UNLINK ACCOUNTS =============================================================
// =============================================================================
// used to unlink accounts. for social accounts, just remove the token
// for local account, remove email and password
// user account will stay active in case they want to reconnect in the future

    // local -----------------------------------
    app.get('/unlink/local', isLoggedIn, function(req, res) {
        var user            = req.user;
        user.local.email    = undefined;
        user.local.password = undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    });

};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}
