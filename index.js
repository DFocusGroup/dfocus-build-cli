#!/usr/bin/env node

const inquirer = require("inquirer");
const shell = require("shelljs");
const fs = require("fs-extra");
const lodash = require("lodash");

const {
  formatJson,
  readData,
  writeData,
  moveFile,
  template
} = require("./utils/index");

shell.exec("pwd", async function(err, pwd) {
  if (err) {
    return;
  }
  try {
    const _pwd = pwd.trim(); // 为啥有空格啊 坑死我了
    console.log("pwd.....", _pwd);
    // 读取   pkg 下面 scripts 的 server 的值
    const { INJECTED_MODULE, BASE, NODE_TITLE } = await getInputInfo();
    let nodeTitle = "node server --title=";
    nodeTitle = `${nodeTitle}${NODE_TITLE}`;
    console.log(`INJECTED_MODULE  is: ${INJECTED_MODULE}`);
    console.log(`BASE is: ${BASE}`);
    console.log(`NODE_TITLE is: ${nodeTitle}`);
    // 首先更改 pkg里面的  scripts 下面的 serve 值
    changePkg(_pwd, nodeTitle);
    const outputName = getOutputName(INJECTED_MODULE);
    console.log(`Dir name is: ${outputName}`);
    // 先找到 当前目录下 所有包含dfocus-fe-meeting 的文件 或者 文件夹
    const shouldDelNames = await getDeleteNames(_pwd);
    //   # 删除之前打包好的项目
    const delArrPro = shouldDelNames.map(v => {
      return removeFile(`${_pwd}/${v}`);
    });
    if (delArrPro.length) {
      await Promise.all(delArrPro);
    }
    // 替换 base
    changeBase(_pwd, BASE);
    // 打包
    await execShell(
      "NODE_ENV=production npm run build",
      "build failed, you need to find why!?!?!?!"
    );
    // 把改dist server package.json  移动到 outputName 下面
    const moveArr = ["package.json", "dist", "server"].map(v => {
      return moveFile(`${_pwd}/${v}`, `${_pwd}/${outputName}/${v}`);
    });
    await Promise.all(moveArr);
    // 拷贝stop.sh到打包目录
    writeStopToBin(_pwd, outputName);
    await execShell(
      `zip -r "${outputName}.zip" ${outputName}`,
      "Install runtime dependencies failed, check network first!"
    );
  } catch (err) {
    console.log("build err>>>>>>>>>>>>>", err);
  }
});

function changeBase(_pwd, base) {
  let data = readData(`${_pwd}/base.json`);
  data.proBase = base;
  writeData(`${_pwd}/base.json`, formatJson(data));
}

function writeStopToBin(_pwd, outputName) {
  const {
    scripts: { serve: nodeTitle }
  } = readData(`${_pwd}/package.json`);
  // 把nodeTITLE 写入到 shell/stop里面
  const data = template(`${_pwd}/shells/stop.sh`, {
    NODE_TITAL: nodeTitle
  });
  console.log("datadata", data);
  writeData(`${_pwd}/${outputName}/bin/stop.sh`, data);
}

function changePkg(_pwd, nodeTitle) {
  let data = readData(`${_pwd}/package.json`);
  data.scripts.serve = nodeTitle;
  writeData(`${_pwd}/package.json`, formatJson(data));
}

async function getInputInfo() {
  return new Promise((reslove, reject) => {
    inquirer
      .prompt([
        {
          type: "input",
          name: "INJECTED_MODULE",
          message: "Please input INJECTED_MODULE",
          default: "dfocus"
        },
        {
          type: "input",
          name: "BASE",
          message: "Please input deploy directory",
          default: "/"
        },
        {
          type: "input",
          name: "NODE_TITLE",
          message: "Please input deploy directory",
          default: "DMEETING_PC"
        }
      ])
      .then(answers => {
        reslove(answers);
      });
  });
}

async function getDeleteNames(filePath) {
  const files = await fs.readdir(filePath);
  return files.filter(v => {
    if (v.includes("dfocus-fe-meeting")) {
      return true;
    }
    return false;
  });
}

async function removeFile(path) {
  return new Promise((reslove, reject) => {
    fs.remove(path, info => {
      reslove(info);
    });
  });
}

function getOutputName(INJECTED_MODULE) {
  if (!INJECTED_MODULE) {
    return "dfocus-fe-meeting-zip-dist";
  }
  if (INJECTED_MODULE === "dfocus") {
    return "dfocus-fe-meeting-zip-dist";
  }
  return `dfocus-fe-meeting-${INJECTED_MODULE}-zip-dist`;
}

async function execShell(shellStr, ifErrorMsg) {
  const { code, stderr } = await shell.exec(shellStr);
  if (code || stderr) {
    throw new Error(stderr || ifErrorMsg);
  }
}