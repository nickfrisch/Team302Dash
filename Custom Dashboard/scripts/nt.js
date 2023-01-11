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
		switch (document.getElementById(key + "-Content").dataset.widgetType)
		{
			case "text":
				document.getElementById(key + "-Content").textContent = value;
				break;
			case "input":
				document.getElementById(key + "-Input").value = value;
		}

		
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
		node.appendChild(textnode);

		var contentChild;
		var entryType = "input";

		/// @TODO: determine type by widget type first, if not, then fallback onto network table value

		if(localStorage.getItem(header+"::WidgetType"))
		{
			//Add widget functionality based on data type, will be determined when first constructing the widget
			switch(localStorage.getItem(header+"::WidgetType"))
			{
				case "text":
					//contentChild = document.createTextNode(NetworkTables.getValue(header, "Default Value"));
					//console.log("text");
					contentChild = document.createElement("input");
					contentChild.type = "text";
					contentChild.value = "Hello World";
					contentChild.id = header+"-Input";
					entryType = "input";
					contentChild.addEventListener("keydown", (e) => {
						if (e.key === "Enter"){
							setEntryValue(e.target.value, header);
							console.log("setEntryValue");
						}
					});
					// contentChild.setAttribute('tabindex', '1');
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
			//contentChild = document.createTextNode(NetworkTables.getValue(header, "Default Value"));
			contentChild = document.createElement("input");
			contentChild.type = "text";
			contentChild.value = NetworkTables.getValue(header, "Default Value")
			contentChild.id = header+"-Input";
			contentChild.addEventListener("keydown", (e) => {
				if (e.key === "Enter"){
					setEntryValue(e.target.value, header);
					console.log("setEntryValue");
				}
			});
		}

		const contentNode = document.createElement("div");
		contentNode.className = "draggablecontent";
		contentNode.id = header + "-Content";
		contentNode.dataset.widgetType = localStorage.getItem(header+"::WidgetType") ? localStorage.getItem(header+"::WidgetType") : entryType;
		contentNode.style.top = localStorage.getItem(header+"::YPos");
		contentNode.style.left = localStorage.getItem(header+"::XPos");

		contentNode.appendChild(node);
		contentNode.appendChild(contentChild);

		document.body.appendChild(contentNode);

		dragElement(contentNode);
		contentNode.addEventListener('contextmenu', function(e) {
			//alert("You've tried to open context menu"); //here you draw your own menu
      		e.preventDefault();
			showWidgetMenu(e);
		}, false);
	}
}

function setEntryValue(targetVal, header)
{
	NetworkTables.putValue(header, targetVal);
}