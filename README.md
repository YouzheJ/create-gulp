# create-gulp
基于gulp的简单脚手架

#### 项目结构

```shell
.
├── /build/                     # 打包后的目录, 线上可用版
├── /temp/                      # 打包后的目录, 只有打包压缩，无版本号/替换线上路径
├── /node_modules/              # ...
├── /src/
    ├── /demo/                  # 示例，项目并不存在
    │   ├── /css/               # 样式文件 命名需要保持一致，否则要单独配置
    │   └── /images/            # 图片 命名需要保持一致，否则要单独配置
    │   └── /js/                # js文件 命名需要保持一致，否则要单独配置
    │   └── demo.html           # thml/htm/jsp
    ├── /static/                # 可能公用的文件
    │   ├── /css/               # 样式文件 命名需要保持一致，否则要单独配置
    │   └── /images/            # 图片 命名需要保持一致，否则要单独配置
    │   └── /js/                # js文件 命名需要保持一致，否则要单独配置
├── gulpfile.js                 # gulp的配置文件
│── package.json                # ...
└── README.md                   # 项目文档
```

#### 项目命令

- 本地开发

```bash
npm start # 不监听less
npm start-less # 监听less
```

- 本地代理接口

```js
# 在gulpfile.js中修改
# 下面为简单的示例
middleware: [
  proxy(['/test'], {target: 'http://baidu.com', changeOrigin: true}),
]
```

- 通用打包

```bash
npm run build
```

> 打包后会生成两个目录，temp 、build，temp为中转目录，build为线上使用

> 如果通用打包不能满足需要，则可自己定制新的命令，具体可参考现有代码，或查阅相关文档，当然也可以直接使用源文件