import React from "react";
import { Avatar } from "@mui/material";
import { Button } from "@mui/material";
import { CssBaseline } from "@mui/material";
import { TextField } from "@mui/material";
import { Link, } from "react-router-dom";
import { Grid } from "@mui/material";
import { Box } from "@mui/system";
import ContactMailIcon from '@mui/icons-material/ContactMail';
import { Typography } from "@mui/material";
import { makeStyles } from "@mui/material";
import { Container } from "@mui/material";
//import Logo from "../icons/logo.js";
import { Paper } from "@mui/material";



const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(4),
    paddingBottom: theme.spacing(2),
    marginRight: theme.spacing(3),
    marginLeft: theme.spacing(3),
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1)
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  }
}));

export default function Register() {
  const classes = useStyles();

  return (
    <Container component="main" maxWidth="md">
      <CssBaseline />
      <Paper variant="outlined">
        <div className={classes.paper}>
          
          <Avatar className={classes.avatar}>
            <ContactMailIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Register
          </Typography>
          <form className={classes.form} noValidate>
            <React.Fragment>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    id="firstName"
                    name="firstName"
                    label="First name"
                    fullWidth
                    autoComplete="given-name"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    id="lastName"
                    name="lastName"
                    label="Last name"
                    fullWidth
                    autoComplete="family-name"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    id="emailid"
                    name="emailid"
                    label="Email ID"
                    fullWidth
                    autoComplete="given-name"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    id="department"
                    name="department"
                    label="Department"
                    fullWidth
                    autoComplete="department-name"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    id="contactno"
                    name="contactno"
                    label="Contact Number"
                    fullWidth
                    autoComplete="mobile number"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    id="city"
                    name="city"
                    label="City"
                    fullWidth
                    autoComplete="city"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    id="state"
                    name="state"
                    label="State/Province/Region"
                    fullWidth
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    id="country"
                    name="country"
                    label="Country"
                    fullWidth
                    autoComplete="country"
                  />
                </Grid>
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
              >
                Register
              </Button>
              <Grid container>
                <Grid item xs></Grid>
                <Grid item>
                  <Link to="" variant="body2">
                    {"Have Account! SignIn here"}
                  </Link>
                </Grid>
              </Grid>
            </React.Fragment>
          </form>
        </div>
      </Paper>
      <Box mt={8}>
        
      </Box>
    </Container>
  );
}
