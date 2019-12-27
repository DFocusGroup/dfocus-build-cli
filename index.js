#!/usr/bin/env node

const inquirer = require("inquirer")
const shell = require("shelljs")
const fs = require("fs-extra")
const format = "zip-dist"
const {
  formatJson,
  readData,
  writeData,
  moveFile,
  template,
  execShell
} = require("./utils/index")
const { uploadFile } = require("./utils/upload")
const { startRemoteShell } = require("./utils/startShell")
shell.exec("pwd", async function(err, pwd) {
  if (err) {
    return
  }
  try {
    const _pwd = getPwd(pwd)

    //获取   base.json 里面的 outputName值
    let { outputName: OUTPUTNAME, nodeDependencies, serveConfig } = getBaseJson(
      _pwd
    )
    if (!OUTPUTNAME) {
      throw new Error("base.json has not outputName filed")
    }
    nodeDependencies = checkDeps(nodeDependencies) // node 必须要有的依赖项

    const defNodeTitle = getDefNodeTitle(_pwd)

    const { INJECTED_MODULE, BASE, NODE_TITLE } = await getInputInfo(
      defNodeTitle
    )

    let nodeTitle = "node server --title="
    nodeTitle = `${nodeTitle}${NODE_TITLE}`
    console.log(`INJECTED_MODULE  is: ${INJECTED_MODULE}`)
    console.log(`BASE is: ${BASE}`)
    console.log(`NODE_TITLE is: ${nodeTitle}`)
    // 首先更改 pkg里面的  scripts 下面的 serve 值
    changePkg(_pwd, nodeTitle)
    console.log("OUTPUTNAMEOUTPUTNAME", OUTPUTNAME)
    const outputName = getOutputName(INJECTED_MODULE, OUTPUTNAME)
    console.log(`Dir name is: ${outputName}`)
    // 先找到 当前目录下 所有包含projectName的文件 或者 文件夹
    const shouldDelNames = await getDeleteNames(_pwd)
    console.log("删除文件>>>>>", shouldDelNames)
    //   # 删除之前打包好的项目
    const delArrPro = shouldDelNames.map(v => {
      return removeFile(`${_pwd}/${v}`)
    })
    if (delArrPro.length) {
      await Promise.all(delArrPro)
    }
    // 替换 base
    changeBase(_pwd, BASE)
    // 打包
    await execShell(
      "NODE_ENV=production npm run build",
      "build failed, you need to find why!?!?!?!"
    )
    // 把改dist server package.json  移动到 outputName 下面
    const moveArr = ["package.json", "dist", "server"].map(v => {
      return moveFile(`${_pwd}/${v}`, `${_pwd}/${outputName}/${v}`)
    })
    await Promise.all(moveArr)
    // 拷贝stop.sh到打包目录
    writeStopToBin(_pwd, outputName)
    shell.cd(`${_pwd}/${outputName}`)
    // 安装node的依赖
    const installNodeStrShell = getNodeStrShell(nodeDependencies)
    await execShell(
      installNodeStrShell,
      "Install node  runtime dependencies failed, check network first!"
    )
    shell.cd(`${_pwd}`)
    await execShell(
      `zip -r "${outputName}.zip" ${outputName}`,
      "Install runtime dependencies failed, check network first!"
    )
    console.log("打包成功>>>>>>>>")
    await uploadZipAndExecStartShell({
      ...serveConfig,
      sourcePath: `${outputName}.zip`
    })
    process.exit(0)
  } catch (err) {
    console.log("build err>>>>>>>>>>>>>", err)
    process.exit(0)
  }
})

async function uploadZipAndExecStartShell(props) {
  const { host, username, password, targetPath } = props
  if (!host || !username || !password || !targetPath) {
    throw new Error("host or username or password or targetPath must config")
  }
  // 上传
  await uploadFile(props)
  // 上传后启动 start.sh
  await startRemoteShell(props)
}

function getDefNodeTitle(_pwd) {
  const {
    scripts: { serve: nodeTitle }
  } = readData(`${_pwd}/package.json`)
  console.log("def nodeTitle", nodeTitle)
  const format = "node server --title="
  const arr = nodeTitle.split(format)
  if (arr.length !== 2) {
    throw new Error("scripts serve format error")
  }
  return arr[1]
}

function checkDeps(nodeDependencies) {
  if (!nodeDependencies || nodeDependencies.length === 0) {
    nodeDependencies = ["express", "replace-in-file"]
  } else {
    if (!nodeDependencies.includes("express")) {
      nodeDependencies.push("express")
    }
    if (!nodeDependencies.includes("replace-in-file")) {
      nodeDependencies.push("replace-in-file")
    }
  }
  return nodeDependencies
}

function getNodeStrShell(arr) {
  let str = "npm install"
  for (let v of arr) {
    str = `${str} ${v}`
  }
  return str
}

function getPwd(pwd) {
  const _pwd = pwd.trim() // 为啥有空格啊 坑死我了
  console.log("pwd.....", _pwd)
  return _pwd
}

function getBaseJson(_pwd) {
  return readData(`${_pwd}/base.json`)
}

function changeBase(_pwd, base) {
  let data = readData(`${_pwd}/base.json`)
  data.proBase = base
  writeData(`${_pwd}/base.json`, formatJson(data))
}

function writeStopToBin(_pwd, outputName) {
  const {
    scripts: { serve: nodeTitle }
  } = readData(`${_pwd}/package.json`)
  // 把nodeTITLE 写入到 shell/stop里面
  const data = template(`${_pwd}/shells/stop.sh`, {
    NODE_TITAL: nodeTitle
  })

  writeData(`${_pwd}/${outputName}/bin/stop.sh`, data)
}

function changePkg(_pwd, nodeTitle) {
  let data = readData(`${_pwd}/package.json`)
  data.scripts.serve = nodeTitle
  writeData(`${_pwd}/package.json`, formatJson(data))
}

async function getInputInfo(defNodeTitle) {
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
          message: "Please input node_title",
          default: defNodeTitle
        }
        // {
        //   type: "input",
        //   name: "OUTPUTNAME",
        //   message: "Please input outputName",
        //   default: defOutputName
        // }
      ])
      .then(answers => {
        // const _outputName = dealwithOutputName(answers.OUTPUTNAME);
        reslove({
          ...answers
          //   OUTPUTNAME: _outputName
        })
      })
  })
}

function dealwithOutputName(OUTPUTNAME) {
  // 对OUTPUTNAME 字段特殊处理下 如果用户输入是  test-ads 那就给他转化为  test-ads-zip-dist,如果用户输入是 test-ads-zip-dist 就不处理
  const arr = OUTPUTNAME.split(format)
  // 如果 defOutputName "bmw-desking-web-zip-dist"  split 后 为 ["bmw-desking-web-", ""]
  if (arr.length !== 2) {
    // 不等于2 说明test-ads-zip-dist这种格式
    return `${OUTPUTNAME}-${format}`
  }
  return OUTPUTNAME
}

async function getDeleteNames(filePath) {
  const files = await fs.readdir(filePath)
  return files.filter(v => {
    if (v.includes(format)) {
      // 获取所有包含 zip-dist 的文件
      return true
    }
    return false
  })
}

async function removeFile(path) {
  return new Promise((reslove, reject) => {
    fs.remove(path, info => {
      reslove(info)
    })
  })
}

function getProjectName(defOutputName) {
  const arr = defOutputName.split(format)
  // 如果 defOutputName "bmw-desking-web-zip-dist"  split 后 为 ["bmw-desking-web-", ""]
  if (arr.length !== 2) {
    return ""
  }
  return arr[0]
}

function getOutputName(INJECTED_MODULE, defOutputName) {
  if (!INJECTED_MODULE) {
    return defOutputName
  }
  if (INJECTED_MODULE === "dfocus") {
    return defOutputName
  }
  const projectName = getProjectName(defOutputName)
  if (!projectName) {
    return defOutputName
  }
  return `${projectName}${INJECTED_MODULE}-${format}`
}
