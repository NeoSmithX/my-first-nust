const subscanKey =  process.env.SUBSCAN_KEY
import { subscanApiUrl } from "./config"
import {polkadotKeyFormat} from '~/utils/polkadot/format'
const myHeaders = new Headers();
// myHeaders.append("User-Agent", "Apidog/1.0.0 (https://apidog.com)")

myHeaders.append("x-api-key", subscanKey as string)
myHeaders.append("Content-Type", "application/json")
export default myHeaders