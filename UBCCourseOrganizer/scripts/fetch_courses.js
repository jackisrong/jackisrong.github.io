function chosenSession() {
	// Create a request variable and assign a new XMLHttpRequest object to it.
	var request = new XMLHttpRequest();

	// Open a new connection, using the GET request on the URL endpoint
	var selectedSession = document.getElementById("sessionSelector").value;
	request.open('GET', 'https://ubc-courses-api.herokuapp.com/' + selectedSession + '/', true);
	
	// Clear list, disable empty option
	var courseNameSelector = document.getElementById("courseNameSelector");
	var courseNameSelectorLength = courseNameSelector.length;
	for (var i = 0; i < courseNameSelectorLength; i++) {
		courseNameSelector.remove(0);
	}
	var emptyOption = document.createElement("option");
	emptyOption.text = "";
	courseNameSelector.add(emptyOption);
	document.getElementById("sessionSelector").getElementsByTagName("option")[0].disabled = true;

	request.onload = function () {
		// Begin accessing JSON data here
		var data = JSON.parse(this.response);
		
		if (request.status >= 200 && request.status < 400) {
			// Create array of all course names/codes
			var courseCodes = [];
			
			// Add course codes to array and sort
			for (var i = 0; i < data.length; i++) {
				courseCodes.push(data[i].code);
			}
			courseCodes.sort();
			
			// Add course codes to drop down
			for (var i = 0; i < courseCodes.length; i++) {
				var option = document.createElement("option");
				option.text = courseCodes[i];
				courseNameSelector.add(option);
			}
		} else {
			console.log('We have encountered an error when accessing the UBC Courses API when fetching the course names.')
		}
	}

	// Send request
	request.send()
}




function chosenCourseName() {
	// Create a request variable and assign a new XMLHttpRequest object to it.
	var request = new XMLHttpRequest();

	// Open a new connection, using the GET request on the URL endpoint
	var selectedSession = document.getElementById("sessionSelector").value;
	var selectedCourseName = document.getElementById("courseNameSelector").value;
	request.open('GET', 'https://ubc-courses-api.herokuapp.com/' + selectedSession + '/' + selectedCourseName + '/', true);
	
	// Clear list, disable empty option
	var courseNumberSelector = document.getElementById("courseNumberSelector");
	var courseNumberSelectorLength = courseNumberSelector.length;
	for (var i = 0; i < courseNumberSelectorLength; i++) {
		courseNumberSelector.remove(0);
	}
	var emptyOption = document.createElement("option");
	emptyOption.text = "";
	courseNumberSelector.add(emptyOption);
	document.getElementById("courseNameSelector").getElementsByTagName("option")[0].disabled = true;

	request.onload = function () {
		// Begin accessing JSON data here
		var data = JSON.parse(this.response);
		
		if (request.status >= 200 && request.status < 400) {
			// Create array of all course numbers
			var courseNumbers = [];
			
			// Add course numbers to array and sort
			for (var i = 0; i < data.courses.length; i++) {
				courseNumbers.push(data.courses[i]);
			}
			courseNumbers.sort();
			
			// Add course numbers to drop down
			for (var i = 0; i < courseNumbers.length; i++) {
				var option = document.createElement("option");
				option.text = courseNumbers[i];
				courseNumberSelector.add(option);
			}
		} else {
			console.log('We have encountered an error when accessing the UBC Courses API when fetching the course numbers.')
		}
	}

	// Send request
	request.send()
}




function chosenCourseNumber() {
	// Disable empty option
	document.getElementById("courseNumberSelector").getElementsByTagName("option")[0].disabled = true;
}




function chosenCourseSubmit() {
	// Create a request variable and assign a new XMLHttpRequest object to it.
	var request = new XMLHttpRequest();

	// Get selected drop down options
	var selectedSession = document.getElementById("sessionSelector").value;
	var selectedCourseName = document.getElementById("courseNameSelector").value;
	var selectedCourseNumber = document.getElementById("courseNumberSelector").value;
	
	// Check if drop down options have actually been selected
	if (selectedSession == "" || selectedCourseName == "" || selectedCourseNumber == "") {
		document.getElementById("unselectedFieldsWarning").style.display = "block";
	} else {
		window.location.href = 'selected_course.html?session=' + selectedSession + '&courseName=' + selectedCourseName + '&courseNumber=' + selectedCourseNumber;
		//getCourseInfo(selectedSession, selectedCourseName, selectedCourseNumber);
	}
}




function getCourseInfo() {
	// Create a request variable and assign a new XMLHttpRequest object to it.
	var request = new XMLHttpRequest();

	// Get course session, name, and number from URL GET
	var url_string = window.location.href;
	var url = new URL(url_string);
	var session = url.searchParams.get("session");
	var courseName = url.searchParams.get("courseName");
	var courseNumber = url.searchParams.get("courseNumber");
	
	// Open a new connection, using the GET request on the URL endpoint
	request.open('GET', 'https://ubc-courses-api.herokuapp.com/' + session + '/' + courseName + '/' + courseNumber + '/', true);
	
	request.onload = function () {
		// Begin accessing JSON data here
		var data = JSON.parse(this.response);

		// Change page headings
		document.getElementById("courseCode").innerHTML = session + ' ' + courseName + ' ' + courseNumber;
		document.getElementById("courseTitle").innerHTML = data.course_title;
		document.getElementById("courseLink").href = 'https://courses.students.ubc.ca' + data.course_link;
		
		if (request.status >= 200 && request.status < 400) {
			// Create array of all course sections
			var lectureSections = [];

			// Add course codes to array and sort
			var lectureSectionTest = new RegExp("[0-9][0-9][0-9]");
			for (var i = 0; i < data.sections.length; i++) {
				if (lectureSectionTest.test(data.sections[i])) {
					lectureSections.push(data.sections[i]);
				}
			}
			lectureSections.sort();
						
			for (var i = 0; i < lectureSections.length; i++) {
				getSectionInfo(session, courseName, courseNumber, lectureSections[i]);
			}
		} else {
			console.log('We have encountered an error when accessing the UBC Courses API when fetching the course information.')
		}
	}

	// Send request
	request.send()
}




function getSectionInfo(session, courseName, courseNumber, section) {
	// Create a request variable and assign a new XMLHttpRequest object to it.
	var request = new XMLHttpRequest();
	
	// Open a new connection, using the GET request on the URL endpoint
	request.open('GET', 'https://ubc-courses-api.herokuapp.com/' + session + '/' + courseName + '/' + courseNumber + '/' + section + '/', true);
	
	request.onload = function () {
		// Begin accessing JSON data here
		var data = JSON.parse(this.response);
		
		if (request.status >= 200 && request.status < 400) {
			var sectionArray = ['["' + data.status + '"', '"' + data.section_number + '"', '"' + data.activity + '"', '"' + data.term + '"', '"' + data.days + '"', '"' + data.start + '"', '"' + data.end + '"', '"' + data.instructors + '"', '"' + data.building + '"', '"' + data.room + '"', '"' + data.totalRemaining + '"', '"' + data.currentlyRegistered + '"', '"' + data.generalRemaining + '"', '"' + data.restrictedRemaining + '"],'];
		
			document.getElementById("tempData").innerHTML = document.getElementById("tempData").innerHTML + sectionArray;
			getTempData();
			
			/*
			// Display results in mainInfo table
			var table = document.getElementById("mainInfo");
			var row = table.insertRow(-1);
			row.insertCell(-1).innerHTML = data.status;
			row.insertCell(-1).innerHTML = data.section_number;
			row.insertCell(-1).innerHTML = data.activity;
			row.insertCell(-1).innerHTML = data.term;
			row.insertCell(-1).innerHTML = data.days;
			row.insertCell(-1).innerHTML = data.start;
			row.insertCell(-1).innerHTML = data.end;
			row.insertCell(-1).innerHTML = data.instructors;
			row.insertCell(-1).innerHTML = data.building;
			row.insertCell(-1).innerHTML = data.room;
			row.insertCell(-1).innerHTML = 'Total Remaining: ' + data.totalRemaining + '<br>Currently Registered: ' + data.currentlyRegistered + '<br>General Remaining: ' + data.generalRemaining + '<br>Restricted Remaining: ' + data.restrictedRemaining;
			*/
		} else {
			console.log('We have encountered an error when accessing the UBC Courses API when fetching the course information.')
		}
	}

	// Send request
	request.send()
}




function getTempData() {
	var tempDataArray = eval("[" + document.getElementById("tempData").innerHTML + "]");
	
	// Sort by section number
	tempDataArray.sort(function(a, b){
		return a[1] - b[1];
	});
	
	// Empty table
	var tableHeight = document.getElementById("mainInfo").rows.length;
	for (var i = 0; i < tableHeight - 1; i++) {
		document.getElementById("mainInfo").deleteRow(-1);
	}
	
	// Display results in mainInfo table
	for (var i = 0; i < tempDataArray.length; i++) {
		var table = document.getElementById("mainInfo");
		var row = table.insertRow(-1);
		row.insertCell(-1).innerHTML = tempDataArray[i][0];
		row.insertCell(-1).innerHTML = tempDataArray[i][1];
		row.insertCell(-1).innerHTML = tempDataArray[i][2];
		row.insertCell(-1).innerHTML = tempDataArray[i][3];
		row.insertCell(-1).innerHTML = tempDataArray[i][4];
		row.insertCell(-1).innerHTML = tempDataArray[i][5];
		row.insertCell(-1).innerHTML = tempDataArray[i][6];
		row.insertCell(-1).innerHTML = tempDataArray[i][7];
		row.insertCell(-1).innerHTML = tempDataArray[i][8];
		row.insertCell(-1).innerHTML = tempDataArray[i][9];
		row.insertCell(-1).innerHTML = 'Total Remaining: ' + tempDataArray[i][10] + '<br>Currently Registered: ' + tempDataArray[i][11] + '<br>General Remaining: ' + tempDataArray[i][12] + '<br>Restricted Remaining: ' + tempDataArray[i][13];	
	
		// Visually display time slots in timetablePreview table
		var term = tempDataArray[i][3];
		var daysRaw = tempDataArray[i][4];
		var startTimeRaw = tempDataArray[i][5];
		var endTimeRaw = tempDataArray[i][6];
		var section = tempDataArray[i][1];
		
		var daysArray = daysRaw.split(" ");
		daysArray = daysArray.filter(function(x){
			return (x !== (undefined || null || ''));
		});
		var startTime = startTimeRaw.substring(0,startTimeRaw.lastIndexOf(":")) + startTimeRaw.substring(startTimeRaw.lastIndexOf(":") + 1);
		var endTime = endTimeRaw.substring(0,endTimeRaw.lastIndexOf(":")) + endTimeRaw.substring(endTimeRaw.lastIndexOf(":") + 1);
		
		var s = "00" + startTime;
		startTime = s.substring(s.length - 4);
		s = "00" + endTime;
		endTime = s.substring(s.length - 4);
		
		console.log(term);
		console.log(daysArray);
		console.log(startTime);
		console.log(endTime);
		console.log(currentTime + daysArray[0].substring(0,2) + term);
		
		var currentTime = startTime;
		
		while (parseInt(currentTime) < parseInt(endTime)) {
			for (var x = 0; x < daysArray.length; x++) {
				document.getElementById(currentTime + daysArray[x].substring(0,2) + term).style.backgroundColor = '#a0f98b';
				document.getElementById(currentTime + daysArray[x].substring(0,2) + term).innerHTML = section;
			}
			
			if (currentTime.substring(2) == '00') {
				currentTime = parseInt(currentTime) + 30;
				var s = "00" + currentTime;
				currentTime = s.substring(s.length - 4);
			} else {
				currentTime = parseInt(currentTime) + 70;
				var s = "00" + currentTime;
				currentTime = s.substring(s.length - 4);
			}
		}
	}
	
	
}




function createTimetablePreview() {
	var timeTracker = "0700";
	
	for (var i = 1; i < 3; i++) {
		var table = document.getElementById("timetablePreviewTerm" + i);
		
		while (parseInt(timeTracker) <= 2100) {
			// Print timetable preview
			var row = table.insertRow(-1);
			var cell = row.insertCell(-1);
			cell.innerHTML = timeTracker;
			cell.id = timeTracker;

			cell = row.insertCell(-1);
			cell.id = timeTracker + 'Mo' + i;
			cell = row.insertCell(-1);
			cell.id = timeTracker + 'Tu' + i;
			cell = row.insertCell(-1);
			cell.id = timeTracker + 'We' + i;
			cell = row.insertCell(-1);
			cell.id = timeTracker + 'Th' + i;
			cell = row.insertCell(-1);
			cell.id = timeTracker + 'Fr' + i;
			
			if (timeTracker.substring(2) == '00') {
				timeTracker = parseInt(timeTracker) + 30;
				var s = "00" + timeTracker;
				timeTracker = s.substring(s.length - 4);
			} else {
				timeTracker = parseInt(timeTracker) + 70;
				var s = "00" + timeTracker;
				timeTracker = s.substring(s.length - 4);
			}
		}
		timeTracker = "0700";
	}
}











