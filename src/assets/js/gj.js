"use strict";
var gj = {};
gj.includeHTML = function(cb) {
  var z, i, elmnt, file, xhttp;
  z = document.getElementsByTagName("*");
  for (i = 0; i < z.length; i++) {
    elmnt = z[i];
    file = elmnt.getAttribute("gj-include-html");
    if (file) {
      xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
        if (this.readyState == 4) {
          if (this.status == 200) {elmnt.innerHTML = this.responseText;}
          if (this.status == 404) {elmnt.innerHTML = "Page not found.";}
          elmnt.removeAttribute("gj-include-html");
          elmnt.replaceWith(...elmnt.childNodes);
          gj.includeHTML(cb);
        }
      }      
      xhttp.open("GET", file, true);
      xhttp.send();

      return;
    }
  }
  if (cb) cb();
};