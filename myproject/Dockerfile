#使用官方node.js镜像作为基础镜像
FROM node:20
# 安装 PostgreSQL 客户端
RUN apt-get update && apt-get install -y postgresql-client

 
# 设置工作目录
WORKDIR /usr/src/app
 
RUN npm install -g npm@latest

# 将 package.json 和 package-lock.json 复制到工作目录
COPY package*.json ./
 
# 安装依赖
RUN npm install  --verbose
 
# 将项目文件复制到工作目录
COPY . .

         

# 构建项目，生成 dist 文件夹
RUN npm run build

# 暴露应用端口
EXPOSE 3000
 
# 运行 NestJS 应用
CMD [ "npm", "run", "start:prod" ]