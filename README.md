mercator
========
Mercator is a CSS and JavaScript library for making borderlayouts in webpages.

Using CSS to layout a webpage can be very confusing because it contains many different layout models, and looking at the source of many, if not most, webpages shows that people in general use the trial and error approach to layouting in webpages.

The idea of CSS is to keep presentation out of webpages.  However, most webpages consist of tons of divs and spans in order to achieve some type of layout.

Mercator brings back layouting in the markup, where the developer can easily control the position of the content - relative to the corners of the container element.

Mercator provides the developer with a set of tags with predefined CSS layout properties that determines the position of the content relative to the container's corners and edges, and relative to the other tags on the same level.

Behind the scenes it's a classic 3x3 cell table with a default width and height of 100%.

One of the major differences from normal CSS layouts is that in order to make a scrollable webpage, you'll need to explicitly put the scrollable content inside a scrollable panel tag (&lt;panel scroll="y"&gt;), or one could say that all content is by default fixed position (unless the content is larger than the viewport size).  This solves the problem of having header and footer bars that potentially overlap the main content.

Mercator can be used in combination with traditional CSS layouts in webpage fragments where needed, so the developer can choose where it makes sense and where it might not.
