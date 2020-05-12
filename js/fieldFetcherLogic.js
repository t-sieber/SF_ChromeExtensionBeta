
var objectLayoutAssignment = [];

document.addEventListener('DOMContentLoaded', function () {
    waitForDefinement();
    if (document.querySelector('button') != undefined) {
      document.getElementById('fetchLayout').addEventListener('click', function() {
        findFields();
      }, false);
    }
}, true);


function waitForDefinement(){
    if(typeof SESSION_ID !== "undefined"){
        loadPageLayouts();
    }
    else{
        setTimeout(waitForDefinement, 250);
    }
}

function loadPageLayouts() {
      let path = '/services/data/v33.0/tooling/query/?q=Select%20EntityDefinition.Label,%20Name%20,%20TableEnumOrId%20,EntityDefinition.QualifiedAPIName%20from%20Layout';
      fetch(ENDPOINT_URL + path, {
        method: 'GET',
        headers: {
            'Authorization': SESSION_ID
        }
      })
      .then(json)
      .then(function (data) {
        console.log('Request succeeded with JSON response', data);
        parseValuesIntoPicklists(data);
        //createNotification('Data fetched successfully', 'We got back ' + data.size + ' records');
      })
      .catch(function (error) {
        console.log('Request failed', error);
      });
}

function parseValuesIntoPicklists(responseData) {
    
    for (let singleResponse of responseData.records) {
      let objectName;
      if (singleResponse.EntityDefinition != undefined) {
        objectName = singleResponse.EntityDefinition.Label + ' (' + singleResponse.EntityDefinition.QualifiedApiName + ')';
      } else {
        objectName = singleResponse.TableEnumOrId;
      }
      
      if (objectLayoutAssignment[objectName]) {
        objectLayoutAssignment[objectName].layouts.push(singleResponse.Name);
      } else {
        objectLayoutAssignment[objectName] = {}; 
        objectLayoutAssignment[objectName].layouts = [];
        objectLayoutAssignment[objectName].layouts.push(singleResponse.Name);
      }
      
      
    }
    
    fillsObjectSelect(objectLayoutAssignment);
}

function fillsObjectSelect(sObjectAssignment) {
  
  var select = document.getElementById("sObjectTypes"); 
  Object.keys(sObjectAssignment).forEach(function(key,index) {
    var el = document.createElement("option");
    el.textContent = ''+key;
    el.value = ''+key;
    select.appendChild(el);
    // key: the name of the object key
    // index: the ordinal position of the key within the object 
  });
  
  
  
  fillLayoutSelect(Object.keys(sObjectAssignment)[0], sObjectAssignment);
  
  select.addEventListener('change', function() {
    fillLayoutSelect(select.value, objectLayoutAssignment);
  }, false);

}

function fillLayoutSelect(selectedSObjectType, sObjectAssignment) {
  var select = document.getElementById("pageLayouts"); 
  
  select.innerHTML = '';
  
  for (let layoutName of sObjectAssignment[selectedSObjectType].layouts) {
    console.dir(layoutName);
    var el = document.createElement("option");
    el.textContent = ''+layoutName;
    el.value = ''+layoutName;
    select.appendChild(el);
    // key: the name of the object key
    // index: the ordinal position of the key within the object 
  };
}


function findFields() {
  var sObjVal = document.getElementById("sObjectTypes").value;
  var pageLayVal = document.getElementById("pageLayouts").value; 
  
  let path = '/services/data/v36.0/tooling/query/?q=';
  let query = encodeURI('SELECT Id, Metadata FROM Layout Where Name = \'' + pageLayVal + '\'');
  fetch(ENDPOINT_URL + path + query, {
    method: 'GET',
    headers: {
        'Authorization': SESSION_ID
    }
  })
  .then(json)
  .then(function (data) {
    console.log('TOKEN: ' + SESSION_ID);
    console.dir(data.records[0]);
    decodeFieldInfo(data.records[0].Metadata.layoutSections);
  })
  .catch(function (error) {
    console.log('TOKEN: ' + SESSION_ID);
    console.log('Request failed', error);
  });
}

function decodeFieldInfo(fieldInfos) {
  let allFields = [];
  for (let sectionInfo of fieldInfos) {
    
    for (let columnInfo of sectionInfo.layoutColumns) {
      if (columnInfo.layoutItems != null) {
        for (let itemInfo of columnInfo.layoutItems) {
          allFields.push(itemInfo.field);
        }
      }
    }
    
  }
  
  var sObjVal = document.getElementById("sObjectTypes").value;
  var pageLayVal = document.getElementById("pageLayouts").value; 
  
  var blob = new Blob([allFields], {type: 'text/plain'});
  let filename = 'FieldExport-'+sObjVal+'-'+ pageLayVal + '.csv'; 				
       
  if(window.navigator.msSaveOrOpenBlob) {
           window.navigator.msSaveBlob(blob, filename);
         }else{
           var elem = window.document.createElement('a');
           elem.href = window.URL.createObjectURL(blob);
           elem.download = filename;
           document.body.appendChild(elem);
                   elem.click();					
                   document.body.removeChild(elem);
               }
}
