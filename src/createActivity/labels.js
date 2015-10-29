var briefLabels = {
    cover: '封面',
    title: '标题',
    route: '路线',
    startDate: '出发时间',
    endDate: '结束时间',
}

var detailLabels = {
    entryDeadline: '报名截止日期',
    minCars: '最少车辆数量',
    maxCars: '最大车辆数量',
    routeMap: '轨迹图',
    routeDesc: '路线说明',
    partnerRequirements: '参与者要求',
    equipementRequirements: '装备要求',
    costDesc: '费用说明',
    riskPrompt: '风险提示'
}

var labels = {
    ...briefLabels,
    ...detailLabels
}

module.exports = {
    briefLabels,
    detailLabels,
    labels
}