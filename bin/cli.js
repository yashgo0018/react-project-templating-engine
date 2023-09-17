#!/usr/bin/env node

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");
const { removeUnselectedModules } = require("./helpers");

const runCommand = (command) => {
  try {
    execSync(command, { stdio: "inherit" });
  } catch (err) {
    console.error(`Failed to execute ${command}`, err);
    return false;
  }
  return true;
};

const gitRemote = process.argv[2];
const repoName = process.argv[3];
const gitCheckoutCommand = `git clone ${gitRemote} ${repoName}`;

runCommand(gitCheckoutCommand);
runCommand(`cd ${repoName}`);

// copy the modules file
if (!fs.readdirSync(`./${repoName}`).includes(".modules.template"))
  process.exit(0);

const modules = fs
  .readFileSync(`./${repoName}/.modules.template`)
  .toString("utf-8")
  .trim()
  .split("\n")
  .map((module) => module.trim());

// run some cli function to get the module choises
const moduleChoises = ["xmtp"];

removeUnselectedModules(`./${repoName}`, modules, moduleChoises);
