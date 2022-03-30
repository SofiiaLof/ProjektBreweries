window.addEventListener("load", init);

function init() { 
  let form = document.getElementById("search-form"); 
  form.addEventListener("submit", searchForm); 
}


function searchForm(event) { 
  event.preventDefault();
  let searchField = document.getElementById("search");
  let tbody = document.getElementById("tbody"); 
  
  search(searchField.value, tbody);
}


function search(query, container) { 

  container.innerHTML = "";
 
  window
    .fetch(
      "https://api.openbrewerydb.org/breweries/search?query=" +
        encodeURIComponent(query)
    )
    .then(response => response.json()) 
    .then(data => {
      console.log(data);
      
      data.forEach(function(item, index) {
       
      
        Main(item, container, index);
      });
    });
}

function Main(item, container, index) {

  
  let row = document.createElement("tr"); 
  let rowCollapse = document.createElement("tr"); 


  container.appendChild(row); 
  container.appendChild(rowCollapse); 

 
  setAttributes(row, { // main row
   
    "data-toggle": "collapse", 
    "href": `#collapse${index}`, 
    "role": "button",
    "aria-expanded": "false", 
    "aria-controls": "collapse",
    "class": "main-table-rows"
  });

  setAttributes(rowCollapse, { // "Accordion" row
    
    "class": "collapse",
    "id": `#collapse${index}`
  });

  /* GENERAL TABLE BUILDING */

  /* ADD CLASS TOGGLE */
  

  row.addEventListener("click", function() {
   
  
    if (rowCollapse.classList.contains("show")) {
      
      rowCollapse.classList.remove("show");
    } else {
      rowCollapse.classList.add("show");
    }
  });
  /* ADD CLASS TOGGLE */

 
  let collapseContent = document.createElement("td"); 

  let mapLink = document.createElement("a");
  mapLink.textContent = "Search on Google";
  createMarker(item); 
  
  setAttributes(mapLink, { 
    
     "href": `https://www.google.com/maps/search/?api=1&query=${item.latitude},${
      item.longitude
    }`
  });

  setAttributes(collapseContent, { 
    
    "colspan": "4",
    "class": "collapse-content"
  });

  collapseContent.appendChild(mapLink); 
  rowCollapse.appendChild(collapseContent);

  
  let name = new setRowsData(item, row, item.name);
  name.createRow();

  let street = new setRowsData(item, row, item.street);
  street.createRow();

  let country = new setRowsData(item, row, item.city);
  country.createRow();

  let state = new setRowsData(item, row, item.state);
  state.createRow();

  let website_url = new setRowsData(item, collapseContent, item.website_url);
  website_url.createWebsiteLink();
  console.log(state);
}


class setRowsData {
  constructor(data, parent, value) {

    this.data = data;
    this.parent = parent;
    this.value = value;
    this.createRow = function() {
      let newRow = document.createElement("td");
      newRow.textContent = value;
      parent.appendChild(newRow);
    };
    this.createWebsiteLink = function() {
      let link = document.createElement("a");
      link.textContent = "Visit our website";
      link.setAttribute("href", value);
      parent.appendChild(link);
    };
  }
}


function setAttributes(el, attrs) { 
  for (var key in attrs) {
   
    el.setAttribute(key, attrs[key]);
  }
}


function createMarker(mapData) {
  var marker = new google.maps.Marker({
    position: new google.maps.LatLng(mapData.latitude, mapData.longitude),
   
  });
}
