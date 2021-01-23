({
    settings: {
        window_title: 'Sublime Text'
    },
    command: function(file, line) {
        var installLocationRegKey = 'HKEY_LOCAL_MACHINE\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\Sublime Text 3_is1\\InstallLocation';
        var command = '%editor% %file%:%line%';
        var installPath = readRegistryValue(installLocationRegKey);

        if (installPath == '') {
            return;
        }

        command = command.replace(/%editor%/g, installPath + '/sublime_text.exe')
            .replace(/%file%/g, file)
            .replace(/%line%/g, line)
            .replace(/\//g, '\\');

        return command;
    }
});
