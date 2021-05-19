# KeBing Excel to GrowingIO Excel

## Install

```bash
npm install kb2gio -g
```

OR

```bash
yarn global add kb2gio
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
  -f, --file     File path to KeBing Excel.                      [字符串] [必需]
  -o, --out      Output GrowingIO Excel to file path.            [字符串] [必需]
  -e, --eid      Exists Event IDs file, 1 id per line.                  [字符串]
  -h, --help     显示帮助信息                                             [布尔]
  -v, --version  显示版本号                                               [布尔]

示例：
  kb2gio -f ~/download/KeBing.xlsx -o ~/works/yunji/importToGrowingIO.xlsx
  kb2gio -f ~/kebin.xlsx -o ~/growingio.xlsx -e ~/eventIDs.txt
```
