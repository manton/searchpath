Searchpath
==========

This is the JavaScript library used to display search results in Searchpath. To create a new theme, fork this project and add a folder inside "themes" with your theme name (lowercase, ASCII-only please) and submit a pull request to include it in Searchpath. The folder should have a "main.css" and any needed images.

Themes will be routinely synced to the main Searchpath server, where any JavaScript and images will be hosted for you. A theme can be accessed in Searchpath by adding "theme=folder_name" to the JavaScript include URL.

To learn more about Searchpath, visit [searchpath.io](http://searchpath.io/).

A couple things still left to do:

* More of v1.js should be extracted into the default theme to make it easier to override that behavior.
* Rewrite to use JavaScript module pattern instead of awkward "searchpath_" prefixed functions.

Questions? Email support@riverfold.com.