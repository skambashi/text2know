var fs = require('fs'),
    colors = require('colors');

exports.genImage = function(response, file) {
  console.log("[IMAGE] Loading \'/static/img/%s\'".yellow, file.yellow);

  fs.readFile('static/img/' + file, function(err, img) {
    if (err) {
      response.writeHeader(404);
      response.end();
    } else {
      response.writeHeader(200, {"Content-Type": "image/jpeg"});
      response.write(img);
    }

    response.end();
  });
}

exports.genCss = function(response, file) {
  console.log("[CSS] Loading \'/static/css/%s\'".yellow, file.yellow);

  fs.readFile('static/css/' + file, function(err, css) {   if (err) {
      response.writeHeader(404);
      response.end();
    } else {
      response.writeHeader(200, {"Content-Type": "text/css"});
      response.write(css);
    }

    response.end();
  });
}

exports.genJs = function(response, file) {
  console.log("[JS] Loading \'/static/js/%s\'".yellow, file.yellow);

  fs.readFile('static/js/' + file, function(err, js) {
    if (err) {
      response.writeHeader(404);
      response.end();
    } else {
      response.writeHeader(200, {"Content-Type": "text/javascript"});
      response.write(js);
    }

    response.end();
  });
}

exports.genHtml = function(response, file) {
  console.log(("[HTML] Loading " + file).yellow);

  fs.readFile('static/' + file, function(err, html) {
    if (err) {
      response.writeHeader(500);
      response.end();
    } else {
      response.writeHeader(200, {"Content-Type": "text/html"});
      response.write(html);
    }

    response.end();
  });
};
