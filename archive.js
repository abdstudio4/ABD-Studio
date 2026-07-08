let ali = {
    gender: "male"
};

let subhan = {
    salary: 5000
};
// Object.setPrototypeOf(ali, subhan);
// Object.setPrototypeOf(subhan, {
//     height: 170
// });

// console.log(ali.height);
// console.log(subhan.height);
// console.log(ali.salary);
// console.log(ali.gender);
// if (ali.__proto__ === subhan) {
//     console.log("ali is prototype of subhan");
// } else {
//     console.log("ali is not prototype of subhan");
// }

// if (subhan.__proto__ === ali) {
//     console.log("subhan is prototype of ali");
// } else {
//     console.log("subhan is not prototype of ali");
// }

// function Player(name, level) {
//   this.name = name;
//   this.level = level;
// }

// We add a method to the "Prototype" 
// This way, the function exists in ONLY one place, saving memory!
// Player.prototype.levelup = function() {
//   this.level++;
//   console.log(this.name + " is now level " + this.level);
// };

// We use 'new' to create objects
// let p1 = new Player("Archer", 5);
// let p2 = new Player("Mage", 5);
//p1.levelup(); // Archer is now level 2

let playerName = "goku";
playerName = playerName[0].toUpperCase() + playerName.slice(1);
console.log(playerName);
let cardNumber = "1234567890124444";
let lastFour = cardNumber.slice(-4); // Grab the last 4
let masked = lastFour.padStart(16, "*"); // Pad it to 16 chars with *
console.log(masked); // "************4444"