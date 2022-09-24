({
    settings: {
        window_title: 'VSCode'
    },
    command: function(file, line) {
        var installLocationRegKey = 'HKEY_CURRENT_USER\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\{771FD6B0-FA20-440A-A002-3B3BAC16DC50}_is1\\InstallLocation';
        var command = '%editor% --goto %file%:%line%';
        var installPath = readRegistryValue(installLocationRegKey);

        if (installPath == '') {
            return;
        }

        command = command.replace(/%editor%/g, installPath + '/code.exe')
            .replace(/%file%/g, file)
            .replace(/%line%/g, line)
            .replace(/\//g, '\\');

        return command;
    }
});
