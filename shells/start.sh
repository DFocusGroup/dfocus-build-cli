#!/bin/sh

ssh -tt $1@$2<< remotessh    

bash $3


exit  ###不要忘记退出远程机器
remotessh  ###还有这里的结尾哦