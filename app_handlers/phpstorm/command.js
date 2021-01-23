({
    // Code based on https://github.com/aik099/PhpStormProtocol
    settings: {
        // flag to active Jetbrain Toolbox configuration
        toolBoxActive: true,

        // Set to 'true' (without quotes) if run on Windows 64bit. Set to 'false' (without quotes) otherwise.
        x64: true,

        // Set to folder name, where PhpStorm was installed to (e.g. 'PhpStorm')
        folder_name: 'PhpStorm 2020.3.2',

        // In case your file is mapped via a network share and paths do not match.
        // eg. /var/www will can replaced with Y:/
        projects_basepath: '',
        projects_path_alias: ''
    },
    command: function(file, line) {
        var file_system = new ActiveXObject('Scripting.FileSystemObject');
        var search_path = file.replace(/\//g, '\\');

        if (this.settings.toolBoxActive) {
            this.configureToolboxSettings(this.settings);
        }

        if (this.settings.projects_basepath !== '' && this.settings.projects_path_alias !== '') {
            file = file.replace(new RegExp('^' + this.settings.projects_basepath), this.settings.projects_path_alias);
        }

        while (search_path.lastIndexOf('\\') !== -1) {
            search_path = search_path.substring(0, search_path.lastIndexOf('\\'));

            if (file_system.FileExists(search_path + '\\.idea\\.name')) {
                project = search_path;
                break;
            }
        }

        if (project !== '') {
            editor += ' "%project%"';
        }

        editor += ' --line %line% "%file%"';

        var command = editor.replace(/%line%/g, line)
            .replace(/%file%/g, file)
            .replace(/%project%/g, project)
            .replace(/\//g, '\\');

        return command;
    },
    configureToolboxSettings: function (settings) {
        var shell = new ActiveXObject('WScript.Shell');
        var appDataLocal = shell.ExpandEnvironmentStrings("%localappdata%");
        var toolboxDirectory = appDataLocal + '\\JetBrains\\Toolbox\\apps\\PhpStorm\\ch-0\\';

        // Reference the FileSystemObject
        var fso = new ActiveXObject('Scripting.FileSystemObject');

        // Reference the Text directory
        var folder = fso.GetFolder(toolboxDirectory);

        // Reference the File collection of the Text directory
        var fileCollection = folder.SubFolders;

        var maxMajor = 0,
            maxMinor = 0,
            maxPatch = 0,
            maxVersionFolder = "";
        // Traverse through the fileCollection using the FOR loop
        // read the maximum version from toolbox filesystem
        for (var objEnum = new Enumerator(fileCollection); !objEnum.atEnd(); objEnum.moveNext()) {
            var folderObject = ( objEnum.item() );
            if (folderObject.Name.lastIndexOf('plugins') === -1) {
                var versionMatch = /(\d+)\.(\d+)\.(\d+)/.exec(folderObject.Name),
                    major = parseInt(versionMatch[ 1 ]),
                    minor = parseInt(versionMatch[ 2 ]),
                    patch = parseInt(versionMatch[ 3 ]);
                if (maxMajor === 0 || maxMajor <= major) {
                    maxMajor = major;
                    if (maxMinor === 0 || maxMinor <= minor) {
                        maxMinor = minor;
                        if (maxPatch === 0 || maxPatch <= patch) {
                            maxPatch = patch;
                            maxVersionFolder = folderObject.Name;
                        }
                    }
                }
            }
        }

        settings.folder_name = maxVersionFolder;

        // read version name and product name from product-info.json
        var versionFile = fso.OpenTextFile(toolboxDirectory + settings.folder_name + "\\product-info.json", 1, true);
        var content = versionFile.ReadAll();

        eval('var productVersion = ' + content + ';');
        settings.window_title = 'PhpStorm ' + productVersion.version;
        editor = '"' + toolboxDirectory + settings.folder_name + '\\' + productVersion.launch[ 0 ].launcherPath.replace(/\//g, '\\') + '"';
    }
});
