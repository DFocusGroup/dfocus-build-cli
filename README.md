# dfocus打包脚手架


### 安装
```
npm i df-build-cli --save-dev
```


### 然后,在package.json的scripts里面加入

```
"build:prod": "dfb"
```

### 运行时有三个参数需要输入，INJECTED_MODULE，NODE_TITLE ，BASE
#### INJECTED_MODULE 比如  ads
#### NODE_TITLE 比如 DMEETING_PC
#### BASE 比如 /meeting/

![image.png](https://cdn.nlark.com/yuque/0/2019/png/93166/1577069073436-c3819cd7-8abd-4a9f-a8cb-90f13271b8a9.png#align=left&display=inline&height=820&name=image.png&originHeight=820&originWidth=1436&size=200226&status=done&style=none&width=1436)

### 当然，如果不需要改动的话，就一路回车，使用默认值