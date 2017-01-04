#!/usr/bin/env node

var fs = require('fs'),
	exec = require('child_process').exec,
	os = require('os'),
	url = require('url');

var program = require('commander'),
	resemble = require('resemble'),
	colors = require('colors'),
	webshot = require('webshot');
	validUrl = require('valid-url');
	dateFormat = require('dateformat');

program
	.version('2.0.0')
	.option('-w, --windowSize <windowSize>', 'The dimensions of the browser window (default: { width: 1920, height: 1080 })', '{ width: 1920, height: 1080 }')
	.option('-s, --shotSize <shotSize>', 
			'The area of the page document, starting at the upper left corner, to render. ' +
			'Possible values are \'screen\', \'all\', and a number defining a pixel length. ' +
			'(default: { width: \'all\', height: \'all\' })', '{ width: \'all\', height: \'all\' }')
	.option('-p, --phantomPath <phantomPath>', 'The location of phantomjs. (default: \'phantomjs\')', 'phantomjs')
	.option('-r, --renderDelay <renderDelay>', 'Number of milliseconds to wait after a page loads before taking the screenshot. (default: 3000)', 3000)
	.option('-t --timeout <timeout>', 'Number of milliseconds to wait before killing the phantomjs process and assuming webshotting has failed. (default: 30000)', 30000)
	.option('-o, --output <output>', 'The directory to use to save the image files. (default: process.cwd())', process.cwd())
	.parse(process.argv);

if (program.args.length !== 2) {
	program.help();
	console.error('%s [ERROR] Por favor especifique duas urls para comparacao!'.red, dateLog());
	process.exit(1);
}

var firstUrl = normalizeUrl(program.args[0]);
var secondUrl = normalizeUrl(program.args[1]);

var directory = program.output + '/' + dateFormat(new Date(), 'yyyy-mm-dd-HH-MM-ss');

createDir(directory);

var imageScreenShot1 = directory + '/' + url.parse(firstUrl).hostname + '.png';
var imageScreenShot2 = directory + '/' + url.parse(secondUrl).hostname + '.png';

var options = {
	screenSize: program.windowSize,
	shotSize: program.shotSize,
	timeout: program.timeout,
	renderDelay: program.renderDelay,
	phantomPath: program.phantomPath,
	userAgent: 'site-diff-webshot',
	errorIfStatusIsNot200: true
};

snapshot(firstUrl, imageScreenShot1, {
	
	onSnapshotFinished : function() {
		
		snapshot(secondUrl, imageScreenShot2, {
			
			onSnapshotFinished : function() {
				diff();
			}
			
		});
	}

});

function snapshot(url, imageScreenShot, callback) {
	
	console.log("%s [INFO] Requisitando a url [%s].".cyan, dateLog(),url);
	
	webshot(url, imageScreenShot, options, function(e) {
		if(e) {
			console.error("%s [ERROR] A url [%s] demorou [%sms] para responder.".red, dateLog(), url, program.timeout);
			process.exit(1);
		}
	  
		if(!fs.existsSync(imageScreenShot)) {
			console.error("%s [ERROR] A url [%s] respondeu com um 'status code' diferente de 200.".red, dateLog(), url);
			process.exit(1);
		}
		
		console.log("%s [INFO] Imagem criada [%s].".cyan, dateLog() ,imageScreenShot);
		
		if(callback) callback.onSnapshotFinished();
	});
}

function diff() {
	var diffImagePath = directory + '/' + 'diff.png';

	resemble.resemble(imageScreenShot1).compareTo(imageScreenShot2).ignoreNothing().onComplete(function(data) {
        var diffImage = data.getImageDataUrl().replace(/^data:image\/png;base64,/,"");

        console.log("%s [RESULTADO] %s%".bold.magenta, dateLog(), data.misMatchPercentage);

        fs.writeFile(diffImagePath, diffImage, 'base64', function(err) {
            if (err) console.warn("%s [WARN] Não consegui salvar a imagem [%s] com as diferenças entre as url's] ".bold.yellow, dateLog(), diffImagePath);
        });
    });
}

function dateLog() {
	return dateFormat(new Date(), 'yyyy-mm-dd HH-MM-ss,l');
}

function createDir(path) {
	try {
		fs.mkdirSync(path);
	} catch(e) {
		console.error("%s [ERROR] O caminho [%s] nao possui permissao de escrita.".red, dateLog(), path);
		process.exit(1);
	}
}

function normalizeUrl(path) {
    if (url.parse(path).host === null) {
        if (url.parse('http://' + path).host !== null) {
            path = 'http://' + path;
        }
    }
    
    if (!validUrl.isWebUri(path)){
    	console.error('%s [ERROR] A url [%s] é invalida!'.red, dateLog(), path);
    	process.exit(1);
    }

    return path;
}

