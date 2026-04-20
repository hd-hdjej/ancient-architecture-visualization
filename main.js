/**
 * 中国古代建筑结构可视化 - 主逻辑
 */

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    console.log('中国古代建筑结构可视化项目初始化...');

    // 检查 ECharts 是否加载
    if (typeof echarts === 'undefined') {
        document.querySelector('.container').innerHTML = `
            <div class="loading">
                ECharts 库加载失败，请检查网络连接或刷新页面。
            </div>
        `;
        return;
    }

    try {
        // 初始化所有图表
        initCharts();
        console.log('所有图表初始化完成');
    } catch (error) {
        console.error('图表初始化失败:', error);
        alert('图表加载失败，请刷新页面重试。');
    }
});

// 导出图表功能
function exportCharts() {
    const message = document.createElement('div');
    message.innerHTML = `
        <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
                    background: white; padding: 30px; border-radius: 12px;
                    box-shadow: 0 10px 40px rgba(0,0,0,0.2); z-index: 1000;
                    max-width: 400px; text-align: center;">
            <h3 style="margin-bottom: 20px; color: #2c3e50;">导出图表</h3>
            <p style="margin-bottom: 20px; color: #666;">请选择要导出的图表：</p>
            <button onclick="exportChart('radarChart', '结构性能对比')" class="btn" style="margin: 5px;">雷达图</button>
            <button onclick="exportChart('barChart', '木材性能对比')" class="btn" style="margin: 5px;">柱状图</button>
            <button onclick="exportChart('lineChart', '历史演变')" class="btn" style="margin: 5px;">折线图</button>
            <button onclick="exportChart('scatterChart', '适用场景')" class="btn" style="margin: 5px;">散点图</button>
            <button onclick="closeModal()" class="btn btn-secondary" style="margin: 5px;">取消</button>
        </div>
        <div id="modal-overlay" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                                    background: rgba(0,0,0,0.5); z-index: 999;"></div>
    `;
    document.body.appendChild(message);
}

// 导出单个图表
function exportChart(chartId, title) {
    const chart = echarts.getInstanceByDom(document.getElementById(chartId));
    if (!chart) {
        alert('图表未找到');
        return;
    }

    try {
        const dataURL = chart.getDataURL({
            type: 'png',
            pixelRatio: 2,
            backgroundColor: '#fff'
        });

        // 创建下载链接
        const link = document.createElement('a');
        link.download = `中国古代建筑结构可视化_${title}_${new Date().toISOString().slice(0,10)}.png`;
        link.href = dataURL;
        link.click();

        closeModal();
        alert(`${title} 图表已导出！`);
    } catch (error) {
        console.error('导出失败:', error);
        alert('导出失败，请重试。');
    }
}

// 关闭模态框
function closeModal() {
    const modal = document.querySelector('div[style*="position: fixed"]');
    const overlay = document.getElementById('modal-overlay');
    if (modal) modal.remove();
    if (overlay) overlay.remove();
}

// 显示原始数据
function showData() {
    const modalContent = `
        <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
                    background: white; padding: 30px; border-radius: 12px;
                    box-shadow: 0 10px 40px rgba(0,0,0,0.2); z-index: 1000;
                    max-width: 600px; max-height: 80vh; overflow-y: auto;">
            <h3 style="margin-bottom: 20px; color: #2c3e50;">原始数据</h3>
            <div style="background: #f8f9fa; padding: 15px; border-radius: 6px; margin-bottom: 15px;">
                <strong>抬梁式性能数据：</strong>
                <pre style="margin-top: 10px; font-size: 12px;">${JSON.stringify(TAI_LIANG_DATA.performance, null, 2)}</pre>
            </div>
            <div style="background: #f8f9fa; padding: 15px; border-radius: 6px; margin-bottom: 15px;">
                <strong>穿斗式性能数据：</strong>
                <pre style="margin-top: 10px; font-size: 12px;">${JSON.stringify(CHUAN_DOU_DATA.performance, null, 2)}</pre>
            </div>
            <div style="background: #f8f9fa; padding: 15px; border-radius: 6px; margin-bottom: 15px;">
                <strong>木材性能数据：</strong>
                <pre style="margin-top: 10px; font-size: 12px;">${JSON.stringify(WOOD_PROPERTIES, null, 2)}</pre>
            </div>
            <button onclick="closeModal()" class="btn btn-secondary">关闭</button>
        </div>
        <div id="modal-overlay" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                                    background: rgba(0,0,0,0.5); z-index: 999;"></div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalContent);
}

// 键盘快捷键
document.addEventListener('keydown', function(e) {
    // ESC 关闭模态框
    if (e.key === 'Escape') {
        closeModal();
    }
});

// 打印页面
function printPage() {
    window.print();
}

// 检查浏览器支持
function checkBrowserSupport() {
    const features = {
        'Canvas API': !!document.createElement('canvas').getContext,
        'ES6': typeof Symbol !== 'undefined',
        'LocalStorage': typeof localStorage !== 'undefined',
        'JSON': typeof JSON !== 'undefined'
    };

    let allSupported = true;
    for (const [feature, supported] of Object.entries(features)) {
        if (!supported) {
            console.error(`浏览器不支持 ${feature}`);
            allSupported = false;
        }
    }

    return allSupported;
}

// 页面可见性变化时的处理
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        console.log('页面隐藏，暂停动画');
    } else {
        console.log('页面显示，恢复动画');
    }
});

console.log('主逻辑加载完成');
