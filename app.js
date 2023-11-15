var mainElement = document.getElementById("app");

function getParam(name) {
	return (new URLSearchParams(document.location.search)).get(name);
}

function fetchJsonAndRun(what, after, ctx) {
	let f = async function() {
		let result = await fetch(what);
		after(await result.json(), ctx);
	}
	
	f();
}

function setTitle(pre) {
	document.title = `${pre} - Knot's Videos`;
}

function limitWidth() {
	mainElement.innerHTML = `<div id="page-outer" class="page-outer"></div>`;
	mainElement = document.getElementById("page-outer");
}

function make(data) {
	mainElement.innerHTML += data;
}

function makePadding(amount) {
	make(`<div style="height: ${amount}"></div>`);
}

function makeHeading(title) {
	make(`<h1>${title}</h1>`);
}

function makePara(text) {
	make(`<p>${text}</p>`);
}

function makeParaLite(text) {
	make(`<p class="lite">${text}</p>`);
}

function makeClickableVideo(params) {
	make(`
	<div class="video-card" onclick="window.location = '?v=${params['id']}'">
		<div class="video-card-thumb">
			<div class="video-card-thumb-pad">
				<img class="video-card-thumb-img" src="${params['thumb']}" />
			</div>
		</div>
		<div class="video-card-other">
			<h2>${params['title']}</h2>
			<p class="nopad lite">${params['date']}</p>
			<p>${params['desc']}</p>
		</div>
	</div>
	`);
}

function makePlayer(url, thumb) {
	make(`
	<div class="player-outer">
		<video class="player-video" poster="${thumb}" src="${url}" controls loop autoplay />
	</div>
	`);
}

function loadHomePage(content) {
	setTitle("Home");
	
	limitWidth();
	makePadding("50px");
	makeHeading("Knot126's videos");
	makePara("This is a web page where I keep a way to watch my videos &mdash; mostly about Smash Hit modding but sometimes about other things &mdash; on a platform that isn't YouTube.");
	
	console.log(content);
	
	for (vid of content) {
		makeClickableVideo(vid);
	}
	
	makePadding("50px");
}

function loadVideoPage(content, id) {
	limitWidth();
	makePadding("20px");
	
	let found = null;
	
	for (vid of content) {
		if (vid.id == id) {
			found = vid;
		}
	}
	
	if (found) {
		setTitle(found.title);
		makePlayer(found.video, found.thumb);
		makeHeading(found.title);
		makeParaLite(found.date);
		makePara(found.desc);
	}
	else {
		makeHeading("Your video was not found!");
		makePara("Maybe it was deleted?");
	}
	
	makePadding("50px");
}

function loadPage() {
	let video_id = getParam("v");
	
	if (video_id == null) {
		fetchJsonAndRun("videos.json", loadHomePage);
	}
	else {
		fetchJsonAndRun("videos.json", loadVideoPage, video_id);
	}
}
