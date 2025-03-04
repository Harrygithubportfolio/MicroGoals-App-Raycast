/// <reference types="@raycast/api">

/* 🚧 🚧 🚧
 * This file is auto-generated from the extension's manifest.
 * Do not modify manually. Instead, update the `package.json` file.
 * 🚧 🚧 🚧 */

/* eslint-disable @typescript-eslint/ban-types */

type ExtensionPreferences = {
  /** API URL - The URL of your MicroGoals backend API */
  "apiUrl": string,
  /** User ID - Your user ID from the MicroGoals app */
  "userId": string
}

/** Preferences accessible in all the extension's commands */
declare type Preferences = ExtensionPreferences

declare namespace Preferences {
  /** Preferences accessible in the `index` command */
  export type Index = ExtensionPreferences & {}
  /** Preferences accessible in the `add-goal` command */
  export type AddGoal = ExtensionPreferences & {}
  /** Preferences accessible in the `check-microgoal` command */
  export type CheckMicrogoal = ExtensionPreferences & {}
}

declare namespace Arguments {
  /** Arguments passed to the `index` command */
  export type Index = {}
  /** Arguments passed to the `add-goal` command */
  export type AddGoal = {}
  /** Arguments passed to the `check-microgoal` command */
  export type CheckMicrogoal = {}
}

