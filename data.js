/**
 * 中国古代建筑结构可视化 - 数据文件
 *
 * 数据来源说明：
 * 1. 故宫太和殿抬梁式结构数据 - 故宫博物院建筑测绘资料
 * 2. 四川穿斗式民居数据 - 传统民居调研
 * 3. 木材力学性能 - 《营造法式》及现代材料学数据
 * 4. 数据已做适当简化，用于教学演示
 */

// 木材力学性能数据（单位：MPa）
const WOOD_PROPERTIES = {
    materials: ['楠木', '松木', '杉木', '榆木'],
    compression: [85, 70, 65, 75],      // 抗压强度
    bending: [95, 65, 60, 70],          // 抗弯强度
    elasticity: [12000, 10000, 9000, 8000] // 弹性模量 (MPa)
};

// 抬梁式结构数据（以故宫太和殿为参考）
const TAI_LIANG_DATA = {
    name: '抬梁式',
    structure: [
        { name: '柱高', value: 8.2, unit: 'm' },      // 檐柱高度
        { name: '梁长', value: 11.5, unit: 'm' },     // 主要梁长度
        { name: '柱径', value: 0.8, unit: 'm' },      // 柱子直径
        { name: '用材量', value: 120, unit: 'm³' },   // 估算用材量
        { name: '跨度', value: 9.8, unit: 'm' }       // 最大跨度
    ],
    performance: {
        spaceUtilization: 80,    // 空间利用率 (%)
        earthquakeResistance: 90, // 抗震性
        constructionDifficulty: 60, // 施工难度 (越高越难)
        cost: 70,                // 造价成本 (相对值)
        materialUsage: 85        // 用材量 (相对值)
    }
};

// 穿斗式结构数据（以四川民居为参考）
const CHUAN_DOU_DATA = {
    name: '穿斗式',
    structure: [
        { name: '柱高', value: 4.5, unit: 'm' },
        { name: '梁长', value: 5.2, unit: 'm' },
        { name: '柱径', value: 0.4, unit: 'm' },
        { name: '用材量', value: 65, unit: 'm³' },
        { name: '跨度', value: 3.8, unit: 'm' }
    ],
    performance: {
        spaceUtilization: 60,
        earthquakeResistance: 85,
        constructionDifficulty: 70,
        cost: 65,
        materialUsage: 75
    }
};

// 两种结构的综合对比数据
const STRUCTURE_COMPARISON = {
    radarIndicators: [
        { name: '空间利用率', max: 100 },
        { name: '抗震性', max: 100 },
        { name: '施工难度', max: 100 },
        { name: '造价成本', max: 100 },
        { name: '用材量', max: 100 }
    ],
    data: [
        {
            value: [
                TAI_LIANG_DATA.performance.spaceUtilization,
                TAI_LIANG_DATA.performance.earthquakeResistance,
                TAI_LIANG_DATA.performance.constructionDifficulty,
                TAI_LIANG_DATA.performance.cost,
                TAI_LIANG_DATA.performance.materialUsage
            ],
            name: '抬梁式'
        },
        {
            value: [
                CHUAN_DOU_DATA.performance.spaceUtilization,
                CHUAN_DOU_DATA.performance.earthquakeResistance,
                CHUAN_DOU_DATA.performance.constructionDifficulty,
                CHUAN_DOU_DATA.performance.cost,
                CHUAN_DOU_DATA.performance.materialUsage
            ],
            name: '穿斗式'
        }
    ]
};

// 适用场景数据
const APPLICATION_SCENARIOS = {
    buildingTypes: ['宫殿庙宇', '官式建筑', '大型厅堂', '民居', '吊脚楼', '小型建筑'],
    height: [12, 10, 8, 5, 4, 3],      // 适宜高度 (米)
    span: [10, 9, 8, 4, 3, 2],         // 适宜跨度 (米)
    structures: ['抬梁式', '抬梁式', '抬梁式', '穿斗式', '穿斗式', '穿斗式'],
    description: [
        '高大宏伟，需要大空间',
        '等级较高，结构严谨',
        '需要开阔内部空间',
        '经济实用，施工快捷',
        '山地地形，适应性强',
        '小型建筑，材料节约'
    ]
};

// 构件尺寸详细对比
const COMPONENT_DETAILS = {
    components: ['柱高', '梁长', '柱径', '用材量', '适用高度', '适用跨度'],
    '抬梁式': [8.2, 11.5, 0.8, 120, 12, 10],
    '穿斗式': [4.5, 5.2, 0.4, 65, 5, 4]
};

// 历史演变数据
const HISTORICAL_DEVELOPMENT = {
    dynasties: ['先秦', '秦汉', '唐宋', '明清', '现代'],
    usage: [60, 80, 90, 85, 70],      // 抬梁式使用比例
    '抬梁式': [40, 50, 60, 55, 45],
    '穿斗式': [60, 50, 40, 45, 55]
};

// 导出数据（如果使用模块系统）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        WOOD_PROPERTIES,
        TAI_LIANG_DATA,
        CHUAN_DOU_DATA,
        STRUCTURE_COMPARISON,
        APPLICATION_SCENARIOS,
        COMPONENT_DETAILS,
        HISTORICAL_DEVELOPMENT
    };
}
