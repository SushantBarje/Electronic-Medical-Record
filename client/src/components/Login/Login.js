import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate , useLocation} from "react-router-dom";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Navbar from '../layout/Navbar';
import PropTypes from 'prop-types';
import { isOptionGroup } from '@mui/base';


import axios from 'axios';
import useAuth from '../../hooks/useAuth';


const theme = createTheme();
const LOGIN_URL = '/users/login';

export default function Login() {

  const { setAuth } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [organization, setOrganization] = useState("");

  const handleSelectChange = (event) => {
    console.log(event.target.value);
    setRole(event.target.value);
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      username: data.get('username'),
      password: data.get('password'),
      role: data.get('role'),
      organization: data.get('organization')
    });

    try{
      const response = await axios.post(LOGIN_URL, 
        JSON.stringify({username: data.get('username'), password: data.get('password'), role: data.get('role'), organization: data.get('organization')}), 
        {
          headers: { 'Content-Type': 'application/json'},
          withCredentials: true
        }
      );
      
      console.log(response);
      console.log(JSON.stringify(response?.data));
      const accessToken = response?.data?.accessToken;
      const role = response?.data?.role;
      setAuth({username, password, role, accessToken});
      
      setUsername('');
      setPassword('');
      setRole('');
      setOrganization('');
      
      navigate(from, {replace: true});
      
    }catch(err){
      if(!err?.response){
        console.log("no server response");
      }else if(err.response?.status === 400){
        console.log("username apsswe");
      }else if(err.response?.status === 402){
        console.log("Unauthorized");
      }else{
        console.log("Login failed");
      }
    }
  };

  const selectOrganizations = () => {
    if (role === 'admin' || role === 'doctor') {
      return (
        <FormControl margin="normal" required fullWidth>
          <InputLabel id="select-organization">Organization</InputLabel>
          <Select
            labelId="select-organization"
            id="select-organization"
            value={organization}
            label="Organization"
            name="organization"
            onChange={(e) => { setOrganization(e.target.value) }}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            <MenuItem value='doctor'>Doctor Department</MenuItem>
            <MenuItem value='laboratory'>Laboratory Department</MenuItem>
          </Select>
        </FormControl>
      )
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <Navbar/>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Login
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <FormControl margin="normal" required fullWidth>
              <InputLabel id="role-select">Role</InputLabel>
              <Select
                labelId="role-select"
                id="role-select"
                value={role}
                label="Role"
                name="role"
                onChange={handleSelectChange}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value='admin'>Admin</MenuItem>
                <MenuItem value='doctor'>Doctor</MenuItem>
                <MenuItem value='patient'>Patient</MenuItem>
              </Select>
            </FormControl>
            {selectOrganizations()}
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Log In
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

