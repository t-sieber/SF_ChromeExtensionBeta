var FIELD_DATA_RESPONSE;
var FIELD_INFO_RESPONSE; 

var FIELD_DATA_INFO;

document.addEventListener('DOMContentLoaded', function () {
  waitForDefinement();
}, true);


function waitForDefinement(VARIABLE){
    if(typeof SESSION_ID !== "undefined"){
        fetchAvailableSObjects();
    }
    else{
        setTimeout(waitForDefinement, 250);
    }
}


function fetchAvailableSObjects() {
      let path = '/services/data/v45.0/sobjects';
      fetch(ENDPOINT_URL + path, {
        method: 'GET',
        headers: {
            'Authorization': SESSION_ID
        }
      })
      .then(json)
      .then(function (data) {
        console.log('Request succeeded with JSON response', data);
        chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
            let currentURL = tabs[0].url;
            checkURLForRecordId(currentURL, data);
            
            
        });
        //createNotification('Data fetched successfully', 'We got back ' + data.size + ' records');
      })
      .catch(function (error) {
        console.log('Request failed', error);
      });
}


function checkURLForRecordId(currentURL, availableSObjects) {
  let testUrl = currentURL;
  let recordId = testUrl.substring(testUrl.substring(0, testUrl.indexOf('/view')).lastIndexOf('/') + 1, testUrl.indexOf('/view'));
  for (let sObject of availableSObjects.sobjects) {
    if (sObject.keyPrefix != undefined) {
      let indexOfKP = currentURL.indexOf(sObject.keyPrefix);
      if (indexOfKP > -1) {
        if ((indexOfKP <= currentURL.length - 15)) {
          let suspectId = currentURL.substring(indexOfKP, indexOfKP+15);
          if (suspectId.match(/^[a-z0-9]+$/i)) {
            console.dir(sObject);
            document.getElementById("recordId").innerText = suspectId;
            document.getElementById("sObjectName").innerHTML = sObject.label + ' - ' + sObject.name +'<br />' + 'Custom: ' + sObject.custom  + ' Triggable: ' + sObject.triggerable;
            findDataForSObject(suspectId, sObject.urls.sobject);
            describeSObject(sObject.urls.describe);
            buildMapInfo();
          }
        }
      }
    }
  }
}

function buildMapInfo() {
  if(typeof FIELD_DATA_RESPONSE !== "undefined" && typeof FIELD_INFO_RESPONSE !== "undefined"){
      console.dir(FIELD_DATA_RESPONSE);
      console.dir(FIELD_INFO_RESPONSE);
      let FIELD_DATA_INFO = [];
      
      for (let fields of FIELD_INFO_RESPONSE) {
          console.log(fields.name);
          console.log(FIELD_DATA_RESPONSE[fields.name]);
          if (FIELD_DATA_RESPONSE[fields.name] != undefined && typeof FIELD_DATA_RESPONSE[fields.name] != "object") {
            let fieldDataTemplate = {};
            fieldDataTemplate.fieldData = fields;
            fieldDataTemplate.data = FIELD_DATA_RESPONSE[fields.name];
            FIELD_DATA_INFO.push(fieldDataTemplate);
          }
      }
      
      fillRecordTable(FIELD_DATA_INFO);
      
      console.dir(FIELD_DATA_INFO);
  }
  else{
      setTimeout(buildMapInfo, 250);
  }
}

function describeSObject(sObjectDescribeCallQuery) {
  let path = sObjectDescribeCallQuery;
  fetch(ENDPOINT_URL + path, {
    method: 'GET',
    headers: {
        'Authorization': SESSION_ID
    }
  })
  .then(json)
  .then(function (data) {
    FIELD_INFO_RESPONSE = data.fields;
    //createNotification('Data fetched successfully', 'We got back ' + data.size + ' records');
  })
  .catch(function (error) {
    console.log('Request failed', error);
  });
  
}

function findDataForSObject(recordId, sObjectDescribeCallQuery) {
  let path = sObjectDescribeCallQuery+'/'+recordId;
  fetch(ENDPOINT_URL + path, {
    method: 'GET',
    headers: {
        'Authorization': SESSION_ID
    }
  })
  .then(json)
  .then(function (data) {
    FIELD_DATA_RESPONSE = data;
    //createNotification('Data fetched successfully', 'We got back ' + data.size + ' records');
  })
  .catch(function (error) {
    console.log('Request failed', error);
  });
  
}

function fillRecordTable(FIELD_DATA_INFO) {
  let table = document.getElementById('recordDataList');
  let tr = document.createElement('tr');

  var th1 = document.createElement('th');
  var th2 = document.createElement('th');
  var th3 = document.createElement('th');
  var th4 = document.createElement('th');
  var th5 = document.createElement('th');
  var th6 = document.createElement('th');

  th1.appendChild(document.createTextNode('FieldLabel'));
  th2.appendChild(document.createTextNode('FieldName'));
  th3.appendChild(document.createTextNode('FieldType'));
  th4.appendChild(document.createTextNode('C|U'));
  th5.appendChild(document.createTextNode('Picklist values'));
  th6.appendChild(document.createTextNode('Datavalue'));

  tr.appendChild(th1);
  tr.appendChild(th2);
  tr.appendChild(th3);
  tr.appendChild(th4);
  tr.appendChild(th5);
  tr.appendChild(th6);
  
  table.appendChild(tr);
  console.dir(FIELD_DATA_INFO);
  for (let fieldInfo of FIELD_DATA_INFO) {
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
      var td5 = document.createElement('td');
      var tdDiv5 = document.createElement('div');
      tdDiv5.style.overflow = 'scroll';
      tdDiv5.style.maxHeight = '5em';
      
      var td6 = document.createElement('td');
      var tdDiv6 = document.createElement('div');
      tdDiv6.style.overflow = 'scroll';
      tdDiv6.style.maxHeight = '5em';

      tdDiv1.appendChild(document.createTextNode(fieldInfo.fieldData.label));
      tdDiv2.appendChild(document.createTextNode(fieldInfo.fieldData.name));
      tdDiv3.appendChild(document.createTextNode(fieldInfo.fieldData.type));
      let CRUD_string = '';
      
      if (fieldInfo.fieldData.createable) {
        CRUD_string += 'X';
      } else {
        CRUD_string += '_';
      }
       CRUD_string += '|';
      
      if (fieldInfo.fieldData.updateable) {
        CRUD_string += 'X';
      } else {
        CRUD_string += '_';
      }
      
      
      tdDiv4.appendChild(document.createTextNode(CRUD_string));
      
      let picklistNode = document.createElement('span');
      for (let picklistValue of fieldInfo.fieldData.picklistValues) {
        if (picklistValue.active) {
          picklistNode.innerHTML += 'L: ' + picklistValue.label + ' <br /> - V: ' + picklistValue.value + '<br /><br />';
        }
      }
      
      tdDiv5.appendChild(picklistNode);
      tdDiv6.appendChild(document.createTextNode(fieldInfo.data));



      td1.appendChild(tdDiv1);
      td2.appendChild(tdDiv2);
      td3.appendChild(tdDiv3);
      td4.appendChild(tdDiv4);
      td5.appendChild(tdDiv5);
      td6.appendChild(tdDiv6);



      tr.appendChild(td1);
      tr.appendChild(td2);
      tr.appendChild(td3);
      tr.appendChild(td4);
      tr.appendChild(td5);
      tr.appendChild(td6);
      
      table.appendChild(tr);
  }
}
