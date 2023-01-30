
let topicText = {};

/**
 * This function is called when the page finishes loading
 */
$(document).ready(function() {

    // Fetch text blurbs from the server and populate elements from the data
    populateBlurbs();

    // Fetch footer links from server and assemble footer
    populateFooter();

    $(".clickable").click(handleTopicClick);

});



/**
 * This method fetches a JSON object containing all the text blurbs for populating
 * various elements on the page. It retrieves the JSON, parses any special markers
 * in the contents (e.g. creating links embedded in the text), and updates the
 * appropriate elements on the page.
 */
function populateBlurbs() {

    // Fetch blurb text from the server
    let prefix = window.location.hostname === "localhost" ? "" : window.location.href;
    $.getJSON(prefix + "data/blurbs.json", function(data) {

        // Iterate over keys (correspond to ids in html
        for (const id in data) {

            // Get the text that should fill the specified tag
            let text = data[id];

            // Check for any links and replace them with <a> tags
            while (text.indexOf("[[LINK_START, ") !== -1) {

                // Extract link url
                let linkStart = text.indexOf("[[LINK_START, ");
                let linkEnd = text.indexOf("]]");
                let linkUrl = text.substring(linkStart + 14, linkEnd);

                // Replace the link markers with <a> tags
                let startTag = "<a href='" + linkUrl + "' target='_blank' class='card-text-citation'>"
                text = text.replace("[[LINK_START, " + linkUrl + "]]", startTag);
                text = text.replace("[[LINK_END]]", "</a>");

            }

            // Check for any paragraph markers and create a new paragraph for each
            while (text.indexOf("[[P]]") !== -1) {
                let startTag = "</p><p class='main-text'>"
                text = text.replace("[[P]]", startTag);
            }

            // Update the html contents for the specified id
            topicText[id] = text;

        }

        $(".main-text").html(topicText["intro"]);

    });

}


/**
 * This method fetches a JSON object containing the footer headings and links from
 * the server, and assembles the footer accordingly.
 */
function populateFooter() {

    // Fetch footer headings and links from server
    let prefix = window.location.hostname === "localhost" ? "" : window.location.href;
    $.getJSON(prefix + "data/footer.json", function(data) {

        // Iterate over headings
        for (const heading in data) {

            // Add a new vertical for each heading, create the heading inside it
            let section = $("<div>").addClass("footer-vertical");
            section.append($("<h2>").addClass("footer-vertical-heading").html(heading));

            // Add the list of links under the heading
            for (const link in data[heading]) {
                let linkTag = $("<a>").attr("href", data[heading][link]).attr("target", "_blank").html(link);
                section.append(linkTag)
            }

            // Add the heading and links to the page
            $("#footer-contents").append(section);

        }
    });

}


function populateEvents() {

    // Fetch footer headings and links from server
    let prefix = window.location.hostname === "localhost" ? "" : window.location.href;
    $.getJSON(prefix + "data/events.json", function(data) {

        // Iterate over headings
        for (const event in data) {

            // Add a new vertical for each heading, create the heading inside it
            let section = $("<div>").addClass("footer-vertical");
            section.append($("<h2>").addClass("footer-vertical-heading").html(heading));

            // Add the list of links under the heading
            for (const link in data[heading]) {
                let linkTag = $("<a>").attr("href", data[heading][link]).attr("target", "_blank").html(link);
                section.append(linkTag)
            }

            // Add the heading and links to the page
            $("#footer-contents").append(section);

        }
    });

}


function handleTopicClick() {

    if (!$(this).hasClass("selected")) {

        $(".selected").removeClass("selected");
        $(this).addClass("selected");

        let topicName = $(this).attr("id").split('-')[1]

        // Replace the text with the correct new text
        $(".main-text-wrapper").html("<p class='main-text'></p>")
        $(".main-text").html(topicText[topicName]);

        // Update the text heading
        if (topicName === "intro") {
            $("#main-text-heading").html("About Us");
        } else {
            let emphasized = "<span class='main-text-heading-em'>" + topicName + "</span>";
            $("#main-text-heading").html("Our Philosophy: " + emphasized);
        }

    }
}