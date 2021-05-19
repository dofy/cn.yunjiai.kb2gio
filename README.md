# KeBing Excel to GrowingIO Excel

## Install

```bash
npm install @dofy/kb2gio -g
```

OR

```bash
yarn global add @dofy/kb2gio
```

## Run

```bash
# show help
kb2gio -h

# show version
kb2gio -v
```

## Help

```base
选项：
  -f, --file     将被读取的 KeBing 的 Excel。                    [字符串] [必需]
  -o, --out      导出文件。                                      [字符串] [必需]
  -e, --event    已存在的"事件变量"列表文件，每行一个"标识符"。         [字符串]
  -p, --point    已存在的"埋点事件"列表文件，每行一个"标识符"。         [字符串]
  -r, --prefix   "埋点事件"前缀，将生成 "{prefix}_事件Id"               [字符串]
  -h, --help     显示帮助信息                                             [布尔]
  -v, --version  显示版本号                                               [布尔]

示例：
  kb2gio -f ~/download/KeBing.xlsx -o ~/works/yunji/importToGrowingIO.xlsx
  kb2gio -f ~/kebing.xlsx -o ~/growingio.xlsx -e ~/eventIDs.txt
  kb2gio -f ~/kebing.xlsx -o ~/growingio.xlsx -r PC

copyright (c) 2021 Seven Yu
```
