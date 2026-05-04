#!/bin/bash

# 成都天气应用部署脚本
# 适用于 Ubuntu/Debian 服务器

echo "========== 成都天气应用部署 =========="

# 1. 更新系统
echo "[1/5] 更新系统..."
apt update && apt upgrade -y

# 2. 安装 Nginx
echo "[2/5] 安装 Nginx..."
apt install -y nginx

# 3. 创建网站目录
echo "[3/5] 创建网站目录..."
mkdir -p /var/www/xm3

# 4. 复制构建文件 (本地执行)
# 请先在本机运行: npm run build
# 然后通过 FTP/SSH 上传 dist/ 目录内容到 /var/www/xm3/

# 5. 配置 Nginx
echo "[4/5] 配置 Nginx..."
cat > /etc/nginx/sites-available/xm3 << 'EOF'
server {
    listen 80;
    server_name _;
    
    root /var/www/xm3;
    index index.html;
    
    # Gzip 压缩
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
    gzip_min_length 1000;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # 缓存静态资源
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
EOF

# 启用站点
ln -sf /etc/nginx/sites-available/xm3 /etc/nginx/sites-enabled/

# 测试配置
nginx -t

# 重启 Nginx
systemctl restart nginx

# 6. 设置防火墙
echo "[5/5] 配置防火墙..."
ufw allow 22    # SSH
ufw allow 80    # HTTP
ufw allow 443   # HTTPS
ufw --force enable

echo "========== 部署完成 =========="
echo "请将 dist/ 目录内容上传到 /var/www/xm3/"
echo "访问: http://你的服务器IP"