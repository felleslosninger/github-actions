/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 351:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.issue = exports.issueCommand = void 0;
const os = __importStar(__nccwpck_require__(37));
const utils_1 = __nccwpck_require__(278);
/**
 * Commands
 *
 * Command Format:
 *   ::name key=value,key=value::message
 *
 * Examples:
 *   ::warning::This is the message
 *   ::set-env name=MY_VAR::some value
 */
function issueCommand(command, properties, message) {
    const cmd = new Command(command, properties, message);
    process.stdout.write(cmd.toString() + os.EOL);
}
exports.issueCommand = issueCommand;
function issue(name, message = '') {
    issueCommand(name, {}, message);
}
exports.issue = issue;
const CMD_STRING = '::';
class Command {
    constructor(command, properties, message) {
        if (!command) {
            command = 'missing.command';
        }
        this.command = command;
        this.properties = properties;
        this.message = message;
    }
    toString() {
        let cmdStr = CMD_STRING + this.command;
        if (this.properties && Object.keys(this.properties).length > 0) {
            cmdStr += ' ';
            let first = true;
            for (const key in this.properties) {
                if (this.properties.hasOwnProperty(key)) {
                    const val = this.properties[key];
                    if (val) {
                        if (first) {
                            first = false;
                        }
                        else {
                            cmdStr += ',';
                        }
                        cmdStr += `${key}=${escapeProperty(val)}`;
                    }
                }
            }
        }
        cmdStr += `${CMD_STRING}${escapeData(this.message)}`;
        return cmdStr;
    }
}
function escapeData(s) {
    return utils_1.toCommandValue(s)
        .replace(/%/g, '%25')
        .replace(/\r/g, '%0D')
        .replace(/\n/g, '%0A');
}
function escapeProperty(s) {
    return utils_1.toCommandValue(s)
        .replace(/%/g, '%25')
        .replace(/\r/g, '%0D')
        .replace(/\n/g, '%0A')
        .replace(/:/g, '%3A')
        .replace(/,/g, '%2C');
}
//# sourceMappingURL=command.js.map

/***/ }),

/***/ 186:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getIDToken = exports.getState = exports.saveState = exports.group = exports.endGroup = exports.startGroup = exports.info = exports.notice = exports.warning = exports.error = exports.debug = exports.isDebug = exports.setFailed = exports.setCommandEcho = exports.setOutput = exports.getBooleanInput = exports.getMultilineInput = exports.getInput = exports.addPath = exports.setSecret = exports.exportVariable = exports.ExitCode = void 0;
const command_1 = __nccwpck_require__(351);
const file_command_1 = __nccwpck_require__(717);
const utils_1 = __nccwpck_require__(278);
const os = __importStar(__nccwpck_require__(37));
const path = __importStar(__nccwpck_require__(17));
const oidc_utils_1 = __nccwpck_require__(41);
/**
 * The code to exit an action
 */
var ExitCode;
(function (ExitCode) {
    /**
     * A code indicating that the action was successful
     */
    ExitCode[ExitCode["Success"] = 0] = "Success";
    /**
     * A code indicating that the action was a failure
     */
    ExitCode[ExitCode["Failure"] = 1] = "Failure";
})(ExitCode = exports.ExitCode || (exports.ExitCode = {}));
//-----------------------------------------------------------------------
// Variables
//-----------------------------------------------------------------------
/**
 * Sets env variable for this action and future actions in the job
 * @param name the name of the variable to set
 * @param val the value of the variable. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function exportVariable(name, val) {
    const convertedVal = utils_1.toCommandValue(val);
    process.env[name] = convertedVal;
    const filePath = process.env['GITHUB_ENV'] || '';
    if (filePath) {
        return file_command_1.issueFileCommand('ENV', file_command_1.prepareKeyValueMessage(name, val));
    }
    command_1.issueCommand('set-env', { name }, convertedVal);
}
exports.exportVariable = exportVariable;
/**
 * Registers a secret which will get masked from logs
 * @param secret value of the secret
 */
function setSecret(secret) {
    command_1.issueCommand('add-mask', {}, secret);
}
exports.setSecret = setSecret;
/**
 * Prepends inputPath to the PATH (for this action and future actions)
 * @param inputPath
 */
function addPath(inputPath) {
    const filePath = process.env['GITHUB_PATH'] || '';
    if (filePath) {
        file_command_1.issueFileCommand('PATH', inputPath);
    }
    else {
        command_1.issueCommand('add-path', {}, inputPath);
    }
    process.env['PATH'] = `${inputPath}${path.delimiter}${process.env['PATH']}`;
}
exports.addPath = addPath;
/**
 * Gets the value of an input.
 * Unless trimWhitespace is set to false in InputOptions, the value is also trimmed.
 * Returns an empty string if the value is not defined.
 *
 * @param     name     name of the input to get
 * @param     options  optional. See InputOptions.
 * @returns   string
 */
function getInput(name, options) {
    const val = process.env[`INPUT_${name.replace(/ /g, '_').toUpperCase()}`] || '';
    if (options && options.required && !val) {
        throw new Error(`Input required and not supplied: ${name}`);
    }
    if (options && options.trimWhitespace === false) {
        return val;
    }
    return val.trim();
}
exports.getInput = getInput;
/**
 * Gets the values of an multiline input.  Each value is also trimmed.
 *
 * @param     name     name of the input to get
 * @param     options  optional. See InputOptions.
 * @returns   string[]
 *
 */
function getMultilineInput(name, options) {
    const inputs = getInput(name, options)
        .split('\n')
        .filter(x => x !== '');
    if (options && options.trimWhitespace === false) {
        return inputs;
    }
    return inputs.map(input => input.trim());
}
exports.getMultilineInput = getMultilineInput;
/**
 * Gets the input value of the boolean type in the YAML 1.2 "core schema" specification.
 * Support boolean input list: `true | True | TRUE | false | False | FALSE` .
 * The return value is also in boolean type.
 * ref: https://yaml.org/spec/1.2/spec.html#id2804923
 *
 * @param     name     name of the input to get
 * @param     options  optional. See InputOptions.
 * @returns   boolean
 */
function getBooleanInput(name, options) {
    const trueValue = ['true', 'True', 'TRUE'];
    const falseValue = ['false', 'False', 'FALSE'];
    const val = getInput(name, options);
    if (trueValue.includes(val))
        return true;
    if (falseValue.includes(val))
        return false;
    throw new TypeError(`Input does not meet YAML 1.2 "Core Schema" specification: ${name}\n` +
        `Support boolean input list: \`true | True | TRUE | false | False | FALSE\``);
}
exports.getBooleanInput = getBooleanInput;
/**
 * Sets the value of an output.
 *
 * @param     name     name of the output to set
 * @param     value    value to store. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function setOutput(name, value) {
    const filePath = process.env['GITHUB_OUTPUT'] || '';
    if (filePath) {
        return file_command_1.issueFileCommand('OUTPUT', file_command_1.prepareKeyValueMessage(name, value));
    }
    process.stdout.write(os.EOL);
    command_1.issueCommand('set-output', { name }, utils_1.toCommandValue(value));
}
exports.setOutput = setOutput;
/**
 * Enables or disables the echoing of commands into stdout for the rest of the step.
 * Echoing is disabled by default if ACTIONS_STEP_DEBUG is not set.
 *
 */
function setCommandEcho(enabled) {
    command_1.issue('echo', enabled ? 'on' : 'off');
}
exports.setCommandEcho = setCommandEcho;
//-----------------------------------------------------------------------
// Results
//-----------------------------------------------------------------------
/**
 * Sets the action status to failed.
 * When the action exits it will be with an exit code of 1
 * @param message add error issue message
 */
function setFailed(message) {
    process.exitCode = ExitCode.Failure;
    error(message);
}
exports.setFailed = setFailed;
//-----------------------------------------------------------------------
// Logging Commands
//-----------------------------------------------------------------------
/**
 * Gets whether Actions Step Debug is on or not
 */
function isDebug() {
    return process.env['RUNNER_DEBUG'] === '1';
}
exports.isDebug = isDebug;
/**
 * Writes debug message to user log
 * @param message debug message
 */
function debug(message) {
    command_1.issueCommand('debug', {}, message);
}
exports.debug = debug;
/**
 * Adds an error issue
 * @param message error issue message. Errors will be converted to string via toString()
 * @param properties optional properties to add to the annotation.
 */
function error(message, properties = {}) {
    command_1.issueCommand('error', utils_1.toCommandProperties(properties), message instanceof Error ? message.toString() : message);
}
exports.error = error;
/**
 * Adds a warning issue
 * @param message warning issue message. Errors will be converted to string via toString()
 * @param properties optional properties to add to the annotation.
 */
function warning(message, properties = {}) {
    command_1.issueCommand('warning', utils_1.toCommandProperties(properties), message instanceof Error ? message.toString() : message);
}
exports.warning = warning;
/**
 * Adds a notice issue
 * @param message notice issue message. Errors will be converted to string via toString()
 * @param properties optional properties to add to the annotation.
 */
function notice(message, properties = {}) {
    command_1.issueCommand('notice', utils_1.toCommandProperties(properties), message instanceof Error ? message.toString() : message);
}
exports.notice = notice;
/**
 * Writes info to log with console.log.
 * @param message info message
 */
function info(message) {
    process.stdout.write(message + os.EOL);
}
exports.info = info;
/**
 * Begin an output group.
 *
 * Output until the next `groupEnd` will be foldable in this group
 *
 * @param name The name of the output group
 */
function startGroup(name) {
    command_1.issue('group', name);
}
exports.startGroup = startGroup;
/**
 * End an output group.
 */
function endGroup() {
    command_1.issue('endgroup');
}
exports.endGroup = endGroup;
/**
 * Wrap an asynchronous function call in a group.
 *
 * Returns the same type as the function itself.
 *
 * @param name The name of the group
 * @param fn The function to wrap in the group
 */
function group(name, fn) {
    return __awaiter(this, void 0, void 0, function* () {
        startGroup(name);
        let result;
        try {
            result = yield fn();
        }
        finally {
            endGroup();
        }
        return result;
    });
}
exports.group = group;
//-----------------------------------------------------------------------
// Wrapper action state
//-----------------------------------------------------------------------
/**
 * Saves state for current action, the state can only be retrieved by this action's post job execution.
 *
 * @param     name     name of the state to store
 * @param     value    value to store. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function saveState(name, value) {
    const filePath = process.env['GITHUB_STATE'] || '';
    if (filePath) {
        return file_command_1.issueFileCommand('STATE', file_command_1.prepareKeyValueMessage(name, value));
    }
    command_1.issueCommand('save-state', { name }, utils_1.toCommandValue(value));
}
exports.saveState = saveState;
/**
 * Gets the value of an state set by this action's main execution.
 *
 * @param     name     name of the state to get
 * @returns   string
 */
function getState(name) {
    return process.env[`STATE_${name}`] || '';
}
exports.getState = getState;
function getIDToken(aud) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield oidc_utils_1.OidcClient.getIDToken(aud);
    });
}
exports.getIDToken = getIDToken;
/**
 * Summary exports
 */
var summary_1 = __nccwpck_require__(327);
Object.defineProperty(exports, "summary", ({ enumerable: true, get: function () { return summary_1.summary; } }));
/**
 * @deprecated use core.summary
 */
var summary_2 = __nccwpck_require__(327);
Object.defineProperty(exports, "markdownSummary", ({ enumerable: true, get: function () { return summary_2.markdownSummary; } }));
/**
 * Path exports
 */
var path_utils_1 = __nccwpck_require__(981);
Object.defineProperty(exports, "toPosixPath", ({ enumerable: true, get: function () { return path_utils_1.toPosixPath; } }));
Object.defineProperty(exports, "toWin32Path", ({ enumerable: true, get: function () { return path_utils_1.toWin32Path; } }));
Object.defineProperty(exports, "toPlatformPath", ({ enumerable: true, get: function () { return path_utils_1.toPlatformPath; } }));
//# sourceMappingURL=core.js.map

/***/ }),

/***/ 717:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

// For internal use, subject to change.
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.prepareKeyValueMessage = exports.issueFileCommand = void 0;
// We use any as a valid input type
/* eslint-disable @typescript-eslint/no-explicit-any */
const fs = __importStar(__nccwpck_require__(147));
const os = __importStar(__nccwpck_require__(37));
const uuid_1 = __nccwpck_require__(840);
const utils_1 = __nccwpck_require__(278);
function issueFileCommand(command, message) {
    const filePath = process.env[`GITHUB_${command}`];
    if (!filePath) {
        throw new Error(`Unable to find environment variable for file command ${command}`);
    }
    if (!fs.existsSync(filePath)) {
        throw new Error(`Missing file at path: ${filePath}`);
    }
    fs.appendFileSync(filePath, `${utils_1.toCommandValue(message)}${os.EOL}`, {
        encoding: 'utf8'
    });
}
exports.issueFileCommand = issueFileCommand;
function prepareKeyValueMessage(key, value) {
    const delimiter = `ghadelimiter_${uuid_1.v4()}`;
    const convertedValue = utils_1.toCommandValue(value);
    // These should realistically never happen, but just in case someone finds a
    // way to exploit uuid generation let's not allow keys or values that contain
    // the delimiter.
    if (key.includes(delimiter)) {
        throw new Error(`Unexpected input: name should not contain the delimiter "${delimiter}"`);
    }
    if (convertedValue.includes(delimiter)) {
        throw new Error(`Unexpected input: value should not contain the delimiter "${delimiter}"`);
    }
    return `${key}<<${delimiter}${os.EOL}${convertedValue}${os.EOL}${delimiter}`;
}
exports.prepareKeyValueMessage = prepareKeyValueMessage;
//# sourceMappingURL=file-command.js.map

/***/ }),

/***/ 41:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OidcClient = void 0;
const http_client_1 = __nccwpck_require__(255);
const auth_1 = __nccwpck_require__(526);
const core_1 = __nccwpck_require__(186);
class OidcClient {
    static createHttpClient(allowRetry = true, maxRetry = 10) {
        const requestOptions = {
            allowRetries: allowRetry,
            maxRetries: maxRetry
        };
        return new http_client_1.HttpClient('actions/oidc-client', [new auth_1.BearerCredentialHandler(OidcClient.getRequestToken())], requestOptions);
    }
    static getRequestToken() {
        const token = process.env['ACTIONS_ID_TOKEN_REQUEST_TOKEN'];
        if (!token) {
            throw new Error('Unable to get ACTIONS_ID_TOKEN_REQUEST_TOKEN env variable');
        }
        return token;
    }
    static getIDTokenUrl() {
        const runtimeUrl = process.env['ACTIONS_ID_TOKEN_REQUEST_URL'];
        if (!runtimeUrl) {
            throw new Error('Unable to get ACTIONS_ID_TOKEN_REQUEST_URL env variable');
        }
        return runtimeUrl;
    }
    static getCall(id_token_url) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const httpclient = OidcClient.createHttpClient();
            const res = yield httpclient
                .getJson(id_token_url)
                .catch(error => {
                throw new Error(`Failed to get ID Token. \n 
        Error Code : ${error.statusCode}\n 
        Error Message: ${error.message}`);
            });
            const id_token = (_a = res.result) === null || _a === void 0 ? void 0 : _a.value;
            if (!id_token) {
                throw new Error('Response json body do not have ID Token field');
            }
            return id_token;
        });
    }
    static getIDToken(audience) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // New ID Token is requested from action service
                let id_token_url = OidcClient.getIDTokenUrl();
                if (audience) {
                    const encodedAudience = encodeURIComponent(audience);
                    id_token_url = `${id_token_url}&audience=${encodedAudience}`;
                }
                core_1.debug(`ID token url is ${id_token_url}`);
                const id_token = yield OidcClient.getCall(id_token_url);
                core_1.setSecret(id_token);
                return id_token;
            }
            catch (error) {
                throw new Error(`Error message: ${error.message}`);
            }
        });
    }
}
exports.OidcClient = OidcClient;
//# sourceMappingURL=oidc-utils.js.map

/***/ }),

/***/ 981:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.toPlatformPath = exports.toWin32Path = exports.toPosixPath = void 0;
const path = __importStar(__nccwpck_require__(17));
/**
 * toPosixPath converts the given path to the posix form. On Windows, \\ will be
 * replaced with /.
 *
 * @param pth. Path to transform.
 * @return string Posix path.
 */
function toPosixPath(pth) {
    return pth.replace(/[\\]/g, '/');
}
exports.toPosixPath = toPosixPath;
/**
 * toWin32Path converts the given path to the win32 form. On Linux, / will be
 * replaced with \\.
 *
 * @param pth. Path to transform.
 * @return string Win32 path.
 */
function toWin32Path(pth) {
    return pth.replace(/[/]/g, '\\');
}
exports.toWin32Path = toWin32Path;
/**
 * toPlatformPath converts the given path to a platform-specific path. It does
 * this by replacing instances of / and \ with the platform-specific path
 * separator.
 *
 * @param pth The path to platformize.
 * @return string The platform-specific path.
 */
function toPlatformPath(pth) {
    return pth.replace(/[/\\]/g, path.sep);
}
exports.toPlatformPath = toPlatformPath;
//# sourceMappingURL=path-utils.js.map

/***/ }),

/***/ 327:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.summary = exports.markdownSummary = exports.SUMMARY_DOCS_URL = exports.SUMMARY_ENV_VAR = void 0;
const os_1 = __nccwpck_require__(37);
const fs_1 = __nccwpck_require__(147);
const { access, appendFile, writeFile } = fs_1.promises;
exports.SUMMARY_ENV_VAR = 'GITHUB_STEP_SUMMARY';
exports.SUMMARY_DOCS_URL = 'https://docs.github.com/actions/using-workflows/workflow-commands-for-github-actions#adding-a-job-summary';
class Summary {
    constructor() {
        this._buffer = '';
    }
    /**
     * Finds the summary file path from the environment, rejects if env var is not found or file does not exist
     * Also checks r/w permissions.
     *
     * @returns step summary file path
     */
    filePath() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._filePath) {
                return this._filePath;
            }
            const pathFromEnv = process.env[exports.SUMMARY_ENV_VAR];
            if (!pathFromEnv) {
                throw new Error(`Unable to find environment variable for $${exports.SUMMARY_ENV_VAR}. Check if your runtime environment supports job summaries.`);
            }
            try {
                yield access(pathFromEnv, fs_1.constants.R_OK | fs_1.constants.W_OK);
            }
            catch (_a) {
                throw new Error(`Unable to access summary file: '${pathFromEnv}'. Check if the file has correct read/write permissions.`);
            }
            this._filePath = pathFromEnv;
            return this._filePath;
        });
    }
    /**
     * Wraps content in an HTML tag, adding any HTML attributes
     *
     * @param {string} tag HTML tag to wrap
     * @param {string | null} content content within the tag
     * @param {[attribute: string]: string} attrs key-value list of HTML attributes to add
     *
     * @returns {string} content wrapped in HTML element
     */
    wrap(tag, content, attrs = {}) {
        const htmlAttrs = Object.entries(attrs)
            .map(([key, value]) => ` ${key}="${value}"`)
            .join('');
        if (!content) {
            return `<${tag}${htmlAttrs}>`;
        }
        return `<${tag}${htmlAttrs}>${content}</${tag}>`;
    }
    /**
     * Writes text in the buffer to the summary buffer file and empties buffer. Will append by default.
     *
     * @param {SummaryWriteOptions} [options] (optional) options for write operation
     *
     * @returns {Promise<Summary>} summary instance
     */
    write(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const overwrite = !!(options === null || options === void 0 ? void 0 : options.overwrite);
            const filePath = yield this.filePath();
            const writeFunc = overwrite ? writeFile : appendFile;
            yield writeFunc(filePath, this._buffer, { encoding: 'utf8' });
            return this.emptyBuffer();
        });
    }
    /**
     * Clears the summary buffer and wipes the summary file
     *
     * @returns {Summary} summary instance
     */
    clear() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.emptyBuffer().write({ overwrite: true });
        });
    }
    /**
     * Returns the current summary buffer as a string
     *
     * @returns {string} string of summary buffer
     */
    stringify() {
        return this._buffer;
    }
    /**
     * If the summary buffer is empty
     *
     * @returns {boolen} true if the buffer is empty
     */
    isEmptyBuffer() {
        return this._buffer.length === 0;
    }
    /**
     * Resets the summary buffer without writing to summary file
     *
     * @returns {Summary} summary instance
     */
    emptyBuffer() {
        this._buffer = '';
        return this;
    }
    /**
     * Adds raw text to the summary buffer
     *
     * @param {string} text content to add
     * @param {boolean} [addEOL=false] (optional) append an EOL to the raw text (default: false)
     *
     * @returns {Summary} summary instance
     */
    addRaw(text, addEOL = false) {
        this._buffer += text;
        return addEOL ? this.addEOL() : this;
    }
    /**
     * Adds the operating system-specific end-of-line marker to the buffer
     *
     * @returns {Summary} summary instance
     */
    addEOL() {
        return this.addRaw(os_1.EOL);
    }
    /**
     * Adds an HTML codeblock to the summary buffer
     *
     * @param {string} code content to render within fenced code block
     * @param {string} lang (optional) language to syntax highlight code
     *
     * @returns {Summary} summary instance
     */
    addCodeBlock(code, lang) {
        const attrs = Object.assign({}, (lang && { lang }));
        const element = this.wrap('pre', this.wrap('code', code), attrs);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML list to the summary buffer
     *
     * @param {string[]} items list of items to render
     * @param {boolean} [ordered=false] (optional) if the rendered list should be ordered or not (default: false)
     *
     * @returns {Summary} summary instance
     */
    addList(items, ordered = false) {
        const tag = ordered ? 'ol' : 'ul';
        const listItems = items.map(item => this.wrap('li', item)).join('');
        const element = this.wrap(tag, listItems);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML table to the summary buffer
     *
     * @param {SummaryTableCell[]} rows table rows
     *
     * @returns {Summary} summary instance
     */
    addTable(rows) {
        const tableBody = rows
            .map(row => {
            const cells = row
                .map(cell => {
                if (typeof cell === 'string') {
                    return this.wrap('td', cell);
                }
                const { header, data, colspan, rowspan } = cell;
                const tag = header ? 'th' : 'td';
                const attrs = Object.assign(Object.assign({}, (colspan && { colspan })), (rowspan && { rowspan }));
                return this.wrap(tag, data, attrs);
            })
                .join('');
            return this.wrap('tr', cells);
        })
            .join('');
        const element = this.wrap('table', tableBody);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds a collapsable HTML details element to the summary buffer
     *
     * @param {string} label text for the closed state
     * @param {string} content collapsable content
     *
     * @returns {Summary} summary instance
     */
    addDetails(label, content) {
        const element = this.wrap('details', this.wrap('summary', label) + content);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML image tag to the summary buffer
     *
     * @param {string} src path to the image you to embed
     * @param {string} alt text description of the image
     * @param {SummaryImageOptions} options (optional) addition image attributes
     *
     * @returns {Summary} summary instance
     */
    addImage(src, alt, options) {
        const { width, height } = options || {};
        const attrs = Object.assign(Object.assign({}, (width && { width })), (height && { height }));
        const element = this.wrap('img', null, Object.assign({ src, alt }, attrs));
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML section heading element
     *
     * @param {string} text heading text
     * @param {number | string} [level=1] (optional) the heading level, default: 1
     *
     * @returns {Summary} summary instance
     */
    addHeading(text, level) {
        const tag = `h${level}`;
        const allowedTag = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(tag)
            ? tag
            : 'h1';
        const element = this.wrap(allowedTag, text);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML thematic break (<hr>) to the summary buffer
     *
     * @returns {Summary} summary instance
     */
    addSeparator() {
        const element = this.wrap('hr', null);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML line break (<br>) to the summary buffer
     *
     * @returns {Summary} summary instance
     */
    addBreak() {
        const element = this.wrap('br', null);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML blockquote to the summary buffer
     *
     * @param {string} text quote text
     * @param {string} cite (optional) citation url
     *
     * @returns {Summary} summary instance
     */
    addQuote(text, cite) {
        const attrs = Object.assign({}, (cite && { cite }));
        const element = this.wrap('blockquote', text, attrs);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML anchor tag to the summary buffer
     *
     * @param {string} text link text/content
     * @param {string} href hyperlink
     *
     * @returns {Summary} summary instance
     */
    addLink(text, href) {
        const element = this.wrap('a', text, { href });
        return this.addRaw(element).addEOL();
    }
}
const _summary = new Summary();
/**
 * @deprecated use `core.summary`
 */
exports.markdownSummary = _summary;
exports.summary = _summary;
//# sourceMappingURL=summary.js.map

/***/ }),

/***/ 278:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

// We use any as a valid input type
/* eslint-disable @typescript-eslint/no-explicit-any */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.toCommandProperties = exports.toCommandValue = void 0;
/**
 * Sanitizes an input into a string so it can be passed into issueCommand safely
 * @param input input to sanitize into a string
 */
function toCommandValue(input) {
    if (input === null || input === undefined) {
        return '';
    }
    else if (typeof input === 'string' || input instanceof String) {
        return input;
    }
    return JSON.stringify(input);
}
exports.toCommandValue = toCommandValue;
/**
 *
 * @param annotationProperties
 * @returns The command properties to send with the actual annotation command
 * See IssueCommandProperties: https://github.com/actions/runner/blob/main/src/Runner.Worker/ActionCommandManager.cs#L646
 */
function toCommandProperties(annotationProperties) {
    if (!Object.keys(annotationProperties).length) {
        return {};
    }
    return {
        title: annotationProperties.title,
        file: annotationProperties.file,
        line: annotationProperties.startLine,
        endLine: annotationProperties.endLine,
        col: annotationProperties.startColumn,
        endColumn: annotationProperties.endColumn
    };
}
exports.toCommandProperties = toCommandProperties;
//# sourceMappingURL=utils.js.map

/***/ }),

/***/ 526:
/***/ (function(__unused_webpack_module, exports) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PersonalAccessTokenCredentialHandler = exports.BearerCredentialHandler = exports.BasicCredentialHandler = void 0;
class BasicCredentialHandler {
    constructor(username, password) {
        this.username = username;
        this.password = password;
    }
    prepareRequest(options) {
        if (!options.headers) {
            throw Error('The request has no headers');
        }
        options.headers['Authorization'] = `Basic ${Buffer.from(`${this.username}:${this.password}`).toString('base64')}`;
    }
    // This handler cannot handle 401
    canHandleAuthentication() {
        return false;
    }
    handleAuthentication() {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error('not implemented');
        });
    }
}
exports.BasicCredentialHandler = BasicCredentialHandler;
class BearerCredentialHandler {
    constructor(token) {
        this.token = token;
    }
    // currently implements pre-authorization
    // TODO: support preAuth = false where it hooks on 401
    prepareRequest(options) {
        if (!options.headers) {
            throw Error('The request has no headers');
        }
        options.headers['Authorization'] = `Bearer ${this.token}`;
    }
    // This handler cannot handle 401
    canHandleAuthentication() {
        return false;
    }
    handleAuthentication() {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error('not implemented');
        });
    }
}
exports.BearerCredentialHandler = BearerCredentialHandler;
class PersonalAccessTokenCredentialHandler {
    constructor(token) {
        this.token = token;
    }
    // currently implements pre-authorization
    // TODO: support preAuth = false where it hooks on 401
    prepareRequest(options) {
        if (!options.headers) {
            throw Error('The request has no headers');
        }
        options.headers['Authorization'] = `Basic ${Buffer.from(`PAT:${this.token}`).toString('base64')}`;
    }
    // This handler cannot handle 401
    canHandleAuthentication() {
        return false;
    }
    handleAuthentication() {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error('not implemented');
        });
    }
}
exports.PersonalAccessTokenCredentialHandler = PersonalAccessTokenCredentialHandler;
//# sourceMappingURL=auth.js.map

/***/ }),

/***/ 255:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

/* eslint-disable @typescript-eslint/no-explicit-any */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.HttpClient = exports.isHttps = exports.HttpClientResponse = exports.HttpClientError = exports.getProxyUrl = exports.MediaTypes = exports.Headers = exports.HttpCodes = void 0;
const http = __importStar(__nccwpck_require__(685));
const https = __importStar(__nccwpck_require__(687));
const pm = __importStar(__nccwpck_require__(835));
const tunnel = __importStar(__nccwpck_require__(294));
var HttpCodes;
(function (HttpCodes) {
    HttpCodes[HttpCodes["OK"] = 200] = "OK";
    HttpCodes[HttpCodes["MultipleChoices"] = 300] = "MultipleChoices";
    HttpCodes[HttpCodes["MovedPermanently"] = 301] = "MovedPermanently";
    HttpCodes[HttpCodes["ResourceMoved"] = 302] = "ResourceMoved";
    HttpCodes[HttpCodes["SeeOther"] = 303] = "SeeOther";
    HttpCodes[HttpCodes["NotModified"] = 304] = "NotModified";
    HttpCodes[HttpCodes["UseProxy"] = 305] = "UseProxy";
    HttpCodes[HttpCodes["SwitchProxy"] = 306] = "SwitchProxy";
    HttpCodes[HttpCodes["TemporaryRedirect"] = 307] = "TemporaryRedirect";
    HttpCodes[HttpCodes["PermanentRedirect"] = 308] = "PermanentRedirect";
    HttpCodes[HttpCodes["BadRequest"] = 400] = "BadRequest";
    HttpCodes[HttpCodes["Unauthorized"] = 401] = "Unauthorized";
    HttpCodes[HttpCodes["PaymentRequired"] = 402] = "PaymentRequired";
    HttpCodes[HttpCodes["Forbidden"] = 403] = "Forbidden";
    HttpCodes[HttpCodes["NotFound"] = 404] = "NotFound";
    HttpCodes[HttpCodes["MethodNotAllowed"] = 405] = "MethodNotAllowed";
    HttpCodes[HttpCodes["NotAcceptable"] = 406] = "NotAcceptable";
    HttpCodes[HttpCodes["ProxyAuthenticationRequired"] = 407] = "ProxyAuthenticationRequired";
    HttpCodes[HttpCodes["RequestTimeout"] = 408] = "RequestTimeout";
    HttpCodes[HttpCodes["Conflict"] = 409] = "Conflict";
    HttpCodes[HttpCodes["Gone"] = 410] = "Gone";
    HttpCodes[HttpCodes["TooManyRequests"] = 429] = "TooManyRequests";
    HttpCodes[HttpCodes["InternalServerError"] = 500] = "InternalServerError";
    HttpCodes[HttpCodes["NotImplemented"] = 501] = "NotImplemented";
    HttpCodes[HttpCodes["BadGateway"] = 502] = "BadGateway";
    HttpCodes[HttpCodes["ServiceUnavailable"] = 503] = "ServiceUnavailable";
    HttpCodes[HttpCodes["GatewayTimeout"] = 504] = "GatewayTimeout";
})(HttpCodes = exports.HttpCodes || (exports.HttpCodes = {}));
var Headers;
(function (Headers) {
    Headers["Accept"] = "accept";
    Headers["ContentType"] = "content-type";
})(Headers = exports.Headers || (exports.Headers = {}));
var MediaTypes;
(function (MediaTypes) {
    MediaTypes["ApplicationJson"] = "application/json";
})(MediaTypes = exports.MediaTypes || (exports.MediaTypes = {}));
/**
 * Returns the proxy URL, depending upon the supplied url and proxy environment variables.
 * @param serverUrl  The server URL where the request will be sent. For example, https://api.github.com
 */
function getProxyUrl(serverUrl) {
    const proxyUrl = pm.getProxyUrl(new URL(serverUrl));
    return proxyUrl ? proxyUrl.href : '';
}
exports.getProxyUrl = getProxyUrl;
const HttpRedirectCodes = [
    HttpCodes.MovedPermanently,
    HttpCodes.ResourceMoved,
    HttpCodes.SeeOther,
    HttpCodes.TemporaryRedirect,
    HttpCodes.PermanentRedirect
];
const HttpResponseRetryCodes = [
    HttpCodes.BadGateway,
    HttpCodes.ServiceUnavailable,
    HttpCodes.GatewayTimeout
];
const RetryableHttpVerbs = ['OPTIONS', 'GET', 'DELETE', 'HEAD'];
const ExponentialBackoffCeiling = 10;
const ExponentialBackoffTimeSlice = 5;
class HttpClientError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.name = 'HttpClientError';
        this.statusCode = statusCode;
        Object.setPrototypeOf(this, HttpClientError.prototype);
    }
}
exports.HttpClientError = HttpClientError;
class HttpClientResponse {
    constructor(message) {
        this.message = message;
    }
    readBody() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
                let output = Buffer.alloc(0);
                this.message.on('data', (chunk) => {
                    output = Buffer.concat([output, chunk]);
                });
                this.message.on('end', () => {
                    resolve(output.toString());
                });
            }));
        });
    }
    readBodyBuffer() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
                const chunks = [];
                this.message.on('data', (chunk) => {
                    chunks.push(chunk);
                });
                this.message.on('end', () => {
                    resolve(Buffer.concat(chunks));
                });
            }));
        });
    }
}
exports.HttpClientResponse = HttpClientResponse;
function isHttps(requestUrl) {
    const parsedUrl = new URL(requestUrl);
    return parsedUrl.protocol === 'https:';
}
exports.isHttps = isHttps;
class HttpClient {
    constructor(userAgent, handlers, requestOptions) {
        this._ignoreSslError = false;
        this._allowRedirects = true;
        this._allowRedirectDowngrade = false;
        this._maxRedirects = 50;
        this._allowRetries = false;
        this._maxRetries = 1;
        this._keepAlive = false;
        this._disposed = false;
        this.userAgent = userAgent;
        this.handlers = handlers || [];
        this.requestOptions = requestOptions;
        if (requestOptions) {
            if (requestOptions.ignoreSslError != null) {
                this._ignoreSslError = requestOptions.ignoreSslError;
            }
            this._socketTimeout = requestOptions.socketTimeout;
            if (requestOptions.allowRedirects != null) {
                this._allowRedirects = requestOptions.allowRedirects;
            }
            if (requestOptions.allowRedirectDowngrade != null) {
                this._allowRedirectDowngrade = requestOptions.allowRedirectDowngrade;
            }
            if (requestOptions.maxRedirects != null) {
                this._maxRedirects = Math.max(requestOptions.maxRedirects, 0);
            }
            if (requestOptions.keepAlive != null) {
                this._keepAlive = requestOptions.keepAlive;
            }
            if (requestOptions.allowRetries != null) {
                this._allowRetries = requestOptions.allowRetries;
            }
            if (requestOptions.maxRetries != null) {
                this._maxRetries = requestOptions.maxRetries;
            }
        }
    }
    options(requestUrl, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('OPTIONS', requestUrl, null, additionalHeaders || {});
        });
    }
    get(requestUrl, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('GET', requestUrl, null, additionalHeaders || {});
        });
    }
    del(requestUrl, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('DELETE', requestUrl, null, additionalHeaders || {});
        });
    }
    post(requestUrl, data, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('POST', requestUrl, data, additionalHeaders || {});
        });
    }
    patch(requestUrl, data, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('PATCH', requestUrl, data, additionalHeaders || {});
        });
    }
    put(requestUrl, data, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('PUT', requestUrl, data, additionalHeaders || {});
        });
    }
    head(requestUrl, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('HEAD', requestUrl, null, additionalHeaders || {});
        });
    }
    sendStream(verb, requestUrl, stream, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request(verb, requestUrl, stream, additionalHeaders);
        });
    }
    /**
     * Gets a typed object from an endpoint
     * Be aware that not found returns a null.  Other errors (4xx, 5xx) reject the promise
     */
    getJson(requestUrl, additionalHeaders = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
            const res = yield this.get(requestUrl, additionalHeaders);
            return this._processResponse(res, this.requestOptions);
        });
    }
    postJson(requestUrl, obj, additionalHeaders = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = JSON.stringify(obj, null, 2);
            additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
            additionalHeaders[Headers.ContentType] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.ContentType, MediaTypes.ApplicationJson);
            const res = yield this.post(requestUrl, data, additionalHeaders);
            return this._processResponse(res, this.requestOptions);
        });
    }
    putJson(requestUrl, obj, additionalHeaders = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = JSON.stringify(obj, null, 2);
            additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
            additionalHeaders[Headers.ContentType] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.ContentType, MediaTypes.ApplicationJson);
            const res = yield this.put(requestUrl, data, additionalHeaders);
            return this._processResponse(res, this.requestOptions);
        });
    }
    patchJson(requestUrl, obj, additionalHeaders = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = JSON.stringify(obj, null, 2);
            additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
            additionalHeaders[Headers.ContentType] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.ContentType, MediaTypes.ApplicationJson);
            const res = yield this.patch(requestUrl, data, additionalHeaders);
            return this._processResponse(res, this.requestOptions);
        });
    }
    /**
     * Makes a raw http request.
     * All other methods such as get, post, patch, and request ultimately call this.
     * Prefer get, del, post and patch
     */
    request(verb, requestUrl, data, headers) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._disposed) {
                throw new Error('Client has already been disposed.');
            }
            const parsedUrl = new URL(requestUrl);
            let info = this._prepareRequest(verb, parsedUrl, headers);
            // Only perform retries on reads since writes may not be idempotent.
            const maxTries = this._allowRetries && RetryableHttpVerbs.includes(verb)
                ? this._maxRetries + 1
                : 1;
            let numTries = 0;
            let response;
            do {
                response = yield this.requestRaw(info, data);
                // Check if it's an authentication challenge
                if (response &&
                    response.message &&
                    response.message.statusCode === HttpCodes.Unauthorized) {
                    let authenticationHandler;
                    for (const handler of this.handlers) {
                        if (handler.canHandleAuthentication(response)) {
                            authenticationHandler = handler;
                            break;
                        }
                    }
                    if (authenticationHandler) {
                        return authenticationHandler.handleAuthentication(this, info, data);
                    }
                    else {
                        // We have received an unauthorized response but have no handlers to handle it.
                        // Let the response return to the caller.
                        return response;
                    }
                }
                let redirectsRemaining = this._maxRedirects;
                while (response.message.statusCode &&
                    HttpRedirectCodes.includes(response.message.statusCode) &&
                    this._allowRedirects &&
                    redirectsRemaining > 0) {
                    const redirectUrl = response.message.headers['location'];
                    if (!redirectUrl) {
                        // if there's no location to redirect to, we won't
                        break;
                    }
                    const parsedRedirectUrl = new URL(redirectUrl);
                    if (parsedUrl.protocol === 'https:' &&
                        parsedUrl.protocol !== parsedRedirectUrl.protocol &&
                        !this._allowRedirectDowngrade) {
                        throw new Error('Redirect from HTTPS to HTTP protocol. This downgrade is not allowed for security reasons. If you want to allow this behavior, set the allowRedirectDowngrade option to true.');
                    }
                    // we need to finish reading the response before reassigning response
                    // which will leak the open socket.
                    yield response.readBody();
                    // strip authorization header if redirected to a different hostname
                    if (parsedRedirectUrl.hostname !== parsedUrl.hostname) {
                        for (const header in headers) {
                            // header names are case insensitive
                            if (header.toLowerCase() === 'authorization') {
                                delete headers[header];
                            }
                        }
                    }
                    // let's make the request with the new redirectUrl
                    info = this._prepareRequest(verb, parsedRedirectUrl, headers);
                    response = yield this.requestRaw(info, data);
                    redirectsRemaining--;
                }
                if (!response.message.statusCode ||
                    !HttpResponseRetryCodes.includes(response.message.statusCode)) {
                    // If not a retry code, return immediately instead of retrying
                    return response;
                }
                numTries += 1;
                if (numTries < maxTries) {
                    yield response.readBody();
                    yield this._performExponentialBackoff(numTries);
                }
            } while (numTries < maxTries);
            return response;
        });
    }
    /**
     * Needs to be called if keepAlive is set to true in request options.
     */
    dispose() {
        if (this._agent) {
            this._agent.destroy();
        }
        this._disposed = true;
    }
    /**
     * Raw request.
     * @param info
     * @param data
     */
    requestRaw(info, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                function callbackForResult(err, res) {
                    if (err) {
                        reject(err);
                    }
                    else if (!res) {
                        // If `err` is not passed, then `res` must be passed.
                        reject(new Error('Unknown error'));
                    }
                    else {
                        resolve(res);
                    }
                }
                this.requestRawWithCallback(info, data, callbackForResult);
            });
        });
    }
    /**
     * Raw request with callback.
     * @param info
     * @param data
     * @param onResult
     */
    requestRawWithCallback(info, data, onResult) {
        if (typeof data === 'string') {
            if (!info.options.headers) {
                info.options.headers = {};
            }
            info.options.headers['Content-Length'] = Buffer.byteLength(data, 'utf8');
        }
        let callbackCalled = false;
        function handleResult(err, res) {
            if (!callbackCalled) {
                callbackCalled = true;
                onResult(err, res);
            }
        }
        const req = info.httpModule.request(info.options, (msg) => {
            const res = new HttpClientResponse(msg);
            handleResult(undefined, res);
        });
        let socket;
        req.on('socket', sock => {
            socket = sock;
        });
        // If we ever get disconnected, we want the socket to timeout eventually
        req.setTimeout(this._socketTimeout || 3 * 60000, () => {
            if (socket) {
                socket.end();
            }
            handleResult(new Error(`Request timeout: ${info.options.path}`));
        });
        req.on('error', function (err) {
            // err has statusCode property
            // res should have headers
            handleResult(err);
        });
        if (data && typeof data === 'string') {
            req.write(data, 'utf8');
        }
        if (data && typeof data !== 'string') {
            data.on('close', function () {
                req.end();
            });
            data.pipe(req);
        }
        else {
            req.end();
        }
    }
    /**
     * Gets an http agent. This function is useful when you need an http agent that handles
     * routing through a proxy server - depending upon the url and proxy environment variables.
     * @param serverUrl  The server URL where the request will be sent. For example, https://api.github.com
     */
    getAgent(serverUrl) {
        const parsedUrl = new URL(serverUrl);
        return this._getAgent(parsedUrl);
    }
    _prepareRequest(method, requestUrl, headers) {
        const info = {};
        info.parsedUrl = requestUrl;
        const usingSsl = info.parsedUrl.protocol === 'https:';
        info.httpModule = usingSsl ? https : http;
        const defaultPort = usingSsl ? 443 : 80;
        info.options = {};
        info.options.host = info.parsedUrl.hostname;
        info.options.port = info.parsedUrl.port
            ? parseInt(info.parsedUrl.port)
            : defaultPort;
        info.options.path =
            (info.parsedUrl.pathname || '') + (info.parsedUrl.search || '');
        info.options.method = method;
        info.options.headers = this._mergeHeaders(headers);
        if (this.userAgent != null) {
            info.options.headers['user-agent'] = this.userAgent;
        }
        info.options.agent = this._getAgent(info.parsedUrl);
        // gives handlers an opportunity to participate
        if (this.handlers) {
            for (const handler of this.handlers) {
                handler.prepareRequest(info.options);
            }
        }
        return info;
    }
    _mergeHeaders(headers) {
        if (this.requestOptions && this.requestOptions.headers) {
            return Object.assign({}, lowercaseKeys(this.requestOptions.headers), lowercaseKeys(headers || {}));
        }
        return lowercaseKeys(headers || {});
    }
    _getExistingOrDefaultHeader(additionalHeaders, header, _default) {
        let clientHeader;
        if (this.requestOptions && this.requestOptions.headers) {
            clientHeader = lowercaseKeys(this.requestOptions.headers)[header];
        }
        return additionalHeaders[header] || clientHeader || _default;
    }
    _getAgent(parsedUrl) {
        let agent;
        const proxyUrl = pm.getProxyUrl(parsedUrl);
        const useProxy = proxyUrl && proxyUrl.hostname;
        if (this._keepAlive && useProxy) {
            agent = this._proxyAgent;
        }
        if (this._keepAlive && !useProxy) {
            agent = this._agent;
        }
        // if agent is already assigned use that agent.
        if (agent) {
            return agent;
        }
        const usingSsl = parsedUrl.protocol === 'https:';
        let maxSockets = 100;
        if (this.requestOptions) {
            maxSockets = this.requestOptions.maxSockets || http.globalAgent.maxSockets;
        }
        // This is `useProxy` again, but we need to check `proxyURl` directly for TypeScripts's flow analysis.
        if (proxyUrl && proxyUrl.hostname) {
            const agentOptions = {
                maxSockets,
                keepAlive: this._keepAlive,
                proxy: Object.assign(Object.assign({}, ((proxyUrl.username || proxyUrl.password) && {
                    proxyAuth: `${proxyUrl.username}:${proxyUrl.password}`
                })), { host: proxyUrl.hostname, port: proxyUrl.port })
            };
            let tunnelAgent;
            const overHttps = proxyUrl.protocol === 'https:';
            if (usingSsl) {
                tunnelAgent = overHttps ? tunnel.httpsOverHttps : tunnel.httpsOverHttp;
            }
            else {
                tunnelAgent = overHttps ? tunnel.httpOverHttps : tunnel.httpOverHttp;
            }
            agent = tunnelAgent(agentOptions);
            this._proxyAgent = agent;
        }
        // if reusing agent across request and tunneling agent isn't assigned create a new agent
        if (this._keepAlive && !agent) {
            const options = { keepAlive: this._keepAlive, maxSockets };
            agent = usingSsl ? new https.Agent(options) : new http.Agent(options);
            this._agent = agent;
        }
        // if not using private agent and tunnel agent isn't setup then use global agent
        if (!agent) {
            agent = usingSsl ? https.globalAgent : http.globalAgent;
        }
        if (usingSsl && this._ignoreSslError) {
            // we don't want to set NODE_TLS_REJECT_UNAUTHORIZED=0 since that will affect request for entire process
            // http.RequestOptions doesn't expose a way to modify RequestOptions.agent.options
            // we have to cast it to any and change it directly
            agent.options = Object.assign(agent.options || {}, {
                rejectUnauthorized: false
            });
        }
        return agent;
    }
    _performExponentialBackoff(retryNumber) {
        return __awaiter(this, void 0, void 0, function* () {
            retryNumber = Math.min(ExponentialBackoffCeiling, retryNumber);
            const ms = ExponentialBackoffTimeSlice * Math.pow(2, retryNumber);
            return new Promise(resolve => setTimeout(() => resolve(), ms));
        });
    }
    _processResponse(res, options) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                const statusCode = res.message.statusCode || 0;
                const response = {
                    statusCode,
                    result: null,
                    headers: {}
                };
                // not found leads to null obj returned
                if (statusCode === HttpCodes.NotFound) {
                    resolve(response);
                }
                // get the result from the body
                function dateTimeDeserializer(key, value) {
                    if (typeof value === 'string') {
                        const a = new Date(value);
                        if (!isNaN(a.valueOf())) {
                            return a;
                        }
                    }
                    return value;
                }
                let obj;
                let contents;
                try {
                    contents = yield res.readBody();
                    if (contents && contents.length > 0) {
                        if (options && options.deserializeDates) {
                            obj = JSON.parse(contents, dateTimeDeserializer);
                        }
                        else {
                            obj = JSON.parse(contents);
                        }
                        response.result = obj;
                    }
                    response.headers = res.message.headers;
                }
                catch (err) {
                    // Invalid resource (contents not json);  leaving result obj null
                }
                // note that 3xx redirects are handled by the http layer.
                if (statusCode > 299) {
                    let msg;
                    // if exception/error in body, attempt to get better error
                    if (obj && obj.message) {
                        msg = obj.message;
                    }
                    else if (contents && contents.length > 0) {
                        // it may be the case that the exception is in the body message as string
                        msg = contents;
                    }
                    else {
                        msg = `Failed request: (${statusCode})`;
                    }
                    const err = new HttpClientError(msg, statusCode);
                    err.result = response.result;
                    reject(err);
                }
                else {
                    resolve(response);
                }
            }));
        });
    }
}
exports.HttpClient = HttpClient;
const lowercaseKeys = (obj) => Object.keys(obj).reduce((c, k) => ((c[k.toLowerCase()] = obj[k]), c), {});
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 835:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.checkBypass = exports.getProxyUrl = void 0;
function getProxyUrl(reqUrl) {
    const usingSsl = reqUrl.protocol === 'https:';
    if (checkBypass(reqUrl)) {
        return undefined;
    }
    const proxyVar = (() => {
        if (usingSsl) {
            return process.env['https_proxy'] || process.env['HTTPS_PROXY'];
        }
        else {
            return process.env['http_proxy'] || process.env['HTTP_PROXY'];
        }
    })();
    if (proxyVar) {
        try {
            return new URL(proxyVar);
        }
        catch (_a) {
            if (!proxyVar.startsWith('http://') && !proxyVar.startsWith('https://'))
                return new URL(`http://${proxyVar}`);
        }
    }
    else {
        return undefined;
    }
}
exports.getProxyUrl = getProxyUrl;
function checkBypass(reqUrl) {
    if (!reqUrl.hostname) {
        return false;
    }
    const reqHost = reqUrl.hostname;
    if (isLoopbackAddress(reqHost)) {
        return true;
    }
    const noProxy = process.env['no_proxy'] || process.env['NO_PROXY'] || '';
    if (!noProxy) {
        return false;
    }
    // Determine the request port
    let reqPort;
    if (reqUrl.port) {
        reqPort = Number(reqUrl.port);
    }
    else if (reqUrl.protocol === 'http:') {
        reqPort = 80;
    }
    else if (reqUrl.protocol === 'https:') {
        reqPort = 443;
    }
    // Format the request hostname and hostname with port
    const upperReqHosts = [reqUrl.hostname.toUpperCase()];
    if (typeof reqPort === 'number') {
        upperReqHosts.push(`${upperReqHosts[0]}:${reqPort}`);
    }
    // Compare request host against noproxy
    for (const upperNoProxyItem of noProxy
        .split(',')
        .map(x => x.trim().toUpperCase())
        .filter(x => x)) {
        if (upperNoProxyItem === '*' ||
            upperReqHosts.some(x => x === upperNoProxyItem ||
                x.endsWith(`.${upperNoProxyItem}`) ||
                (upperNoProxyItem.startsWith('.') &&
                    x.endsWith(`${upperNoProxyItem}`)))) {
            return true;
        }
    }
    return false;
}
exports.checkBypass = checkBypass;
function isLoopbackAddress(host) {
    const hostLower = host.toLowerCase();
    return (hostLower === 'localhost' ||
        hostLower.startsWith('127.') ||
        hostLower.startsWith('[::1]') ||
        hostLower.startsWith('[0:0:0:0:0:0:0:1]'));
}
//# sourceMappingURL=proxy.js.map

/***/ }),

/***/ 659:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";
var Ne=Object.create;var B=Object.defineProperty;var He=Object.getOwnPropertyDescriptor;var qe=Object.getOwnPropertyNames;var Qe=Object.getPrototypeOf,je=Object.prototype.hasOwnProperty;var Je=(r,e)=>{for(var t in e)B(r,t,{get:e[t],enumerable:!0})},Se=(r,e,t,n)=>{if(e&&typeof e=="object"||typeof e=="function")for(let i of qe(e))!je.call(r,i)&&i!==t&&B(r,i,{get:()=>e[i],enumerable:!(n=He(e,i))||n.enumerable});return r};var Q=(r,e,t)=>(t=r!=null?Ne(Qe(r)):{},Se(e||!r||!r.__esModule?B(t,"default",{value:r,enumerable:!0}):t,r)),Xe=r=>Se(B({},"__esModule",{value:!0}),r);var Tt={};Je(Tt,{AbortError:()=>b,DEFAULT_ConnectionOptions:()=>te,DEFAULT_RetryDelayStrategyOptions:()=>re,DEFAULT_WriteOptions:()=>ne,FLUX_VALUE:()=>E,HttpError:()=>m,IllegalArgumentError:()=>y,InfluxDB:()=>U,LineSplitter:()=>R,Log:()=>h,Point:()=>me,RequestTimedOutError:()=>x,UNKNOWN_COLUMN:()=>J,canRetryHttpCall:()=>Ze,chunksToLines:()=>T,chunksToLinesIterable:()=>$,consoleLogger:()=>Le,convertTimeToNanos:()=>fe,createFluxTableColumn:()=>Ye,createFluxTableMetaData:()=>A,createTextDecoderCombiner:()=>v,currentTime:()=>le,dateToProtocolTimestamp:()=>ue,escape:()=>w,flux:()=>gt,fluxBool:()=>ht,fluxDateTime:()=>ct,fluxDuration:()=>dt,fluxExpression:()=>pe,fluxFloat:()=>ut,fluxInteger:()=>ft,fluxRegExp:()=>mt,fluxString:()=>lt,getRetryDelay:()=>X,isStatusCodeRetriable:()=>ve,linesToRowsIterable:()=>G,linesToTables:()=>z,newFluxTableColumn:()=>O,sanitizeFloat:()=>ce,sanitizeInteger:()=>de,serializeDateTimeAsDate:()=>et,serializeDateTimeAsNumber:()=>tt,serializeDateTimeAsString:()=>rt,setLogger:()=>ot,stringToLines:()=>nt,symbolObservable:()=>K,toFluxValue:()=>N,typeSerializers:()=>C,useProcessHrtime:()=>Fe});module.exports=Xe(Tt);function v(){let r=new TextDecoder("utf-8");return{concat(e,t){let n=new Uint8Array(e.length+t.length);return n.set(e),n.set(t,e.length),n},copy(e,t,n){let i=new Uint8Array(n-t);return i.set(e.subarray(t,n)),i},toUtf8String(e,t,n){return r.decode(e.subarray(t,n))}}}function T(r,e){let t=e!=null?e:v(),n,i=!1,s=!1,a=!1,o;function u(l){let p,c=0;for(n?(p=l.length===0?0:n.length,l=t.concat(n,l)):p=0;p<l.length;){let d=l[p];if(d===10){if(!s){let _=p>0&&l[p-1]===13?p-1:p;if(i)return;if(a=r.next(t.toUtf8String(l,c,_))===!1,c=p+1,a)break}}else d===34&&(s=!s);p++}if(c<l.length?n=t.copy(l,c,l.length):n=void 0,a){if(r.useResume){r.useResume(()=>{a=!1,u(new Uint8Array(0))});return}f.error(new Error("Unable to pause, useResume is not configured!")),a=!1}o&&(o(),o=void 0)}let f={next(l){if(!i)try{return u(l),!a}catch(p){this.error(p)}return!0},error(l){i||(i=!0,r.error(l))},complete(){i||(n&&r.next(t.toUtf8String(n,0,n.length)),i=!0,r.complete())}};return r.useCancellable&&(f.useCancellable=l=>{r.useCancellable&&r.useCancellable({cancel(){l.cancel(),n=void 0,f.complete()},isCancelled(){return l.isCancelled()}})}),r.useResume&&(f.useResume=l=>{o=l}),f}async function*$(r,e){let t=e!=null?e:v(),n,i=!1;for await(let s of r){let a,o=0;for(n?(a=n.length,s=t.concat(n,s)):a=0;a<s.length;){let u=s[a];if(u===10){if(!i){let f=a>0&&s[a-1]===13?a-1:a;yield t.toUtf8String(s,o,f),o=a+1}}else u===34&&(i=!i);a++}o<s.length?n=t.copy(s,o,s.length):n=void 0}n&&(yield t.toUtf8String(n,0,n.length))}var R=class{constructor(){this._reuse=!1}get reuse(){return this._reuse}set reuse(e){e&&!this.reusedValues&&(this.reusedValues=new Array(10)),this._reuse=e}withReuse(){return this.reuse=!0,this}splitLine(e){if(e==null)return this.lastSplitLength=0,[];let t=0,n=0,i=this._reuse?this.reusedValues:[],s=0;for(let o=0;o<e.length;o++){let u=e[o];if(u===","){if(t%2===0){let f=this.getValue(e,n,o,t);this._reuse?i[s++]=f:i.push(f),n=o+1,t=0}}else u==='"'&&t++}let a=this.getValue(e,n,e.length,t);return this._reuse?(i[s]=a,this.lastSplitLength=s+1):(i.push(a),this.lastSplitLength=i.length),i}getValue(e,t,n,i){return t===e.length?"":i===0?e.substring(t,n):i===2?e.substring(t+1,n-1):e.substring(t+1,n-1).replace(/""/gi,'"')}};var j=r=>r,C={boolean:r=>r===""?null:r==="true",unsignedLong:r=>r===""?null:+r,long:r=>r===""?null:+r,double(r){switch(r){case"":return null;case"+Inf":return Number.POSITIVE_INFINITY;case"-Inf":return Number.NEGATIVE_INFINITY;default:return+r}},string:j,base64Binary:j,duration:r=>r===""?null:r,"dateTime:RFC3339":r=>r===""?null:r},M=class{get(e){var n;let t=e[this.index];return(t===""||t===void 0)&&this.defaultValue&&(t=this.defaultValue),((n=C[this.dataType])!=null?n:j)(t)}},J=Object.freeze({label:"",dataType:"",group:!1,defaultValue:"",index:Number.MAX_SAFE_INTEGER,get:()=>{}});function O(){return new M}function Ye(r){var t,n;let e=new M;return e.label=String(r.label),e.dataType=r.dataType,e.group=Boolean(r.group),e.defaultValue=(t=r.defaultValue)!=null?t:"",e.index=(n=r.index)!=null?n:0,e}var Ge=[404,408,425,429,500,502,503,504];function ve(r){return Ge.includes(r)}var y=class extends Error{constructor(e){super(e),this.name="IllegalArgumentError",Object.setPrototypeOf(this,y.prototype)}},m=class extends Error{constructor(t,n,i,s,a,o){super();this.statusCode=t;this.statusMessage=n;this.body=i;this.contentType=a;if(Object.setPrototypeOf(this,m.prototype),o)this.message=o;else if(i){if(a!=null&&a.startsWith("application/json"))try{this.json=JSON.parse(i),this.message=this.json.message,this.code=this.json.code}catch(u){}this.message||(this.message=`${t} ${n} : ${i}`)}else this.message=`${t} ${n}`;this.name="HttpError",this.setRetryAfter(s)}setRetryAfter(t){typeof t=="string"?/^[0-9]+$/.test(t)?this._retryAfter=parseInt(t):this._retryAfter=0:this._retryAfter=0}canRetry(){return ve(this.statusCode)}retryAfter(){return this._retryAfter}},Ke=["ECONNRESET","ENOTFOUND","ESOCKETTIMEDOUT","ETIMEDOUT","ECONNREFUSED","EHOSTUNREACH","EPIPE"];function Ze(r){if(r){if(typeof r.canRetry=="function")return!!r.canRetry();if(r.code&&Ke.includes(r.code))return!0}else return!1;return!1}function X(r,e){if(r){let t;return typeof r.retryAfter=="function"?r.retryAfter():(t=0,e&&e>0?t+Math.round(Math.random()*e):t)}else return 0}var x=class extends Error{constructor(){super(),Object.setPrototypeOf(this,x.prototype),this.name="RequestTimedOutError",this.message="Request timed out"}canRetry(){return!0}retryAfter(){return 0}},b=class extends Error{constructor(){super(),this.name="AbortError",Object.setPrototypeOf(this,b.prototype),this.message="Response aborted"}canRetry(){return!0}retryAfter(){return 0}};function et(){C["dateTime:RFC3339"]=r=>r===""?null:new Date(Date.parse(r))}function tt(){C["dateTime:RFC3339"]=r=>r===""?null:Date.parse(r)}function rt(){C["dateTime:RFC3339"]=r=>r===""?null:r}var Y=class{constructor(e){e.forEach((t,n)=>t.index=n),this.columns=e}column(e,t=!0){for(let n=0;n<this.columns.length;n++){let i=this.columns[n];if(i.label===e)return i}if(t)throw new y(`Column ${e} not found!`);return J}toObject(e){let t={};for(let n=0;n<this.columns.length&&n<e.length;n++){let i=this.columns[n];t[i.label]=i.get(e)}return t}get(e,t){return this.column(t,!1).get(e)}};function A(r){return new Y(r)}function z(r){let e=new R().withReuse(),t,n=!0,i=0,s,a={error(o){r.error(o)},next(o){if(o==="")n=!0,t=void 0;else{let u=e.splitLine(o),f=e.lastSplitLength;if(n){if(!t){t=new Array(f);for(let l=0;l<f;l++)t[l]=O()}if(u[0].startsWith("#")){if(u[0]==="#datatype")for(let l=1;l<f;l++)t[l].dataType=u[l];else if(u[0]==="#default")for(let l=1;l<f;l++)t[l].defaultValue=u[l];else if(u[0]==="#group")for(let l=1;l<f;l++)t[l].group=u[l][0]==="t"}else{u[0]===""?(i=1,t=t.slice(1)):i=0;for(let l=i;l<f;l++)t[l-i].label=u[l];s=A(t),n=!1}}else return r.next(u.slice(i,f),s)}return!0},complete(){r.complete()}};return r.useCancellable&&(a.useCancellable=r.useCancellable.bind(r)),r.useResume&&(a.useResume=r.useResume.bind(r)),a}async function*G(r){let e=new R().withReuse(),t,n=!0,i=0,s;for await(let a of r)if(a==="")n=!0,t=void 0;else{let o=e.splitLine(a),u=e.lastSplitLength;if(n){if(!t){t=new Array(u);for(let f=0;f<u;f++)t[f]=O()}if(o[0].startsWith("#")){if(o[0]==="#datatype")for(let f=1;f<u;f++)t[f].dataType=o[f];else if(o[0]==="#default")for(let f=1;f<u;f++)t[f].defaultValue=o[f];else if(o[0]==="#group")for(let f=1;f<u;f++)t[f].group=o[f][0]==="t"}else{o[0]===""?(i=1,t=t.slice(1)):i=0;for(let f=i;f<u;f++)t[f-i].label=o[f];s=A(t),n=!1}}else yield{values:o.slice(i,u),tableMeta:s}}}function nt(r,e){let t=!1,n=0,i=0;for(;i<r.length;){let s=r.charCodeAt(i);if(s===10){if(!t){let a=i>0&&r.charCodeAt(i-1)===13?i-1:i;e.next(r.substring(n,a)),n=i+1}}else s===34&&(t=!t);i++}n<i&&e.next(r.substring(n,i)),e.complete()}var K=(()=>typeof Symbol=="function"&&Symbol.observable||"@@observable")();var ee=class{constructor(e,t){this.isClosed=!1;try{t({next:n=>{e.next(n)},error:n=>{this.isClosed=!0,e.error(n)},complete:()=>{this.isClosed=!0,e.complete()},useCancellable:n=>{this.cancellable=n}})}catch(n){this.isClosed=!0,e.error(n)}}get closed(){return this.isClosed}unsubscribe(){var e;(e=this.cancellable)==null||e.cancel(),this.isClosed=!0}};function Z(){}function it(r){let{next:e,error:t,complete:n}=r;return{next:e?e.bind(r):Z,error:t?t.bind(r):Z,complete:n?n.bind(r):Z}}var S=class{constructor(e,t){this.executor=e;this.decorator=t}subscribe(e,t,n){let i=it(typeof e!="object"||e===null?{next:e,error:t,complete:n}:e);return new ee(this.decorator(i),this.executor)}[K](){return this}};Symbol.observable;var te={timeout:1e4},re={retryJitter:200,minRetryDelay:5e3,maxRetryDelay:125e3,exponentialBase:5,randomRetry:!0},ne={batchSize:1e3,maxBatchBytes:5e7,flushInterval:6e4,writeFailed:function(){},writeSuccess:function(){},writeRetrySkipped:function(){},maxRetries:5,maxRetryTime:18e4,maxBufferLines:32e3,retryJitter:200,minRetryDelay:5e3,maxRetryDelay:125e3,exponentialBase:2,gzipThreshold:1e3,randomRetry:!0};function ie(r,e){return function(t){let n="",i=0,s=0;for(;s<t.length;){let a=r.indexOf(t[s]);a>=0&&(n+=t.substring(i,s),n+=e[a],i=s+1),s++}return i==0?t:(i<t.length&&(n+=t.substring(i,t.length)),n)}}function st(r,e){let t=ie(r,e);return n=>'"'+t(n)+'"'}var w={measurement:ie(`, 
\r	`,["\\,","\\ ","\\n","\\r","\\t"]),quoted:st('"\\',['\\"',"\\\\"]),tag:ie(`, =
\r	`,["\\,","\\ ","\\=","\\n","\\r","\\t"])};var k="000000000",ae=!1;function Fe(r){return ae=r&&process&&typeof process.hrtime=="function"}Fe(!0);var Oe,V,Ae=Date.now(),se=0;function oe(){if(ae){let r=process.hrtime(),e=Date.now();V?(r[0]=r[0]-V[0],r[1]=r[1]-V[1],r[1]<0&&(r[0]-=1,r[1]+=1e9),e=Oe+r[0]*1e3+Math.floor(r[1]/1e6)):(V=r,Oe=e);let t=String(r[1]%1e6);return String(e)+k.substr(0,6-t.length)+t}else{let r=Date.now();r!==Ae?(Ae=r,se=0):se++;let e=String(se);return String(r)+k.substr(0,6-e.length)+e}}function Ee(){if(ae){let r=process.hrtime(),e=String(Math.trunc(r[1]/1e3)%1e3);return String(Date.now())+k.substr(0,3-e.length)+e}else return String(Date.now())+k.substr(0,3)}function De(){return String(Date.now())}function Pe(){return String(Math.floor(Date.now()/1e3))}var le={s:Pe,ms:De,us:Ee,ns:oe,seconds:Pe,millis:De,micros:Ee,nanos:oe},ue={s:r=>`${Math.floor(r.getTime()/1e3)}`,ms:r=>`${r.getTime()}`,us:r=>`${r.getTime()}000`,ns:r=>`${r.getTime()}000000`};function fe(r){return r===void 0?oe():typeof r=="string"?r.length>0?r:void 0:r instanceof Date?`${r.getTime()}000000`:String(typeof r=="number"?Math.floor(r):r)}var Le={error(r,e){console.error("ERROR: "+r,e||"")},warn(r,e){console.warn("WARN: "+r,e||"")}},W=Le,h={error(r,e){W.error(r,e)},warn(r,e){W.warn(r,e)}};function ot(r){let e=W;return W=r,e}var E=Symbol("FLUX_VALUE"),g=class{constructor(e){this.fluxValue=e}toString(){return this.fluxValue}[E](){return this.fluxValue}};function at(r){return typeof r=="object"&&typeof r[E]=="function"}function D(r){if(r==null)return"";r=r.toString();let e,t=0;function n(){e===void 0&&(e=r.substring(0,t))}for(;t<r.length;t++){let i=r.charAt(t);switch(i){case"\r":n(),e+="\\r";break;case`
`:n(),e+="\\n";break;case"	":n(),e+="\\t";break;case'"':case"\\":n(),e=e+"\\"+i;break;case"$":if(t+1<r.length&&r.charAt(t+1)==="{"){n(),t++,e+="\\${";break}e!=null&&(e+=i);break;default:e!=null&&(e+=i)}}return e!==void 0?e:r}function lt(r){return new g(`"${D(r)}"`)}function ce(r){let e=Number(r);if(!isFinite(e)){if(typeof r=="number")return`float(v: "${e}")`;throw new Error(`not a flux float: ${r}`)}let t=e.toString(),n=!1;for(let i of t)if(!(i>="0"&&i<="9"||i=="-")){if(i==="."){n=!0;continue}return`float(v: "${t}")`}return n?t:t+".0"}function ut(r){return new g(ce(r))}function de(r){let e=String(r),t=e.startsWith("-"),n=t?e.substring(1):e;if(n.length===0||n.length>19)throw new Error(`not a flux integer: ${e}`);for(let i of n)if(i<"0"||i>"9")throw new Error(`not a flux integer: ${e}`);if(n.length===19){if(t&&n>"9223372036854775808")throw new Error(`flux integer out of bounds: ${e}`);if(!t&&n>"9223372036854775807")throw new Error(`flux integer out of bounds: ${e}`)}return e}function ft(r){return new g(de(r))}function pt(r){return`time(v: "${D(r)}")`}function ct(r){return new g(pt(r))}function dt(r){return new g(`duration(v: "${D(r)}")`)}function Ie(r){return r instanceof RegExp?r.toString():new RegExp(r).toString()}function mt(r){return new g(Ie(r))}function ht(r){return r==="true"||r==="false"?new g(r):new g((!!r).toString())}function pe(r){return new g(String(r))}function N(r){if(r===void 0)return"";if(r===null)return"null";if(typeof r=="boolean")return r.toString();if(typeof r=="string")return`"${D(r)}"`;if(typeof r=="number")return Number.isSafeInteger(r)?de(r):ce(r);if(typeof r=="object"){if(typeof r[E]=="function")return r[E]();if(r instanceof Date)return r.toISOString();if(r instanceof RegExp)return Ie(r);if(Array.isArray(r))return`[${r.map(N).join(",")}]`}else if(typeof r=="bigint")return`${r}.0`;return N(r.toString())}function gt(r,...e){if(r.length==1&&e.length===0)return pe(r[0]);let t=new Array(r.length+e.length),n=0;for(let i=0;i<r.length;i++){let s=r[i];if(t[n++]=s,i<e.length){let a=e[i],o;if(s.endsWith('"')&&i+1<r.length&&r[i+1].startsWith('"'))o=D(a);else if(o=N(a),o===""&&!at(a))throw new Error(`Unsupported parameter literal '${a}' at index: ${i}, type: ${typeof a}`);t[n++]=o}else if(i<r.length-1)throw new Error("Too few parameters supplied!")}return pe(t.join(""))}var me=class{constructor(e){this.tags={};this.fields={};e&&(this.name=e)}measurement(e){return this.name=e,this}tag(e,t){return this.tags[e]=t,this}booleanField(e,t){return this.fields[e]=t?"T":"F",this}intField(e,t){let n;if(typeof t=="number"?n=t:n=parseInt(String(t)),isNaN(n)||n<=-9223372036854776e3||n>=9223372036854776e3)throw new Error(`invalid integer value for field '${e}': '${t}'!`);return this.fields[e]=`${Math.floor(n)}i`,this}uintField(e,t){if(typeof t=="number"){if(isNaN(t)||t<0||t>Number.MAX_SAFE_INTEGER)throw new Error(`uint value for field '${e}' out of range: ${t}`);this.fields[e]=`${Math.floor(t)}u`}else{let n=String(t);for(let i=0;i<n.length;i++){let s=n.charCodeAt(i);if(s<48||s>57)throw new Error(`uint value has an unsupported character at pos ${i}: ${t}`)}if(n.length>20||n.length===20&&n.localeCompare("18446744073709551615")>0)throw new Error(`uint value for field '${e}' out of range: ${n}`);this.fields[e]=`${n}u`}return this}floatField(e,t){let n;if(typeof t=="number"?n=t:n=parseFloat(t),!isFinite(n))throw new Error(`invalid float value for field '${e}': ${t}`);return this.fields[e]=String(n),this}stringField(e,t){return t!=null&&(typeof t!="string"&&(t=String(t)),this.fields[e]=w.quoted(t)),this}timestamp(e){return this.time=e,this}toLineProtocol(e){if(!this.name)return;let t="";if(Object.keys(this.fields).sort().forEach(a=>{if(a){let o=this.fields[a];t.length>0&&(t+=","),t+=`${w.tag(a)}=${o}`}}),t.length===0)return;let n="",i=e&&e.defaultTags?{...e.defaultTags,...this.tags}:this.tags;Object.keys(i).sort().forEach(a=>{if(a){let o=i[a];o&&(n+=",",n+=`${w.tag(a)}=${w.tag(o)}`)}});let s=this.time;return e&&e.convertTime?s=e.convertTime(s):s=fe(s),`${w.measurement(this.name)}${n} ${t}${s!==void 0?" "+s:""}`}toString(){let e=this.toLineProtocol(void 0);return e||`invalid point: ${JSON.stringify(this,void 0)}`}};var he=class{constructor(e){this.options={...re,...e},this.success()}nextDelay(e,t){let n=X(e);if(n&&n>0)return n+Math.round(Math.random()*this.options.retryJitter);if(t&&t>0){if(this.options.randomRetry){let s=Math.max(this.options.minRetryDelay,1),a=s*this.options.exponentialBase;for(let o=1;o<t;o++)if(s=a,a=a*this.options.exponentialBase,a>=this.options.maxRetryDelay){a=this.options.maxRetryDelay;break}return s+Math.round(Math.random()*(a-s)+Math.random()*this.options.retryJitter)}let i=Math.max(this.options.minRetryDelay,1);for(let s=1;s<t;s++)if(i=i*this.options.exponentialBase,i>=this.options.maxRetryDelay){i=this.options.maxRetryDelay;break}return i+Math.round(Math.random()*this.options.retryJitter)}else this.currentDelay?this.currentDelay=Math.min(Math.max(this.currentDelay*this.options.exponentialBase,1)+Math.round(Math.random()*this.options.retryJitter),this.options.maxRetryDelay):this.currentDelay=this.options.minRetryDelay+Math.round(Math.random()*this.options.retryJitter);return this.currentDelay}success(){this.currentDelay=void 0}};function Ue(r){return new he(r)}function yt(r){let e,t=r,n=r;for(;n.next;)n.next.expires<t.expires&&(e=n,t=n.next),n=n.next;return[t,e]}var P=class{constructor(e,t,n=()=>{}){this.maxLines=e;this.retryLines=t;this.onShrink=n;this.size=0;this.closed=!1;this._timeoutHandle=void 0}addLines(e,t,n,i){if(this.closed||!e.length)return;let s=Date.now()+n;if(i<s&&(s=i),this.first&&this.size+e.length>this.maxLines){let f=this.size,l=f*.7;do{let[p,c]=yt(this.first);this.size-=p.lines.length,c?c.next=p.next:(this.first=p.next,this.first&&this.scheduleRetry(this.first.retryTime-Date.now())),p.next=void 0,this.onShrink(p)}while(this.first&&this.size+e.length>l);h.error(`RetryBuffer: ${f-this.size} oldest lines removed to keep buffer size under the limit of ${this.maxLines} lines.`)}let a={lines:e,retryCount:t,retryTime:s,expires:i},o=this.first,u;for(;;){if(!o||o.retryTime>s){a.next=o,u?u.next=a:(this.first=a,this.scheduleRetry(s-Date.now()));break}u=o,o=o.next}this.size+=e.length}removeLines(){if(this.first){let e=this.first;return this.first=this.first.next,e.next=void 0,this.size-=e.lines.length,e}}scheduleRetry(e){this._timeoutHandle&&clearTimeout(this._timeoutHandle),this._timeoutHandle=setTimeout(()=>{let t=this.removeLines();t?this.retryLines(t.lines,t.retryCount,t.expires).catch(()=>{}).finally(()=>{this.first&&this.scheduleRetry(this.first.retryTime-Date.now())}):this._timeoutHandle=void 0},Math.max(e,0))}async flush(){let e;for(;e=this.removeLines();)await this.retryLines(e.lines,e.retryCount,e.expires)}close(){return this._timeoutHandle&&(clearTimeout(this._timeoutHandle),this._timeoutHandle=void 0),this.closed=!0,this.size}};function ge(r){let e=r.length;for(let t=0;t<r.length;t++){let n=r.charCodeAt(t);n<128||(n>=128&&n<=2047?e++:n>=2048&&n<=65535?n>=55296&&n<=57343?e++:e+=2:e+=3)}return e}var ye=class{constructor(e,t,n,i){this.maxChunkRecords=e;this.maxBatchBytes=t;this.flushFn=n;this.scheduleSend=i;this.length=0;this.bytes=-1;this.lines=new Array(e)}add(e){let t=ge(e);this.length===0?this.scheduleSend():this.bytes+t+1>=this.maxBatchBytes&&this.flush().catch(n=>{}),this.lines[this.length]=e,this.length++,this.bytes+=t+1,(this.length>=this.maxChunkRecords||this.bytes>=this.maxBatchBytes)&&this.flush().catch(n=>{})}flush(){let e=this.reset();return e.length>0?this.flushFn(e):Promise.resolve()}reset(){let e=this.lines.slice(0,this.length);return this.length=0,this.bytes=-1,e}},F=class{constructor(e,t,n,i,s){this.transport=e;this.closed=!1;this._timeoutHandle=void 0;this.path=`/api/v2/write?org=${encodeURIComponent(t)}&bucket=${encodeURIComponent(n)}&precision=${i}`,s!=null&&s.consistency&&(this.path+=`&consistency=${encodeURIComponent(s.consistency)}`),this.writeOptions={...ne,...s},this.currentTime=le[i],this.dateToProtocolTimestamp=ue[i],this.writeOptions.defaultTags&&this.useDefaultTags(this.writeOptions.defaultTags),this.sendOptions={method:"POST",headers:{"content-type":"text/plain; charset=utf-8",...s==null?void 0:s.headers},gzipThreshold:this.writeOptions.gzipThreshold};let a=()=>{this.writeOptions.flushInterval>0&&(this._clearFlushTimeout(),this.closed||(this._timeoutHandle=setTimeout(()=>this.sendBatch(this.writeBuffer.reset(),this.writeOptions.maxRetries).catch(o=>{}),this.writeOptions.flushInterval)))};this.writeBuffer=new ye(this.writeOptions.batchSize,this.writeOptions.maxBatchBytes,o=>(this._clearFlushTimeout(),this.sendBatch(o,this.writeOptions.maxRetries)),a),this.sendBatch=this.sendBatch.bind(this),this.retryStrategy=Ue(this.writeOptions),this.retryBuffer=new P(this.writeOptions.maxBufferLines,this.sendBatch,this.writeOptions.writeRetrySkipped)}sendBatch(e,t,n=Date.now()+this.writeOptions.maxRetryTime){let i=this,s=i.writeOptions.maxRetries+1-t;if(!this.closed&&e.length>0){if(n<=Date.now()){let a=new Error("Max retry time exceeded."),o=i.writeOptions.writeFailed.call(i,a,e,s,n);return o||(h.error(`Write to InfluxDB failed (attempt: ${s}).`,a),Promise.reject(a))}return new Promise((a,o)=>{let u,f={responseStarted(l,p){u=p},error(l){let p=i.writeOptions.writeFailed.call(i,l,e,s,n);if(p){p.then(a,o);return}if(l instanceof m&&l.json&&typeof l.json.error=="string"&&l.json.error.includes("hinted handoff queue not empty")){h.warn("Write to InfluxDB returns: "+l.json.error),u=204,f.complete();return}if(!i.closed&&t>0&&(!(l instanceof m)||l.statusCode>=429)){h.warn(`Write to InfluxDB failed (attempt: ${s}).`,l),i.retryBuffer.addLines(e,t-1,i.retryStrategy.nextDelay(l,s),n),o(l);return}h.error("Write to InfluxDB failed.",l),o(l)},complete(){if(u==204||u==null)i.writeOptions.writeSuccess.call(i,e),i.retryStrategy.success(),a();else{let l=`204 HTTP response status code expected, but ${u} returned`,p=new m(u,l,void 0,"0");p.message=l,f.error(p)}}};this.transport.send(this.path,e.join(`
`),this.sendOptions,f)})}else return Promise.resolve()}_clearFlushTimeout(){this._timeoutHandle!==void 0&&(clearTimeout(this._timeoutHandle),this._timeoutHandle=void 0)}writeRecord(e){if(this.closed)throw new Error("writeApi: already closed!");this.writeBuffer.add(e)}writeRecords(e){if(this.closed)throw new Error("writeApi: already closed!");for(let t=0;t<e.length;t++)this.writeBuffer.add(e[t])}writePoint(e){if(this.closed)throw new Error("writeApi: already closed!");let t=e.toLineProtocol(this);t&&this.writeBuffer.add(t)}writePoints(e){if(this.closed)throw new Error("writeApi: already closed!");for(let t=0;t<e.length;t++){let n=e[t].toLineProtocol(this);n&&this.writeBuffer.add(n)}}async flush(e){if(await this.writeBuffer.flush(),e)return await this.retryBuffer.flush()}close(){return this.writeBuffer.flush().finally(()=>{let t=this.retryBuffer.close();t&&h.error(`Retry buffer closed with ${t} items that were not written to InfluxDB!`,null),this.closed=!0})}dispose(){return this._clearFlushTimeout(),this.closed=!0,this.retryBuffer.close()+this.writeBuffer.length}useDefaultTags(e){return this.defaultTags=e,this}convertTime(e){return e===void 0?this.currentTime():typeof e=="string"?e.length>0?e:void 0:e instanceof Date?this.dateToProtocolTimestamp(e):String(typeof e=="number"?Math.floor(e):e)}};var Re=__nccwpck_require__(310),$e=Q(__nccwpck_require__(685)),Me=Q(__nccwpck_require__(687)),H=__nccwpck_require__(300);var be=__nccwpck_require__(300),bt={concat(r,e){return be.Buffer.concat([r,e])},toUtf8String(r,e,t){return r.toString("utf-8",e,t)},copy(r,e,t){let n=be.Buffer.allocUnsafe(t-e);return r.copy(n,0,e,t),n}},_e=bt;var L=Q(__nccwpck_require__(796));function xe(r={}){let e=0,t={next:n=>{if(e===0&&r.next&&n!==null&&n!==void 0)return r.next(n)},error:n=>{e===0&&(e=1,r.error&&r.error(n))},complete:()=>{e===0&&(e=2,r.complete&&r.complete())},responseStarted:(n,i)=>{r.responseStarted&&r.responseStarted(n,i)}};return r.useCancellable&&(t.useCancellable=r.useCancellable.bind(r)),r.useResume&&(t.useResume=r.useResume.bind(r)),t}var Be="1.33.2";var ze=__nccwpck_require__(781),xt={flush:L.default.constants.Z_SYNC_FLUSH,finishFlush:L.default.constants.Z_SYNC_FLUSH},Rt=H.Buffer.allocUnsafe(0),we=class{constructor(){this.cancelled=!1}cancel(){this.cancelled=!0,this.resume&&(this.resume(),this.resume=void 0)}isCancelled(){return this.cancelled}},Te=class{constructor(e){this.chunkCombiner=_e;var u,f,l,p,c,d,_;let{url:t,proxyUrl:n,token:i,transportOptions:s,...a}=e,o=(0,Re.parse)(n||t);if(this.token=i,this.defaultOptions={...te,...a,...s,port:o.port,protocol:o.protocol,hostname:o.hostname},this.contextPath=n?t:(u=o.path)!=null?u:"",this.contextPath.endsWith("/")&&(this.contextPath=this.contextPath.substring(0,this.contextPath.length-1)),Object.keys(this.defaultOptions).forEach(Ce=>this.defaultOptions[Ce]===void 0&&delete this.defaultOptions[Ce]),this.contextPath.endsWith("/api/v2")&&(h.warn(`Please remove '/api/v2' context path from InfluxDB base url, using ${o.protocol}//${o.hostname}:${o.port} !`),this.contextPath=""),o.protocol==="http:")this.requestApi=(p=(l=(f=this.defaultOptions["follow-redirects"])==null?void 0:f.http)==null?void 0:l.request)!=null?p:$e.request;else if(o.protocol==="https:")this.requestApi=(_=(d=(c=this.defaultOptions["follow-redirects"])==null?void 0:c.https)==null?void 0:d.request)!=null?_:Me.request;else throw new Error(`Unsupported protocol "${o.protocol} in URL: "${e.url}"`);this.headers={"User-Agent":`influxdb-client-js/${Be}`,...e.headers},n&&(this.headers.Host=(0,Re.parse)(t).host)}send(e,t,n,i){let s=new we;i&&i.useCancellable&&i.useCancellable(s),this.createRequestMessage(e,t,n,a=>{this._request(a,s,i)},a=>(i==null?void 0:i.error)&&i.error(a))}request(e,t,n,i){t?typeof t!="string"&&(t=JSON.stringify(t)):t="";let s=Rt,a,o;return new Promise((u,f)=>{this.send(e,t,n,{responseStarted(l,p){i&&i(l,p),a=String(l["content-type"]),o=p},next:l=>{s=H.Buffer.concat([s,l])},complete:()=>{var p,c;let l=(c=(p=n.headers)==null?void 0:p.accept)!=null?c:a;try{o===204&&u(void 0),l.includes("json")?s.length?u(JSON.parse(s.toString("utf8"))):u(void 0):l.includes("text")||l.startsWith("application/csv")?u(s.toString("utf8")):u(s)}catch(d){f(d)}},error:l=>{f(l)}})})}async*iterate(e,t,n){var l;let i,s;function a(p){i=p,s(p)}let o=await new Promise((p,c)=>{s=c,this.createRequestMessage(e,t,n,p,a)});(l=o.signal)!=null&&l.addEventListener&&o.signal.addEventListener("abort",()=>{a(new b)});let u=await new Promise((p,c)=>{s=c;let d=this.requestApi(o,p);d.on("timeout",()=>a(new x)),d.on("error",a),d.write(o.body),d.end()}),f=await new Promise((p,c)=>{s=c,this._prepareResponse(u,p,a)});for await(let p of f){if(i)throw i;yield p}}createRequestMessage(e,t,n,i,s){let a=H.Buffer.from(t,"utf-8"),o={"content-type":"application/json; charset=utf-8",...this.headers};this.token&&(o.authorization="Token "+this.token);let u={...this.defaultOptions,path:this.contextPath+e,method:n.method,headers:{...o,...n.headers}};if(n.signal&&(u.signal=n.signal),n.gzipThreshold!==void 0&&n.gzipThreshold<a.length){L.default.gzip(a,(f,l)=>{if(f)return s(f);u.headers["content-encoding"]="gzip",u.body=l,i(u)});return}u.body=a,u.headers["content-length"]=u.body.length,i(u)}_prepareResponse(e,t,n){var o;e.on("aborted",()=>{n(new b)}),e.on("error",n);let i=(o=e.statusCode)!=null?o:600,s=e.headers["content-encoding"],a;if(s==="gzip"?(a=L.default.createGunzip(xt),a=(0,ze.pipeline)(e,a,u=>u&&n(u))):a=e,i>=300){let u="",f=String(e.headers["content-type"]).startsWith("application/json");a.on("data",l=>{u+=l.toString(),!f&&u.length>1e3&&(u=u.slice(0,1e3),e.resume())}),a.on("end",()=>{u===""&&!!e.headers["x-influxdb-error"]&&(u=e.headers["x-influxdb-error"].toString()),n(new m(i,e.statusMessage,u,e.headers["retry-after"],e.headers["content-type"]))})}else t(a)}_request(e,t,n){var a;let i=xe(n);if(t.isCancelled()){i.complete();return}(a=e.signal)!=null&&a.addEventListener&&e.signal.addEventListener("abort",()=>{i.error(new b)});let s=this.requestApi(e,o=>{if(t.isCancelled()){o.resume(),i.complete();return}i.responseStarted(o.headers,o.statusCode),this._prepareResponse(o,u=>{u.on("data",f=>{if(t.isCancelled())o.resume();else if(i.next(f)===!1){if(!i.useResume){i.error(new Error("Unable to pause, useResume is not configured!")),o.resume();return}o.pause();let l=()=>{o.resume()};t.resume=l,i.useResume(l)}}),u.on("end",i.complete)},i.error)});typeof s.setTimeout=="function"&&e.timeout&&s.setTimeout(e.timeout),s.on("timeout",()=>{i.error(new x)}),s.on("error",o=>{i.error(o)}),e.body&&s.write(e.body),s.end()}},Ve=Te;var ke={header:!0,delimiter:",",quoteChar:'"',commentPrefix:"#",annotations:["datatype","group","default"]},I=class{constructor(e,t,n){this.transport=e;this.createCSVResponse=t;this.options=typeof n=="string"?{org:n}:n}with(e){return new I(this.transport,this.createCSVResponse,{...this.options,...e})}response(e){let{org:t,type:n,gzip:i,headers:s}=this.options,a=`/api/v2/query?org=${encodeURIComponent(t)}`,o=JSON.stringify(this.decorateRequest({query:e.toString(),dialect:ke,type:n})),u={method:"POST",headers:{"content-type":"application/json; encoding=utf-8","accept-encoding":i?"gzip":"identity",...s}};return this.createCSVResponse(f=>this.transport.send(a,o,u,f),()=>this.transport.iterate(a,o,u))}iterateLines(e){return this.response(e).iterateLines()}iterateRows(e){return this.response(e).iterateRows()}lines(e){return this.response(e).lines()}rows(e){return this.response(e).rows()}queryLines(e,t){return this.response(e).consumeLines(t)}queryRows(e,t){return this.response(e).consumeRows(t)}collectRows(e,t){return this.response(e).collectRows(t)}collectLines(e){return this.response(e).collectLines()}queryRaw(e){let{org:t,type:n,gzip:i,headers:s}=this.options;return this.transport.request(`/api/v2/query?org=${encodeURIComponent(t)}`,JSON.stringify(this.decorateRequest({query:e.toString(),dialect:ke,type:n})),{method:"POST",headers:{accept:"text/csv","accept-encoding":i?"gzip":"identity","content-type":"application/json; encoding=utf-8",...s}})}decorateRequest(e){var t;return typeof this.options.now=="function"&&(e.now=this.options.now()),e.type=(t=this.options.type)!=null?t:"flux",e}},We=I;function wt(r,e){return e.toObject(r)}var q=class{constructor(e,t,n){this.executor=e;this.iterableResultExecutor=t;this.chunkCombiner=n}iterateLines(){return $(this.iterableResultExecutor())}iterateRows(){return G($(this.iterableResultExecutor()))}lines(){return new S(this.executor,e=>T(e,this.chunkCombiner))}rows(){return new S(this.executor,e=>T(z({next(t,n){e.next({values:t,tableMeta:n})},error(t){e.error(t)},complete(){e.complete()}}),this.chunkCombiner))}consumeLines(e){this.executor(T(e,this.chunkCombiner))}consumeRows(e){this.executor(T(z(e),this.chunkCombiner))}collectRows(e=wt){let t=[];return new Promise((n,i)=>{this.consumeRows({next(s,a){let o=e.call(this,s,a);o!==void 0&&t.push(o)},error(s){i(s)},complete(){n(t)}})})}collectLines(){let e=[];return new Promise((t,n)=>{this.consumeLines({next(i){e.push(i)},error(i){n(i)},complete(){t(e)}})})}};var U=class{constructor(e){var n;if(typeof e=="string")this._options={url:e};else if(e!==null&&typeof e=="object")this._options=e;else throw new y("No url or configuration specified!");let t=this._options.url;if(typeof t!="string")throw new y("No url specified!");t.endsWith("/")&&(this._options.url=t.substring(0,t.length-1)),this.transport=(n=this._options.transport)!=null?n:new Ve(this._options),this.processCSVResponse=(i,s)=>new q(i,s,this.transport.chunkCombiner)}getWriteApi(e,t,n="ns",i){return new F(this.transport,e,t,n,i!=null?i:this._options.writeOptions)}getQueryApi(e){return new We(this.transport,this.processCSVResponse,e)}};0&&(0);
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 294:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

module.exports = __nccwpck_require__(219);


/***/ }),

/***/ 219:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


var net = __nccwpck_require__(808);
var tls = __nccwpck_require__(404);
var http = __nccwpck_require__(685);
var https = __nccwpck_require__(687);
var events = __nccwpck_require__(361);
var assert = __nccwpck_require__(491);
var util = __nccwpck_require__(837);


exports.httpOverHttp = httpOverHttp;
exports.httpsOverHttp = httpsOverHttp;
exports.httpOverHttps = httpOverHttps;
exports.httpsOverHttps = httpsOverHttps;


function httpOverHttp(options) {
  var agent = new TunnelingAgent(options);
  agent.request = http.request;
  return agent;
}

function httpsOverHttp(options) {
  var agent = new TunnelingAgent(options);
  agent.request = http.request;
  agent.createSocket = createSecureSocket;
  agent.defaultPort = 443;
  return agent;
}

function httpOverHttps(options) {
  var agent = new TunnelingAgent(options);
  agent.request = https.request;
  return agent;
}

function httpsOverHttps(options) {
  var agent = new TunnelingAgent(options);
  agent.request = https.request;
  agent.createSocket = createSecureSocket;
  agent.defaultPort = 443;
  return agent;
}


function TunnelingAgent(options) {
  var self = this;
  self.options = options || {};
  self.proxyOptions = self.options.proxy || {};
  self.maxSockets = self.options.maxSockets || http.Agent.defaultMaxSockets;
  self.requests = [];
  self.sockets = [];

  self.on('free', function onFree(socket, host, port, localAddress) {
    var options = toOptions(host, port, localAddress);
    for (var i = 0, len = self.requests.length; i < len; ++i) {
      var pending = self.requests[i];
      if (pending.host === options.host && pending.port === options.port) {
        // Detect the request to connect same origin server,
        // reuse the connection.
        self.requests.splice(i, 1);
        pending.request.onSocket(socket);
        return;
      }
    }
    socket.destroy();
    self.removeSocket(socket);
  });
}
util.inherits(TunnelingAgent, events.EventEmitter);

TunnelingAgent.prototype.addRequest = function addRequest(req, host, port, localAddress) {
  var self = this;
  var options = mergeOptions({request: req}, self.options, toOptions(host, port, localAddress));

  if (self.sockets.length >= this.maxSockets) {
    // We are over limit so we'll add it to the queue.
    self.requests.push(options);
    return;
  }

  // If we are under maxSockets create a new one.
  self.createSocket(options, function(socket) {
    socket.on('free', onFree);
    socket.on('close', onCloseOrRemove);
    socket.on('agentRemove', onCloseOrRemove);
    req.onSocket(socket);

    function onFree() {
      self.emit('free', socket, options);
    }

    function onCloseOrRemove(err) {
      self.removeSocket(socket);
      socket.removeListener('free', onFree);
      socket.removeListener('close', onCloseOrRemove);
      socket.removeListener('agentRemove', onCloseOrRemove);
    }
  });
};

TunnelingAgent.prototype.createSocket = function createSocket(options, cb) {
  var self = this;
  var placeholder = {};
  self.sockets.push(placeholder);

  var connectOptions = mergeOptions({}, self.proxyOptions, {
    method: 'CONNECT',
    path: options.host + ':' + options.port,
    agent: false,
    headers: {
      host: options.host + ':' + options.port
    }
  });
  if (options.localAddress) {
    connectOptions.localAddress = options.localAddress;
  }
  if (connectOptions.proxyAuth) {
    connectOptions.headers = connectOptions.headers || {};
    connectOptions.headers['Proxy-Authorization'] = 'Basic ' +
        new Buffer(connectOptions.proxyAuth).toString('base64');
  }

  debug('making CONNECT request');
  var connectReq = self.request(connectOptions);
  connectReq.useChunkedEncodingByDefault = false; // for v0.6
  connectReq.once('response', onResponse); // for v0.6
  connectReq.once('upgrade', onUpgrade);   // for v0.6
  connectReq.once('connect', onConnect);   // for v0.7 or later
  connectReq.once('error', onError);
  connectReq.end();

  function onResponse(res) {
    // Very hacky. This is necessary to avoid http-parser leaks.
    res.upgrade = true;
  }

  function onUpgrade(res, socket, head) {
    // Hacky.
    process.nextTick(function() {
      onConnect(res, socket, head);
    });
  }

  function onConnect(res, socket, head) {
    connectReq.removeAllListeners();
    socket.removeAllListeners();

    if (res.statusCode !== 200) {
      debug('tunneling socket could not be established, statusCode=%d',
        res.statusCode);
      socket.destroy();
      var error = new Error('tunneling socket could not be established, ' +
        'statusCode=' + res.statusCode);
      error.code = 'ECONNRESET';
      options.request.emit('error', error);
      self.removeSocket(placeholder);
      return;
    }
    if (head.length > 0) {
      debug('got illegal response body from proxy');
      socket.destroy();
      var error = new Error('got illegal response body from proxy');
      error.code = 'ECONNRESET';
      options.request.emit('error', error);
      self.removeSocket(placeholder);
      return;
    }
    debug('tunneling connection has established');
    self.sockets[self.sockets.indexOf(placeholder)] = socket;
    return cb(socket);
  }

  function onError(cause) {
    connectReq.removeAllListeners();

    debug('tunneling socket could not be established, cause=%s\n',
          cause.message, cause.stack);
    var error = new Error('tunneling socket could not be established, ' +
                          'cause=' + cause.message);
    error.code = 'ECONNRESET';
    options.request.emit('error', error);
    self.removeSocket(placeholder);
  }
};

TunnelingAgent.prototype.removeSocket = function removeSocket(socket) {
  var pos = this.sockets.indexOf(socket)
  if (pos === -1) {
    return;
  }
  this.sockets.splice(pos, 1);

  var pending = this.requests.shift();
  if (pending) {
    // If we have pending requests and a socket gets closed a new one
    // needs to be created to take over in the pool for the one that closed.
    this.createSocket(pending, function(socket) {
      pending.request.onSocket(socket);
    });
  }
};

function createSecureSocket(options, cb) {
  var self = this;
  TunnelingAgent.prototype.createSocket.call(self, options, function(socket) {
    var hostHeader = options.request.getHeader('host');
    var tlsOptions = mergeOptions({}, self.options, {
      socket: socket,
      servername: hostHeader ? hostHeader.replace(/:.*$/, '') : options.host
    });

    // 0 is dummy port for v0.6
    var secureSocket = tls.connect(0, tlsOptions);
    self.sockets[self.sockets.indexOf(socket)] = secureSocket;
    cb(secureSocket);
  });
}


function toOptions(host, port, localAddress) {
  if (typeof host === 'string') { // since v0.10
    return {
      host: host,
      port: port,
      localAddress: localAddress
    };
  }
  return host; // for v0.11 or later
}

function mergeOptions(target) {
  for (var i = 1, len = arguments.length; i < len; ++i) {
    var overrides = arguments[i];
    if (typeof overrides === 'object') {
      var keys = Object.keys(overrides);
      for (var j = 0, keyLen = keys.length; j < keyLen; ++j) {
        var k = keys[j];
        if (overrides[k] !== undefined) {
          target[k] = overrides[k];
        }
      }
    }
  }
  return target;
}


var debug;
if (process.env.NODE_DEBUG && /\btunnel\b/.test(process.env.NODE_DEBUG)) {
  debug = function() {
    var args = Array.prototype.slice.call(arguments);
    if (typeof args[0] === 'string') {
      args[0] = 'TUNNEL: ' + args[0];
    } else {
      args.unshift('TUNNEL:');
    }
    console.error.apply(console, args);
  }
} else {
  debug = function() {};
}
exports.debug = debug; // for test


/***/ }),

/***/ 840:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
Object.defineProperty(exports, "v1", ({
  enumerable: true,
  get: function () {
    return _v.default;
  }
}));
Object.defineProperty(exports, "v3", ({
  enumerable: true,
  get: function () {
    return _v2.default;
  }
}));
Object.defineProperty(exports, "v4", ({
  enumerable: true,
  get: function () {
    return _v3.default;
  }
}));
Object.defineProperty(exports, "v5", ({
  enumerable: true,
  get: function () {
    return _v4.default;
  }
}));
Object.defineProperty(exports, "NIL", ({
  enumerable: true,
  get: function () {
    return _nil.default;
  }
}));
Object.defineProperty(exports, "version", ({
  enumerable: true,
  get: function () {
    return _version.default;
  }
}));
Object.defineProperty(exports, "validate", ({
  enumerable: true,
  get: function () {
    return _validate.default;
  }
}));
Object.defineProperty(exports, "stringify", ({
  enumerable: true,
  get: function () {
    return _stringify.default;
  }
}));
Object.defineProperty(exports, "parse", ({
  enumerable: true,
  get: function () {
    return _parse.default;
  }
}));

var _v = _interopRequireDefault(__nccwpck_require__(628));

var _v2 = _interopRequireDefault(__nccwpck_require__(409));

var _v3 = _interopRequireDefault(__nccwpck_require__(122));

var _v4 = _interopRequireDefault(__nccwpck_require__(120));

var _nil = _interopRequireDefault(__nccwpck_require__(332));

var _version = _interopRequireDefault(__nccwpck_require__(595));

var _validate = _interopRequireDefault(__nccwpck_require__(900));

var _stringify = _interopRequireDefault(__nccwpck_require__(950));

var _parse = _interopRequireDefault(__nccwpck_require__(746));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ }),

/***/ 569:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _crypto = _interopRequireDefault(__nccwpck_require__(113));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function md5(bytes) {
  if (Array.isArray(bytes)) {
    bytes = Buffer.from(bytes);
  } else if (typeof bytes === 'string') {
    bytes = Buffer.from(bytes, 'utf8');
  }

  return _crypto.default.createHash('md5').update(bytes).digest();
}

var _default = md5;
exports["default"] = _default;

/***/ }),

/***/ 332:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _default = '00000000-0000-0000-0000-000000000000';
exports["default"] = _default;

/***/ }),

/***/ 746:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _validate = _interopRequireDefault(__nccwpck_require__(900));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function parse(uuid) {
  if (!(0, _validate.default)(uuid)) {
    throw TypeError('Invalid UUID');
  }

  let v;
  const arr = new Uint8Array(16); // Parse ########-....-....-....-............

  arr[0] = (v = parseInt(uuid.slice(0, 8), 16)) >>> 24;
  arr[1] = v >>> 16 & 0xff;
  arr[2] = v >>> 8 & 0xff;
  arr[3] = v & 0xff; // Parse ........-####-....-....-............

  arr[4] = (v = parseInt(uuid.slice(9, 13), 16)) >>> 8;
  arr[5] = v & 0xff; // Parse ........-....-####-....-............

  arr[6] = (v = parseInt(uuid.slice(14, 18), 16)) >>> 8;
  arr[7] = v & 0xff; // Parse ........-....-....-####-............

  arr[8] = (v = parseInt(uuid.slice(19, 23), 16)) >>> 8;
  arr[9] = v & 0xff; // Parse ........-....-....-....-############
  // (Use "/" to avoid 32-bit truncation when bit-shifting high-order bytes)

  arr[10] = (v = parseInt(uuid.slice(24, 36), 16)) / 0x10000000000 & 0xff;
  arr[11] = v / 0x100000000 & 0xff;
  arr[12] = v >>> 24 & 0xff;
  arr[13] = v >>> 16 & 0xff;
  arr[14] = v >>> 8 & 0xff;
  arr[15] = v & 0xff;
  return arr;
}

var _default = parse;
exports["default"] = _default;

/***/ }),

/***/ 814:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _default = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;
exports["default"] = _default;

/***/ }),

/***/ 807:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = rng;

var _crypto = _interopRequireDefault(__nccwpck_require__(113));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const rnds8Pool = new Uint8Array(256); // # of random values to pre-allocate

let poolPtr = rnds8Pool.length;

function rng() {
  if (poolPtr > rnds8Pool.length - 16) {
    _crypto.default.randomFillSync(rnds8Pool);

    poolPtr = 0;
  }

  return rnds8Pool.slice(poolPtr, poolPtr += 16);
}

/***/ }),

/***/ 274:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _crypto = _interopRequireDefault(__nccwpck_require__(113));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function sha1(bytes) {
  if (Array.isArray(bytes)) {
    bytes = Buffer.from(bytes);
  } else if (typeof bytes === 'string') {
    bytes = Buffer.from(bytes, 'utf8');
  }

  return _crypto.default.createHash('sha1').update(bytes).digest();
}

var _default = sha1;
exports["default"] = _default;

/***/ }),

/***/ 950:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _validate = _interopRequireDefault(__nccwpck_require__(900));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */
const byteToHex = [];

for (let i = 0; i < 256; ++i) {
  byteToHex.push((i + 0x100).toString(16).substr(1));
}

function stringify(arr, offset = 0) {
  // Note: Be careful editing this code!  It's been tuned for performance
  // and works in ways you may not expect. See https://github.com/uuidjs/uuid/pull/434
  const uuid = (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + '-' + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + '-' + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + '-' + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + '-' + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase(); // Consistency check for valid UUID.  If this throws, it's likely due to one
  // of the following:
  // - One or more input array values don't map to a hex octet (leading to
  // "undefined" in the uuid)
  // - Invalid input values for the RFC `version` or `variant` fields

  if (!(0, _validate.default)(uuid)) {
    throw TypeError('Stringified UUID is invalid');
  }

  return uuid;
}

var _default = stringify;
exports["default"] = _default;

/***/ }),

/***/ 628:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _rng = _interopRequireDefault(__nccwpck_require__(807));

var _stringify = _interopRequireDefault(__nccwpck_require__(950));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// **`v1()` - Generate time-based UUID**
//
// Inspired by https://github.com/LiosK/UUID.js
// and http://docs.python.org/library/uuid.html
let _nodeId;

let _clockseq; // Previous uuid creation time


let _lastMSecs = 0;
let _lastNSecs = 0; // See https://github.com/uuidjs/uuid for API details

function v1(options, buf, offset) {
  let i = buf && offset || 0;
  const b = buf || new Array(16);
  options = options || {};
  let node = options.node || _nodeId;
  let clockseq = options.clockseq !== undefined ? options.clockseq : _clockseq; // node and clockseq need to be initialized to random values if they're not
  // specified.  We do this lazily to minimize issues related to insufficient
  // system entropy.  See #189

  if (node == null || clockseq == null) {
    const seedBytes = options.random || (options.rng || _rng.default)();

    if (node == null) {
      // Per 4.5, create and 48-bit node id, (47 random bits + multicast bit = 1)
      node = _nodeId = [seedBytes[0] | 0x01, seedBytes[1], seedBytes[2], seedBytes[3], seedBytes[4], seedBytes[5]];
    }

    if (clockseq == null) {
      // Per 4.2.2, randomize (14 bit) clockseq
      clockseq = _clockseq = (seedBytes[6] << 8 | seedBytes[7]) & 0x3fff;
    }
  } // UUID timestamps are 100 nano-second units since the Gregorian epoch,
  // (1582-10-15 00:00).  JSNumbers aren't precise enough for this, so
  // time is handled internally as 'msecs' (integer milliseconds) and 'nsecs'
  // (100-nanoseconds offset from msecs) since unix epoch, 1970-01-01 00:00.


  let msecs = options.msecs !== undefined ? options.msecs : Date.now(); // Per 4.2.1.2, use count of uuid's generated during the current clock
  // cycle to simulate higher resolution clock

  let nsecs = options.nsecs !== undefined ? options.nsecs : _lastNSecs + 1; // Time since last uuid creation (in msecs)

  const dt = msecs - _lastMSecs + (nsecs - _lastNSecs) / 10000; // Per 4.2.1.2, Bump clockseq on clock regression

  if (dt < 0 && options.clockseq === undefined) {
    clockseq = clockseq + 1 & 0x3fff;
  } // Reset nsecs if clock regresses (new clockseq) or we've moved onto a new
  // time interval


  if ((dt < 0 || msecs > _lastMSecs) && options.nsecs === undefined) {
    nsecs = 0;
  } // Per 4.2.1.2 Throw error if too many uuids are requested


  if (nsecs >= 10000) {
    throw new Error("uuid.v1(): Can't create more than 10M uuids/sec");
  }

  _lastMSecs = msecs;
  _lastNSecs = nsecs;
  _clockseq = clockseq; // Per 4.1.4 - Convert from unix epoch to Gregorian epoch

  msecs += 12219292800000; // `time_low`

  const tl = ((msecs & 0xfffffff) * 10000 + nsecs) % 0x100000000;
  b[i++] = tl >>> 24 & 0xff;
  b[i++] = tl >>> 16 & 0xff;
  b[i++] = tl >>> 8 & 0xff;
  b[i++] = tl & 0xff; // `time_mid`

  const tmh = msecs / 0x100000000 * 10000 & 0xfffffff;
  b[i++] = tmh >>> 8 & 0xff;
  b[i++] = tmh & 0xff; // `time_high_and_version`

  b[i++] = tmh >>> 24 & 0xf | 0x10; // include version

  b[i++] = tmh >>> 16 & 0xff; // `clock_seq_hi_and_reserved` (Per 4.2.2 - include variant)

  b[i++] = clockseq >>> 8 | 0x80; // `clock_seq_low`

  b[i++] = clockseq & 0xff; // `node`

  for (let n = 0; n < 6; ++n) {
    b[i + n] = node[n];
  }

  return buf || (0, _stringify.default)(b);
}

var _default = v1;
exports["default"] = _default;

/***/ }),

/***/ 409:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _v = _interopRequireDefault(__nccwpck_require__(998));

var _md = _interopRequireDefault(__nccwpck_require__(569));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const v3 = (0, _v.default)('v3', 0x30, _md.default);
var _default = v3;
exports["default"] = _default;

/***/ }),

/***/ 998:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = _default;
exports.URL = exports.DNS = void 0;

var _stringify = _interopRequireDefault(__nccwpck_require__(950));

var _parse = _interopRequireDefault(__nccwpck_require__(746));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function stringToBytes(str) {
  str = unescape(encodeURIComponent(str)); // UTF8 escape

  const bytes = [];

  for (let i = 0; i < str.length; ++i) {
    bytes.push(str.charCodeAt(i));
  }

  return bytes;
}

const DNS = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';
exports.DNS = DNS;
const URL = '6ba7b811-9dad-11d1-80b4-00c04fd430c8';
exports.URL = URL;

function _default(name, version, hashfunc) {
  function generateUUID(value, namespace, buf, offset) {
    if (typeof value === 'string') {
      value = stringToBytes(value);
    }

    if (typeof namespace === 'string') {
      namespace = (0, _parse.default)(namespace);
    }

    if (namespace.length !== 16) {
      throw TypeError('Namespace must be array-like (16 iterable integer values, 0-255)');
    } // Compute hash of namespace and value, Per 4.3
    // Future: Use spread syntax when supported on all platforms, e.g. `bytes =
    // hashfunc([...namespace, ... value])`


    let bytes = new Uint8Array(16 + value.length);
    bytes.set(namespace);
    bytes.set(value, namespace.length);
    bytes = hashfunc(bytes);
    bytes[6] = bytes[6] & 0x0f | version;
    bytes[8] = bytes[8] & 0x3f | 0x80;

    if (buf) {
      offset = offset || 0;

      for (let i = 0; i < 16; ++i) {
        buf[offset + i] = bytes[i];
      }

      return buf;
    }

    return (0, _stringify.default)(bytes);
  } // Function#name is not settable on some platforms (#270)


  try {
    generateUUID.name = name; // eslint-disable-next-line no-empty
  } catch (err) {} // For CommonJS default export support


  generateUUID.DNS = DNS;
  generateUUID.URL = URL;
  return generateUUID;
}

/***/ }),

/***/ 122:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _rng = _interopRequireDefault(__nccwpck_require__(807));

var _stringify = _interopRequireDefault(__nccwpck_require__(950));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function v4(options, buf, offset) {
  options = options || {};

  const rnds = options.random || (options.rng || _rng.default)(); // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`


  rnds[6] = rnds[6] & 0x0f | 0x40;
  rnds[8] = rnds[8] & 0x3f | 0x80; // Copy bytes to buffer, if provided

  if (buf) {
    offset = offset || 0;

    for (let i = 0; i < 16; ++i) {
      buf[offset + i] = rnds[i];
    }

    return buf;
  }

  return (0, _stringify.default)(rnds);
}

var _default = v4;
exports["default"] = _default;

/***/ }),

/***/ 120:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _v = _interopRequireDefault(__nccwpck_require__(998));

var _sha = _interopRequireDefault(__nccwpck_require__(274));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const v5 = (0, _v.default)('v5', 0x50, _sha.default);
var _default = v5;
exports["default"] = _default;

/***/ }),

/***/ 900:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _regex = _interopRequireDefault(__nccwpck_require__(814));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function validate(uuid) {
  return typeof uuid === 'string' && _regex.default.test(uuid);
}

var _default = validate;
exports["default"] = _default;

/***/ }),

/***/ 595:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _validate = _interopRequireDefault(__nccwpck_require__(900));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function version(uuid) {
  if (!(0, _validate.default)(uuid)) {
    throw TypeError('Invalid UUID');
  }

  return parseInt(uuid.substr(14, 1), 16);
}

var _default = version;
exports["default"] = _default;

/***/ }),

/***/ 857:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.toInputData = void 0;
function toInputData(jsonAsString) {
    const jsonObject = JSON.parse(jsonAsString);
    return jsonObject;
}
exports.toInputData = toInputData;


/***/ }),

/***/ 293:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.toPoint = void 0;
const influxdb_client_1 = __nccwpck_require__(659);
function toPoint(measurementName, inputData) {
    const point = new influxdb_client_1.Point(measurementName);
    for (const [key, value] of Object.entries(inputData.tags)) {
        point.tag(key, value);
    }
    for (const [key, value] of Object.entries(inputData.stringFields)) {
        point.stringField(key, value);
    }
    return point;
}
exports.toPoint = toPoint;


/***/ }),

/***/ 727:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.toWritePrecisionType = void 0;
function toWritePrecisionType(precision) {
    if (["ns", "us", "ms", "s"].includes(precision)) {
        return precision;
    }
    throw new Error(`Unsupported precision type: ${precision}`);
}
exports.toWritePrecisionType = toWritePrecisionType;


/***/ }),

/***/ 694:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.loadInputs = void 0;
const core = __importStar(__nccwpck_require__(186));
const input_to_input_data_1 = __nccwpck_require__(857);
const input_to_write_precision_type_1 = __nccwpck_require__(727);
function loadInputs() {
    const influxdbUrl = core.getInput("influxdb-url");
    const influxdbToken = core.getInput("influxdb-token");
    const organization = core.getInput("organization");
    const bucket = core.getInput("bucket");
    const inputData = (0, input_to_input_data_1.toInputData)(core.getInput("json"));
    const measurementName = core.getInput("measurement-name");
    const precision = (0, input_to_write_precision_type_1.toWritePrecisionType)(core.getInput("precision"));
    return {
        measurementName,
        inputData,
        influxdbUrl,
        influxdbToken,
        organization,
        bucket,
        precision
    };
}
exports.loadInputs = loadInputs;


/***/ }),

/***/ 86:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.write = void 0;
const core = __importStar(__nccwpck_require__(186));
function write(point) {
    core.summary
        .addHeading("JSON Data", 3)
        .addCodeBlock(JSON.stringify(point, null, "\t"), "json")
        .write();
}
exports.write = write;


/***/ }),

/***/ 399:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.run = void 0;
const core = __importStar(__nccwpck_require__(186));
const influxdb_client_1 = __nccwpck_require__(659);
const input_to_point_1 = __nccwpck_require__(293);
const load_inputs_1 = __nccwpck_require__(694);
const summary = __importStar(__nccwpck_require__(86));
/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
async function run() {
    try {
        const { measurementName, inputData, influxdbUrl, influxdbToken, organization, bucket, precision } = (0, load_inputs_1.loadInputs)();
        const point = (0, input_to_point_1.toPoint)(measurementName, inputData);
        const client = new influxdb_client_1.InfluxDB({
            url: influxdbUrl,
            token: influxdbToken
        }).getWriteApi(organization, bucket, precision);
        client.writePoint(point);
        summary.write(point);
        // Flush pending writes and close client.
        await client.close();
        core.setOutput("success", "true");
    }
    catch (error) {
        // Fail the workflow run if an error occurs
        if (error instanceof Error)
            core.setFailed(error.message);
    }
}
exports.run = run;


/***/ }),

/***/ 491:
/***/ ((module) => {

"use strict";
module.exports = require("assert");

/***/ }),

/***/ 300:
/***/ ((module) => {

"use strict";
module.exports = require("buffer");

/***/ }),

/***/ 113:
/***/ ((module) => {

"use strict";
module.exports = require("crypto");

/***/ }),

/***/ 361:
/***/ ((module) => {

"use strict";
module.exports = require("events");

/***/ }),

/***/ 147:
/***/ ((module) => {

"use strict";
module.exports = require("fs");

/***/ }),

/***/ 685:
/***/ ((module) => {

"use strict";
module.exports = require("http");

/***/ }),

/***/ 687:
/***/ ((module) => {

"use strict";
module.exports = require("https");

/***/ }),

/***/ 808:
/***/ ((module) => {

"use strict";
module.exports = require("net");

/***/ }),

/***/ 37:
/***/ ((module) => {

"use strict";
module.exports = require("os");

/***/ }),

/***/ 17:
/***/ ((module) => {

"use strict";
module.exports = require("path");

/***/ }),

/***/ 781:
/***/ ((module) => {

"use strict";
module.exports = require("stream");

/***/ }),

/***/ 404:
/***/ ((module) => {

"use strict";
module.exports = require("tls");

/***/ }),

/***/ 310:
/***/ ((module) => {

"use strict";
module.exports = require("url");

/***/ }),

/***/ 837:
/***/ ((module) => {

"use strict";
module.exports = require("util");

/***/ }),

/***/ 796:
/***/ ((module) => {

"use strict";
module.exports = require("zlib");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __nccwpck_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId].call(module.exports, module, module.exports, __nccwpck_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = __dirname + "/";
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
var exports = __webpack_exports__;

Object.defineProperty(exports, "__esModule", ({ value: true }));
/**
 * The entrypoint for the action.
 */
const main_1 = __nccwpck_require__(399);
// eslint-disable-next-line @typescript-eslint/no-floating-promises
(0, main_1.run)();

})();

module.exports = __webpack_exports__;
/******/ })()
;