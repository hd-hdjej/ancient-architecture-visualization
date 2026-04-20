// 仪表盘交互逻辑

// 全局变量
let currentBuildingIndex = 0;
let currentPeriodBuildings = [];
let currentPeriodIndex = 0;
let currentImageIndex = 0; // 当前图片索引

// DOM加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    // 初始化导航系统
    initNavigation();
    
    // 初始化模态框
    initModal();
    
    // 初始化建筑图片查看模态框
    initBuildingModal();
    
    // 初始化历史长河
    initHistoryTimeline();
    
    // 初始化 3D 场景
    console.log('检查 3D 场景初始化函数...');
    if (typeof initThreeJS === 'function') {
        console.log('initThreeJS 函数存在，开始初始化...');
        initThreeJS();
    } else {
        console.error('initThreeJS 函数不存在！请检查 threejs-init.js 是否正确加载');
    }
    
    // 初始化图表
    if (typeof initCharts === 'function') {
        initCharts();
    }
});

// 初始化导航系统
function initNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.section');
    const sectionTitle = document.getElementById('section-title');
    
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            const sectionId = this.getAttribute('data-section');
            
            // 更新导航项状态
            navItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
            
            // 更新内容区域
            sections.forEach(section => {
                if (section.id === sectionId) {
                    section.classList.add('active');
                    section.classList.remove('hidden');
                    // 更新标题
                    sectionTitle.textContent = this.querySelector('span').textContent;
                } else {
                    section.classList.remove('active');
                    section.classList.add('hidden');
                }
            });
        });
    });
    
    // 初始化技术卡片点击事件
    const techCards = document.querySelectorAll('.tech-card');
    techCards.forEach(card => {
        card.addEventListener('click', function() {
            const tech = this.getAttribute('data-tech');
            showTechDetail(tech);
        });
    });
    
    // 初始化布局卡片点击事件
    const layoutCards = document.querySelectorAll('.layout-card');
    layoutCards.forEach(card => {
        card.addEventListener('click', function() {
            const layout = this.getAttribute('data-layout');
            showLayoutDetail(layout);
        });
    });
    
    // 初始化成就卡片点击事件
    const achievementCards = document.querySelectorAll('.achievement-card');
    achievementCards.forEach(card => {
        card.addEventListener('click', function() {
            const achievement = this.getAttribute('data-achievement');
            showAchievementDetail(achievement);
        });
    });
}

// 初始化模态框
function initModal() {
    const modal = document.getElementById('detail-modal');
    const closeBtn = document.querySelector('.close');
    
    // 关闭模态框
    closeBtn.addEventListener('click', function() {
        modal.style.display = 'none';
    });
    
    // 点击模态框外部关闭
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
}

// 显示建筑详情
function showBuildingDetail(type) {
    const modal = document.getElementById('detail-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    
    // 建筑类型详情数据
    const buildingDetails = {
        palace: {
            title: '宫殿建筑',
            content: `
                <div style="color: #333; line-height: 1.8; font-family: '黑体', Arial, sans-serif;">
                    <h3 style="color: #C23B22; border-bottom: 2px solid #C23B22; padding-bottom: 10px; margin-bottom: 20px; font-weight: bold;">建筑特点</h3>
                    <p style="margin-bottom: 15px;">宫殿建筑是中国古代建筑中等级最高、规模最大的建筑类型，主要为帝王居住和处理政务的场所 <span style="font-size: 1.2em;">👑</span></p>
                    <p style="margin-bottom: 15px;">特点：规模宏大，布局严谨，中轴对称，体现等级制度，装饰华丽 <span style="font-size: 1.2em;">🏯</span></p>
                    
                    <h3 style="color: #C23B22; border-bottom: 2px solid #C23B22; padding-bottom: 10px; margin: 30px 0 20px; font-weight: bold;">代表作品</h3>
                    <ul style="list-style: none; padding: 0; margin-bottom: 20px;">
                        <li style="margin-bottom: 15px;"><span style="color: #C23B22; font-weight: bold;">紫禁城：</span>明清两代的皇宫，是中国古代宫殿建筑的巅峰之作 <span style="font-size: 1.2em;">✨</span><br>
                        <small style="color: #666; margin-left: 20px; font-size: 1em; font-family: '黑体', Arial, sans-serif;">小故事：紫禁城的建造历时14年，动用了大量人力物力，体现了中国古代建筑技术的高超水平。</small></li>
                        <li style="margin-bottom: 15px;"><span style="color: #C23B22; font-weight: bold;">阿房宫：</span>秦代宫殿，规模宏大，被誉为“天下第一宫” <span style="font-size: 1.2em;">🏛️</span><br>
                        <small style="color: #666; margin-left: 20px; font-size: 1em; font-family: '黑体', Arial, sans-serif;">案例：阿房宫的规模宏大，体现了秦代的强大国力和建筑技术的高度发展。</small></li>
                    </ul>
                    
                    <h3 style="color: #C23B22; border-bottom: 2px solid #C23B22; padding-bottom: 10px; margin: 30px 0 20px; font-weight: bold;">历史意义</h3>
                    <p style="margin-bottom: 15px;">宫殿建筑不仅是权力的象征，也是中国古代建筑技术和艺术的集中体现，反映了中国古代社会的等级制度和礼制文化 <span style="font-size: 1.2em;">📜</span></p>
                </div>
            `
        },
        temple: {
            title: '宗教建筑',
            content: `
                <div style="color: #333; line-height: 1.8; font-family: '黑体', Arial, sans-serif;">
                    <h3 style="color: #C23B22; border-bottom: 2px solid #C23B22; padding-bottom: 10px; margin-bottom: 20px; font-weight: bold;">建筑特点</h3>
                    <p style="margin-bottom: 15px;">宗教建筑是中国古代建筑的重要类型，包括寺庙、道观、佛塔等，融合了宗教信仰与建筑艺术 <span style="font-size: 1.2em;">🙏</span></p>
                    <p style="margin-bottom: 15px;">特点：布局严谨，装饰精美，体现宗教氛围，融合文化元素 <span style="font-size: 1.2em;">🕍</span></p>
                    
                    <h3 style="color: #C23B22; border-bottom: 2px solid #C23B22; padding-bottom: 10px; margin: 30px 0 20px; font-weight: bold;">代表作品</h3>
                    <ul style="list-style: none; padding: 0; margin-bottom: 20px;">
                        <li style="margin-bottom: 15px;"><span style="color: #C23B22; font-weight: bold;">佛光寺：</span>唐代木构建筑的典范，是中国现存最早的木结构建筑之一 <span style="font-size: 1.2em;">🏛️</span><br>
                        <small style="color: #666; margin-left: 20px; font-size: 1em; font-family: '黑体', Arial, sans-serif;">小故事：佛光寺东大殿的发现，为研究唐代建筑提供了重要的实物资料。</small></li>
                        <li style="margin-bottom: 15px;"><span style="color: #C23B22; font-weight: bold;">少林寺：</span>中国佛教禅宗祖庭，建筑风格独特 <span style="font-size: 1.2em;">🛕</span><br>
                        <small style="color: #666; margin-left: 20px; font-size: 1em; font-family: '黑体', Arial, sans-serif;">案例：少林寺的建筑融合了佛教文化和中国传统建筑艺术，是宗教建筑的典范。</small></li>
                    </ul>
                    
                    <h3 style="color: #C23B22; border-bottom: 2px solid #C23B22; padding-bottom: 10px; margin: 30px 0 20px; font-weight: bold;">历史意义</h3>
                    <p style="margin-bottom: 15px;">宗教建筑不仅是宗教活动的场所，也是中国古代建筑技术和艺术的重要载体，反映了中国古代宗教文化的发展 <span style="font-size: 1.2em;">🌟</span></p>
                </div>
            `
        },
        residential: {
            title: '民居建筑',
            content: `
                <div style="color: #333; line-height: 1.8; font-family: '黑体', Arial, sans-serif;">
                    <h3 style="color: #C23B22; border-bottom: 2px solid #C23B22; padding-bottom: 10px; margin-bottom: 20px; font-weight: bold;">建筑特点</h3>
                    <p style="margin-bottom: 15px;">民居建筑是中国古代建筑中最广泛的类型，适应不同地域的自然环境和生活方式 <span style="font-size: 1.2em;">🏠</span></p>
                    <p style="margin-bottom: 15px;">特点：因地制宜，形式多样，注重实用，体现地域文化 <span style="font-size: 1.2em;">🌍</span></p>
                    
                    <h3 style="color: #C23B22; border-bottom: 2px solid #C23B22; padding-bottom: 10px; margin: 30px 0 20px; font-weight: bold;">代表作品</h3>
                    <ul style="list-style: none; padding: 0; margin-bottom: 20px;">
                        <li style="margin-bottom: 15px;"><span style="color: #C23B22; font-weight: bold;">北京四合院：</span>北方传统民居的代表，布局严谨，体现家庭伦理 <span style="font-size: 1.2em;">🏘️</span><br>
                        <small style="color: #666; margin-left: 20px; font-size: 1em; font-family: '黑体', Arial, sans-serif;">小故事：北京四合院的布局体现了中国传统的家庭伦理观念，长幼有序，尊卑有别。</small></li>
                        <li style="margin-bottom: 15px;"><span style="color: #C23B22; font-weight: bold;">福建土楼：</span>聚族而居的防御性建筑，独特的圆形或方形布局 <span style="font-size: 1.2em;">🏯</span><br>
                        <small style="color: #666; margin-left: 20px; font-size: 1em; font-family: '黑体', Arial, sans-serif;">案例：福建土楼是中国传统民居的独特类型，体现了聚族而居的生活方式和防御需求。</small></li>
                    </ul>
                    
                    <h3 style="color: #C23B22; border-bottom: 2px solid #C23B22; padding-bottom: 10px; margin: 30px 0 20px; font-weight: bold;">历史意义</h3>
                    <p style="margin-bottom: 15px;">民居建筑反映了中国古代劳动人民的智慧和生活方式，是中国传统文化的重要组成部分 <span style="font-size: 1.2em;">💡</span></p>
                </div>
            `
        },
        garden: {
            title: '园林建筑',
            content: `
                <div style="color: #333; line-height: 1.8; font-family: '黑体', Arial, sans-serif;">
                    <h3 style="color: #C23B22; border-bottom: 2px solid #C23B22; padding-bottom: 10px; margin-bottom: 20px; font-weight: bold;">建筑特点</h3>
                    <p style="margin-bottom: 15px;">园林建筑是中国古代建筑的重要类型，包括皇家园林和私家园林，追求自然意境 <span style="font-size: 1.2em;">🌳</span></p>
                    <p style="margin-bottom: 15px;">特点：师法自然，因地制宜，精巧布局，意境深远 <span style="font-size: 1.2em;">🎋</span></p>
                    
                    <h3 style="color: #C23B22; border-bottom: 2px solid #C23B22; padding-bottom: 10px; margin: 30px 0 20px; font-weight: bold;">代表作品</h3>
                    <ul style="list-style: none; padding: 0; margin-bottom: 20px;">
                        <li style="margin-bottom: 15px;"><span style="color: #C23B22; font-weight: bold;">颐和园：</span>清代皇家园林，是中国古典园林的代表作 <span style="font-size: 1.2em;">🌸</span><br>
                        <small style="color: #666; margin-left: 20px; font-size: 1em; font-family: '黑体', Arial, sans-serif;">小故事：颐和园是乾隆皇帝为孝敬母亲而修建的，融合了江南园林的精巧和北方园林的大气。</small></li>
                        <li style="margin-bottom: 15px;"><span style="color: #C23B22; font-weight: bold;">拙政园：</span>江南私家园林的代表，以水为中心，布局精巧 <span style="font-size: 1.2em;">🌊</span><br>
                        <small style="color: #666; margin-left: 20px; font-size: 1em; font-family: '黑体', Arial, sans-serif;">案例：拙政园的布局精巧，体现了中国传统园林的美学思想，是江南园林的典范。</small></li>
                    </ul>
                    
                    <h3 style="color: #C23B22; border-bottom: 2px solid #C23B22; padding-bottom: 10px; margin: 30px 0 20px; font-weight: bold;">历史意义</h3>
                    <p style="margin-bottom: 15px;">园林建筑体现了中国古代文人的审美追求和哲学思想，是中国传统文化的重要载体 <span style="font-size: 1.2em;">📚</span></p>
                </div>
            `
        },
        bridge: {
            title: '桥梁建筑',
            content: `
                <div style="color: #333; line-height: 1.8; font-family: '黑体', Arial, sans-serif;">
                    <h3 style="color: #C23B22; border-bottom: 2px solid #C23B22; padding-bottom: 10px; margin-bottom: 20px; font-weight: bold;">建筑特点</h3>
                    <p style="margin-bottom: 15px;">桥梁建筑是中国古代建筑的重要类型，体现了中国古代工匠的结构智慧 <span style="font-size: 1.2em;">🌉</span></p>
                    <p style="margin-bottom: 15px;">特点：结构合理，造型优美，因地制宜，技术先进 <span style="font-size: 1.2em;">🔧</span></p>
                    
                    <h3 style="color: #C23B22; border-bottom: 2px solid #C23B22; padding-bottom: 10px; margin: 30px 0 20px; font-weight: bold;">代表作品</h3>
                    <ul style="list-style: none; padding: 0; margin-bottom: 20px;">
                        <li style="margin-bottom: 15px;"><span style="color: #C23B22; font-weight: bold;">赵州桥：</span>隋代石拱桥，是世界上最早的敞肩拱桥，至今仍在使用 <span style="font-size: 1.2em;">🏗️</span><br>
                        <small style="color: #666; margin-left: 20px; font-size: 1em; font-family: '黑体', Arial, sans-serif;">小故事：赵州桥由隋代工匠李春设计建造，距今已有1400多年的历史，是中国古代桥梁建筑的杰作。</small></li>
                        <li style="margin-bottom: 15px;"><span style="color: #C23B22; font-weight: bold;">卢沟桥：</span>金代石拱桥，以其精美的石狮雕刻闻名 <span style="font-size: 1.2em;">🦁</span><br>
                        <small style="color: #666; margin-left: 20px; font-size: 1em; font-family: '黑体', Arial, sans-serif;">案例：卢沟桥的石狮雕刻精美，形态各异，体现了中国古代雕刻艺术的高超水平。</small></li>
                    </ul>
                    
                    <h3 style="color: #C23B22; border-bottom: 2px solid #C23B22; padding-bottom: 10px; margin: 30px 0 20px; font-weight: bold;">历史意义</h3>
                    <p style="margin-bottom: 15px;">桥梁建筑不仅是交通设施，也是中国古代建筑技术的重要体现，反映了中国古代工匠的智慧和创造力 <span style="font-size: 1.2em;">💪</span></p>
                </div>
            `
        },
        tomb: {
            title: '陵墓建筑',
            content: `
                <div style="color: #333; line-height: 1.8; font-family: '黑体', Arial, sans-serif;">
                    <h3 style="color: #C23B22; border-bottom: 2px solid #C23B22; padding-bottom: 10px; margin-bottom: 20px; font-weight: bold;">建筑特点</h3>
                    <p style="margin-bottom: 15px;">陵墓建筑是中国古代建筑的重要类型，主要为帝王和贵族的墓葬 <span style="font-size: 1.2em;">🏛️</span></p>
                    <p style="margin-bottom: 15px;">特点：规模宏大，布局严谨，等级分明，装饰华丽 <span style="font-size: 1.2em;">👑</span></p>
                    
                    <h3 style="color: #C23B22; border-bottom: 2px solid #C23B22; padding-bottom: 10px; margin: 30px 0 20px; font-weight: bold;">代表作品</h3>
                    <ul style="list-style: none; padding: 0; margin-bottom: 20px;">
                        <li style="margin-bottom: 15px;"><span style="color: #C23B22; font-weight: bold;">秦始皇陵：</span>中国历史上第一个皇帝陵园，规模宏大 <span style="font-size: 1.2em;">🏯</span><br>
                        <small style="color: #666; margin-left: 20px; font-size: 1em; font-family: '黑体', Arial, sans-serif;">小故事：秦始皇陵的建造历时39年，动用了70多万劳动力，是中国古代陵墓建筑的杰作。</small></li>
                        <li style="margin-bottom: 15px;"><span style="color: #C23B22; font-weight: bold;">明十三陵：</span>明代帝王陵墓群，布局严谨，气势恢宏 <span style="font-size: 1.2em;">🌟</span><br>
                        <small style="color: #666; margin-left: 20px; font-size: 1em; font-family: '黑体', Arial, sans-serif;">案例：明十三陵的布局严谨，气势恢宏，体现了明代的丧葬制度和建筑技术。</small></li>
                    </ul>
                    
                    <h3 style="color: #C23B22; border-bottom: 2px solid #C23B22; padding-bottom: 10px; margin: 30px 0 20px; font-weight: bold;">历史意义</h3>
                    <p style="margin-bottom: 15px;">陵墓建筑反映了中国古代的生死观念和等级制度，是中国古代建筑技术和艺术的重要体现 <span style="font-size: 1.2em;">📜</span></p>
                </div>
            `
        }
    };
    
    // 显示详情
    modalTitle.textContent = buildingDetails[type].title;
    modalBody.innerHTML = buildingDetails[type].content;
    modal.style.display = 'block';
}

// 显示技术详情
function showTechDetail(tech) {
    const modal = document.getElementById('detail-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    
    // 技术详情数据
    const techDetails = {
        'wood-frame': {
            title: '木构架体系',
            content: `
                <div style="color: #333; line-height: 1.8; font-family: '黑体', Arial, sans-serif;">
                    <h3 style="color: #C23B22; border-bottom: 2px solid #C23B22; padding-bottom: 10px; margin-bottom: 20px; font-weight: bold;">技术原理</h3>
                    <p style="margin-bottom: 15px;"><span style="color: #C23B22; font-weight: bold;">核心概念：</span>木构架体系是中国古代建筑的核心结构，以木材为主要材料，通过榫卯连接形成框架结构。 <span style="font-size: 1.2em;">🪵</span></p>
                    <p style="margin-bottom: 15px;"><span style="color: #C23B22; font-weight: bold;">特点：</span>抗震性能优异，施工灵活，易于维修。 <span style="font-size: 1.2em;">🏗️</span></p>
                    
                    <h3 style="color: #C23B22; border-bottom: 2px solid #C23B22; padding-bottom: 10px; margin: 30px 0 20px; font-weight: bold;">历史演变</h3>
                    <ul style="list-style: none; padding: 0; margin-bottom: 20px;">
                        <li style="margin-bottom: 15px;"><span style="color: #C23B22; font-weight: bold;">原始社会：</span>简单木结构开始出现 <span style="font-size: 1.2em;">🌳</span><br>
                        <small style="color: #666; margin-left: 20px; font-size: 1em; font-family: '黑体', Arial, sans-serif;">小故事：原始人类利用天然木材搭建简单的居住结构，这是木构架体系的萌芽。</small></li>
                        <li style="margin-bottom: 15px;"><span style="color: #C23B22; font-weight: bold;">秦汉时期：</span>木构架体系基本形成 <span style="font-size: 1.2em;">🏯</span><br>
                        <small style="color: #666; margin-left: 20px; font-size: 1em; font-family: '黑体', Arial, sans-serif;">案例：秦汉时期的宫殿建筑已经采用了成熟的木构架体系，如未央宫的建筑结构。</small></li>
                        <li style="margin-bottom: 15px;"><span style="color: #C23B22; font-weight: bold;">隋唐时期：</span>技术成熟，规模宏大 <span style="font-size: 1.2em;">🌟</span><br>
                        <small style="color: #666; margin-left: 20px; font-size: 1em; font-family: '黑体', Arial, sans-serif;">小故事：唐代的大明宫含元殿采用了庞大的木构架结构，体现了当时木构架技术的高度成熟。</small></li>
                        <li style="margin-bottom: 15px;"><span style="color: #C23B22; font-weight: bold;">明清时期：</span>高度成熟，规范化 <span style="font-size: 1.2em;">✨</span><br>
                        <small style="color: #666; margin-left: 20px; font-size: 1em; font-family: '黑体', Arial, sans-serif;">案例：明清时期的紫禁城采用了严格规范的木构架体系，体现了木构架技术的高度成熟。</small></li>
                    </ul>
                    
                    <h3 style="color: #C23B22; border-bottom: 2px solid #C23B22; padding-bottom: 10px; margin: 30px 0 20px; font-weight: bold;">应用实例</h3>
                    <ul style="list-style: none; padding: 0;">
                        <li style="margin-bottom: 15px;"><span style="color: #C23B22; font-weight: bold;">佛光寺东大殿：</span>唐代木构建筑的典范 <span style="font-size: 1.2em;">🏛️</span><br>
                        <small style="color: #666; margin-left: 20px; font-size: 1em; font-family: '黑体', Arial, sans-serif;">佛光寺东大殿是中国现存最早的木结构建筑之一，体现了唐代木构架技术的高超水平。</small></li>
                        <li style="margin-bottom: 15px;"><span style="color: #C23B22; font-weight: bold;">紫禁城：</span>明清两代的皇宫，木构架体系的巅峰之作 <span style="font-size: 1.2em;">👑</span><br>
                        <small style="color: #666; margin-left: 20px; font-size: 1em; font-family: '黑体', Arial, sans-serif;">紫禁城的木构架体系设计精巧，施工精湛，是中国古代木构架建筑的巅峰之作。</small></li>
                    </ul>
                </div>
            `
        },
        dougong: {
            title: '斗拱',
            content: `
                <div style="color: #333; line-height: 1.8; font-family: '黑体', Arial, sans-serif;">
                    <h3 style="color: #C23B22; border-bottom: 2px solid #C23B22; padding-bottom: 10px; margin-bottom: 20px; font-weight: bold;">技术原理</h3>
                    <p style="margin-bottom: 15px;"><span style="color: #C23B22; font-weight: bold;">核心概念：</span>斗拱是中国古代建筑特有的结构构件，位于柱与梁之间，兼具结构和装饰功能。 <span style="font-size: 1.2em;">🔧</span></p>
                    <p style="margin-bottom: 15px;"><span style="color: #C23B22; font-weight: bold;">特点：</span>传递荷载，抗震减震，装饰美观。 <span style="font-size: 1.2em;">⚖️</span></p>
                    
                    <h3 style="color: #C23B22; border-bottom: 2px solid #C23B22; padding-bottom: 10px; margin: 30px 0 20px; font-weight: bold;">历史演变</h3>
                    <ul style="list-style: none; padding: 0; margin-bottom: 20px;">
                        <li style="margin-bottom: 15px;"><span style="color: #C23B22; font-weight: bold;">西周时期：</span>斗拱开始出现 <span style="font-size: 1.2em;">🏛️</span><br>
                        <small style="color: #666; margin-left: 20px; font-size: 1em; font-family: '黑体', Arial, sans-serif;">小故事：西周时期的建筑遗址中已经发现了斗拱的雏形，这是斗拱技术的起源。</small></li>
                        <li style="margin-bottom: 15px;"><span style="color: #C23B22; font-weight: bold;">秦汉时期：</span>斗拱结构基本形成 <span style="font-size: 1.2em;">🏯</span><br>
                        <small style="color: #666; margin-left: 20px; font-size: 1em; font-family: '黑体', Arial, sans-serif;">案例：秦汉时期的建筑中，斗拱已经成为重要的结构构件，发挥着传递荷载的作用。</small></li>
                        <li style="margin-bottom: 15px;"><span style="color: #C23B22; font-weight: bold;">隋唐时期：</span>斗拱宏大，结构作用明显 <span style="font-size: 1.2em;">🌟</span><br>
                        <small style="color: #666; margin-left: 20px; font-size: 1em; font-family: '黑体', Arial, sans-serif;">小故事：唐代的斗拱尺寸宏大，结构作用明显，体现了斗拱技术的成熟。</small></li>
                        <li style="margin-bottom: 15px;"><span style="color: #C23B22; font-weight: bold;">明清时期：</span>斗拱变小，装饰作用增强 <span style="font-size: 1.2em;">✨</span><br>
                        <small style="color: #666; margin-left: 20px; font-size: 1em; font-family: '黑体', Arial, sans-serif;">案例：明清时期的斗拱尺寸变小，装饰作用增强，成为建筑装饰的重要元素。</small></li>
                    </ul>
                    
                    <h3 style="color: #C23B22; border-bottom: 2px solid #C23B22; padding-bottom: 10px; margin: 30px 0 20px; font-weight: bold;">应用实例</h3>
                    <ul style="list-style: none; padding: 0;">
                        <li style="margin-bottom: 15px;"><span style="color: #C23B22; font-weight: bold;">佛光寺东大殿：</span>唐代斗拱的典范 <span style="font-size: 1.2em;">🏛️</span><br>
                        <small style="color: #666; margin-left: 20px; font-size: 1em; font-family: '黑体', Arial, sans-serif;">佛光寺东大殿的斗拱宏大而精巧，体现了唐代斗拱技术的高超水平。</small></li>
                        <li style="margin-bottom: 15px;"><span style="color: #C23B22; font-weight: bold;">应县木塔：</span>辽代木塔，斗拱结构复杂 <span style="font-size: 1.2em;">🏯</span><br>
                        <small style="color: #666; margin-left: 20px; font-size: 1em; font-family: '黑体', Arial, sans-serif;">应县木塔使用了大量复杂的斗拱结构，是中国古代斗拱技术的杰出代表。</small></li>
                    </ul>
                </div>
            `
        },
        sunmao: {
            title: '榫卯',
            content: `
                <div style="color: #333; line-height: 1.8; font-family: '黑体', Arial, sans-serif;">
                    <h3 style="color: #C23B22; border-bottom: 2px solid #C23B22; padding-bottom: 10px; margin-bottom: 20px; font-weight: bold;">技术原理</h3>
                    <p style="margin-bottom: 15px;"><span style="color: #C23B22; font-weight: bold;">核心概念：</span>榫卯是中国传统木工技艺，通过榫头和卯眼的配合实现木材的连接，不用钉子。 <span style="font-size: 1.2em;">🔗</span></p>
                    <p style="margin-bottom: 15px;"><span style="color: #C23B22; font-weight: bold;">特点：</span>结构牢固，拆装方便，抗震性能好。 <span style="font-size: 1.2em;">🛠️</span></p>
                    
                    <h3 style="color: #C23B22; border-bottom: 2px solid #C23B22; padding-bottom: 10px; margin: 30px 0 20px; font-weight: bold;">历史演变</h3>
                    <ul style="list-style: none; padding: 0; margin-bottom: 20px;">
                        <li style="margin-bottom: 15px;"><span style="color: #C23B22; font-weight: bold;">原始社会：</span>简单榫卯开始出现 <span style="font-size: 1.2em;">🌳</span><br>
                        <small style="color: #666; margin-left: 20px; font-size: 1em; font-family: '黑体', Arial, sans-serif;">小故事：原始人类在制作工具和简单结构时，已经开始使用简单的榫卯连接方式。</small></li>
                        <li style="margin-bottom: 15px;"><span style="color: #C23B22; font-weight: bold;">商周时期：</span>榫卯技术基本成熟 <span style="font-size: 1.2em;">🏛️</span><br>
                        <small style="color: #666; margin-left: 20px; font-size: 1em; font-family: '黑体', Arial, sans-serif;">案例：商周时期的青铜器和木器中已经出现了复杂的榫卯结构，体现了榫卯技术的成熟。</small></li>
                        <li style="margin-bottom: 15px;"><span style="color: #C23B22; font-weight: bold;">秦汉时期：</span>榫卯技术广泛应用 <span style="font-size: 1.2em;">🏯</span><br>
                        <small style="color: #666; margin-left: 20px; font-size: 1em; font-family: '黑体', Arial, sans-serif;">小故事：秦汉时期的建筑中，榫卯技术得到广泛应用，成为木构架体系的重要组成部分。</small></li>
                        <li style="margin-bottom: 15px;"><span style="color: #C23B22; font-weight: bold;">明清时期：</span>榫卯技术高度成熟 <span style="font-size: 1.2em;">✨</span><br>
                        <small style="color: #666; margin-left: 20px; font-size: 1em; font-family: '黑体', Arial, sans-serif;">案例：明清时期的家具和建筑中，榫卯技术达到了很高的水平，结构精巧，连接牢固。</small></li>
                    </ul>
                    
                    <h3 style="color: #C23B22; border-bottom: 2px solid #C23B22; padding-bottom: 10px; margin: 30px 0 20px; font-weight: bold;">应用实例</h3>
                    <ul style="list-style: none; padding: 0;">
                        <li style="margin-bottom: 15px;"><span style="color: #C23B22; font-weight: bold;">应县木塔：</span>全塔不用一钉一铆，靠榫卯连接 <span style="font-size: 1.2em;">🏯</span><br>
                        <small style="color: #666; margin-left: 20px; font-size: 1em; font-family: '黑体', Arial, sans-serif;">应县木塔全塔不用一钉一铆，完全依靠榫卯连接，体现了榫卯技术的高超水平。</small></li>
                        <li style="margin-bottom: 15px;"><span style="color: #C23B22; font-weight: bold;">紫禁城：</span>大量使用榫卯技术 <span style="font-size: 1.2em;">👑</span><br>
                        <small style="color: #666; margin-left: 20px; font-size: 1em; font-family: '黑体', Arial, sans-serif;">紫禁城中的木构架结构大量使用榫卯技术，保证了建筑的牢固和稳定性。</small></li>
                    </ul>
                </div>
            `
        },
        'brick-tile': {
            title: '砖瓦技术',
            content: `
                <div style="color: #333; line-height: 1.8; font-family: '黑体', Arial, sans-serif;">
                    <h3 style="color: #C23B22; border-bottom: 2px solid #C23B22; padding-bottom: 10px; margin-bottom: 20px; font-weight: bold;">技术原理</h3>
                    <p style="margin-bottom: 15px;"><span style="color: #C23B22; font-weight: bold;">核心概念：</span>砖瓦技术是中国古代建筑的重要材料技术，包括制砖、制瓦、砌筑等工艺。 <span style="font-size: 1.2em;">🧱</span></p>
                    <p style="margin-bottom: 15px;"><span style="color: #C23B22; font-weight: bold;">特点：</span>坚固耐用，防水防火，装饰美观。 <span style="font-size: 1.2em;">🛡️</span></p>
                    
                    <h3 style="color: #C23B22; border-bottom: 2px solid #C23B22; padding-bottom: 10px; margin: 30px 0 20px; font-weight: bold;">历史演变</h3>
                    <ul style="list-style: none; padding: 0; margin-bottom: 20px;">
                        <li style="margin-bottom: 15px;"><span style="color: #C23B22; font-weight: bold;">西周时期：</span>砖瓦开始出现 <span style="font-size: 1.2em;">🏛️</span><br>
                        <small style="color: #666; margin-left: 20px; font-size: 1em; font-family: '黑体', Arial, sans-serif;">小故事：西周时期已经开始使用砖瓦作为建筑材料，这是砖瓦技术的起源。</small></li>
                        <li style="margin-bottom: 15px;"><span style="color: #C23B22; font-weight: bold;">秦汉时期：</span>砖瓦技术成熟，广泛应用 <span style="font-size: 1.2em;">🏯</span><br>
                        <small style="color: #666; margin-left: 20px; font-size: 1em; font-family: '黑体', Arial, sans-serif;">案例：秦汉时期的建筑中，砖瓦技术得到广泛应用，如长城的砖砌筑。</small></li>
                        <li style="margin-bottom: 15px;"><span style="color: #C23B22; font-weight: bold;">隋唐时期：</span>砖瓦质量提高，装饰性增强 <span style="font-size: 1.2em;">🌟</span><br>
                        <small style="color: #666; margin-left: 20px; font-size: 1em; font-family: '黑体', Arial, sans-serif;">小故事：唐代的砖瓦质量提高，装饰性增强，如彩色琉璃瓦的使用。</small></li>
                        <li style="margin-bottom: 15px;"><span style="color: #C23B22; font-weight: bold;">明清时期：</span>砖瓦技术高度成熟，品种丰富 <span style="font-size: 1.2em;">✨</span><br>
                        <small style="color: #666; margin-left: 20px; font-size: 1em; font-family: '黑体', Arial, sans-serif;">案例：明清时期的砖瓦技术高度成熟，品种丰富，如紫禁城的琉璃瓦。</small></li>
                    </ul>
                    
                    <h3 style="color: #C23B22; border-bottom: 2px solid #C23B22; padding-bottom: 10px; margin: 30px 0 20px; font-weight: bold;">应用实例</h3>
                    <ul style="list-style: none; padding: 0;">
                        <li style="margin-bottom: 15px;"><span style="color: #C23B22; font-weight: bold;">长城：</span>大量使用砖砌筑 <span style="font-size: 1.2em;">🏞️</span><br>
                        <small style="color: #666; margin-left: 20px; font-size: 1em; font-family: '黑体', Arial, sans-serif;">长城的修筑大量使用了砖砌筑技术，体现了砖瓦技术的广泛应用。</small></li>
                        <li style="margin-bottom: 15px;"><span style="color: #C23B22; font-weight: bold;">紫禁城：</span>琉璃瓦的典范 <span style="font-size: 1.2em;">👑</span><br>
                        <small style="color: #666; margin-left: 20px; font-size: 1em; font-family: '黑体', Arial, sans-serif;">紫禁城的屋顶使用了大量的琉璃瓦，色彩鲜艳，装饰精美，体现了砖瓦技术的高度成熟。</small></li>
                    </ul>
                </div>
            `
        }
    };
    
    // 显示详情
    modalTitle.textContent = techDetails[tech].title;
    modalBody.innerHTML = techDetails[tech].content;
    modal.style.display = 'block';
}

// 显示布局详情
function showLayoutDetail(layout) {
    const modal = document.getElementById('detail-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    
    // 布局详情数据
    const layoutDetails = {
        'axis-symmetry': {
            title: '中轴对称',
            content: `
                <div style="color: #333; line-height: 1.8; font-family: '黑体', Arial, sans-serif;">
                    <h3 style="color: #C23B22; border-bottom: 2px solid #C23B22; padding-bottom: 10px; margin-bottom: 20px; font-weight: bold;">布局原理</h3>
                    <p style="margin-bottom: 15px;"><span style="color: #C23B22; font-weight: bold;">核心概念：</span>中轴对称是中国古代建筑的重要布局原则，以中轴线为中心，左右对称布局。 <span style="font-size: 1.2em;">🏯</span></p>
                    <p style="margin-bottom: 15px;"><span style="color: #C23B22; font-weight: bold;">特点：</span>秩序井然，等级分明，体现礼制。 <span style="font-size: 1.2em;">⚖️</span></p>
                    
                    <h3 style="color: #C23B22; border-bottom: 2px solid #C23B22; padding-bottom: 10px; margin: 30px 0 20px; font-weight: bold;">历史演变</h3>
                    <ul style="list-style: none; padding: 0; margin-bottom: 20px;">
                        <li style="margin-bottom: 15px;"><span style="color: #C23B22; font-weight: bold;">夏商周时期：</span>中轴对称布局开始出现 <span style="font-size: 1.2em;">🏛️</span><br>
                        <small style="color: #666; margin-left: 20px; font-size: 1em; font-family: '黑体', Arial, sans-serif;">小故事：二里头遗址的宫殿基址是中国最早的宫殿遗址之一，已经出现了明确的中轴线布局，为后世宫殿建筑奠定了基础。</small></li>
                        <li style="margin-bottom: 15px;"><span style="color: #C23B22; font-weight: bold;">秦汉时期：</span>中轴对称布局基本形成 <span style="font-size: 1.2em;">🏯</span><br>
                        <small style="color: #666; margin-left: 20px; font-size: 1em; font-family: '黑体', Arial, sans-serif;">案例：秦咸阳宫、汉未央宫都采用了严格的中轴对称布局，体现了大一统王朝的威严。</small></li>
                        <li style="margin-bottom: 15px;"><span style="color: #C23B22; font-weight: bold;">隋唐时期：</span>中轴对称布局成熟，规模宏大 <span style="font-size: 1.2em;">🌟</span><br>
                        <small style="color: #666; margin-left: 20px; font-size: 1em; font-family: '黑体', Arial, sans-serif;">小故事：唐长安城以朱雀大街为中轴线，将城市分为东西对称的两部分，是中国古代城市规划的典范。</small></li>
                        <li style="margin-bottom: 15px;"><span style="color: #C23B22; font-weight: bold;">明清时期：</span>中轴对称布局高度规范化 <span style="font-size: 1.2em;">✨</span><br>
                        <small style="color: #666; margin-left: 20px; font-size: 1em; font-family: '黑体', Arial, sans-serif;">案例：紫禁城的中轴线从午门延伸至神武门，全长约1.6公里，两侧建筑严格对称，体现了皇家建筑的庄严与秩序。</small></li>
                    </ul>
                    
                    <h3 style="color: #C23B22; border-bottom: 2px solid #C23B22; padding-bottom: 10px; margin: 30px 0 20px; font-weight: bold;">应用实例</h3>
                    <ul style="list-style: none; padding: 0;">
                        <li style="margin-bottom: 15px;"><span style="color: #C23B22; font-weight: bold;">紫禁城：</span>严格的中轴对称布局 <span style="font-size: 1.2em;">👑</span><br>
                        <small style="color: #666; margin-left: 20px; font-size: 1em; font-family: '黑体', Arial, sans-serif;">紫禁城的中轴线布局不仅体现了皇权的至高无上，也反映了中国传统文化中“居中为尊”的思想。</small></li>
                        <li style="margin-bottom: 15px;"><span style="color: #C23B22; font-weight: bold;">孔庙：</span>中轴对称布局的典范 <span style="font-size: 1.2em;">📚</span><br>
                        <small style="color: #666; margin-left: 20px; font-size: 1em; font-family: '黑体', Arial, sans-serif;">曲阜孔庙的中轴线布局体现了对孔子的尊崇，从棂星门到大成殿，层次分明，秩序井然。</small></li>
                    </ul>
                </div>
            `
        },
        hierarchy: {
            title: '等级制度',
            content: `
                <div style="color: #333; line-height: 1.8; font-family: '黑体', Arial, sans-serif;">
                    <h3 style="color: #C23B22; border-bottom: 2px solid #C23B22; padding-bottom: 10px; margin-bottom: 20px; font-weight: bold;">布局原理</h3>
                    <p style="margin-bottom: 15px;"><span style="color: #C23B22; font-weight: bold;">核心概念：</span>等级制度是中国古代建筑的重要特征，通过建筑的规模、形式、装饰等体现社会等级。 <span style="font-size: 1.2em;">👑</span></p>
                    <p style="margin-bottom: 15px;"><span style="color: #C23B22; font-weight: bold;">特点：</span>严格的等级规定，体现社会秩序。 <span style="font-size: 1.2em;">📜</span></p>
                    
                    <h3 style="color: #C23B22; border-bottom: 2px solid #C23B22; padding-bottom: 10px; margin: 30px 0 20px; font-weight: bold;">历史演变</h3>
                    <ul style="list-style: none; padding: 0; margin-bottom: 20px;">
                        <li style="margin-bottom: 15px;"><span style="color: #C23B22; font-weight: bold;">夏商周时期：</span>等级制度开始形成 <span style="font-size: 1.2em;">🏛️</span><br>
                        <small style="color: #666; margin-left: 20px; font-size: 1em; font-family: '黑体', Arial, sans-serif;">小故事：周代的《考工记》中已经对不同等级的建筑规模和形式有了明确规定，体现了早期的等级制度。</small></li>
                        <li style="margin-bottom: 15px;"><span style="color: #C23B22; font-weight: bold;">秦汉时期：</span>等级制度基本确立 <span style="font-size: 1.2em;">⚔️</span><br>
                        <small style="color: #666; margin-left: 20px; font-size: 1em; font-family: '黑体', Arial, sans-serif;">案例：秦汉时期的宫殿建筑规模宏大，而民居建筑则受到严格限制，体现了鲜明的等级差异。</small></li>
                        <li style="margin-bottom: 15px;"><span style="color: #C23B22; font-weight: bold;">隋唐时期：</span>等级制度成熟，规定详细 <span style="font-size: 1.2em;">📋</span><br>
                        <small style="color: #666; margin-left: 20px; font-size: 1em; font-family: '黑体', Arial, sans-serif;">小故事：唐代的《营缮令》对不同等级官员的住宅规模、装饰等都有详细规定，形成了完整的等级制度体系。</small></li>
                        <li style="margin-bottom: 15px;"><span style="color: #C23B22; font-weight: bold;">明清时期：</span>等级制度高度规范化 <span style="font-size: 1.2em;">🎯</span><br>
                        <small style="color: #666; margin-left: 20px; font-size: 1em; font-family: '黑体', Arial, sans-serif;">案例：明清时期的建筑等级制度更加严格，从屋顶形式、开间数量到装饰色彩都有明确规定，不可逾越。</small></li>
                    </ul>
                    
                    <h3 style="color: #C23B22; border-bottom: 2px solid #C23B22; padding-bottom: 10px; margin: 30px 0 20px; font-weight: bold;">应用实例</h3>
                    <ul style="list-style: none; padding: 0;">
                        <li style="margin-bottom: 15px;"><span style="color: #C23B22; font-weight: bold;">紫禁城：</span>严格的等级制度体现 <span style="font-size: 1.2em;">🏯</span><br>
                        <small style="color: #666; margin-left: 20px; font-size: 1em; font-family: '黑体', Arial, sans-serif;">紫禁城的太和殿是等级最高的建筑，采用重檐庑殿顶，开间数最多，装饰最华丽，体现了皇权的至高无上。</small></li>
                        <li style="margin-bottom: 15px;"><span style="color: #C23B22; font-weight: bold;">民居：</span>根据社会地位不同，建筑规模和形式有严格规定 <span style="font-size: 1.2em;">🏠</span><br>
                        <small style="color: #666; margin-left: 20px; font-size: 1em; font-family: '黑体', Arial, sans-serif;">明清时期，普通百姓的住宅不得使用斗拱、彩色琉璃瓦等装饰，体现了严格的等级限制。</small></li>
                    </ul>
                </div>
            `
        },
        courtyard: {
            title: '庭院空间',
            content: `
                <div style="color: #333; line-height: 1.8; font-family: '黑体', Arial, sans-serif;">
                    <h3 style="color: #C23B22; border-bottom: 2px solid #C23B22; padding-bottom: 10px; margin-bottom: 20px; font-weight: bold;">布局原理</h3>
                    <p style="margin-bottom: 15px;"><span style="color: #C23B22; font-weight: bold;">核心概念：</span>庭院空间是中国古代建筑的基本单元，通过围墙和建筑围合形成内向的空间。 <span style="font-size: 1.2em;">🏡</span></p>
                    <p style="margin-bottom: 15px;"><span style="color: #C23B22; font-weight: bold;">特点：</span>封闭性与开放性结合，体现人与自然的和谐。 <span style="font-size: 1.2em;">🌿</span></p>
                    
                    <h3 style="color: #C23B22; border-bottom: 2px solid #C23B22; padding-bottom: 10px; margin: 30px 0 20px; font-weight: bold;">历史演变</h3>
                    <ul style="list-style: none; padding: 0; margin-bottom: 20px;">
                        <li style="margin-bottom: 15px;"><span style="color: #C23B22; font-weight: bold;">原始社会：</span>简单庭院开始出现 <span style="font-size: 1.2em;">🏕️</span><br>
                        <small style="color: #666; margin-left: 20px; font-size: 1em; font-family: '黑体', Arial, sans-serif;">小故事：原始社会晚期，人类开始在房屋周围围合出简单的庭院空间，用于日常生活和活动。</small></li>
                        <li style="margin-bottom: 15px;"><span style="color: #C23B22; font-weight: bold;">商周时期：</span>庭院布局基本形成 <span style="font-size: 1.2em;">🏛️</span><br>
                        <small style="color: #666; margin-left: 20px; font-size: 1em; font-family: '黑体', Arial, sans-serif;">案例：商周时期的宫殿建筑已经形成了以庭院为中心的布局，体现了早期的庭院空间理念。</small></li>
                        <li style="margin-bottom: 15px;"><span style="color: #C23B22; font-weight: bold;">秦汉时期：</span>庭院空间广泛应用 <span style="font-size: 1.2em;">🏯</span><br>
                        <small style="color: #666; margin-left: 20px; font-size: 1em; font-family: '黑体', Arial, sans-serif;">小故事：秦汉时期的住宅建筑普遍采用庭院式布局，形成了“前堂后寝”的空间结构。</small></li>
                        <li style="margin-bottom: 15px;"><span style="color: #C23B22; font-weight: bold;">明清时期：</span>庭院空间高度成熟，形式多样 <span style="font-size: 1.2em;">🌸</span><br>
                        <small style="color: #666; margin-left: 20px; font-size: 1em; font-family: '黑体', Arial, sans-serif;">案例：明清时期的北京四合院和江南园林，庭院空间的设计达到了很高的艺术水平，体现了中国传统的空间美学。</small></li>
                    </ul>
                    
                    <h3 style="color: #C23B22; border-bottom: 2px solid #C23B22; padding-bottom: 10px; margin: 30px 0 20px; font-weight: bold;">应用实例</h3>
                    <ul style="list-style: none; padding: 0;">
                        <li style="margin-bottom: 15px;"><span style="color: #C23B22; font-weight: bold;">北京四合院：</span>庭院空间的典范 <span style="font-size: 1.2em;">🏘️</span><br>
                        <small style="color: #666; margin-left: 20px; font-size: 1em; font-family: '黑体', Arial, sans-serif;">北京四合院以庭院为中心，四周环绕房屋，形成了封闭而又通透的空间，体现了中国传统的家庭伦理观念。</small></li>
                        <li style="margin-bottom: 15px;"><span style="color: #C23B22; font-weight: bold;">苏州园林：</span>庭院空间与自然景观的完美结合 <span style="font-size: 1.2em;">🎋</span><br>
                        <small style="color: #666; margin-left: 20px; font-size: 1em; font-family: '黑体', Arial, sans-serif;">苏州园林通过巧妙的布局，将庭院空间与自然景观融为一体，创造出“虽由人作，宛自天开”的意境。</small></li>
                    </ul>
                </div>
            `
        }
    };
    
    // 显示详情
    modalTitle.textContent = layoutDetails[layout].title;
    modalBody.innerHTML = layoutDetails[layout].content;
    modal.style.display = 'block';
}

// 显示成就详情
function showAchievementDetail(achievement) {
    const modal = document.getElementById('detail-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    
    // 成就详情数据
    const achievementDetails = {
        structural: {
            title: '结构成就',
            content: `
                <div style="color: #333; line-height: 1.8; font-family: '黑体', Arial, sans-serif;">
                    <h3 style="color: #C23B22; border-bottom: 2px solid #C23B22; padding-bottom: 10px; margin-bottom: 20px; font-weight: bold;">成就内容</h3>
                    <p style="margin-bottom: 15px;">木构架体系的高度成熟，抗震性能优异，千年建筑至今屹立 <span style="font-size: 1.2em;">🏗️</span></p>
                    <p style="margin-bottom: 15px;">斗拱、榫卯等结构技术的发明和应用，体现了中国古代工匠的智慧 <span style="font-size: 1.2em;">🔧</span></p>
                    
                    <h3 style="color: #C23B22; border-bottom: 2px solid #C23B22; padding-bottom: 10px; margin: 30px 0 20px; font-weight: bold;">历史意义</h3>
                    <p style="margin-bottom: 15px;">中国古代建筑的结构技术不仅解决了建筑的实用问题，也为世界建筑技术的发展做出了贡献 <span style="font-size: 1.2em;">🌍</span></p>
                    <small style="color: #666; margin-left: 20px; display: block; margin-bottom: 15px; font-size: 1em; font-family: '黑体', Arial, sans-serif;">案例：佛光寺东大殿是中国现存最早的木结构建筑之一，体现了唐代木构架技术的高超水平。</small>
                    
                    <h3 style="color: #C23B22; border-bottom: 2px solid #C23B22; padding-bottom: 10px; margin: 30px 0 20px; font-weight: bold;">现代影响</h3>
                    <p style="margin-bottom: 15px;">中国古代建筑的结构理念和技术对现代建筑仍有启示，如抗震设计、可持续建筑等 <span style="font-size: 1.2em;">🔄</span></p>
                </div>
            `
        },
        artistic: {
            title: '艺术成就',
            content: `
                <div style="color: #333; line-height: 1.8; font-family: '黑体', Arial, sans-serif;">
                    <h3 style="color: #C23B22; border-bottom: 2px solid #C23B22; padding-bottom: 10px; margin-bottom: 20px; font-weight: bold;">成就内容</h3>
                    <p style="margin-bottom: 15px;">建筑与自然环境的和谐统一，体现了中国传统的天人合一思想 <span style="font-size: 1.2em;">🌿</span></p>
                    <p style="margin-bottom: 15px;">雕刻、彩画、装饰等艺术形式的高度发展，使建筑成为艺术的载体 <span style="font-size: 1.2em;">🎨</span></p>
                    
                    <h3 style="color: #C23B22; border-bottom: 2px solid #C23B22; padding-bottom: 10px; margin: 30px 0 20px; font-weight: bold;">历史意义</h3>
                    <p style="margin-bottom: 15px;">中国古代建筑艺术是中国传统文化的重要组成部分，反映了中国古代的审美观念和艺术水平 <span style="font-size: 1.2em;">🌟</span></p>
                    <small style="color: #666; margin-left: 20px; display: block; margin-bottom: 15px; font-size: 1em; font-family: '黑体', Arial, sans-serif;">小故事：苏州园林通过巧妙的布局，将建筑与自然景观融为一体，创造出“虽由人作，宛自天开”的意境。</small>
                    
                    <h3 style="color: #C23B22; border-bottom: 2px solid #C23B22; padding-bottom: 10px; margin: 30px 0 20px; font-weight: bold;">现代影响</h3>
                    <p style="margin-bottom: 15px;">中国古代建筑艺术对现代建筑设计仍有启发，如传统元素的现代应用、环境与建筑的和谐等 <span style="font-size: 1.2em;">💡</span></p>
                </div>
            `
        },
        technical: {
            title: '技术成就',
            content: `
                <div style="color: #333; line-height: 1.8; font-family: '黑体', Arial, sans-serif;">
                    <h3 style="color: #C23B22; border-bottom: 2px solid #C23B22; padding-bottom: 10px; margin-bottom: 20px; font-weight: bold;">成就内容</h3>
                    <p style="margin-bottom: 15px;">《营造法式》等建筑专著的出现，标志着中国古代建筑技术的规范化 <span style="font-size: 1.2em;">📚</span></p>
                    <p style="margin-bottom: 15px;">标准化施工方法的建立，提高了建筑质量和效率 <span style="font-size: 1.2em;">⚙️</span></p>
                    
                    <h3 style="color: #C23B22; border-bottom: 2px solid #C23B22; padding-bottom: 10px; margin: 30px 0 20px; font-weight: bold;">历史意义</h3>
                    <p style="margin-bottom: 15px;">中国古代建筑技术的规范化和标准化，为建筑的传承和发展提供了保障 <span style="font-size: 1.2em;">🛡️</span></p>
                    <small style="color: #666; margin-left: 20px; display: block; margin-bottom: 15px; font-size: 1em; font-family: '黑体', Arial, sans-serif;">案例：宋代李诫编写的《营造法式》是中国古代建筑技术的重要专著，对后世建筑产生了深远影响。</small>
                    
                    <h3 style="color: #C23B22; border-bottom: 2px solid #C23B22; padding-bottom: 10px; margin: 30px 0 20px; font-weight: bold;">现代影响</h3>
                    <p style="margin-bottom: 15px;">中国古代建筑的标准化思想对现代建筑工业化和标准化仍有启示 <span style="font-size: 1.2em;">🔄</span></p>
                </div>
            `
        },
        cultural: {
            title: '文化价值',
            content: `
                <div style="color: #333; line-height: 1.8; font-family: '黑体', Arial, sans-serif;">
                    <h3 style="color: #C23B22; border-bottom: 2px solid #C23B22; padding-bottom: 10px; margin-bottom: 20px; font-weight: bold;">成就内容</h3>
                    <p style="margin-bottom: 15px;">建筑作为文化载体，体现了中国传统哲学、礼制思想和审美观念 <span style="font-size: 1.2em;">📜</span></p>
                    <p style="margin-bottom: 15px;">不同地域的建筑风格反映了地域文化的多样性 <span style="font-size: 1.2em;">🌏</span></p>
                    
                    <h3 style="color: #C23B22; border-bottom: 2px solid #C23B22; padding-bottom: 10px; margin: 30px 0 20px; font-weight: bold;">历史意义</h3>
                    <p style="margin-bottom: 15px;">中国古代建筑是中国传统文化的重要组成部分，是历史的见证和文化的载体 <span style="font-size: 1.2em;">🏛️</span></p>
                    <small style="color: #666; margin-left: 20px; display: block; margin-bottom: 15px; font-size: 1em; font-family: '黑体', Arial, sans-serif;">小故事：紫禁城的布局体现了中国传统的“居中为尊”思想，是中国传统文化的重要载体。</small>
                    
                    <h3 style="color: #C23B22; border-bottom: 2px solid #C23B22; padding-bottom: 10px; margin: 30px 0 20px; font-weight: bold;">现代影响</h3>
                    <p style="margin-bottom: 15px;">中国古代建筑的文化价值对现代文化建设和文化自信的提升具有重要意义 <span style="font-size: 1.2em;">💪</span></p>
                </div>
            `
        }
    };
    
    // 显示详情
    modalTitle.textContent = achievementDetails[achievement].title;
    modalBody.innerHTML = achievementDetails[achievement].content;
    modal.style.display = 'block';
}

// 语音播放函数
function playAudio(type) {
    // 语音播放内容
    const audioContent = {
        'wood-frame': '木构架体系是中国古代建筑的核心结构，以木材为主要材料。原始人类利用天然木材搭建简单的居住结构，这是木构架体系的萌芽。',
        'dougong': '斗拱是中国古代建筑特有的结构构件，兼具结构和装饰功能。唐代的斗拱尺寸宏大，结构作用明显，体现了斗拱技术的成熟。',
        'sunmao': '榫卯是中国传统木工技艺，不用钉子的连接方式。应县木塔全塔不用一钉一铆，完全依靠榫卯连接。',
        'brick-tile': '砖瓦技术是中国古代建筑的重要材料技术。紫禁城的屋顶使用了大量的琉璃瓦，色彩鲜艳，装饰精美。',
        'axis-symmetry': '中轴对称是中国古代建筑的重要布局原则，体现等级制度。二里头遗址的宫殿基址是中国最早的宫殿遗址之一，已经出现了明确的中轴线布局。',
        'hierarchy': '等级制度是建筑规制体现社会等级，严格遵循礼制。《考工记》中对不同等级建筑的规模和装饰有明确规定。',
        'courtyard': '庭院空间是中国古代建筑的基本单元，体现人与自然的和谐。北京四合院是中国传统庭院空间的典型代表，体现了家族聚居的生活方式。',
        'structural': '结构成就是木构架体系的高度成熟，抗震性能优异，千年建筑至今屹立。佛光寺东大殿是中国现存最早的木结构建筑之一，体现了唐代木构架技术的高超水平。',
        'artistic': '艺术成就是建筑与自然环境的和谐统一，雕刻、彩画等装饰艺术的高度发展。苏州园林通过巧妙的布局，将建筑与自然景观融为一体，创造出虽由人作，宛自天开的意境。',
        'technical': '技术成就是《营造法式》等建筑专著的出现，标准化施工方法的建立。宋代李诫编写的《营造法式》是中国古代建筑技术的重要专著，对后世建筑产生了深远影响。',
        'cultural': '文化价值是建筑作为文化载体，体现中国传统哲学、礼制思想和审美观念。紫禁城的布局体现了中国传统的居中为尊思想，是中国传统文化的重要载体。'
    };
    
    // 创建语音合成对象
    const speech = new SpeechSynthesisUtterance();
    
    // 设置语音内容
    speech.text = audioContent[type] || '语音内容未找到';
    
    // 设置语音属性
    speech.lang = 'zh-CN'; // 中文
    speech.rate = 1; // 语速
    speech.pitch = 1; // 音调
    speech.volume = 1; // 音量
    
    // 播放语音
    window.speechSynthesis.speak(speech);
}

// 刷新仪表盘
function refreshDashboard() {
    // 模拟刷新效果
    const contentBody = document.querySelector('.content-body');
    contentBody.style.opacity = '0.5';
    
    setTimeout(() => {
        // 重新初始化图表
        if (typeof initCharts === 'function') {
            initCharts();
        }
        
        // 恢复显示
        contentBody.style.opacity = '1';
        
        // 显示刷新成功提示
        showNotification('仪表盘已刷新');
    }, 1000);
}

// 显示通知
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #C23B22;
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1000;
        animation: slideIn 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// 3D模型相关函数
function loadSelectedModel() {
    const select = document.getElementById('model-select');
    const modelPath = select.value;
    const modelInfoText = document.getElementById('model-info-text');
    
    if (!modelPath) {
        modelInfoText.textContent = '请选择一个3D模型查看详细信息';
        return;
    }
    
    // 模型信息
    const modelInfo = {
        'models/fujiantulou.glb': '福建土楼：聚族而居的防御性建筑，独特的圆形或方形布局。',
        'models/gongqiao.glb': '拱桥：中国古代桥梁建筑的重要类型，体现了中国古代工匠的结构智慧。',
        'models/siheyuan.glb': '四合院：北方传统民居的代表，布局严谨，体现家庭伦理。',
        'models/taihedian.glb': '太和殿：紫禁城内的正殿，是中国古代宫殿建筑的巅峰之作。'
    };
    
    // 更新模型信息
    modelInfoText.textContent = modelInfo[modelPath] || '模型信息加载中...';
    
    // 调用全局的loadCustomModel函数
    if (typeof loadCustomModel === 'function') {
        loadCustomModel(modelPath);
    }
}

function refreshModelList() {
    // 模拟刷新模型列表
    const select = document.getElementById('model-select');
    const originalValue = select.value;
    
    // 显示加载状态
    select.disabled = true;
    select.innerHTML = '<option value="">加载中...</option>';
    
    setTimeout(() => {
        // 恢复模型列表
        select.innerHTML = `
            <option value="">-- 选择3D模型 --</option>
            <option value="models/fujiantulou.glb">福建土楼</option>
            <option value="models/gongqiao.glb">拱桥</option>
            <option value="models/siheyuan.glb">四合院</option>
            <option value="models/taihedian.glb">太和殿</option>
        `;
        
        // 恢复之前的选择
        if (originalValue) {
            select.value = originalValue;
            // 重新加载模型
            loadSelectedModel();
        }
        
        select.disabled = false;
        showNotification('模型列表已刷新');
    }, 1000);
}

function resetCamera() {
    // 调用全局的resetCamera函数
    if (typeof resetCamera === 'function') {
        resetCamera();
    }
}

function toggleFullscreen() {
    const container = document.getElementById('building3D');
    
    if (!document.fullscreenElement) {
        container.requestFullscreen().catch(err => {
            console.error(`Error attempting to enable full-screen mode: ${err.message}`);
        });
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
}

// 初始化历史长河
function initHistoryTimeline() {
    console.log('初始化历史长河');
    
    const timelineContainer = document.getElementById('history-timeline');
    if (!timelineContainer) {
        console.error('历史长河容器不存在');
        return;
    }
    
    // 加载历史数据
    if (typeof historyData === 'undefined') {
        console.error('历史数据未加载');
        return;
    }
    
    console.log('历史数据:', historyData);
    
    // 清空时间线
    timelineContainer.innerHTML = '';
    
    // 生成时间线项目
    historyData.forEach((period, index) => {
        console.log('处理时期:', period.name, '索引:', index);
        
        const timelineItem = document.createElement('div');
        timelineItem.className = 'timeline-item';
        timelineItem.setAttribute('data-period', period.period);
        
        const timelineContent = document.createElement('div');
        timelineContent.className = 'timeline-content';
        
        const periodTitle = document.createElement('h4');
        periodTitle.textContent = `${period.name}（${period.timeRange}）`;
        
        const periodDescription = document.createElement('p');
        periodDescription.textContent = period.description;
        
        // 创建建筑类型列表
        const buildingTypesList = document.createElement('div');
        buildingTypesList.className = 'building-types-list';
        
        period.buildings.forEach((building, buildingIndex) => {
            const buildingItem = document.createElement('span');
            buildingItem.className = 'building-type-item';
            buildingItem.textContent = building.name;
            buildingItem.setAttribute('data-building-index', buildingIndex);
            buildingItem.setAttribute('data-period-index', index);
            
            console.log('创建建筑类型项:', building.name, '时期索引:', index, '建筑索引:', buildingIndex);
            
            // 添加点击事件
            buildingItem.addEventListener('click', function() {
                const periodIndex = parseInt(this.getAttribute('data-period-index'));
                const buildingIndex = parseInt(this.getAttribute('data-building-index'));
                console.log('点击建筑类型项，时期索引:', periodIndex, '建筑索引:', buildingIndex);
                showBuildingDetail(periodIndex, buildingIndex);
            });
            
            buildingTypesList.appendChild(buildingItem);
        });
        
        timelineContent.appendChild(periodTitle);
        timelineContent.appendChild(periodDescription);
        timelineContent.appendChild(buildingTypesList);
        timelineItem.appendChild(timelineContent);
        timelineContainer.appendChild(timelineItem);
    });
    
    console.log('历史长河初始化完成');
}

// 初始化建筑图片查看模态框
function initBuildingModal() {
    const modal = document.getElementById('building-modal');
    const closeBtn = modal.querySelector('.close');
    const prevBtn = document.getElementById('prev-image');
    const nextBtn = document.getElementById('next-image');
    
    // 关闭模态框
    closeBtn.addEventListener('click', function() {
        modal.style.display = 'none';
    });
    
    // 点击模态框外部关闭
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    // 上一张图片
    prevBtn.addEventListener('click', function() {
        if (currentImageIndex > 0) {
            currentImageIndex--;
            updateBuildingModal();
        }
    });
    
    // 下一张图片
    nextBtn.addEventListener('click', function() {
        const building = currentPeriodBuildings[currentBuildingIndex];
        const images = building.images || (building.image ? [building.image] : []);
        if (currentImageIndex < images.length - 1) {
            currentImageIndex++;
            updateBuildingModal();
        }
    });
}

// 显示建筑详情
function showBuildingDetail(periodIndex, buildingIndex) {
    console.log('显示建筑详情，时期索引:', periodIndex, '建筑索引:', buildingIndex);
    
    if (!historyData || !historyData[periodIndex] || !historyData[periodIndex].buildings[buildingIndex]) {
        console.error('建筑数据不存在', {
            historyData: historyData,
            periodIndex: periodIndex,
            buildingIndex: buildingIndex
        });
        return;
    }
    
    const period = historyData[periodIndex];
    const building = period.buildings[buildingIndex];
    
    console.log('时期数据:', period);
    console.log('建筑数据:', building);
    
    // 保存当前建筑数据和时期索引
    currentPeriodBuildings = period.buildings;
    currentBuildingIndex = buildingIndex;
    currentPeriodIndex = periodIndex; // 保存当前时期索引
    currentImageIndex = 0; // 初始化图片索引为 0，支持图片数组
    
    console.log('准备更新模态框，当前建筑数组:', currentPeriodBuildings, '当前时期索引:', currentPeriodIndex);
    
    // 更新模态框内容
    updateBuildingModal();
    
    // 显示模态框
    const modal = document.getElementById('building-modal');
    if (modal) {
        modal.style.display = 'block';
        console.log('模态框已显示');
    } else {
        console.error('模态框元素不存在');
    }
}

// 更新建筑模态框
function updateBuildingModal() {
    console.log('更新模态框，当前建筑索引:', currentBuildingIndex);
    console.log('当前建筑数组:', currentPeriodBuildings);
    console.log('当前时期索引:', currentPeriodIndex);
    
    if (currentPeriodBuildings.length === 0 || currentBuildingIndex < 0 || currentBuildingIndex >= currentPeriodBuildings.length) {
        console.error('建筑数据无效');
        return;
    }
    
    const building = currentPeriodBuildings[currentBuildingIndex];
    const period = historyData[currentPeriodIndex];
    
    console.log('当前建筑:', building);
    console.log('当前时期:', period);
    
    if (!building || !period) {
        console.error('建筑或时期数据不存在');
        return;
    }
    
    // 获取图片数组（支持单个 image 或 images 数组）
    const images = building.images || (building.image ? [building.image] : []);
    
    if (images.length === 0) {
        console.error('建筑图片不存在');
        return;
    }
    
    // 确保图片索引在有效范围内
    if (currentImageIndex < 0) {
        currentImageIndex = 0;
    } else if (currentImageIndex >= images.length) {
        currentImageIndex = images.length - 1;
    }
    
    // 获取 DOM 元素
    const buildingTitle = document.getElementById('building-title');
    const buildingName = document.getElementById('building-name');
    const buildingDescription = document.getElementById('building-description-text');
    const buildingPeriod = document.getElementById('building-period');
    const buildingImage = document.getElementById('building-image');
    const prevButton = document.getElementById('prev-image');
    const nextButton = document.getElementById('next-image');
    
    if (!buildingTitle || !buildingName || !buildingDescription || !buildingPeriod || !buildingImage) {
        console.error('模态框元素不存在');
        return;
    }
    
    // 更新模态框内容
    buildingTitle.textContent = '建筑详情';
    buildingName.textContent = building.name;
    buildingDescription.textContent = building.description;
    buildingPeriod.textContent = `时期：${period.name}（${period.timeRange}）`;
    buildingImage.src = images[currentImageIndex];
    buildingImage.alt = building.name;
    
    console.log('图片数组:', images);
    console.log('当前图片索引:', currentImageIndex);
    console.log('图片路径:', images[currentImageIndex]);
    console.log('图片加载状态:', buildingImage.complete);
    
    // 图片加载错误处理
    buildingImage.onerror = function() {
        console.error('图片加载失败:', images[currentImageIndex]);
        this.alt = '图片加载失败：' + building.name;
    };
    
    buildingImage.onload = function() {
        console.log('图片加载成功:', images[currentImageIndex]);
    };
    
    // 更新导航按钮状态
    if (prevButton && nextButton) {
        prevButton.disabled = currentImageIndex === 0;
        nextButton.disabled = currentImageIndex === images.length - 1;
    }
}

// 添加动画样式
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);
