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
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = void 0;
const core = __importStar(require("@actions/core"));
const app_1 = require("@octokit/app");
const github = __importStar(require("@actions/github"));
/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
async function run() {
    try {
        console.log("Starting run()");
        const appId = core.getInput("app-id");
        const privateKey = core.getInput("private-key");
        const installationId = core.getInput("installation-id");
        const repository = core.getInput("repository") || github.context.repo.repo;
        if (!repository) {
            throw new Error("Repository was not supplied as an input or environment variable");
        }
        core.info(`Repository: ${repository}`);
        const app = new app_1.App({
            appId,
            privateKey
        });
        console.log(`Sending request POST /app/installations/${installationId}/access_tokens`);
        const { data: { token } } = await app.octokit.request(`POST /app/installations/${installationId}/access_tokens`, {
            repositories: [repository]
        });
        console.log(`Token: ${token}`);
        core.setSecret(token);
        core.setOutput("token", token);
    }
    catch (error) {
        // Fail the workflow run if an error occurs
        if (error instanceof Error)
            console.log(`ERROR: ${JSON.stringify(error)}`);
    }
}
exports.run = run;
//# sourceMappingURL=main.js.map