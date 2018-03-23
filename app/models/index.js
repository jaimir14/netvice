var models = [
	'Address',
	'User'
];

models.forEach(function(model) {
	console.log("Loading model: " + model);
	var loadedModel = require(__dirname + '/' + model);
});

console.log("models loaded");