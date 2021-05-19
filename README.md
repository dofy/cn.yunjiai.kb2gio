# KeBing Excel to GrowingIO Excel

## Install

```bash
npm install -g kb2gio
```

OR

```bash
yarn add global kb2gio
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