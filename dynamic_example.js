ocpu.seturl("https://www.stat-edu.cloud.edu.au/codesharey/library/codesharey/R");

$(function () {
  domarkdown();
});

function domarkdown() {
  var dd = Date.now();

  fetch("dynamic_example.Rmd?t=" + dd)
    .then((response) => {
      if (!response.ok) throw new Error("Fetch Rmd failed: " + response.status);
      return response.text();
    })
    .then((data) => {
      var lines = data.split("\n");
      var filteredLines = lines.filter(function (line) {
        return !line.trim().startsWith("library");
      });
      var filteredText = filteredLines.join("\n");

      var req = ocpu
        .call("rmdtext", { text: filteredText }, function (session) {
          $("#output").html(
            "<iframe frameborder='0' width='100%' onload='resizeIframe(this)' src='" +
              session.getFileURL("output.html") +
              "'></iframe>"
          );
          $(".loading").hide();
        })
        .fail(function () {
          // 注意：这里用 req.responseText（如果有）
          var msg = (req && req.responseText) ? req.responseText : "No responseText (maybe CORS / network / 404).";
          $("#output").html(
            "<pre style='white-space:pre-wrap;background:#f0f0f0;padding:16px;'>" +
              msg +
              "</pre>"
          );
        });
    })
    .catch((err) => {
      $("#output").html(
        "<pre style='white-space:pre-wrap;background:#ffecec;padding:16px;'>" +
          err +
          "</pre>"
      );
    });
}

function resizeIframe(iframe) {
  iframe.style.height = window.innerHeight - 50 + "px";
}
