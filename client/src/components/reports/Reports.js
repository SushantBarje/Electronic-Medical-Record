import * as React from "react";
import Link from "@mui/material/Link";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Title from "./Title";
import Button from "@mui/material/Button";
// Generate Order Data
function createData(id, date, name, action, report) {
  return { id, date, name, action, report };
}

const rows = [
  createData(0, "16 Mar, 2019", "Rohit", "Accept", "Report"),
  createData(1, "16 Mar, 2019", "Rohit", "Accept", "Report"),
  createData(2, "16 Mar, 2019", "Rohit", "Accept", "Report"),
  createData(3, "16 Mar, 2019", "Sushant", "Accept", "Report"),
  createData(4, "15 Mar, 2019", "Sushant", "Accept", "Report"),
  createData(4, "15 Mar, 2019", "Sahil", "Accept", "Report")
];

function preventDefault(event) {
  event.preventDefault();
}
function openPdf() {
  window.open("https://drive.google.com/file/d/1chX7MAuJKAJwqGFAV1M4plRA63Nxt6te/view", "_blank");
}

export default function Orders() {
  return (
    <React.Fragment>
      <Title>Recent Patients</Title>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Action</TableCell>
            <TableCell>View Report</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.date}</TableCell>
              <TableCell>{row.name}</TableCell>
              <TableCell>
              <Button variant="outlined">Accept</Button>
              </TableCell>
              <TableCell>
                <a onClick={openPdf} href="#">
                  {row.report}
                </a>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Link color="primary" href="#" onClick={preventDefault} sx={{ mt: 3 }}>
        See more Patient
      </Link>
    </React.Fragment>
  );
}
