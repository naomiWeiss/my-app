import React, { useState } from "react";
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import Select from 'react-select';
import 'react-data-grid/lib/styles.css';
//import DataGrid from 'react-data-grid';
import { DataGrid, GridToolbarExport, GridToolbarContainer  } from '@mui/x-data-grid';
import { styled } from '@mui/material/styles';
import { json } from "react-router-dom";

export default function Document(props) {

 //Initialize data:
  let [lastName, setLastName] = useState("");

  //List of Kupot Cholim
  const HMOoptions = [
    {  label: 'Clalit', value: 'Clalit'},
    {  label: 'Meuchedet', value: 'Meuchedet' },
    { label: 'Macabi', value: 'Macabi' },
    {  label: 'Leumit', value: 'Leumit' }
  ]
  
  //List of column in children table
  const columns= [
    { field: "id", headerName: "Identification Number ", width: 180, editable: true},
    { field: "name", headerName: "Name", editable: true },
    { field: "birthDate", headerName: "Date of birth", type: "date", width: 180, editable: true },
    ];


  //Rows for childrean table
  const [rows, setRows]  = useState([{id:"", name:"", birthDate:""},]);

  //ToolBar for children table  
  function CustomToolbar() {
    return (
        <GridToolbarContainer>
            <GridToolbarExport />
        </GridToolbarContainer>
    );
}

 //Creates CSV from html table, can be moved to a utility file
  const toCsv = function (table) {
    var csv = [];
    var rows = table.querySelectorAll("table tr");
  
    for (var i = 0; i < rows.length; i++) {
      var row = [],
        cols = rows[i].querySelectorAll("td, th");
      for (var j = 0; j < cols.length; j++) {
        if (cols[j].children.length > 0) { 
         let obj = cols[j].firstChild
         while((typeof obj.value == "undefined") || (obj.value==""))
         {
          if  ((obj.firstChild !== "undefined")&&(obj.firstChild !== null))
          {
           if ((obj.firstChild.outerHTML!== null) && (obj.firstChild.outerHTML!== "undefined") && (obj.firstChild.outerHTML!== "")&&(obj.firstChild.outerHTML.indexOf("react-select")>-1)){
            row.push(obj.innerText);
            break;  
           }
           obj = obj.firstChild; 
          }
          else{
            row.push(obj.innerText);
            break;
          }
         }
          if (obj.value !== "undefined")
         {
          row.push(obj.value);
         }
         } else {
          row.push(cols[j].innerText);
        }
      }
      csv.push(row.join(","));
    }
    return csv.join('\n');
    }

  //Downloads a file
  const download = function (text, fileName) {
    const link = document.createElement('a');
    link.setAttribute('href', `data:text/csv;charset=utf-8,${encodeURIComponent(text)}`);
    link.setAttribute('download', fileName);
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

const submitHandler = (event) => {
  event.preventDefault();

  //VAlidations
  if (document.getElementById("tz").value.length != 9) {
    alert ("Identification number needs to be 9 digits");
    return;
  }

  if (!/[a-zA-Z\" ]/.test(document.getElementById("fname").value)) {
    alert ("Invalid first name");
    return;
  }
  
  if (!/[a-zA-Z\" ]/.test(document.getElementById("lname").value)) {
    alert ("Invalid last name");
    return;
  }
   const csv = toCsv(document.getElementById('UserDetails'));
  // Download to file
  download(csv, 'download.csv');
};


  return (
    <div style={{alignContent:"center", textAlign: "center"}}>
        <form  onSubmit={submitHandler}>
          <h1>Hi {props.fname} {lastName}</h1>
          <div style={{alignContent:"center", paddingLeft:"550px"}}>
          <button id="export" type="submit" >
              Save user details to file 
            </button>
            <table id="UserDetails">
            <tbody>
              <tr>
                <td>First name</td>
                <td><input type="text" id="fname" defaultValue= {localStorage.getItem('fname')}
                onChange={(e) => { props.setFname(e.target.value); }} 
                onBlur={(e) => { localStorage.setItem('fname', JSON.stringify(e.target.value)); props.setStoredIn(true); }}
                required/></td>
              </tr>
              <tr>
                <td>Last name</td>
                <td><input type="text" id="lname" value={lastName} onChange={(e) => {setLastName(e.target.value)}} required/></td>
              </tr>
              <tr>
                <td>ID</td>
                <td><input id="tz" name="tz" maxLength="9"  onKeyPress={(event) => {
        if (!/[0-9]/.test(event.key)) {
          event.preventDefault();
        }
      }} required/></td>
              </tr>
              <tr>
                <td>Date of birth</td>
                <td><input type="date" min="1910-01-01" max="2024-12-31" required /></td>
              </tr>
              <tr>
                <td>Gender</td>
                <td>
                  <ul style={{listStyleType:"none", textAlign:"left"}}>
                    <li><input type="radio" value="male" name="radio" required/> male </li>
                    <li><input type="radio" value="female" name="radio" required/> female</li>
                  </ul>
                </td>
              </tr>
              <tr>
                <td>Kupat cholim</td>
                <td><Select options={HMOoptions} required/></td>
              </tr>
            </tbody>
          </table>
            
          </div>  
     
          <br/>
          <label><h4>Child information</h4></label>
          
          
          <br/>
          <div style={{ height: 300, width: '80%', paddingLeft:"300px" }}>
            <DataGrid
              
              columns={columns} 
              rows={rows}
              editMode ="row"
              disableMultipleSelection={false}
              rowsPerPageOptions={[]}
              getRowsToExport= {[]}
              checkboxSelection
              localeText={{
                      toolbarExport: "Save selected children to file"
              }}
              components={{
                Toolbar: CustomToolbar,
               }}
               />
          </div>
          <br/>
        </form>
    </div>
     
  );
}