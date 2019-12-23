# dfocus打包脚手架


### 首先要用这个cli打包，项目需要稍作改动
#### 1.需要在项目根目录下，新建base.json文件，如下
![image.png](https://cdn.nlark.com/yuque/0/2019/png/93166/1577075347896-fbc9eea8-e136-4e17-81fe-a824bba8c5db.png#align=left&display=inline&height=490&name=image.png&originHeight=980&originWidth=1642&size=176974&status=done&style=none&width=821)

#### 2.在src 下面的utils里面的env.js 改动如下代码
![image.png](https://cdn.nlark.com/yuque/0/2019/png/93166/1577075613857-0c95faa7-07ea-4b90-992c-9c052be5aeee.png#align=left&display=inline&height=681&name=image.png&originHeight=1362&originWidth=2276&size=341946&status=done&style=none&width=1138)

#### 3.utils 里面的 config.js的base取值防暑该改变下，如下

![image.png](https://cdn.nlark.com/yuque/0/2019/png/93166/1577075792485-e9289749-bfc9-4ac0-943b-d088d6df5308.png#align=left&display=inline&height=662&name=image.png&originHeight=1324&originWidth=2266&size=507414&status=done&style=none&width=1133)
,
#### 4.  根目录下面的.roadhogrc.js里面的base取值方式，也需改动

![image.png](https://cdn.nlark.com/yuque/0/2019/png/93166/1577075938436-02a40c41-8182-4d10-bd96-f1c01cb3726a.png#align=left&display=inline&height=662&name=image.png&originHeight=1324&originWidth=2016&size=417596&status=done&style=none&width=1008)
### 安装
```
npm i df-build-cli --save-dev
```


### 然后,在package.json的scripts里面加入

```
"build:prod": "dfb"
```


### 然后打包

```
npm run build:prod
```

### 运行时有三个参数需要输入，INJECTED_MODULE，NODE_TITLE ，BASE
#### INJECTED_MODULE 比如  ads
#### NODE_TITLE 比如 DMEETING_PC
#### BASE 比如 /meeting/


### 效果图如下
![dfb.gif](https://cdn.nlark.com/yuque/0/2019/gif/93166/1577075215732-22c51061-94a0-4e35-80ad-bd4b7a3a8fcc.gif#align=left&display=inline&height=820&name=dfb.gif&originHeight=820&originWidth=1440&size=5645519&status=done&style=none&width=1440)

### 当然，如果不需要改动的话，就一路回车，使用默认值
