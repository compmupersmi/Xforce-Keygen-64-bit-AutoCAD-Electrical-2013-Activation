import { execFile } from 'child_process'
import { platform } from 'process'
import { promisify } from 'util'

const pExecFile = promisify(execFile)

// Retrieve nvm custom alias
export const getNvmCustomAlias = function (rawVersion) {
  return runNvmCommand(`nvm_alias ${rawVersion}`)
}

// Retrieve Node.js version outside nvm
export const getNvmSystemVersion = function () {
  return runNvmCommand('nvm deactivate >/dev/null && node --version')
}

// nvm requires Bash and reading the user's `.profile` to source `nvm.sh`
const runNvmCommand = async function (command) {
  if (platform === 'win32') {
    return ''
  }

  try {
    const { stdout } = await pExecFile('bash', ['-ic', command])
    return stdout.trim()
    // Among possible errors:
    //   - Setup issue: Bash or nvm not installed, Bash setup error, etc.
    //   - Custom alias: alias does not exist
    //   - `system`: no system `node` outside `nvm`
  } catch (error) {
    return ''
  }
}
