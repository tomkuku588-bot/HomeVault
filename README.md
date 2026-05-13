# HomeVault 协议托管页面

这个目录用于托管家庭资料收纳（HomeVault，`com.xmgod.familyrecords`）的隐私政策和用户协议静态页面。主页为单页协议中心，支持在同一页面内切换隐私政策、用户协议、中文和英文，可用于应用内展示和应用市场审核访问。

## 文件清单

| 文件 | 用途 |
| --- | --- |
| `index.html` | 单页协议中心，支持协议类型和中英文切换 |
| `privacy-policy.html` | 旧隐私政策链接兼容跳转页 |
| `user-agreement.html` | 旧用户协议链接兼容跳转页 |
| `404.html` | 中英文 404 兜底页 |
| `privacy-policy.md` | 隐私政策中文 Markdown 原文 |
| `privacy-policy.en.md` | 隐私政策英文 Markdown 原文 |
| `user-agreement.md` | 用户协议中文 Markdown 原文 |
| `user-agreement.en.md` | 用户协议英文 Markdown 原文 |
| `legal-manifest.json` | 应用、开发者、协议链接和版本信息 |
| `CHANGELOG.md` | 页面与协议托管变更记录 |
| `assets/legal.js` | 页面语言切换与语言参数保留脚本 |
| `assets/favicon.svg` | 网站图标 |
| `robots.txt` | 搜索引擎抓取规则 |
| `sitemap.xml` | 站点地图与中英文替代链接 |
| `.editorconfig` | 编辑器格式规则 |
| `.gitattributes` | Git 换行与二进制文件规则 |
| `.nojekyll` | 让 GitHub Pages 原样托管静态文件 |

## 线上链接

仓库地址：

```text
git@github.com:tomkuku588-bot/HomeVault.git
```

GitHub Pages 已通过 `gh-pages` 分支发布，可访问：

```text
协议中心：https://tomkuku588-bot.github.io/HomeVault/
隐私政策：https://tomkuku588-bot.github.io/HomeVault/?doc=privacy&lang=zh
用户协议：https://tomkuku588-bot.github.io/HomeVault/?doc=agreement&lang=zh
英文隐私政策：https://tomkuku588-bot.github.io/HomeVault/?doc=privacy&lang=en
英文用户协议：https://tomkuku588-bot.github.io/HomeVault/?doc=agreement&lang=en
协议元数据：https://tomkuku588-bot.github.io/HomeVault/legal-manifest.json
```

更新页面后，将同一内容推送到 `main` 和 `gh-pages` 分支即可刷新线上页面。

## 维护流程

1. 修改 Markdown 原文：中文改 `privacy-policy.md`、`user-agreement.md`，英文改 `privacy-policy.en.md`、`user-agreement.en.md`。
2. 同步更新 `index.html` 中对应协议的正文、目录、版本号和最近更新日期。
3. 如版本、日期或链接变化，同步更新 `legal-manifest.json`、`sitemap.xml` 和 `CHANGELOG.md`。
4. 本地检查后提交，提交日志使用中文。
5. 推送到 `main`，再同步推送到 `gh-pages` 发布线上页面。

## 开发者信息

联系邮箱：tomkuku588@gmail.com
