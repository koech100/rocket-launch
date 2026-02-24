const express = require('express');
const session = require('express-session');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = 8080;

// ============================
// Middleware
// ============================
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static files
app.use(express.static(path.join(__dirname)));

// Session configuration
app.use(session({
  secret: 'rocket-secret-key-123', // replace with secure secret
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 60 * 60 * 1000 } // 1 hour
}));

// ============================
// Logging Middleware
// ============================
app.use((req, res, next) => {
  if (req.session.user) {
    console.log(`[${new Date().toISOString()}] User: ${req.session.user.username} accessed ${req.url}`);
  } else {
    console.log(`[${new Date().toISOString()}] Guest accessed ${req.url}`);
  }
  next();
});

// ============================
// Authentication Middleware
// ============================
const requireLogin = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    res.redirect('/login.html');
  }
};

// ============================
// Routes
// ============================

// Default route -> login page
app.get('/', (req, res) => {
  res.redirect('/login.html');
});

// Login POST
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Demo authentication
  if (username === 'admin' && password === 'password123') {
    req.session.user = { username };
    return res.redirect('/index.html');
  } else {
    return res.send('<h3>Invalid credentials. <a href="/login.html">Try again</a></h3>');
  }
});

// Logout
app.get('/logout', (req, res) => {
  req.session.destroy(err => {
    res.redirect('/login.html');
  });
});

// Protect all HTML pages except login.html
app.use((req, res, next) => {
  if (req.path.endsWith('.html') && req.path !== '/login.html') {
    return requireLogin(req, res, next);
  }

  // Redirect logged-in users away from login.html
  if (req.path === '/login.html' && req.session.user) {
    return res.redirect('/index.html');
  }

  next();
});

// Catch-all for 404
app.use((req, res) => {
  res.status(404).send('<h1>404 Not Found</h1>');
});

// ============================
// Start Server
// ============================
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});

