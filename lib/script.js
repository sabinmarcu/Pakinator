// Generated by CoffeeScript 1.3.3
(function() {
  var args, data, exists, fs, parser, path, prev, stringify, sty, _args, _config, _path, _ref, _ref1;

  sty = require("sty");

  _config = require("../package.json");

  _path = process.env.PWD;

  parser = require("cliparser");

  _args = parser.parse(process.argv, {
    "-m": "--modify",
    "-d": "--delete",
    "-a": "--add",
    "-h": "--help",
    "-v": "--version",
    "-c": "--create",
    "-e": "--erase"
  });

  args = _args.doubledash;

  if (args['help'] != null) {
    return console.log(sty.red("                                        \n ____       _    _             _             \n|  _ \\ __ _| | _(_)_ __   __ _| |_ ___  _ __ \n| |_) / _` | |/ / | '_ \\ / _` | __/ _ \\| '__|\n|  __/ (_| |   <| | | | | (_| | || (_) | |   \n|_|   \\__,_|_|\\_\\_|_| |_|\\__,_|\\__\\___/|_|   \n                                             \n==================================================\n\n\n" + sty.white("Version : " + (sty.blue(sty.bold("v" + _config.version))) + "\nAuthor  : " + (sty.blue(sty.bold("Sabin Marcu <"))) + (sty.bold(sty.blue(sty.underline("sabinmarcu@gmail.com")))) + (sty.blue(sty.bold(">"))) + "\n\nUsage   : " + (sty.red(sty.bold("pakinator"))) + " " + (sty.blue(sty.bold('(action)'))) + " " + (sty.green("arguments...")) + "\nActions : \n\n	" + (sty.blue(sty.bold("-m, --modify"))) + "		- " + (sty.green("Modify the selected property. If it does not exist, it will be created")) + "\n	" + (sty.blue(sty.bold("-a, --add"))) + "		- " + (sty.green("Add a property")) + "\n	" + (sty.blue(sty.bold("-d, --delete"))) + "		- " + (sty.green("Delete a property")) + "\n	" + (sty.blue(sty.bold("-c, --create"))) + "		- " + (sty.green("Create a package.json")) + "\n	" + (sty.blue(sty.bold("-e, --erase"))) + "		- " + (sty.green("Erase the package.json already existent")) + "\n\nFor example : \n   pakinator --create \n   pakinator --add property\n   pakinator --modify version --set 0.0.1\n   pakinator --delete dependencies pakinator\n")));
  }

  if (args["version"] != null) {
    return console.log(_config.version);
  }

  fs = require("fs");

  path = require("path");

  exists = fs.existsSync || path.existsSync;

  if ((args["create"] != null) || (args["erase"] != null)) {
    if ((args["create"] != null) && !exists("" + _path + "/package.json")) {
      fs.writeFileSync("" + _path + "/package.json", "{\n	\"name\": \"newproject\",\n	\"version\": \"0.0.1\",\n	\"author\": \"Alien\",\n	\"dependencies\": {\n		\"coffee-script\": \"*\"\n	},\n	\"devDependencies\": {\n		\"jasmine-node\": \"*\"	\n	},\n	\"scripts\": {\n		\"create-dir-structure\": \"mkdir lib src spec bin\",\n		\"compile\": \"node node_modules/.bin/coffee -c -o lib src\",\n		\"run-tests\": \"node node_modules/.bin/jasmine-node --coffee --noColor spec\",\n		\"test\": \"npm run-script compile && npm run-script run-tests\"\n	},\n	\"main\": \"./lib/script.js\"\n}				", "utf-8");
    }
    if ((args["erase"] != null) && exists("" + _path + "/package.json")) {
      fs.unlinkSync("" + _path + "/package.json");
    }
    return;
  }

  if (!exists("" + _path + "/package.json")) {
    return console.log(sty.red("There is NO " + sty.blue("package.json" + sty.red("!!!"))));
  }

  data = require("" + _path + "/package.json");

  if ((_ref = args["add"]) == null) {
    args["add"] = args["modify"];
  }

  if ((_ref1 = args["add"]) == null) {
    args["add"] = args["delete"];
  }

  if (args["add"] != null) {
    prev = data;
    while (args["add"].length > 2) {
      if (!(prev[args["add"][0]] != null)) {
        prev[args["add"][0]] = {};
      }
      prev = prev[args["add"][0]];
      args["add"].shift();
    }
    if (args["delete"] != null) {
      prev[args["add"][0]] = null;
    } else {
      prev[args["add"][0]] = args["add"][1] || null;
    }
  }

  stringify = function(json, indent) {
    var i, key, value, _i, _j;
    if (indent == null) {
      indent = 0;
    }
    data = "{\n";
    for (key in json) {
      value = json[key];
      if (!(value != null)) {
        continue;
      }
      for (i = _i = 0; 0 <= indent ? _i <= indent : _i >= indent; i = 0 <= indent ? ++_i : --_i) {
        data += "\t";
      }
      data += "\"" + key + "\" :  ";
      if (typeof value === "object") {
        data += stringify(value, indent + 1);
      } else {
        data += "\"" + (value.toString().replace("\"", "'")) + "\"";
      }
      data += ",\n";
    }
    data = data.substr(0, data.length - 2);
    data += "\n";
    for (i = _j = 0; 0 <= indent ? _j < indent : _j > indent; i = 0 <= indent ? ++_j : --_j) {
      if (i < indent) {
        data += "\t";
      }
    }
    data += "}";
    return data;
  };

  fs.writeFileSync("" + _path + "/package.json", stringify(data));

  console.log(sty.red("Success !!"));

}).call(this);