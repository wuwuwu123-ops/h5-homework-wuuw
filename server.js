const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');

const PORT = 3000;
const BASE_DIR = __dirname;

const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.json': 'application/json',
    '.txt': 'text/plain'
};

const binaryExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico'];

function getMimeType(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    return mimeTypes[ext] || 'application/octet-stream';
}

function isBinary(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    return binaryExtensions.includes(ext);
}

function getLocalIPAddress() {
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]) {
            if (iface.family === 'IPv4' && !iface.internal) {
                return iface.address;
            }
        }
    }
    return 'localhost';
}

const server = http.createServer((req, res) => {
    let filePath = req.url === '/' ? '/index.html' : req.url;
    
    try {
        filePath = decodeURIComponent(filePath);
    } catch (e) {
        console.error('URL decode error:', e);
    }
    
    filePath = path.join(BASE_DIR, filePath);

    fs.exists(filePath, (exists) => {
        if (!exists) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('404 Not Found');
            return;
        }

        if (fs.statSync(filePath).isDirectory()) {
            filePath = path.join(filePath, 'index.html');
        }

        const mimeType = getMimeType(filePath);
        const isBin = isBinary(filePath);

        fs.readFile(filePath, (err, content) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('500 Internal Server Error');
                return;
            }

            res.writeHead(200, { 
                'Content-Type': mimeType,
                'Cache-Control': 'no-cache'
            });
            
            if (isBin) {
                res.end(content);
            } else {
                res.end(content, 'utf-8');
            }
        });
    });
});

server.listen(PORT, '0.0.0.0', () => {
    const localIP = getLocalIPAddress();
    const localUrl = `http://${localIP}:${PORT}/`;
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(localUrl)}`;
    
    console.log('========================================');
    console.log('🚀 服务器已启动！');
    console.log('----------------------------------------');
    console.log(`本机访问: http://localhost:${PORT}/`);
    console.log(`局域网访问: ${localUrl}`);
    console.log('----------------------------------------');
    console.log('📱 手机二维码访问:');
    console.log('请访问以下链接生成二维码，或直接用手机浏览器打开局域网地址:');
    console.log(qrUrl);
    console.log('========================================');
    console.log('⚠️  手机和电脑必须连接到同一个WiFi网络！');
});