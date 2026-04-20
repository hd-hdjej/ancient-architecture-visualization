// 3D 建筑效果展示

// 全局变量
let scene, camera, renderer, controls;
let currentModel = null;
let modelLoader = null;
let isInitialized = false; // 标记是否已初始化

// 初始化 3D 场景
function initThreeJS() {
    console.log('开始初始化 3D 场景...');
    
    // 检查容器是否存在
    const container = document.getElementById('building3D');
    if (!container) {
        console.error('3D 容器不存在！');
        return;
    }
    
    console.log('3D 容器存在，尺寸:', container.clientWidth, 'x', container.clientHeight);
    
    // 创建场景
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);
    
    // 创建相机
    camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.set(0, 5, 10);
    
    // 创建渲染器
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);
    
    console.log('渲染器创建成功');
    
    // 添加控制器
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;
    controls.minDistance = 5;
    controls.maxDistance = 50;
    
    console.log('控制器添加成功');
    
    // 添加灯光
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
    directionalLight.position.set(5, 10, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);
    
    // 添加辅助灯光
    const pointLight = new THREE.PointLight(0xffffff, 0.5);
    pointLight.position.set(-5, 5, -5);
    scene.add(pointLight);
    
    console.log('灯光添加成功');
    
    // 添加地面
    const groundGeometry = new THREE.PlaneGeometry(20, 20);
    const groundMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x888888,
        roughness: 0.8,
        metalness: 0.2
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -2;
    ground.receiveShadow = true;
    scene.add(ground);
    
    console.log('地面添加成功');
    
    // 添加网格辅助线
    const gridHelper = new THREE.GridHelper(20, 20, 0x444444, 0x666666);
    gridHelper.position.y = -1.99;
    scene.add(gridHelper);
    
    console.log('网格辅助线添加成功');
    
    // 初始化模型加载器 - 确保使用正确的加载器
    if (typeof THREE.GLTFLoader !== 'undefined') {
        modelLoader = new THREE.GLTFLoader();
        console.log('GLTFLoader 初始化成功');
        console.log('modelLoader 对象:', modelLoader);
        console.log('modelLoader 的 load 方法:', typeof modelLoader.load);
    } else {
        console.error('GLTFLoader 未加载！');
        console.error('THREE 对象:', THREE);
        console.error('THREE 对象的所有属性:', Object.keys(THREE));
    }
    
    // 响应式调整
    window.addEventListener('resize', onWindowResize);
    
    // 动画循环
    animate();
    
    // 设置初始化标记
    isInitialized = true;
    console.log('3D 场景初始化完成');
    
    // 加载默认模型
    loadDefaultModel();
}

// 窗口大小调整
function onWindowResize() {
    const container = document.getElementById('building3D');
    if (!container || !camera || !renderer) return;
    
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
}

// 动画循环
function animate() {
    requestAnimationFrame(animate);
    
    if (controls) {
        controls.update();
    }
    
    if (renderer && scene && camera) {
        renderer.render(scene, camera);
    }
}

// 加载默认模型
function loadDefaultModel() {
    console.log('加载默认模型...');
    // 使用绝对路径
    const basePath = window.location.origin + window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/'));
    console.log('基础路径:', basePath);
    loadModel('models/taihedian.glb');
}

// 加载模型
function loadModel(modelPath) {
    console.log('开始加载模型:', modelPath);
    console.log('当前状态 - 已初始化:', isInitialized, '加载器存在:', !!modelLoader);
    
    if (!isInitialized) {
        console.error('3D 场景未初始化，无法加载模型');
        return;
    }
    
    if (!modelLoader) {
        console.error('模型加载器未初始化');
        return;
    }
    
    // 移除当前模型
    if (currentModel) {
        scene.remove(currentModel);
        currentModel = null;
        console.log('已移除当前模型');
    }
    
    // 显示加载提示
    const container = document.getElementById('building3D');
    if (container) {
        // 先移除旧的加载提示
        const oldLoadingDiv = document.getElementById('model-loading-indicator');
        if (oldLoadingDiv) {
            oldLoadingDiv.remove();
        }
        
        const loadingDiv = document.createElement('div');
        loadingDiv.id = 'model-loading-indicator';
        loadingDiv.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(255, 255, 255, 0.9);
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            z-index: 100;
            text-align: center;
        `;
        loadingDiv.innerHTML = `
            <div id="loading-text" style="color: #333; margin-bottom: 10px; font-weight: bold;">正在加载模型...</div>
            <div style="width: 200px; height: 4px; background: #e0e0e0; border-radius: 2px; overflow: hidden;">
                <div id="progress-fill" style="width: 0%; height: 100%; background: #C23B22; transition: width 0.3s ease;"></div>
            </div>
        `;
        container.style.position = 'relative';
        container.appendChild(loadingDiv);
        console.log('显示加载提示');
    }
    
    // 直接使用相对路径加载
    console.log('Three.js 版本:', THREE.REVISION);
    console.log('GLTFLoader 类型:', typeof THREE.GLTFLoader);
    console.log('modelLoader 类型:', typeof modelLoader);
    
    modelLoader.load(
        modelPath,
        // 成功回调
        function(gltf) {
            console.log('模型加载成功回调');
            console.log('gltf 对象:', gltf);
            console.log('gltf.scene 对象:', gltf.scene);
            
            currentModel = gltf.scene;
            
            // 调整模型位置和大小
            adjustModel(currentModel);
            
            // 添加到场景
            scene.add(currentModel);
            
            // 隐藏加载提示
            const loadingDiv = document.getElementById('model-loading-indicator');
            if (loadingDiv) {
                loadingDiv.remove();
            }
            
            console.log('模型已成功添加到场景:', modelPath);
        },
        // 进度回调
        function(xhr) {
            console.log('加载进度回调:', xhr);
            if (xhr.total > 0) {
                const progress = (xhr.loaded / xhr.total) * 100;
                const progressFill = document.getElementById('progress-fill');
                if (progressFill) {
                    progressFill.style.width = progress + '%';
                }
                console.log('加载进度:', progress.toFixed(2) + '%');
            }
        },
        // 错误回调
        function(error) {
            console.error('模型加载失败:', error);
            console.error('错误类型:', typeof error);
            console.error('错误对象:', JSON.stringify(error, Object.getOwnPropertyNames(error)));
            
            // 隐藏加载提示
            const loadingDiv = document.getElementById('model-loading-indicator');
            if (loadingDiv) {
                let errorMessage = '模型加载失败！';
                if (error) {
                    if (typeof error === 'string') {
                        errorMessage += '<br><small style="color: #666;">' + error + '</small>';
                    } else if (error.message) {
                        errorMessage += '<br><small style="color: #666;">' + error.message + '</small>';
                    } else if (error.target && error.target.url) {
                        errorMessage += '<br><small style="color: #666;">无法加载：' + error.target.url + '</small>';
                    } else {
                        errorMessage += '<br><small style="color: #666;">未知错误，请查看控制台</small>';
                    }
                }
                loadingDiv.innerHTML = '<div style="color: #C23B22; font-weight: bold;">' + errorMessage + '</div>';
                // 不自动移除，让用户看到错误
            }
        }
    );
}

// 调整模型位置和大小
function adjustModel(model) {
    if (!model) return;
    
    // 计算模型边界
    const box = new THREE.Box3().setFromObject(model);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    
    // 计算缩放比例
    const maxSize = Math.max(size.x, size.y, size.z);
    const scale = 4 / maxSize;
    
    // 调整模型
    model.scale.set(scale, scale, scale);
    model.position.set(-center.x * scale, -box.min.y * scale, -center.z * scale);
    
    // 确保模型在地面之上
    const modelBox = new THREE.Box3().setFromObject(model);
    const modelMinY = modelBox.min.y;
    if (modelMinY < -2) {
        model.position.y += (-2 - modelMinY);
    }
}

// 加载自定义模型（全局函数）
function loadCustomModel(modelPath) {
    loadModel(modelPath);
}

// 重置相机
function resetCamera() {
    if (camera && controls) {
        camera.position.set(0, 5, 10);
        camera.lookAt(0, 0, 0);
        controls.reset();
    }
}

// 导出全局函数
window.initThreeJS = initThreeJS;
window.loadCustomModel = loadCustomModel;
window.resetCamera = resetCamera;
