window.onload = function(){
	document.getElementById("searchbox").addEventListener("input", getMovies);
};

var page;
var searched;
var apikey = "91a033f8"; // apikey = c524e08, alt1 = 8191c80a, alt2 = 91a033f8

/* Gets 1st page of movies from search. */
function getMovies() {
	searched = $("#searchbox").val();
	$(".grid-container").empty();
	$("#results").text(""); 
	page = 1;
	
	$.getJSON('http://www.omdbapi.com/?s=' + searched + '&type=movie&page=' + page + '&apikey=' + apikey, function(movies) {
		response = movies.Response;
		search = movies.Search;
		results = movies.totalResults;
		if (response == 'True') {
			for (var movie in search) {
				addMovie(search[movie].Title);
			}			
		}
		else {
			$("#results").text("No results found"); 
		}
	});
}

/* Loads more data while scrolling. */
$(window).scroll(function() {
	pageHeight = Math.max(document.body.scrollHeight, document.body.offsetHeight);
	nearBottom = pageHeight - (window.pageYOffset + self.innerHeight) < 150
	if(nearBottom) {
		page++;
		if (page<=100) {
			$.getJSON('http://www.omdbapi.com/?s=' + searched + '&type=movie&page=' + page + '&apikey=' + apikey, function(movies) {
				response = movies.Response;
				search = movies.Search;
				if (response == 'True') {
					for (var movie in search) {
						addMovie(search[movie].Title);
					}			
				}
			});
		}
	}
});

/* Adds a single movie to html. */
function addMovie(title){
	$.getJSON('http://www.omdbapi.com/?t=' + title + '&type=movie&apikey=' + apikey, function(movie) {	
		var divimg = jQuery('<div class="image"></div>');
		var div = jQuery('<div class="info"></div>');
		
		divimg.append($('<img>',{src:movie.Poster, width:"180", height:"250"}));
	
		if (movie.Title != "N/A") {
			div.append($('<h2>',{text:movie.Title}));			
		}
		if (movie.Year != "N/A") {
			div.append($('<span>',{class:"highlight", text:movie.Year}));
		}
		if (movie.Rated != "N/A" && (movie.Rated).toUpperCase() !== "NOT RATED") {
			div.append($('<span>',{class:"highlight", text:" " + movie.Rated}));
		}			
		if (movie.Runtime != "N/A") {
			div.append($('<span>',{class:"highlight", text:" " + movie.Runtime}));
		}	
		if (movie.Plot != "N/A") {
			div.append($('<p>',{text:movie.Plot}));
		}
		if (movie.Genre != "N/A") {
			div.append($('<p>',{id:"genres", text:"Genres: " + movie.Genre}));
		}
		if (movie.Released != "N/A") {
			div.append($('<span>',{text:"Released: " + movie.Released}));
			div.append($('<br>'));
		}
		var ratings = "Ratings: ";
		for (var rating in movie.Ratings) {
			ratings = ratings + movie.Ratings[rating].Source + ": " + movie.Ratings[rating].Value + " ";	
		}
		if (ratings != "Ratings: ") {
			div.append($('<span>',{text:ratings}));
			div.append($('<br>'));
		}
		if (movie.Director != "N/A") {
			div.append($('<span>',{text:"Director: " + movie.Director}));
			div.append($('<br>'));
		}
		if (movie.Actors != "N/A") {
			div.append($('<span>',{text:"Actors: " + movie.Actors}));
			div.append($('<br>'));
		}
		if (movie.Writer != "N/A") {
			div.append($('<span>',{text:"Writer: " + movie.Writer}));
			div.append($('<br>'));
		}
		if (movie.Language != "N/A") {
			div.append($('<span>',{text:"Language: " + movie.Language}));
			div.append($('<br>'));
		}
		if (movie.Country != "N/A") {
			div.append($('<span>',{text:"Country: " + movie.Country}));
			div.append($('<br>'));
		}	
		if (movie.DVD != "N/A") {		
			div.append($('<span>',{text:"DVD: " + movie.DVD}));
			div.append($('<br>'));
		}
		if (movie.BoxOffice != "N/A") {
			div.append($('<span>',{text:"Box Office: " + movie.BoxOffice}));
			div.append($('<br>'));
		}
		if (movie.Production != "N/A") {
			div.append($('<span>',{text:"Production: " + movie.Production}));
			div.append($('<br>'));
		}		
		if (movie.Website != "N/A") {
			var website = $('<span>',{text:"Website: "});
			website.append($('<a>',{text: movie.Website, href:movie.Website}));
			div.append(website);
		}
		
		var divmovie = jQuery('<div class="movie"></div>');
		divmovie.append(divimg);
		divmovie.append(div);
		var btnShow = jQuery('<button class="show">Show more</button>')
		
		/* 'Show more'-'show less' button. */
		btnShow.click(function(){
			minHeight = 250;
			currentHeight = divmovie.height();
			autoHeight = divmovie.css('height', 'auto').height(); //changes height to auto
			divmovie.css('height', currentHeight); //restore height to currentHeight
			if (currentHeight == minHeight) {
				divmovie.animate({height:autoHeight});
				$(this).html("Show less");
			}
			else {
				divmovie.animate({height:minHeight});
				$(this).html("Show more");
			}		
		})
		
		var outer = jQuery('<div class="outer"></div>');
		outer.append(divmovie);
		outer.append(btnShow);
		
		outer.hide().appendTo(".grid-container").fadeIn();
	});
}

