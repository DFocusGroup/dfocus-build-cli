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
![avatar]('./doc/dfb (1).gif)
### 当然，如果不需要改动的话，就一路回车，使用默认值
