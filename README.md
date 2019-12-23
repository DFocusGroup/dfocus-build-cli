# dfocus打包脚手架


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
![dfb (1).gif](https://cdn.nlark.com/yuque/0/2019/gif/93166/1577070819963-eb95253a-3cfa-484f-9189-c720688a5364.gif#align=left&display=inline&height=820&name=dfb%20%281%29.gif&originHeight=820&originWidth=1436&size=8020908&status=done&style=none&width=1436)

### 当然，如果不需要改动的话，就一路回车，使用默认值
