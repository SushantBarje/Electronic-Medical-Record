import * as React from "react";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
//import { useHistory } from "react-router-dom";
import { useNavigate } from 'react-router-dom';

const NavList = () => {
  const navigate = useNavigate();
  return (
    <div>
      <ListItem button onClick={() => navigate.push("/books")}>
        <ListItemIcon>
          <PeopleIcon />
        </ListItemIcon>
        <ListItemText primary="View Patient" />
      </ListItem>
      <ListItem button onClick={() => navigate.push("/dash")}>
        <ListItemIcon>
          <DashboardIcon />
        </ListItemIcon>
        <ListItemText primary="Dashboard" />
      </ListItem>
    </div>
  );
};

export default NavList;
