/* eslint-disable i18n-text/no-en */
/* eslint-disable filenames/match-regex */
import * as cp from 'child_process'
import * as path from 'path'
import * as process from 'process'
import {setAndroidVersion, setIOSVersion} from '../utils'
import {Config} from '../types'
import {readFileSync} from 'fs'

test('throws when android config missing', async () => {
  expect(() => setAndroidVersion({expo: {version: '1.2.3'}}, '')).toThrow(
    'Android config missing in app.json, for more info see https://docs.expo.io/workflow/configuration/'
  )
})

test('throws when ios config missing', async () => {
  expect(() => setIOSVersion({expo: {version: '1.2.3'}}, '')).toThrow(
    'iOS config missing in app.json, for more info see https://docs.expo.io/workflow/configuration/'
  )
})

test('should get set ios version', async () => {
  const buildNumber = setIOSVersion(
    {
      expo: {
        version: '1.4.5',
        ios: {
          buildNumber: '1.4.5'
        }
      }
    },
    '1.5.6'
  )
  expect(buildNumber).toEqual('1.5.6')
})

test('should get set android version', async () => {
  const buildNumber = setAndroidVersion(
    {
      expo: {
        version: '1.4.5',
        android: {
          versionCode: 10001001
        }
      }
    },
    '1.5.6'
  )
  expect(buildNumber).toEqual(1005006)
})

test('should modify config ios', async () => {
  const config = {
    expo: {
      version: '1.4.5',
      ios: {
        buildNumber: '5'
      }
    }
  }
  setIOSVersion(config, '1.2.3')
  expect(config.expo.ios.buildNumber).toEqual('1.2.3')
})

// shows how the runner will run a javascript action with env / stdout protocol
test('test bumps app.json', () => {
  const filepath = './src/__tests__/app.json'
  process.env['INPUT_FILEPATH'] = filepath
  process.env['INPUT_PLATFORMS'] = 'ios,android'
  process.env['INPUT_TAG'] = 'v1.2.3'

  const np = process.execPath
  const ip = path.join(__dirname, '../..', 'lib', 'main.js')
  const options: cp.ExecFileSyncOptions = {
    env: process.env
  }

  cp.execFileSync(np, [ip], options)

  const afterFileStr = readFileSync(filepath, 'utf-8')
  const afterfile = JSON.parse(afterFileStr) as Config

  expect(afterfile.expo.version).toEqual('1.2.3')
  expect(afterfile.expo.android).toBeDefined()
  expect(afterfile.expo.android?.versionCode).toEqual(1002003)
  expect(afterfile.expo.ios).toBeDefined()
  expect(afterfile.expo.ios?.buildNumber).toEqual('1.2.3')
})

test('test bumps app.json for only android', () => {
  const filepath = './src/__tests__/app.json'
  process.env['INPUT_FILEPATH'] = filepath
  process.env['INPUT_PLATFORMS'] = 'android'
  process.env['INPUT_TAG'] = 'v1.2.3'

  const np = process.execPath
  const ip = path.join(__dirname, '../..', 'lib', 'main.js')
  const options: cp.ExecFileSyncOptions = {
    env: process.env
  }

  cp.execFileSync(np, [ip], options)

  const afterFileStr = readFileSync(filepath, 'utf-8')
  const afterfile = JSON.parse(afterFileStr) as Config

  expect(afterfile.expo.android?.versionCode).toEqual(1002003)
  expect(afterfile.expo.ios?.buildNumber).toEqual(
    afterfile.expo.ios?.buildNumber
  )
})

test('test bumps app.json for only ios', () => {
  const filepath = './src/__tests__/app.json'
  process.env['INPUT_FILEPATH'] = filepath
  process.env['INPUT_PLATFORMS'] = 'ios'
  process.env['INPUT_TAG'] = 'v1.2.3'

  const np = process.execPath
  const ip = path.join(__dirname, '../..', 'lib', 'main.js')
  const options: cp.ExecFileSyncOptions = {
    env: process.env
  }

  cp.execFileSync(np, [ip], options)

  const prefileStr = readFileSync(filepath, 'utf-8')
  const prefile = JSON.parse(prefileStr) as Config

  const afterFileStr = readFileSync(filepath, 'utf-8')
  const afterfile = JSON.parse(afterFileStr) as Config

  expect(afterfile.expo.android?.versionCode).toEqual(
    prefile.expo.android?.versionCode
  )
  expect(afterfile.expo.ios?.buildNumber).toEqual('1.2.3')
})
