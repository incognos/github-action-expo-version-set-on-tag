export type Config = {
  expo: {
    version: string
    ios?: {
      buildNumber?: string
    }
    android?: {
      versionCode?: number
    }
  }
}
