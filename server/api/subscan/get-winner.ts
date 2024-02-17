const subscanKey =  process.env.SUBSCAN_KEY
import { subscanApiUrl } from "./config"
import {polkadotKeyFormat} from '~/utils/polkadot/format'
const myHeaders = new Headers();
// myHeaders.append("User-Agent", "Apidog/1.0.0 (https://apidog.com)")

myHeaders.append("x-api-key", subscanKey as string)
myHeaders.append("Content-Type", "application/json")
export default defineEventHandler(async (event) => {
    
    const body = await readBody(event) as any
    // console.log('body in getWinner: ', body)
    const {network, deployHash, correctAnwser, winnerNum} = body
    const getWinner = await questWinner(network, deployHash, correctAnwser, winnerNum)
    return getWinner
})
  


export const questWinner = async (network: string, deployHash: string, correctAnwser: string, winnerNum: number) => {
    let result: { status: boolean, winnerList: string[] } = {
        status: false,
        winnerList: []
    }
    const apiUrl = subscanApiUrl[network as keyof typeof subscanApiUrl]

    const raw = JSON.stringify({
        "hash": deployHash,
        "only_extrinsic_event": true
    });

    const requestOptions: RequestInit = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow' as RequestRedirect
    }
    // console.log('requestOptions', "https://" + apiUrl + "/api/scan/extrinsic", requestOptions)
    let question_data_json
    try {
        const response = await fetch("https://" + apiUrl + "/api/scan/extrinsic", requestOptions)
        const text = JSON.parse(await response.text())
        if (text.message != 'Success') {
            console.log('text.message', text.message)
            return result
        }
        question_data_json = text.data
        // console.log(question_data_json)
    } catch (e) {
        console.log('e', e)
        return result
    }
    // console.log('question_data_json',question_data_json)
    if (question_data_json.call_module_function != 'remark' && question_data_json.call_module_function != 'remark_with_event') {
        console.log('question_data_json.call_module_function', question_data_json.call_module_function)
        return result
    }


    const inscription = JSON.parse(question_data_json.params[0].value)

    if (inscription.op != "deploy-question") {
        console.log('inscription.op', inscription.op)
        return result
    }
    const { space,  question } = inscription
    console.log('space', space, 'question', question)
    // const question_ID = inscription.questionID
    const winnerList = await find_winner(apiUrl, space, question, correctAnwser, winnerNum, question_data_json.block_num)
    if (winnerList.length == winnerNum) {
        result.status = true
        result.winnerList = winnerList
        
    }
    return result
}

const find_winner = async (apiUrl: string, space: string, question: string, correctAnwser: string, winnerNum: number, start_block: number) => {

    let winnerList: string[] = []
    for (let page = 0; ; page++) {
        const raw = JSON.stringify({

            "block_range": start_block + '-' + start_block * 100,
            // "block_num":19092662,
            "module": "system",
            "call": "remark",
            "page": page,
            "row": 100,
            "order": "asc",
            "success": true,
        })
        const requestOptions: RequestInit = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow' as RequestRedirect
        }
        let remarkRecord
        try {
            const response = await fetch("https://" + apiUrl + "/api/v2/scan/extrinsics", requestOptions)
            const text = JSON.parse(await response.text())
            if (text.message != 'Success') {
                console.log('text.message', text.message)
                return winnerList
            }
            remarkRecord = text.data.extrinsics
            const extrinsic_index_list: string[] = []
            remarkRecord.forEach(
                (x: any) => {
                    extrinsic_index_list.push(x.extrinsic_index)
                }
            )
            const raw_tx_details = JSON.stringify({

                "extrinsic_index": extrinsic_index_list
            })
            const requestOptions_tx_details: RequestInit = {
                method: 'POST',
                headers: myHeaders,
                body: raw_tx_details,
                redirect: 'follow' as RequestRedirect
            }
            const response_tx_details = await fetch("https://" + apiUrl + "/api/scan/extrinsic/params", requestOptions_tx_details)
            const text_tx_details = JSON.parse(await response_tx_details.text()).data

            for (let i = 0; i < text_tx_details.length; i++) {
                const inscription = JSON.parse(text_tx_details[i].params[0].value)
                if (!inscription) {
                    continue
                }
                if (inscription.op == "mint-answer" && inscription.space == space && inscription.question == question && inscription.answer == correctAnwser) {
                    const winner_address = remarkRecord[i].account_display.address
                    const winner_address_substrate = polkadotKeyFormat(winner_address, 'substrate') as string
                    if (!winnerList.includes(winner_address_substrate)) {
                        winnerList.push(winner_address_substrate)
                        if (winnerList.length == winnerNum) {
                            return winnerList
                        }
                    }
                }

            }
            if (winnerList.length >= winnerNum) {
                winnerList = winnerList.splice(0, winnerNum)
                return winnerList
            }
            if (remarkRecord.length < 100) {
                console.log('has reached the end of the subscan')
                return winnerList
            }

            // console.log(question_data_json)
        } catch (e) {
            console.log('e', e)
            return winnerList
        }
    }


}