# Gym-management-system
# 💪 健身房管理系统微信小程序

> 一个完整的健身房服务解决方案，涵盖会员管理、课程预约与私教沟通功能  
> **技术栈**：WXML + WXSS + JavaScript + 微信云开发

[![小程序二维码](./assets/qrcode.jpg)](https://example.com)  
（扫码体验，需微信授权）

## 🏆 核心功能
| 功能模块         | 技术实现                                                                 | 交互亮点                     |
|------------------|--------------------------------------------------------------------------|------------------------------|
| **用户认证**     | 微信登录 + 云数据库用户档案                                              | JWT令牌自动续期              |
| **课程预约**     | 基于云函数的时段冲突检测                                                 | 可视化课程表（支持拖拽）     |
| **头像编辑**     | 腾讯云COS存储 + 图片裁剪组件                                             | 实时预览效果                 |
| **私教沟通**     | WebSocket长连接 + 消息模板推送                                           | 未读消息红点提醒             |
| **客服系统**     | 接入微信原生客服消息                                                     | 智能问题分类（NLP基础处理）  |

## 🎨 界面演示
<div align="center">
  <img src="./assets/gifs/ezgif.com-video-to-gif-converter.gif" width="400" height="300" alt="登录流程">
  </div>
  <div align="center">
  <img src="./assets/gifs/ezgif.com-video-to-gif-converter (1).gif" width="400" height="300" alt="课程预约">
     </div>
     <div align="center">
   <img src="./assets/gifs/ezgif.com-video-to-gif-converter (2).gif" width="200" alt="个人信息">
       </div>
  <div align="center">
       <img src="./assets/gifs/ezgif.com-video-to-gif-converter.gif(2)" width="200" alt="预约课程">
    </div>
    <div align="center">
  <img src="./assets/screenshots/chat.gif" width="200" alt="私教沟通，联系客服">
  </div>
    <div align="center">
  <img src="./assets/gifs/ezgif.com-video-to-gif-converter.gif(2)" width="200" alt="后台管理">
</div>

## ⚙️ 系统架构
```mermaid
graph TD
    A[前端] -->|微信API| B(云函数)
    B --> C[云数据库]
    B --> D[云存储]
    C --> E[数据分析看板]
    D --> F[CDN分发]
