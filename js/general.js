/*global document, $ */
/* the line above helps JSLint recognize the globals being used, so they don't get flagged as errors */

var dd = $("#dropdown"), // the dropdown container
	// values below are configurable
	dir = "dropdowns", // this is the directory where your Ajax-loaded files reside
	ext = ".html", // this is the file extension of your Ajax-loaded files; change to .php if you use that
	speed = 900, // this is the speed, in milliseconds, of the animated menus
	downArrow = "&#9660;", // this is the downward-pointing arrow next to each menu link
	upArrow = "&#9650;", // ditto for up, when the menu item is selected; these could be inline images instead
	closeLinkString = "<div class='close'><a href='#' id='close-link' onclick=\"Megadropdowns.closeDropDown(); return false;\">close [x]</a></div>", // this is the close button, could be an image if you want
	// blank values below are just initial states of later-used stuff
	i = "",
	j = "",
	singleMenu = "",
	fragment = "",
	urlString = "",
	menusArray = "",
	menuLinks = $("nav ul li.menu>a"), // this is the often-used link collection; ">" makes sure sublinks aren't included
	currentHash = document.location.hash.split("#")[1], // get the hash, if it exists
	// function below inserts the "close" button from the line above
	addCloseLink = function () {
		dd.append(closeLinkString);
	},
	// function below gets all the names of the menu items
	menuItems = function () {
		for (var i = 0, j = menuLinks.length; i < j; i += 1) {
			urlString = menuLinks[i].href.split("/");
			urlString = urlString[urlString.length - 1].replace(ext, "");
			fragment = fragment + " " + urlString;
		}
		return fragment;
	},
	// value of function above saved in "pages", below
	pages = menuItems(),
	// Below is the primary namespace for all the functions
	Megadropdowns = {

	// First: check to see if a hash is defined, to open the appropriate menu
	handleHash: function (menuString) {
		if (currentHash) {
			menuString = menuString.split(" ");
			for (i = 0, j = menuString.length; i < j; i += 1) {
				if (currentHash === menuString[i]) {
					// open menu; load the content for the hashed menu
					dd.addClass("open");
					Megadropdowns.populateMenu(currentHash);
					break; // break out of the loop once requirement is met, because it should only occur once
				}
			}
			
			// find the right menu item, to make it "active"
			for (i = 0, j = menuLinks.length; i < j; i += 1) {
				if (menuLinks[i].href.toString().indexOf(currentHash) !== -1) {
					menuLinks[i].className = "active";
					break; // break out of the loop once found, because it should only occur once
				}
			}

		}
		Megadropdowns.getMenuClick(menuString);
	},
	
	// click event handler; checks which menu item was clicked
	// deal with the click accordingly
	getMenuClick: function (menuString) {
		menuLinks.click(function () {
			var currentLink = this.toString().split("/");
			currentLink = currentLink[currentLink.length - 1].replace(ext, "");
			// if the dropdown menu is already open, and the same link is clicked, close it
			if (dd.hasClass("open") && dd.hasClass(currentLink)) {
				dd.slideUp(speed, function () { 
					dd.removeClass();
					dd.addClass("loading");
					dd.html("");
					document.location.hash = "";
					menuLinks.removeClass("active");
					menuLinks.find("span").html(downArrow);
				});
			
			// if the dropdown menu doesn't match the clicked link, populate it and open it if necessary
			} else {
				Megadropdowns.populateMenu(currentLink);
				menuLinks.removeClass("active");
				$(this).addClass("active");
				menuLinks.find("span").html(downArrow);
				$(this).find("span").html(upArrow);
			}

			return false; 
		});
	},
	
	// populates the menu according to what link was clicked, opens it if not already opened
	populateMenu: function (currentLink) {
		dd.removeClass(pages);
		dd.addClass(currentLink + " open");
		dd.slideDown(speed, function () {
			// callback that runs after menu finishes sliding down
			$("nav ul li.menu>a.active").find("span").html(upArrow);
			// ajax call is below; it appends a timestamp to prevent caching, in case of dynamic content; remove if you like
			dd.load(dir + "/" + currentLink + ext + "?" + new Date().getTime(), function () {
				// callback that runs after menu finishes loading
				dd.removeClass("loading");
				addCloseLink();
			});
		});
		// change the hash according to the clicked link
		document.location.hash = currentLink;
	},
	
	// this closes the dropdown and takes appropriate actions; called when the "close" link is clicked
	closeDropDown: function (currentLink) {
		dd.slideUp(speed, function () {
			menuLinks.find("span").html(downArrow);
			menuLinks.removeClass();
			dd.removeClass();
			document.location.hash = "";
			dd.addClass("loading");
			dd.html("");
		});
	}

}; // Megadropdowns namespace ends here

$(document).ready(function () {
	menuLinks.append(" <span>" + downArrow + "</span>");
	Megadropdowns.handleHash(pages);
});