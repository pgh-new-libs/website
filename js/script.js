
let topicText = {};  // Var to store text blurbs so we can switch between them quickly
let topicList = [    // List of topic names to iterate through when arrows are pressed
    "intro",         // TODO this should be generated programmatically from JSON
    "liberalism",
    "economy",
    "housing",
    "immigration",
    "environment",
    "pragmatism",
    "tolerance"
]
let currentTopic = "intro"; // Var to keep track of which topic is currently active


/**
 * This function is called when the page finishes loading. Any functions required
 * for loading/rendering the page should be added here, and all default event listeners
 * should be attached here
 */
$(document).ready(function() {

    // Fetch text blurbs from the server and populate elements from the data
    populateBlurbs();

    // Fetch footer links from server and assemble footer
    populateFooter();

    // Attach click handlers to the topic selector buttons
    $(".clickable").click(handleTopicClick);

    // Attach click handlers to the navigation arrows
    $(".arrow-icon").click(handleArrowClick);

});


/**
 * This method fetches a JSON object containing all the text blurbs for populating
 * various elements on the page. It retrieves the JSON, parses any special markers
 * in the contents (e.g. creating links embedded in the text, separating paragraphs)
 * and updates the appropriate elements on the page.
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

            // Store a dictionary mapping from topic names to text descriptions
            // for fast retrieval when active topic is changed
            topicText[id] = text;

        }

        // Set the active topic to the "intro" message
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


/**
 * This function updates the text on the screen and highlights the new active topic
 * whenever the topic changes. If the selected topic was already active, it should
 * have no effect.
 */
function handleTopicClick() {

    if (!$(this).hasClass("selected")) {

        $(".selected").removeClass("selected");
        $(this).addClass("selected");

        let topicName = $(this).attr("id").split('-')[1]
        currentTopic = topicName

        // Replace the text with the correct new text
        $(".main-text-wrapper").html("<p class='main-text'></p>")
        $(".main-text").html(topicText[topicName]);

        // Update the text heading
        if (topicName === "intro") {
            $("#main-text-title").html("About Us");
        } else {
            let emphasized = "<span class='main-text-title-em'>" + topicName + "</span>";
            $("#main-text-title").html("Our Philosophy: " + emphasized);
        }

    }
}


/**
 * This function advances the topic (either forwards or backwards), when one of
 * the arrow buttons is pressed. These buttons are used on narrow screens to change
 * the topics, instead of the topic selectors that are visible on wider screens. It works
 * by simulating a press of the topic selector button for the next topic in order
 */
function handleArrowClick() {

    // Determine which direction to move in
    let move = $(this).attr("id") === "arrow-fwd" ? 1 : -1;

    // Get the next topic in that direction
    let currentIndex = topicList.indexOf(currentTopic);
    let newIndex = (currentIndex + move + topicList.length) % topicList.length;

    // Simulate a click of the (now hidden) topic selector button
    $("#topic-" + topicList[newIndex]).trigger("click");

}