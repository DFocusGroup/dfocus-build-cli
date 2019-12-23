# dfocus打包脚手架


### 首先要用这个cli打包，项目需要稍作改动
#### 1.需要在项目根目录下，新建base.json文件，如下
![image.png](https://cdn.nlark.com/yuque/0/2019/png/93166/1577083181212-566a20b7-3d02-419c-9459-f619ba613d0f.png#align=left&display=inline&height=814&name=image.png&originHeight=1628&originWidth=2666&size=495969&status=done&style=none&width=1333)

#### 2.在src 下面的utils里面的env.js 改动如下代码
![image.png](https://cdn.nlark.com/yuque/0/2019/png/93166/1577075613857-0c95faa7-07ea-4b90-992c-9c052be5aeee.png#align=left&display=inline&height=681&name=image.png&originHeight=1362&originWidth=2276&size=341946&status=done&style=none&width=1138)

#### 3.utils 里面的 config.js的base取值需改动，如下

![image.png](https://cdn.nlark.com/yuque/0/2019/png/93166/1577075792485-e9289749-bfc9-4ac0-943b-d088d6df5308.png#align=left&display=inline&height=662&name=image.png&originHeight=1324&originWidth=2266&size=507414&status=done&style=none&width=1133)
,
#### 4.  根目录下面的.roadhogrc.js里面的base取值方式，也需改动

![image.png](https://cdn.nlark.com/yuque/0/2019/png/93166/1577075938436-02a40c41-8182-4d10-bd96-f1c01cb3726a.png#align=left&display=inline&height=662&name=image.png&originHeight=1324&originWidth=2016&size=417596&status=done&style=none&width=1008)

### 注意
#### 1，2步骤，所有项目都要这样改动，但是3,4步骤，需要结合自己实际项目进行改动
#### 比如UMI项目，只需改动.umirc.js|ts 如下
![image.png](https://cdn.nlark.com/yuque/0/2019/png/93166/1577077110861-b0d8b2d1-687d-4872-b6b9-db2cf374360d.png#align=left&display=inline&height=580&name=image.png&originHeight=1160&originWidth=1890&size=303091&status=done&style=none&width=945)


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
![avatar](https://github.com/DFocusGroup/dfocus-build-cli/blob/master/doc/dfb.gif)
### 当然，如果不需要改动这个三个参数的话，就一路回车，使用默认值

### 这个脚手架为啥会出现

- 1.js写的大家都能维护，反正我对shell语法不感冒，虽然shell很简洁

- 2.有时间私有化部署的时候，用户不让部署到/目录下面，这样我们就需要手动改base，然后改动很少，但是改动，就意味你动了源码，有风险

-  3.有时间需要更改node title 我要更改两个地方，pkg里面要改动，shells文件下面的stop.sh 也需要改动，风险点和第二点一样