var today = new Date();
var month = today.getMonth();
var displayMonth = "";

// 1. Get the Month Name
switch (month) {
    case 0: displayMonth = "January"; break;
    case 1: displayMonth = "February"; break;
    case 2: displayMonth = "March"; break;
    case 3: displayMonth = "April"; break;
    case 4: displayMonth = "May"; break;
    case 5: displayMonth = "June"; break;
    case 6: displayMonth = "July"; break;
    case 7: displayMonth = "August"; break;
    case 8: displayMonth = "September"; break;
    case 9: displayMonth = "October"; break;
    case 10: displayMonth = "November"; break;
    case 11: displayMonth = "December"; break;
    default: displayMonth = "INVALID";
}

// 2. Set Time Variables
var hours = today.getHours(); // 0-23
var minutes = today.getMinutes();
var greeting = "";
var ampm = (hours >= 12) ? "p.m." : "a.m.";

// 3. Determine Greeting (using 24-hour logic first)
if (hours < 12) {
    greeting = "Good morning!";
} else if (hours >= 12 && hours < 18) {
    greeting = "Good afternoon!";
} else if (hours >= 18 && hours < 21) {
    greeting = "Good evening!";
} else {
    greeting = "Good night!";
}

// 4. Convert to 12-hour format for display
var displayHours = hours % 12;
if (displayHours === 0) {
    displayHours = 12; // Midnight or Noon
}

// 5. Format Minutes (Leading Zero)
if (minutes < 10) {
    minutes = "0" + minutes;
}

// 6. Build the Display String
var displayGreeting = greeting + " It is " + displayMonth + " " 
                    + today.getDate() + ", " 
                    + today.getFullYear() 
                    + " - " + displayHours + ":" + minutes + " " + ampm;

document.getElementById("greeting-display").innerText = displayGreeting;