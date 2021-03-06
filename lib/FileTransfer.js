// const logUpdate = require('log-update')
const { readFileSync, existsSync } = require('fs')
const xlsx = require('xlsx')

// è¾åºæ¶æ¯
const Msg = {
  // actions
  readFile: (file) => console.log(`ð è¯»åæä»¶ï¼"${file}"`),
  writeFile: (file) => console.log(`ð åå¥æä»¶ï¼"${file}"`),
  noFile: (file) => console.log(`ð¨ æä»¶ "${file}" ä¸å­å¨`),
  // result
  fail: () => console.log(`â å¯¼åºå¤±è´¥...`),
  succ: () => console.log(`ð å¯¼åºæåï¼æ­åï¼`),
  // information
  infoCount: (num1, num2) =>
    console.log(`ðº å±å¯¼åºäº ${num1} äºä»¶ï¼${num2} äºä»¶åé`),
  infoKillPoint: (obj) => console.log('ðð¾ æé¤å·²å­å¨ç"åç¹äºä»¶"ï¼', obj),
  infoKillEvent: (obj) => console.log('ðð¾ââï¸ æé¤å·²å­å¨ç"äºä»¶åé"ï¼', obj),
}

// åè¡æä»¶ -> æ°ç»
const file2array = (file) => {
  if (existsSync(file)) {
    return readFileSync(file, { encoding: 'utf8' })
      .split(/\r|\n/)
      .map((value) => value.trim())
      .filter(Boolean)
  } else {
    file && Msg.noFile(file)
    return []
  }
}

const trans = (props) => {
  const {
    file = null,
    out = null,
    point = null,
    event = null,
    prefix = null,
  } = props

  if (existsSync(file)) {
    Msg.readFile(file)
  } else {
    Msg.noFile(file)
    Msg.fail()
    return
  }

  // kill
  const pidArray = file2array(point)
  const eidArray = file2array(event)

  // excel
  const { Sheets } = xlsx.readFile(file)
  const [key] = Object.keys(Sheets)
  const json = xlsx.utils.sheet_to_json(Sheets[key])

  const space = [{}, {}]
  const sheet1 = [...space]
  const sheet2 = [...space]

  // ws1
  let eids = {}
  let pointKill = {}
  let eventKill = {}
  json.map((item) => {
    // row
    let baseRow = {}
    Object.keys(item).forEach((key) => {
      // col
      const content = item[key]
      switch (key) {
        case 'äºä»¶Id':
          baseRow['id'] = [prefix, content].filter(Boolean).join('_')
          break
        case 'äºä»¶åç§°':
          baseRow['name'] = content
          baseRow['remark'] = content
          break
        case 'åæ°1æ å¿ç¬¦':
        case 'åæ°2æ å¿ç¬¦':
        case 'åæ°3æ å¿ç¬¦':
        case 'åæ°4æ å¿ç¬¦':
        case 'åæ°5æ å¿ç¬¦':
        case 'åæ°6æ å¿ç¬¦':
        case 'åæ°7æ å¿ç¬¦':
          if (!pidArray.includes(baseRow.id)) {
            sheet1.push({ ...baseRow, eid: content, ename: content })
            if (!eidArray.includes(content)) {
              eids[content] = true
            } else {
              eventKill[content] = false
            }
          } else {
            pointKill[baseRow.id] = false
          }
          break
        default:
          break
      }
    })
  })

  // ws2
  Object.keys(eids).forEach((content) => {
    sheet2.push({
      eid: content,
      ename: content,
      etype: 'å­ç¬¦ä¸²',
      remark: content,
    })
  })

  const wb = xlsx.utils.book_new()
  const ws0 = xlsx.utils.json_to_sheet(space)
  const ws1 = xlsx.utils.json_to_sheet(sheet1)
  const ws2 = xlsx.utils.json_to_sheet(sheet2)

  xlsx.utils.book_append_sheet(wb, ws0, 'Space Sheet')
  xlsx.utils.book_append_sheet(wb, ws1, 'åç¹äºä»¶')
  xlsx.utils.book_append_sheet(wb, ws2, 'äºä»¶çº§åé')

  point && Msg.infoKillPoint(Object.keys(pointKill))
  event && Msg.infoKillEvent(Object.keys(eventKill))

  if (out) {
    Msg.writeFile(out)
    xlsx.writeFileAsync(out, wb, () => {
      Msg.infoCount(
        json.length - Object.keys(pointKill).length,
        sheet2.length - space.length,
      )
      Msg.succ()
    })
  } else {
    Msg.noFile(out)
    Msg.fail()
  }
}

module.exports = trans

/**
 * # åç¹äºä»¶
 *
 * A4: æ è¯ç¬¦ï¼äºä»¶ï¼*
 * B4: åç§°ï¼äºä»¶ï¼*
 * C4: æè¿°
 * D4: æ è¯ç¬¦ï¼äºä»¶çº§åéï¼*
 * E4: åç§°ï¼äºä»¶çº§åéï¼*
 *
 *
 * # äºä»¶çº§åé
 *
 * A4: æ è¯ç¬¦ *
 * B4: åç§° *
 * C4: ç±»å
 * D4: æè¿°
 *
 *
 */
