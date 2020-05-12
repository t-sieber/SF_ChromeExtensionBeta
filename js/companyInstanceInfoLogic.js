
document.addEventListener('DOMContentLoaded', function () {
    waitForDefinement();
}, true);


function waitForDefinement(){
    if(typeof SESSION_ID !== "undefined"){
        loadCompanyInformation();
    }
    else{
        setTimeout(waitForDefinement, 250);
    }
}




function loadCompanyInformation() {
  
      let path = '/services/data/v33.0/query/?q=SELECT%20Name%20,%20PrimaryContact%20,%20InstanceName%20FROM%20Organization';
      fetch(ENDPOINT_URL + path, {
        method: 'GET',
        headers: {
            'Authorization': SESSION_ID
        }
      })
      .then(json)
      .then(function (data) {
        console.log('Request succeeded with JSON response', data);
        parseCompanyInformation(data.records[0]);
        findInstanceStatus(data.records[0].InstanceName);
        
        
        //createNotification('Data fetched successfully', 'We got back ' + data.size + ' records');
      })
      .catch(function (error) {
        console.log('Request failed', error);
      });
}

function parseCompanyInformation(dataCompany) {
  document.getElementsByClassName('companyInfo_Name')[0].innerText = 'Name: ' + dataCompany.Name;
  document.getElementsByClassName('companyInfo_Contact')[0].innerText = 'Primary Contact: ' + dataCompany.PrimaryContact;
  document.getElementsByClassName('companyInfo_Instance')[0].innerText = 'Instance: ' + dataCompany.InstanceName;
}


function findInstanceStatus(instanceName) {
  fetch('https://api.status.salesforce.com/v1/instances/'+instanceName+'/status?childProducts=false', {
    method: 'GET'
  })
  .then(json)
  .then(function (data) {
    
    console.log('Request succeeded with JSON response', data);
    fillMaintenanceTable(data.Maintenances);
    fillIncidentsTable(data.Incidents);
    
    document.getElementsByClassName('companyInfo_ReleaseVersion')[0].innerText = 'Release: ' + data.releaseVersion;
    document.getElementsByClassName('companyInfo_Status')[0].innerText = 'Status: ' + data.status;
    
  })
  .catch(function (error) {
    console.log('Request failed', error);
  });
}

function fillMaintenanceTable(maintenanceData) {
  let table = document.getElementById('maintenanceTable');
  let tr = document.createElement('tr');

  var th1 = document.createElement('th');
  th1.style.minWidth = '10em';
  var th2 = document.createElement('th');
  th2.style.minWidth = '10em';
  var th3 = document.createElement('th');
  th3.style.minWidth = '10em';
  var th4 = document.createElement('th');

  th1.appendChild(document.createTextNode('Approx. Start Time'));
  th2.appendChild(document.createTextNode('Approx. End Time'));
  th3.appendChild(document.createTextNode('Name'));
  th4.appendChild(document.createTextNode('Additional Info'));

  tr.appendChild(th1);
  tr.appendChild(th2);
  tr.appendChild(th3);
  tr.appendChild(th4);
  
  table.appendChild(tr);
  for (let maintenance of maintenanceData) {
      let tr = document.createElement('tr');
    
      var td1 = document.createElement('td');
      var tdDiv1 = document.createElement('div');
      tdDiv1.style.overflow = 'scroll';
      tdDiv1.style.maxHeight = '5em';
      
      var td2 = document.createElement('td');
      
      var tdDiv2 = document.createElement('div');
      tdDiv2.style.overflow = 'scroll';
      tdDiv2.style.maxHeight = '5em';
      var td3 = document.createElement('td');
      
      var tdDiv3 = document.createElement('div');
      tdDiv3.style.overflow = 'scroll';
      tdDiv3.style.maxHeight = '5em';
      var td4 = document.createElement('td');
      
      var tdDiv4 = document.createElement('div');
      tdDiv4.style.overflow = 'scroll';
      tdDiv4.style.maxHeight = '5em';

      tdDiv1.appendChild(document.createTextNode(new Date(maintenance.plannedStartTime).toUTCString()));
      tdDiv2.appendChild(document.createTextNode(new Date(maintenance.plannedEndTime).toUTCString()));
      tdDiv3.appendChild(document.createTextNode(maintenance.name));
      tdDiv4.appendChild(document.createTextNode(maintenance.additionalInformation == null ? 'Not provided' : maintenance.additionalInformation));

      td1.appendChild(tdDiv1);
              td2.appendChild(tdDiv2);
                      td3.appendChild(tdDiv3);
                              td4.appendChild(tdDiv4);



      tr.appendChild(td1);
      tr.appendChild(td2);
      tr.appendChild(td3);
      tr.appendChild(td4);
      
      table.appendChild(tr);
  }
  
}

function fillIncidentsTable(incidentData) {
  if (incidentData.length == 0) {
    let table = document.getElementById('incidentTable');
    var tdDiv1 = document.createElement('div');
    
    tdDiv1.appendChild(document.createTextNode('Hooray! No incidents found!'));
    
                              table.appendChild(tdDiv1);
  } else {
  let table = document.getElementById('incidentTable');
  let tr = document.createElement('tr');

  var th1 = document.createElement('th');
  th1.style.minWidth = '10em';
  var th2 = document.createElement('th');
  th2.style.minWidth = '10em';
  var th3 = document.createElement('th');
  th3.style.minWidth = '7.5em';
  var th4 = document.createElement('th');
  th4.style.minWidth = '7.5em';

  th1.appendChild(document.createTextNode('Approx. Start Time'));
  th2.appendChild(document.createTextNode('Approx. End Time'));
  th3.appendChild(document.createTextNode('Type'));
  th4.appendChild(document.createTextNode('RootCause'));

  tr.appendChild(th1);
  tr.appendChild(th2);
  tr.appendChild(th3);
  tr.appendChild(th4);
  
  table.appendChild(tr);
  for (let incident of incidentData) {
      for (let incidentImpact of incident.IncidentImpacts) {
        let tr = document.createElement('tr');
    
        var td1 = document.createElement('td');
        var tdDiv1 = document.createElement('div');
        tdDiv1.style.overflow = 'scroll';
        tdDiv1.style.maxHeight = '5em';
      
        var td2 = document.createElement('td');
      
        var tdDiv2 = document.createElement('div');
        tdDiv2.style.overflow = 'scroll';
        tdDiv2.style.maxHeight = '5em';
        var td3 = document.createElement('td');
      
        var tdDiv3 = document.createElement('div');
        tdDiv3.style.overflow = 'scroll';
        tdDiv3.style.maxHeight = '5em';
        var td4 = document.createElement('td');
      
        var tdDiv4 = document.createElement('div');
        tdDiv4.style.overflow = 'scroll';
        tdDiv4.style.maxHeight = '5em';

        tdDiv1.appendChild(document.createTextNode(new Date(incidentImpact.startTime).toUTCString()));
        tdDiv2.appendChild(document.createTextNode(new Date(incidentImpact.endTime).toUTCString()));
        tdDiv3.appendChild(document.createTextNode(incidentImpact.type));
        tdDiv4.appendChild(document.createTextNode(incident.message.rootCause == null ? 'Not provided' : incident.message.rootCause));

        td1.appendChild(tdDiv1);
              td2.appendChild(tdDiv2);
                      td3.appendChild(tdDiv3);
                              td4.appendChild(tdDiv4);



                              tr.appendChild(td1);
                              tr.appendChild(td2);
                              tr.appendChild(td3);
                                tr.appendChild(td4);
      
                                table.appendChild(tr);
      }
  }
  }
  
}
