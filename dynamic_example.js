ocpu.seturl("https://www.stat-edu.cloud.edu.au/codesharey/library/codesharey/R")

$(function(){ 
  domarkdown();
})

function domarkdown(e){
  var dd = Date.now();
  fetch('dynamic_example.Rmd?t=' + dd)
    .then(response => response.text())
    .then(data => {
      var lines = data.split('\n');
      var filteredLines = lines.filter(function(line) {
        return !line.trim().startsWith('library');
      });
      var filteredText = filteredLines.join('\n');
      var req = ocpu.call("rmdtext", {
        text : filteredText
      }, function(session){
           $('#output').html("<iframe frameborder=0 width='100%' onload='resizeIframe(this)' src='" + session.getFileURL("output.html") + "'></iframe>");
           $(".loading").hide();  
      }).fail(function(text){
          var html = "<div style='background-color:#F0F0F0;padding:50px;font-size:18pt'><p>It looks like something is not quite right about your dynamic_example.Rmd. Please check the following potential isues.</p><p>First, you should not have any raw HTML tags in your dynamic_example.Rmd file. You are only to use markdown to generate HTML, along with R code and CSS code chunks.</p><p>Second, all R code that you run has to be within your dynamic_example.Rmd. Please review the notes and lectures to see examples of using R code chunks, and re-read the project instructions.</p><p>Third, all images have to be accessed from a public webpage, as your dynamic_example.Rmd is being generated from your github repo, not your computer.</p><p>Fourth, you can not use R packages that have not been taught in the course. </p><p>The full error message is printed below, please read the beginning of it and use this part only when asking for help on Ed Discussion</p><p>" + req.responseText + "</p></div>";
			$('#output').html(html);
            //$('#output').html(req.responseText)	
          //alert("Error: " + req.responseText);
      });
    })
}

function resizeIframe(iframe) {
    iframe.style.height =  (window.innerHeight - 50) + 'px';
