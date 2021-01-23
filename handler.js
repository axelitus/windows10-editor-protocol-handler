function main(url)
{
    var protocols = {
        subl: 'sublime_text',
        sublime: 'sublime_text'
    };
    var regex = new RegExp('^(' + parseProtocols(protocols) + '):\\\/\\\/open\\\/?\\?(?:url=file:\\\/\\\/|file=)(.+)&line=(\\d+)$');
    var match = regex.exec(url);

    if(match) {
        var handler = eval(readHandler(protocols[match[1]]));
        execute(handler.command(decodeURIComponent(match[2]).replace(/\+/g, ' '), match[3]), handler.settings);
    }
}

function parseProtocols(protocols)
{
    var parsed = '';
    for(var protocol in protocols) {
        parsed += '|' + protocol;
    }

    return parsed.substr(1);
}

function readHandler(app)
{
    var file_system = new ActiveXObject("Scripting.FileSystemObject");
    var path = (file_system.GetParentFolderName(WScript.ScriptFullName) + '/app_handlers/'+ app + '/command.js');
    if (file_system.fileExists(path)) {
        return file_system.OpenTextFile(path, 1).ReadAll();
    }
}

function execute(command, settings)
{
    if (command != '') {
        var shell = new ActiveXObject('WScript.Shell');
        shell.Exec(command);
        shell.AppActivate(settings.window_title);
    }
}

function readRegistryValue(key, defaultValue)
{
    var shell = new ActiveXObject('WScript.Shell');
    var value = defaultValue;

    try {
        var value = shell.RegRead(key);
    } catch (exception) {}

    return value;
}

main(WScript.Arguments(0));
