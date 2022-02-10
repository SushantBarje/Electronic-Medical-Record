import React from "react";
//import Avatar from "@material-ui/core/Avatar";
import { Button } from "@mui/material";
import { CssBaseline } from "@mui/material";
import { TextField } from "@mui/material";
import { Grid } from "@mui/material";
import { Box } from "@mui/system";
import { Link,} from "react-router-dom";
// import VpnKeyOutlinedIcon from "@material-ui/icons/VpnKeyOutlined";
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

export default function ForgetPass() {
  const classes = useStyles();

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Paper variant="outlined">
        <div className={classes.paper}>
         
           {/*<Avatar className={classes.avatar}>
            <VpnKeyOutlinedIcon />
          </Avatar> */}
          <Typography component="h1" variant="h5">
            Reset Password
          </Typography>
          <form className={classes.form} noValidate>
            <TextField
              variant="outlined"
              margin="normal"
              required
              id="firstName"
              name="firstName"
              label="First name"
              fullWidth
              autoComplete="given-name"
              autoFocus
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Reset Password
            </Button>
            <Grid container>
              <Grid item xs></Grid>
              <Grid item>
                <Link to="" variant="body2">
                  {"Have Account! SignIn here"}
                </Link>
              </Grid>
            </Grid>
          </form>
        </div>
      </Paper>
      <Box mt={8}>
        
      </Box>
    </Container>
  );
}
