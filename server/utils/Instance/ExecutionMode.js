/**
 * Elrest eDesign Runtime IPC Typescript Model Instance Execution Mode
 *
 * @copyright 2024 Elrest Automations Systeme GMBH
 */
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExecutionMode = void 0;
var ExecutionMode;
(function (ExecutionMode) {
    // thread = 'thread',
    // threadCluster = 'threadCluster',
    ExecutionMode["spawn"] = "spawn";
    // spawnCluster = 'spawn',
    // docker = 'docker',
    // libvirt = 'libvirt',
    ExecutionMode["worker"] = "worker";
    ExecutionMode["remote"] = "remote";
})(ExecutionMode || (exports.ExecutionMode = ExecutionMode = {}));
