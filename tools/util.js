/**
 * Contains post/page manipulation functions and other tools which are referenced by multiple controllers.
 */

/**
 * Splits a body of text into paragraphs (adding p tag html markup) by splitting over double newline characters.
 */
exports.splitIntoParagraphs = function(body) {
    body = body.split('\n\n');
    var paragraphs = '';
    for (var i = 0; i < body.length; i++) {
        paragraphs = paragraphs.concat('<p>' + body[i] + '</p>');
    }
    return paragraphs;
};

/**
 * Converts HTML markup symbols into their respective &lt; and &gt; notations. Used for comments only, as admin posts
 * can embed HTML tags freely.
 */
exports.convertSymbols = function(body) {
    // ampersand first because it's contained in the &symbols;
    body = body.replace(new RegExp('&', 'g'), '&amp;');
    // then the rest
    body = body.replace(new RegExp('<', 'g'), '&lt;');
    body = body.replace(new RegExp('>', 'g'), '&gt;');
    body = body.replace(new RegExp('\'', 'g'), '&apos;');
    body = body.replace(new RegExp('"', 'g'), '&quot;');
    return body;
};
