//when page loads, automatically go to competition mode
switchDisplayMode("comp");

/// @TODO: make sure this can work with all widget types once that feature is added
function updateDashboard(key, value)
{
	if(document.getElementById(key + "-Content"))
	{
		switch (document.getElementById(key + "-Content").dataset.widgetType)
		{
			case "text":
				document.getElementById(key + "-Text").textContent = value;
				break;
			case "button":
				document.getElementById(key + "-Button").textContent = value;
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
	if(!document.getElementById(header))
	{
		//Create div with top and left being the x and y pos, get network table key
		const node = document.createElement("div");
		const textnode = document.createTextNode(header);
		node.className = "draggableheader";
		node.id = header;
		node.appendChild(textnode);

		var contentChild;
		var entryType = "text";

		//If widget to be added is saved, use localStorage value for widget type
		if(localStorage.getItem(header+"::ShowDefault"))
		{
			switch(localStorage.getItem(header+"::WidgetType"))
			{
				
				case "button":
					contentChild = document.createElement("button");
					contentChild.textContent = NetworkTables.getValue(header, "Default Value");
					contentChild.id = header+"-Button";
					entryType = "button";
					break;
				case "input":
					contentChild = document.createElement("input");
					contentChild.type = "text";
					contentChild.id = header+"-Input";
					entryType = "input";
					contentChild.addEventListener("keydown", (e) => {
						if (e.key === "Enter"){
							setEntryValue(e.target.value, header);
						}
					});
				case "text":
					contentChild = document.createElement("p");
					contentChild.textContent = NetworkTables.getValue(header, "Default Value");
					contentChild.id = header+"-Text";
					entryType = "text";
				default:
					contentChild = document.createTextNode(NetworkTables.getValue(header, "Default Value"));
					break;
			}
		}
		else //Widget is not saved, so default to text type
		{
			contentChild = document.createElement("p");
			contentChild.textContent = NetworkTables.getValue(header, "Default Value");
			contentChild.id = header+"-Text";
			entryType = "text";
		}

		const contentNode = document.createElement("div");
		contentNode.className = "draggablecontent";
		contentNode.id = header + "-Content";
		contentNode.dataset.widgetType = localStorage.getItem(header+"::WidgetType") ? localStorage.getItem(header+"::WidgetType") : entryType; //If saved, set value to saved value, else use entryType
		contentNode.style.top = localStorage.getItem(header+"::YPos");
		contentNode.style.left = localStorage.getItem(header+"::XPos");

		contentNode.appendChild(node);
		if(contentChild !== undefined)
		{
			contentNode.appendChild(contentChild);
		}
		
		document.body.appendChild(contentNode);

		//Make widget draggable
		dragElement(contentNode);

		//Add support for context menu
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