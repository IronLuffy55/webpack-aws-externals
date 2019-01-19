var utils = require("./utils");
var awsPackages = JSON.parse(require("./aws_packages")) || [];
var scopedModuleRegex = new RegExp(
  "@[a-zA-Z0-9][\\w-.]+/[a-zA-Z0-9][\\w-.]+([a-zA-Z0-9./]+)?",
  "g"
);

function getModuleName(request, includeAbsolutePaths) {
  var req = request;
  var delimiter = "/";

  if (includeAbsolutePaths) {
    req = req.replace(/^.*?\/node_modules\//, "");
  }
  // check if scoped module
  if (scopedModuleRegex.test(req)) {
    // reset regexp
    scopedModuleRegex.lastIndex = 0;
    return req.split(delimiter, 2).join(delimiter);
  }
  return req.split(delimiter)[0];
}

module.exports = function nodeExternals(options) {
  options = options || {};
  var whitelist = [].concat(options.whitelist || []);
  var importType = options.importType || "commonjs";
  var includeAbsolutePaths = !!options.includeAbsolutePaths;
  // return an externals function
  return function(_, request, callback) {
    var moduleName = getModuleName(request, includeAbsolutePaths);
    if (
      utils.contains(awsPackages, moduleName) &&
      !utils.containsPattern(whitelist, request)
    ) {
      if (typeof importType === "function") {
        return callback(null, importType(request));
      }
      // mark this module as external
      // https://webpack.js.org/configuration/externals/
      return callback(null, importType + " " + request);
    }
    callback();
  };
};
