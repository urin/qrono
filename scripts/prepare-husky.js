import { spawnSync } from 'node:child_process'

const gitCheck = spawnSync('git', ['rev-parse', '--git-dir'], {
  stdio: 'ignore',
})

if (gitCheck.status !== 0) {
  process.exit(0)
}

const husky = spawnSync('husky', { shell: true, stdio: 'inherit' })

process.exit(husky.status ?? 0)
