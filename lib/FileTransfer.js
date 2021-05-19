// const logUpdate = require('log-update')
const { readFileSync, existsSync } = require('fs')
const xlsx = require('xlsx')

// 输出消息
const Msg = {
  // actions
  readFile: (file) => console.log(`📚 读取文件："${file}"`),
  writeFile: (file) => console.log(`📝 写入文件："${file}"`),
  noFile: (file) => console.log(`🚨 文件 "${file}" 不存在`),
  // result
  fail: () => console.log(`❌ 导出失败...`),
  succ: () => console.log(`🎉 导出成功，恭喜！`),
  // information
  infoCount: (num1, num2) =>
    console.log(`🍺 共导出了 ${num1} 事件，${num2} 事件变量`),
  infoKillPoint: (obj) => console.log('🙅🏾 排除已存在的"埋点事件"：', obj),
  infoKillEvent: (obj) => console.log('🙅🏾‍♂️ 排除已存在的"事件变量"：', obj),
}

// 单行文件 -> 数组
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

  const pidArray = file2array(point)
  // event id
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
        case '事件Id':
          baseRow['id'] = [prefix, content].filter(Boolean).join('_')
          break
        case '事件名称':
          baseRow['name'] = content
          baseRow['remark'] = content
          break
        case '参数1标志符':
        case '参数2标志符':
        case '参数3标志符':
        case '参数4标志符':
        case '参数5标志符':
        case '参数6标志符':
        case '参数7标志符':
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
      etype: '字符串',
      remark: content,
    })
  })

  const wb = xlsx.utils.book_new()
  const ws0 = xlsx.utils.json_to_sheet(space)
  const ws1 = xlsx.utils.json_to_sheet(sheet1)
  const ws2 = xlsx.utils.json_to_sheet(sheet2)

  xlsx.utils.book_append_sheet(wb, ws0, 'Space Sheet')
  xlsx.utils.book_append_sheet(wb, ws1, '埋点事件')
  xlsx.utils.book_append_sheet(wb, ws2, '事件级变量')

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
 * # 埋点事件
 *
 * A4: 标识符（事件）*
 * B4: 名称（事件）*
 * C4: 描述
 * D4: 标识符（事件级变量）*
 * E4: 名称（事件级变量）*
 *
 *
 * # 事件级变量
 *
 * A4: 标识符 *
 * B4: 名称 *
 * C4: 类型
 * D4: 描述
 *
 *
 */
