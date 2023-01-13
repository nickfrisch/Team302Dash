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

	//The reason for takinga substring is to remove -Content from the id to get the "header" child div
	document.getElementById(elmnt.id.substring(0,elmnt.id.length-8)).onmousedown = dragMouseDown;

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

function showWidgetMenu(mouseEvent)
{
	const node = document.createElement("div");
	node.style.top = mouseY(mouseEvent) + "px";
	node.style.left = mouseX(mouseEvent) + "px"
	node.id= "contextMenu";
	node.className = "draggablecontent";
	
	const testNode = document.createTextNode("Hello World");
	node.appendChild(testNode);
	document.body.appendChild(node);

	function mouseX(evt) {
		if (evt.pageX) {
		  return evt.pageX;
		} else if (evt.clientX) {
		  return evt.clientX + (document.documentElement.scrollLeft ?
			document.documentElement.scrollLeft :
			document.body.scrollLeft);
		} else {
		  return null;
		}
	  }
	  
	  function mouseY(evt) {
		if (evt.pageY) {
		  return evt.pageY;
		} else if (evt.clientY) {
		  return evt.clientY + (document.documentElement.scrollTop ?
			document.documentElement.scrollTop :
			document.body.scrollTop);
		} else {
		  return null;
		}
	  }
}