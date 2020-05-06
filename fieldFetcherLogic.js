
var objectLayoutAssignment = [];

function parseValuesIntoPicklists(responseData) {
    debugger;
    console.dir(responseData);
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
