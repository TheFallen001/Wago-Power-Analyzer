/**
 * Elrest eDesign Runtime IPC Typescript Model Runtime
 *
 * @copyright 2024 Elrest Automations Systeme GMBH
 */
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.Header = void 0;
var Header = /** @class */ (function () {
    function Header(reportVersion, event, trigger, filename, dumpEventTime, dumpEventTimeStamp, processId, threadId, cwd, commandLine, nodejsVersion, glibcVersionRuntime, glibcVersionCompiler, wordSize, arch, platform, componentVersions, release, osName, osRelease, osVersion, osMachine, cpus, networkInterfaces, host) {
        this.reportVersion = reportVersion;
        this.event = event;
        this.trigger = trigger;
        this.filename = filename;
        this.dumpEventTime = dumpEventTime;
        this.dumpEventTimeStamp = dumpEventTimeStamp;
        this.processId = processId;
        this.threadId = threadId;
        this.cwd = cwd;
        this.commandLine = commandLine;
        this.nodejsVersion = nodejsVersion;
        this.glibcVersionRuntime = glibcVersionRuntime;
        this.glibcVersionCompiler = glibcVersionCompiler;
        this.wordSize = wordSize;
        this.arch = arch;
        this.platform = platform;
        this.componentVersions = componentVersions;
        this.release = release;
        this.osName = osName;
        this.osRelease = osRelease;
        this.osVersion = osVersion;
        this.osMachine = osMachine;
        this.cpus = cpus;
        this.networkInterfaces = networkInterfaces;
        this.host = host;
    }
    return Header;
}());
exports.Header = Header;
