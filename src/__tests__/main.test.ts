import {setAndroidVersion, setIOSVersion} from '../utils'
import * as process from 'process'
import * as cp from 'child_process'
import * as path from 'path'
import {readFileSync} from 'fs'
import {Config} from '../types'

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
