// We're using a global variable to store the number of occurrences
var MyApp_SearchResultCount = 0;

var consoleStr = "\n";
var results = "";

var neighSize = 20;

function addCSSRule(selector, newRule) {
    var mySheet = document.styleSheets[0];
    if (mySheet.addRule) {
        mySheet.addRule(selector, newRule);                               // For Internet Explorer
    } else {
        ruleIndex = mySheet.cssRules.length;
        mySheet.insertRule(selector + '{' + newRule + ';}', ruleIndex);   // For Firefox, Chrome, etc.
    }
}
// helper function, recursively searches in elements and their child nodes
function MyApp_HighlightAllOccurencesOfStringForElement(element,keyword) {
    if (element) {
        if (element.nodeType == 3) {// Text node
            while (true) {
                var value = element.nodeValue;  // Search for keyword in text node
                // console.log('value='+value);
                var idx = value.toLowerCase().indexOf(keyword);
                // console.log('idx='+idx);                         
                if (idx < 0) break;             // not found, abort
                
                var span = document.createElement("highlight");
                span.className = "MyAppHighlight";
                var text = document.createTextNode(value.substr(idx,keyword.length));
                // console.log('substr='+value.substr(idx,keyword.length));
                span.appendChild(text);
                
                var rightText = document.createTextNode(value.substr(idx+keyword.length));
                // console.log('span='+span);
                element.deleteData(idx, value.length - idx);
                                
                var next = element.nextSibling;
                element.parentNode.insertBefore(rightText, next);
                element.parentNode.insertBefore(span, rightText);
                
                var leftNeighText = element.nodeValue.substr(element.length - neighSize, neighSize);
                var rightNeighText = rightText.nodeValue.substr(0, neighSize);

                element = rightText;
                MyApp_SearchResultCount++;	// update the counter
                
                consoleStr += "Span className: " + span.className + "\n";
                consoleStr += "Span position: (" + getPos(span).x + ", " + getPos(span).y + ")\n";
                // console.log('consoleStr=' + consoleStr);
                results += getPos(span).x + "," + getPos(span).y + "," + escape(leftNeighText + text.nodeValue + rightNeighText) + ";";
                // console.log('results=' + results);
                results;
            }
        } else if (element.nodeType == 1) { // Element node
            if (element.style.display != "none" && element.nodeName.toLowerCase() != 'select') {
                for (var i=element.childNodes.length-1; i>=0; i--) {
                    MyApp_HighlightAllOccurencesOfStringForElement(element.childNodes[i],keyword);
                }
            }
        }
    }
}

function getPos(el) {
    // yay readability
    for (var lx=0, ly=0; el != null; lx += el.offsetLeft, ly += el.offsetTop, el = el.offsetParent);
    return {x: lx,y: ly};
}

// the main entry point to start the search
function MyApp_HighlightAllOccurencesOfString(keyword) {
    MyApp_RemoveAllHighlights();
    MyApp_HighlightAllOccurencesOfStringForElement(document.body, keyword.toLowerCase());
}

// helper function, recursively removes the highlights in elements and their childs
function MyApp_RemoveAllHighlightsForElement(element) {
    if (element) {
        if (element.nodeType == 1) {
            if (element.getAttribute("class") == "MyAppHighlight") {
                var text = element.removeChild(element.firstChild);
                element.parentNode.insertBefore(text,element);
                element.parentNode.removeChild(element);
                return true;
            } else {
                var normalize = false;
                for (var i=element.childNodes.length-1; i>=0; i--) {
                    if (MyApp_RemoveAllHighlightsForElement(element.childNodes[i])) {
                        normalize = true;
                    }
                }
                if (normalize) {
                    element.normalize();
                }
            }
        }
    }
    return false;
}

// the main entry point to remove the highlights
function MyApp_RemoveAllHighlights() {
    MyApp_SearchResultCount = 0;
    MyApp_RemoveAllHighlightsForElement(document.body);
}

$(document).ready(function() {
    addCSSRule('highlight', 'background-color: yellow;');
    MyApp_HighlightAllOccurencesOfString('the');
});