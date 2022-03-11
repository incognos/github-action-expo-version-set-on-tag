/* eslint-disable i18n-text/no-en */
import * as core from '@actions/core'
import {setAndroidVersion, setIOSVersion} from './utils'
import {Config} from './types'
import fs from 'fs'

type Platform = 'android' | 'ios'

async function run(): Promise<void> {
  try {
    const filepath: string = core.getInput('filepath')
    const platformsStr: string = core.getInput('platforms')
    const tagStr: string = core.getInput('tag')

    core.debug(`Looking for app.json at '${filepath}'`)

    const jsonStr = fs.readFileSync(filepath, 'utf-8')

    const indent = '  '

    const json = JSON.parse(jsonStr) as Config

    const platforms = platformsStr.toLowerCase().split(',') as Platform[]

    core.debug(`Platforms to process: ${platforms.join(',')}`)

    const nextVersion = tagStr.replace(/^v/, '')
    json.expo.version = nextVersion

    if (platforms.includes('android')) {
      const versionCode = setAndroidVersion(json, nextVersion)
      core.debug(`Bump android versionCode to ${versionCode}`)
      core.setOutput('versioncode', versionCode)
    }

    if (platforms.includes('ios')) {
      const nextBuildNumber = setIOSVersion(json, nextVersion)
      core.debug(`Bumping android versionCode to ${nextBuildNumber}`)
      core.setOutput('buildnumber', nextBuildNumber)
    }

    const output = JSON.stringify(json, null, indent)

    core.debug('Saving app.json')

    fs.writeFileSync(filepath, output)
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message)
    }
  }
}

run()
