const node_ssh = require("node-ssh")
// const node_ssh = require("/Users/dany/Desktop/npm包/node-ssh/lib/index")
const shell = require("shelljs")
const ssh = new node_ssh()

//执行远端部署脚本
module.exports.startRemoteShell = async options => {
  //在服务器上cwd配置的路径下执行sh deploy.sh脚本来实现发布
  await sshConnect(options)
  await execShell(options)
}

async function sshConnect({ host, username, password, port }) {
  await ssh.connect({
    host,
    username,
    password,
    port: port || 22
  })
}

async function execShell({ targetPath, startShellPath }) {
  console.log("targetPathtargetPath", targetPath)
  console.log("startShellPathstartShellPath", startShellPath)
  return new Promise((reslove, reject) => {
    ssh.execCommand(startShellPath, {
      cwd: targetPath,
      stdin: "exit",
      onStdout(chunk) {
        const str = chunk.toString("utf8")
        console.log(str)
        if (str.includes("running on port")) {
          reslove()
        }
      },
      onStderr(chunk) {
        console.log("stderr", chunk.toString("utf8"))
      }
    })
  })
}
