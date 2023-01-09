//when page loads, automatically go to competition mode
switchDisplayMode("comp");


//below to other comment is all pynetworktables2js
// sets a function that will be called when the websocket connects/disconnects
NetworkTables.addWsConnectionListener(onNetworkTablesConnection, true);
	
// sets a function that will be called when the robot connects/disconnects
NetworkTables.addRobotConnectionListener(onRobotConnection, true);

// sets a function that will be called when any NetworkTables key/value changes
NetworkTables.addGlobalListener(onValueChanged, true);

function onRobotConnection(connected) {
	$('#robotstate').text(connected ? "Connected!" : "Disconnected");
	$('#robotAddress').text(connected ? NetworkTables.getRobotAddress() : "disconnected");
}

function onNetworkTablesConnection(connected) {

	if (connected) {
		$("#connectstate").text("Connected!");
		
		// clear the table
		$("#nt tbody > tr").remove();
		
	} else {
		$("#connectstate").text("Disconnected!");
	}
}
//everything above is from pynetworktables2js example js

function onValueChanged(key, value, isNew) {

	// key thing here: we're using the various NetworkTable keys as
	// the id of the elements that we're appending, for simplicity. However,
	// the key names aren't always valid HTML identifiers, so we use
	// the NetworkTables.keyToId() function to convert them appropriately

	if (isNew) {
		var tr = $('<tr></tr>').appendTo($('#nt > tbody:last'));
		$('<td></td>').text(key).appendTo(tr);
		$('<td></td>').attr('id', NetworkTables.keyToId(key))
					   .text(value)
					   .appendTo(tr);
	} else {
	
		// similarly, use keySelector to convert the key to a valid jQuery
		// selector. This should work for class names also, not just for ids
		$('#' + NetworkTables.keySelector(key)).text(value);
	}

	updateDashboard(key, value);
}

/// @TODO: make sure this can work with all widget types once that feature is added
function updateDashboard(key, value)
{
	if(document.getElementById(key + "-Content"))
	{
		document.getElementById(key + "-Content").textContent = value;
	}
}
//Function to switch between debug and comp mode
function switchDisplayMode(mode)
{
    if (mode === "comp")
    {
        document.getElementById("nt").style.display = "none";
		populateDefaults();
    }
    else if (mode === "debug")
    {
        document.getElementById("nt").style.display = "block";
    }
}

//Function to populate network table dropdown to add fields onto page
function populateSelectionDropdown()
{
	const dropDown = document.getElementById('myDropdown');

	fields = document.getElementsByTagName('td');

	const count = fields.length;
	for (let i = 0; i < count; i++)
	{
		if(!fields[i].hasAttribute('id'))
		{
			const node = document.createElement("button");
			const textnode = document.createTextNode(fields[i].textContent);
			node.appendChild(textnode);
			node.onclick = addToDashboard.bind(this, fields[i].textContent);
			dropDown.appendChild(node);
			
		}
	}
}

let populated = false;

/* When the user clicks on the button,
toggle between hiding and showing the dropdown content */
function myFunction() {
	document.getElementById("myDropdown").classList.toggle("show");

	if(!populated)
	{
		populateSelectionDropdown();
	}

	populated = true;
  }
  
  /// @TODO: Filter function runs on mouse over and will filter out entries that are already out on the dashboard

  function filterFunction() {
	var input, filter, ul, li, a, i;
	input = document.getElementById("myInput");
	filter = input.value.toUpperCase();
	div = document.getElementById("myDropdown");
	a = div.getElementsByTagName("button");
	for (i = 0; i < a.length; i++) {
	  txtValue = a[i].textContent || a[i].innerText;
	  if (txtValue.toUpperCase().indexOf(filter) > -1) {
		a[i].style.display = "";
	  } else {
		a[i].style.display = "none";
	  }
	}
}

function dragElement(elmnt) {
	var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
	elmnt.onmousedown = dragMouseDown;
  
	function dragMouseDown(e) {
	  e = e || window.event;
	  e.preventDefault();
	  // get the mouse cursor position at startup:
	  pos3 = e.clientX;
	  pos4 = e.clientY;
	  document.onmouseup = closeDragElement;
	  // call a function whenever the cursor moves:
	  document.onmousemove = elementDrag;
	}
  
	function elementDrag(e) {
	  e = e || window.event;
	  e.preventDefault();
	  // calculate the new cursor position:
	  pos1 = pos3 - e.clientX;
	  pos2 = pos4 - e.clientY;
	  pos3 = e.clientX;
	  pos4 = e.clientY;
	  // set the element's new position:
	  elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
	  elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
	}
  
	function closeDragElement() {
	  // stop moving when mouse button is released:
	  document.onmouseup = null;
	  document.onmousemove = null;
	}
}

function saveCurrentLayout()
{
	const currentWidgets = document.getElementsByClassName("draggableheader");
	for(let cW of currentWidgets)
	{
		//check if we have already declared this entry in localStorage
		//if statement checks if its a "new" entry being added
		//otherwise, we can use the id of the div as the "prefix" to the web storage key
		
		//Webstore standard only supports string
		localStorage.setItem(cW.id+"::ShowDefault", "true");
		localStorage.setItem(cW.id+"::XPos", cW.style.left);
		localStorage.setItem(cW.id+"::YPos", cW.style.top);
		localStorage.setItem(cW.id+"::WidgetType", cW.dataset.widgetType);
	}
}

function populateDefaults()
{
	for(let i = 0; i < localStorage.length; i++)
	{
		var currentKey = localStorage.key(i);
		if(currentKey.includes("::ShowDefault"))
		{
			var header = currentKey.substring(0, currentKey.length-13);
			addToDashboard(header);
		}
	}
}

function addToDashboard(header)
{
	//Make sure we don't duplicate entries
	if(!document.getElementById(header))
	{
		//Create div with top and left being the x and y pos, get network table key
		const node = document.createElement("div");
		const textnode = document.createTextNode(header);
		node.className = "draggableheader";
		node.id = header;
		node.dataset.widgetType = localStorage.getItem(header+"::WidgetType");
		node.style.top = localStorage.getItem(header+"::YPos");
		node.style.left = localStorage.getItem(header+"::XPos");
		node.appendChild(textnode);

		var contentChild;

		/// @TODO: determine type by widget type first, if not, then fallback onto network table value

		if(localStorage.getItem(header+"::WidgetType"))
		{
			//Add widget functionality based on data type, will be determined when first constructing the widget
			switch(localStorage.getItem(header+"::WidgetType"))
			{
				case "text":
					contentChild = document.createTextNode(NetworkTables.getValue(header, "Default Value"));
					console.log("text");
					break;
				case "button":
					contentChild = document.createTextNode(NetworkTables.getValue(header, "Default Value"));
					contentChild = document.createElement("button");
					contentChild.textContent = NetworkTables.getValue(header, "Default Value");
					console.log("button");
					break;
				case "input":
					console.log("input");
				default:
					console.log("default");
					break;
			}
		}
		else //default case if the widget isnt in the saved layout
		{
			contentChild = document.createTextNode(NetworkTables.getValue(header, "Default Value"));
		}

		const contentNode = document.createElement("div");
		contentNode.className = "draggablecontent";
		contentNode.id = header + "-Content";
		
		contentNode.appendChild(contentChild);
		node.appendChild(contentNode);

		document.body.appendChild(node);

		dragElement(node);
	}
}

function testFunc()
{
	console.log("Hel");
}