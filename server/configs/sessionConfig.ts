import session from 'express-session';

const sessionConfig = session({
  secret: "cyberwolve_secret_key",
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true },
});

export default sessionConfig;