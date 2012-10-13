sty     = require "sty"
_config = require "../package.json"
_path   = process.env.PWD
parser  = require "cliparser"
_args   = parser.parse process.argv, "-m": "--modify", "-d": "--delete", "-a": "--add", "-h": "--help", "-v" : "--version", "-c": "--create", "-e": "--erase"
args    = _args.doubledash



# Issuing the help instances 
# This is activated when using -h, --help
if args['help']? then return console.log sty.red """                                        
  ____       _    _             _             
 |  _ \\ __ _| | _(_)_ __   __ _| |_ ___  _ __ 
 | |_) / _` | |/ / | '_ \\ / _` | __/ _ \\| '__|
 |  __/ (_| |   <| | | | | (_| | || (_) | |   
 |_|   \\__,_|_|\\_\\_|_| |_|\\__,_|\\__\\___/|_|   
                                              
==================================================



""" + sty.white """
		Version : #{sty.blue sty.bold "v" + _config.version}
		Author  : #{sty.blue sty.bold "Sabin Marcu <"}#{sty.bold sty.blue sty.underline "sabinmarcu@gmail.com"}#{sty.blue sty.bold ">"}

		Usage   : #{sty.red sty.bold "pakinator"} #{sty.blue sty.bold '(action)'} #{sty.green "arguments..."}
		Actions : 

			#{sty.blue sty.bold "-m, --modify"}		- #{sty.green "Modify the selected property. If it does not exist, it will be created"}
			#{sty.blue sty.bold "-a, --add"}		- #{sty.green "Add a property"}
			#{sty.blue sty.bold "-d, --delete"}		- #{sty.green "Delete a property"}
			#{sty.blue sty.bold "-c, --create"}		- #{sty.green "Create a package.json"}
			#{sty.blue sty.bold "-e, --erase"}		- #{sty.green "Erase the package.json already existent"}

		For example : 
		   pakinator --create 
		   pakinator --add property
		   pakinator --modify version --set 0.0.1
		   pakinator --delete dependencies pakinator

"""

# Issuing the version instances 
# This is activated using -v, --version
if args["version"]? then return console.log _config.version


# Then, if we got till here, we are in the CRUD Section
# First off, we tend to the delete and create functions related to package.json
fs     = require "fs"
path   = require "path"
exists = fs.existsSync or path.existsSync
if args["create"]? or args["erase"]?
	if args["create"]? and not exists "#{_path}/package.json" then fs.writeFileSync "#{_path}/package.json", """
	{
		\"name\": \"newproject\",
		\"version\": \"0.0.1\",
		\"author\": \"Alien\",
		\"dependencies\": {
			\"coffee-script\": \"*\"
		},
		\"devDependencies\": {
			\"jasmine-node\": \"*\"	
		},
		\"scripts\": {
			\"create-dir-structure\": \"mkdir lib src spec bin\",
			\"compile\": \"node node_modules/.bin/coffee -c -o lib src\",
			\"run-tests\": \"node node_modules/.bin/jasmine-node --coffee --noColor spec\",
			\"test\": \"npm run-script compile && npm run-script run-tests\"
		},
		\"main\": \"./lib/script.js\"
	}				
		""", "utf-8"
	if args["erase"]? and exists "#{_path}/package.json" then fs.unlinkSync "#{_path}/package.json"
	return

# Now that we have that out of the way ... let us read the package.json and start editing it
return console.log sty.red "There is NO " + sty.blue "package.json" + sty.red "!!!" if not exists "#{_path}/package.json"
data = require "#{_path}/package.json"

args["add"] ?= args["modify"]
args["add"] ?= args["delete"]
if args["add"]?
	prev = data
	while args["add"].length > 2
		if not prev[args["add"][0]]? then prev[args["add"][0]] = {}
		prev = prev[args["add"][0]]
		args["add"].shift()
	if args["delete"]? then prev[args["add"][0]]= null
	else prev[args["add"][0]] = args["add"][1] or null

stringify = (json, indent = 0) ->
	data = "{\n"
	for key, value of json
		continue if not value?
		data += "\t" for i in [0..indent]
		data += "\"#{key}\" :  "
		if typeof value is "object" then data += stringify value, indent + 1
		else data += "\"#{value.toString().replace("\"", "'")}\""
		data += ",\n"
	data = data.substr 0, data.length - 2
	data += "\n"
	data += "\t" for i in [0...indent] when i < indent
	data += "}"
	return data
fs.writeFileSync "#{_path}/package.json", stringify data

console.log sty.red "Success !!"

