#!/usr/bin/env node

const fs = require("fs-extra");
const lodash = require("lodash");
const shell = require("shelljs")

function formatJson(data) {
  return JSON.stringify(data, null, 2);
}

function readData(_path) {
  return JSON.parse(fs.readFileSync(_path, "utf-8"));
}

function writeData(_path, data) {
  fs.outputFileSync(_path, data, {
    encoding: "utf8"
  });
}

async function moveFile(srcPath, toPath) {
  await fs.copy(srcPath, toPath);
}

function template(filePath, opts) {
  const content = fs.readFileSync(filePath, { encoding: "utf8" });
  return lodash.template(content, { interpolate: /<%=([\s\S]+?)%>/g })(opts);
}

function isArray(params) {
  return (
    Object.prototype.toString.call(params) === "[object Array]" &&
    !isNaN(params)
  );
}

function isString(params) {
  return Object.prototype.toString.call(params) === "[object String]";
}


async function execShell(shellStr, ifErrorMsg) {
  console.log("exec shell", shellStr)
  const { stderr, code } = await shell.exec(shellStr)
  if (code) {
    console.log("shell err msg >>>>", stderr)
    console.log("errcode>>>", code)
    throw new Error(stderr || ifErrorMsg)
  }
}


// function hasValue(v) {
//   if (!v) {
//     return false;
//   }
//   if (!isArray(v) || !isString(v)) {
//     return false;
//   }
//   return v.includes('')
// }

module.exports = {
  formatJson,
  readData,
  writeData,
  moveFile,
  template,
  execShell
};
