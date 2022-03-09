import {Config} from './types'

export const setAndroidVersion = (json: Config, version: string): number => {
  const android = json.expo.android
  if (!android) {
    throw new Error(
      'Android config missing in app.json, for more info see https://docs.expo.io/workflow/configuration/'
    )
  }
  const versionCode = json.expo.android?.versionCode
  if (versionCode === undefined || !Number.isInteger(versionCode)) {
    throw new Error(
      `Expected expo.android.versionCode to be an integer (found ${versionCode}), for more info see https://docs.expo.io/workflow/configuration/`
    )
  }
  const versionArray = version.split('.')
  const nextVersionCode =
    parseInt(versionArray[0]) * 1000000 +
    parseInt(versionArray[1]) * 1000 +
    parseInt(versionArray[2])
  android.versionCode = nextVersionCode
  return nextVersionCode
}

export const setIOSVersion = (json: Config, version: string): string => {
  const ios = json.expo.ios
  if (!ios) {
    throw new Error(
      'iOS config missing in app.json, for more info see https://docs.expo.io/workflow/configuration/'
    )
  }
  ios.buildNumber = version
  return version
}
