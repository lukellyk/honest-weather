//CODE TO BE RUN ON A LOCAL SERVER
//python -m SimpleHTTPServer 8080 (MacOS)
//python -m http.server 8080 (Windows)

//DECLARING VARIABLES

let apiKey, lat, long, units, blackFont, phrases, cols, rows, fr, flowfeild;
let loadedEverything = false;
let currentWeather = "";
let temp = "";
let humidity = "";
let rainChance = "";
let inc = 0.1;
let scl = 10;
let zoff = 0;
let particles = [];
let colorCapture;

let BGimg, clearDayImg, clearNightImg, cloudyImg, fogImg, partlyCloudyDayImg, partlyCloudyNightImg, rainImg, sleetImg, snowImg, windImg;

let xSize = 450;
let ySize = 600;

//END DECLARING VARIABLES

//CONFIG

apiKey = 'd4f76aeec9b8912bc25002bb05366b7d'

//END CONFIG

function preload() {	//preloading all images and icons
BGimg = loadImage(`https://source.unsplash.com/collection/4479275/${xSize}x${ySize}`);
clearDayImg = loadImage('assets/icons/clear_day.png');
clearNightImg = loadImage('assets/icons/clear_night.png');
cloudyImg = loadImage('assets/icons/cloudy.png');
fogImg = loadImage('assets/icons/fog.png');
partlyCloudyDayImg = loadImage('assets/icons/partly_cloudy_day.png');
partlyCloudyNightImg = loadImage('assets/icons/partly_cloudy_night.png');
rainImg = loadImage('assets/icons/rain.png');
sleetImg = loadImage('assets/icons/sleet.png');
snowImg = loadImage('assets/icons/snow.png');
windImg = loadImage('assets/icons/wind.png');


phrases = loadJSON('assets/phrases.json');	//loading in json with phrases


}

function setup() {
		createCanvas(xSize, ySize);
		textFont('SF Heavy');

		getCurrentPosition(results);

		cols = floor(width / scl);	//divides image into grid with variable scale 
		rows = floor(height / scl);

	flowfield = new Array(cols * rows);

	for (let i = 0; i < 200; i++) {
		particles[i] = new Particle();	//defining the amoutnof particles on screen
	}
	
	background('black')
}

function results(position) { //finding position of user using GPS and feeding information into weather API
	lat = position.latitude
	long = position.longitude

	fill('white');
	textSize(50);

//calling url with variables that define results
let url = `https://api.allorigins.win/raw?url=https://api.darksky.net/forecast/${apiKey}/${lat},${long}?units=auto&exclude=minutely,hourly,alerts,flags`


const weatherResults = (callback) => { //parsing json with weather information within
		fetch(url , {mode: 'cors'}).then((res) => {
			return res.text()
		}).then((value) => {
			callback(JSON.parse(value));
		});
	}
	
	
	weatherResults((json) => {
		console.log(json) //log raw weather data to console
		loadedEverything = true; //boolean to let weather information load before code carries on

		// //variables defined by information within weather json
		currentWeather = json.currently.icon;
		temp = floor(json.currently.apparentTemperature);
		humidity = floor((json.currently.humidity)*100);
		rainChance = floor((json.currently.precipProbability)*100);

	})

}

function draw(){

	textFont('SF Heavy');
	textSize(50);

	colorCapture = BGimg.get(width/2,height/2,1,1); //defines colour of background by picking pixel of random image loaded

	background(colorCapture[1], colorCapture[2], colorCapture[3]);	//sets background colour
	strokeWeight(0); 


	//defines movements of particles/bubbles
	let yoff = 0;

	for (let y = 0; y < rows; y++) {
		let xoff = 0;
		for (let x = 0; x < cols; x++) {
			let index = x + y * cols;
			let angle = noise(xoff, yoff, zoff) * TWO_PI * 4;
			let v = p5.Vector.fromAngle(angle);
			v.setMag(1);
			flowfield[index] = v;
			xoff += inc;
			stroke(0, 50);
		}
		yoff += inc;

		zoff += random(0.0001, 0.001);
	}

	for (let i = 0; i < particles.length; i++) {
		particles[i].follow(flowfield);
		particles[i].update();
		particles[i].edges();
		particles[i].draw();
	}

noStroke();

//once everything is loaded the text will be displayed based on what weather has been fed via the API
	if(loadedEverything){

		textAlign(LEFT, BASELINE)

		if ((currentWeather) == 'clear-day' && (between(temp, 15, 19))) {
			text(phrases.clearDay.original, 10, height-15);
			image(clearDayImg, 10, height-160);
		}

		else if ((currentWeather) == 'rain' && (temp >= 17)) {
			text(phrases.rain.original, 10, height-75);
			image(rainImg, 10, height-220);
		}

		else if ((currentWeather) == 'rain' && (temp <= 18)) {
			text(phrases.rain.cold, 10, height-75);
			image(rainImg, 10, height-220);
		}

		else if ((currentWeather) == 'cloudy' && (temp >= 17)) {
			text(phrases.cloudy.original, 10, height-75);
			image(cloudyImg, 10, height-220);
		}

		else if ((currentWeather) == 'clear-day' && (between(temp, 10, 14))) {
			text(phrases.clearDay.cool, 10, height-15);
			image(clearDayImg, 10, height-160);
		}

		else if ((currentWeather) == 'clear-day' && (between(temp, 3, 9))) {
			text(phrases.clearDay.cold, 10, height-75);
			image(clearDayImg, 10, height-220);
		}

		else if ((currentWeather) == 'clear-day' && (between(temp, 27, 35))) {
			text(phrases.clearDay.hot, 10, height-75);
			image(clearDayImg, 10, height-220);
		}
		
		else if ((currentWeather) == 'cloudy' && (temp <= 16)) {
			text(phrases.cloudy.cold, 10, height-75);
			image(cloudyImg, 10, height-220);
		}

		else if ((currentWeather) == 'sleet') {
			text(phrases.sleet.original, 10, height-75);
			image(sleetImg, 10, height-220);
		}

		else if ((currentWeather) == 'clear-day' && (between(temp, 20, 26))) {
			text(phrases.clearDay.perfect, 10, height-75);
			image(clearDayImg, 10, height-220);
		}

		else if ((currentWeather) == 'clear-day' && (temp >= 36)) {
			text(phrases.clearDay.really_hot, 10, height-75);
			image(clearDayImg, 10, height-220);
		}

		else if ((currentWeather) == 'wind' && (temp >= 15)) {
			text(phrases.wind.original, 10, height-75);
			image(windImg, 10, height-220);
		}

		else if ((currentWeather) == 'wind' && (temp <= 15)) {
			text(phrases.wind.cold, 10, height-75);
			image(windImg, 10, height-220);
		}

		else if ((currentWeather) == 'snow' && (temp >= 1)) {
			text(phrases.snow.original, 10, height-75);
			image(snowImg, 10, height-220);
		}

		else if ((currentWeather) == 'snow' && (temp <= 0)) {
			text(phrases.snow.freezing, 10, height-75);
			image(snowImg, 10, height-220);
		}

		else if ((currentWeather) == 'clear-day' && (between(temp, -4, 2))) {
			text(phrases.clearDay.zero, 10, height-75);
			image(clearDayImg, 10, height-220);
		}

		else if ((currentWeather) == 'clear-day' && (temp <= -5)) {
			text(phrases.clearDay.negative, 10, height-75);
			image(clearDayImg, 10, height-220);
		}

		else if ((currentWeather) == 'clear-night') {
			text(phrases.clearNight.original, 10, height-75);
			image(clearNightImg, 10, height-220);
		}

		else if ((currentWeather) == 'fog' && (temp >= 11)) {
			text(phrases.fog.original, 10, height-15);
			image(fogImg, 10, height-160);
		}

		else if ((currentWeather) == 'fog'  && (temp <= 10)) {
			text(phrases.fog.cold, 10, height-75);
			image(fogImg, 10, height-220);
		}

		else if ((currentWeather) == 'partly-cloudy-day') {
			text(phrases.partlyCloudyDay.original, 10, height-75);
			image(partlyCloudyDayImg, 10, height-220);
		}

		else if ((currentWeather) == 'partly-cloudy-night') {
			text(phrases.partlyCloudyNight.original, 10, height-75);
			image(partlyCloudyNightImg, 10, height-220);
		}

		textFont('SF Light')
		textSize(25);
		
		//shows specific information relating to the weather
		text(`temperature: ${temp}°C`, 10, 30);
		text(`humidity: ${humidity}%`, 10, 60);
		text(`chance of rain: ${rainChance}%`, 10, 90);



	} 	else {
		textAlign(CENTER, CENTER);
		text("still loading...", width/2, height/2);
	}





}

//class defining the looks and characteristics of the particles/bubbles
class Particle{
	constructor(){

		this.pos = createVector(random(width), random(height));
		this.vel = createVector(0, 0);
		this.acc = createVector(0, 0);

		this.maxSpeed = 0.5;
		this.h = 1;
		this.cc = color(200, 0, 0);

		this.prevPos = this.pos.copy();

	}

	update(){
			this.vel.add(this.acc);
			this.vel.limit(this.maxSpeed);
			this.pos.add(this.vel);
			this.acc.mult(0);
		}

		follow(vectors){
			let x = floor(this.pos.x/scl);
			let y = floor(this.pos.y/scl);
			let index = x + y * cols;
			let force = vectors[index];
			this.applyForce(force);
		}

		applyForce(force){
			this.acc.add(force);
		}

		draw(){

			let newColour = color(BGimg.get(this.pos.x, this.pos.y));
			stroke(red(newColour), green(newColour), blue(newColour), 30);
			this.h = this.h + 1;
			if (this.h > 100){
				this.h = 0;
			}

			strokeWeight(50);
			line(this.pos.x, this.pos.y, this.prevPos.x, this.prevPos
				.y);
			this.updatePrev();
		}

		updatePrev(){
			this.prevPos.x = this.pos.x;
			this.prevPos.y = this.pos.y;
		}

		edges(){
			if(this.pos.x > width){
				this.pos.x = 0;
				this.updatePrev();
			}
			if(this.pos.x < 0){
				this.pos.x = width;
				this.updatePrev();
			}
			if(this.pos.y > height){
				this.pos.y = 0;
				this.updatePrev();
			}
			if (this.pos.y < 0){
				this.pos.y = height;
				this.updatePrev();
			}
		}

}


//function to make finding if a number is within a range easier
function between(x, min, max) {
	return x >= min && x <= max;
  }

 //code end