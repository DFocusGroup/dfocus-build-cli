const client = require("scp2")
const signale = require("signale")

module.exports.uploadFile = async options => {
  return new Promise((resolve, reject) => {
      console.log('optionsoptions',options)
    let { targetPath, sourcePath, host, username, password } = options
    signale.pending("Uploading...")
    client.scp(
      sourcePath,
      {
        host: host,
        username: username,
        password: password,
        path: `${targetPath}`
      },
      err => {
        if (err) {
          signale.debug("Upload failed!")
          signale.error(err)
          process.exit(1)
        }
        signale.success("Upload success!")
        resolve()
      }
    )
  })
}
