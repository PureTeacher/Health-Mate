<template>
    <view
        :class="['psychologist-container', containerClasses]"
        :style="{ '--theme-color': themeColor }"
    >
        <!-- 顶部导航 -->
        <view class="header">
            <!-- <view class="header-left">
        <text class="back-arrow" @click="goBack">⬅️</text>
        <text class="header-title">健康顾问</text>
      </view> -->
            <view class="header-right">
                <view class="appointment-record" @click="goToAppointmentRecord">
                    <text class="record-icon">📋</text>
                    <text class="record-text">预约记录</text>
                </view>
            </view>
        </view>
        <!-- <view class="header-subtitle">
      <text class="subtitle-text">健康顾问与服务点</text>
    </view> -->

        <!-- 搜索栏 -->
        <view class="search-section">
            <view class="search-bar">
                <text class="search-icon">🔍</text>
                <input
                    class="search-input"
                    placeholder="搜索顾问姓名、营养师或服务点"
                    v-model="searchKeyword"
                    @input="handleSearch"
                />
            </view>
        </view>

        <!-- 顾问列表 -->
        <view class="doctor-list" v-if="!loading">
            <view v-if="filteredDoctors.length === 0" class="empty-state">
                <text class="empty-emoji">🏥</text>
                <text class="empty-text">暂无匹配的顾问</text>
                <text class="empty-desc">请尝试其他筛选条件</text>
            </view>

            <view v-else>
                <view
                    v-for="(doctor, index) in filteredDoctors"
                    :key="doctor.id"
                    class="doctor-card"
                    @click="viewDoctorDetail(doctor)"
                >
                    <view class="card-header">
                        <view class="avatar-container">
                            <image
                                :src="doctor.avatar"
                                class="doctor-avatar"
                                mode="aspectFill"
                            />
                            <view
                                class="online-status"
                                :class="{ online: doctor.isOnline }"
                            ></view>
                        </view>
                        <view class="doctor-info">
                            <view class="name-section">
                                <text class="doctor-name">{{
                                    doctor.name
                                }}</text>
                            </view>
                            <view class="basic-info">
                                <text class="info-item"
                                    >{{ doctor.age }}岁</text
                                >
                                <text class="info-item"
                                    >从业{{ doctor.experience }}年</text
                                >
                                <text class="info-item">{{
                                    doctor.title
                                }}</text>
                            </view>
                        </view>
                        <view class="rating-section">
                            <view class="rating">
                                <text class="rating-score">{{
                                    doctor.rating
                                }}</text>
                                <text class="rating-star">⭐</text>
                            </view>
                            <text class="rating-count"
                                >{{ doctor.reviewCount }}评价</text
                            >
                        </view>
                    </view>

                    <view class="card-content">
                        <view class="specialties">
                            <text class="specialty-label">专业领域：</text>
                            <view class="specialty-tags">
                                <text
                                    v-for="specialty in doctor.specialties"
                                    :key="specialty"
                                    class="specialty-tag"
                                >
                                    {{ specialty }}
                                </text>
                            </view>
                        </view>

                        <view class="introduction">
                            <text class="intro-text">{{
                                doctor.introduction
                            }}</text>
                        </view>
                    </view>

                    <view class="card-footer">
                        <view class="action-buttons">
                            <button
                                class="appointment-btn"
                                @click.stop="makeAppointment(doctor)"
                            >
                                预约顾问
                            </button>
                        </view>
                    </view>
                </view>
            </view>
        </view>

        <!-- 加载状态 -->
        <view class="loading-container" v-if="loading">
            <view class="loading-spinner"></view>
            <text class="loading-text">加载中...</text>
        </view>

        <!-- 顾问详情弹窗 -->
        <view class="detail-modal" v-if="showDetail" @click="closeDetail">
            <view class="detail-content" @click.stop>
                <view class="detail-header">
                    <view class="doctor-profile">
                        <image
                            :src="selectedDoctor.avatar"
                            class="detail-avatar"
                            mode="aspectFill"
                        />
                        <view class="profile-info">
                            <text class="detail-name">{{
                                selectedDoctor.name
                            }}</text>
                            <text class="detail-title">{{
                                selectedDoctor.title
                            }}</text>
                        </view>
                    </view>
                    <view class="close-btn" @click="closeDetail">×</view>
                </view>

                <view class="detail-body">
                    <view class="detail-section">
                        <text class="section-label">基本信息</text>
                        <view class="info-grid">
                            <view class="info-item">
                                <text class="info-label">性别</text>
                                <text class="info-value">{{
                                    selectedDoctor.gender
                                }}</text>
                            </view>
                            <view class="info-item">
                                <text class="info-label">年龄</text>
                                <text class="info-value"
                                    >{{ selectedDoctor.age }}岁</text
                                >
                            </view>
                            <view class="info-item">
                                <text class="info-label">从业</text>
                                <text class="info-value"
                                    >{{ selectedDoctor.experience }}年</text
                                >
                            </view>
                            <view class="info-item">
                                <text class="info-label">职称</text>
                                <text class="info-value">{{
                                    selectedDoctor.title
                                }}</text>
                            </view>
                        </view>
                    </view>

                    <view class="detail-section">
                        <text class="section-label">专业领域</text>
                        <view class="specialty-list">
                            <text
                                v-for="specialty in selectedDoctor.specialties"
                                :key="specialty"
                                class="specialty-item"
                            >
                                {{ specialty }}
                            </text>
                        </view>
                    </view>

                    <view class="detail-section">
                        <text class="section-label">个人简介</text>
                        <text class="detail-intro">{{
                            selectedDoctor.introduction
                        }}</text>
                    </view>

                    <view class="detail-section">
                        <text class="section-label">专业背景</text>
                        <text class="detail-background">{{
                            selectedDoctor.background
                        }}</text>
                    </view>
                </view>

                <view class="detail-footer">
                    <button
                        class="detail-appointment-btn"
                        @click="makeAppointment(selectedDoctor)"
                    >
                        预约顾问
                    </button>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
export default {
    data() {
        return {
            themeColor: "#4facfe",
            loading: true,
            searchKeyword: "",
            showDetail: false,
            selectedDoctor: {},
            doctors: [
                {
                    id: 1,
                    name: "李心怡",
                    gender: "女",
                    age: 35,
                    experience: 8,
                    title: "首席健康顾问",
                    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=doctor1&backgroundColor=b6e3f4",
                    rating: 4.9,
                    reviewCount: 1286,
                    isOnline: true,
                    specialties: ["体重管理", "饮食记录", "打卡随访"],
                    introduction:
                        "健康管理顾问，擅长结合健康自测、饮食运动习惯和阶段打卡记录，为用户提供体重管理参考建议。",
                    background:
                        "营养与健康管理方向顾问，从事体重管理和用户随访服务8年。",
                    consultationCount: 3240,
                    successRate: 94,
                    responseTime: 15,
                    price: 300,
                },
                {
                    id: 2,
                    name: "王明华",
                    gender: "男",
                    age: 42,
                    experience: 12,
                    title: "营养健康顾问",
                    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=doctor2&backgroundColor=c7a2ff",
                    rating: 4.8,
                    reviewCount: 2156,
                    isOnline: false,
                    specialties: ["营养建议", "代谢风险", "长期管理"],
                    introduction:
                        "营养健康顾问，擅长为超重、久坐和饮食不规律用户提供饮食运动参考建议。",
                    background:
                        "公共营养与健康管理背景，从事慢病风险管理和营养咨询服务12年。",
                    consultationCount: 4560,
                    successRate: 92,
                    responseTime: 20,
                    price: 350,
                },
                {
                    id: 3,
                    name: "张雅文",
                    gender: "女",
                    age: 38,
                    experience: 10,
                    title: "社区服务点顾问",
                    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=doctor3&backgroundColor=ffd1dc",
                    rating: 4.9,
                    reviewCount: 1890,
                    isOnline: true,
                    specialties: [
                        "社区筛查",
                        "健康建档",
                        "服务点随访",
                    ],
                    introduction:
                        "社区健康服务点顾问，负责健康自测登记、基础数据记录和活动随访支持。",
                    background:
                        "社区健康服务与用户运营背景，从事健康宣教和活动随访10年。",
                    consultationCount: 2890,
                    successRate: 96,
                    responseTime: 12,
                    price: 280,
                },
                {
                    id: 4,
                    name: "陈志强",
                    gender: "男",
                    age: 45,
                    experience: 15,
                    title: "代谢管理顾问",
                    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=doctor4&backgroundColor=ffb3ba",
                    rating: 4.7,
                    reviewCount: 3240,
                    isOnline: true,
                    specialties: [
                        "BMI管理",
                        "腰围记录",
                        "平台期复盘",
                    ],
                    introduction:
                        "代谢管理顾问，擅长帮助用户复盘 BMI、腰围、体重趋势和生活方式变化。",
                    background:
                        "健康管理与运动营养背景，从事体重管理服务15年。",
                    consultationCount: 5670,
                    successRate: 89,
                    responseTime: 25,
                    price: 400,
                },
                {
                    id: 5,
                    name: "刘晓曼",
                    gender: "女",
                    age: 36,
                    experience: 9,
                    title: "饮食记录顾问",
                    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=doctor5&backgroundColor=bae1ff",
                    rating: 4.8,
                    reviewCount: 1560,
                    isOnline: true,
                    specialties: ["饮食复盘", "控糖控脂", "家庭餐建议"],
                    introduction:
                        "饮食记录顾问，擅长帮助用户复盘日常饮食结构，给出更容易坚持的餐食调整参考。",
                    background:
                        "营养健康服务背景，从事饮食记录、体重管理和用户陪跑服务9年。",
                    consultationCount: 2130,
                    successRate: 93,
                    responseTime: 18,
                    price: 250,
                },
                {
                    id: 6,
                    name: "赵建国",
                    gender: "男",
                    age: 50,
                    experience: 18,
                    title: "高级健康管理顾问",
                    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=doctor6&backgroundColor=ffdfba",
                    rating: 4.9,
                    reviewCount: 4120,
                    isOnline: false,
                    specialties: [
                        "慢病风险提示",
                        "指标复盘",
                        "阶段方案调整",
                    ],
                    introduction:
                        "高级健康管理顾问，擅长结合 BMI、腰围、血压血糖等用户授权数据，提供阶段管理参考。",
                    background:
                        "健康管理与公共卫生背景，从事代谢风险筛查和长期随访服务18年。",
                    consultationCount: 6780,
                    successRate: 91,
                    responseTime: 30,
                    price: 450,
                },
                {
                    id: 7,
                    name: "孙晓敏",
                    gender: "女",
                    age: 36,
                    experience: 9,
                    title: "睡眠情绪顾问",
                    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=doctor7&backgroundColor=ffffba",
                    rating: 4.8,
                    reviewCount: 1980,
                    isOnline: true,
                    specialties: [
                        "睡眠习惯",
                        "压力饮食",
                        "生活节律",
                    ],
                    introduction:
                        "睡眠情绪顾问，关注睡眠、压力和食欲变化对体重管理的影响，提供生活节律建议。",
                    background:
                        "心理健康教育与健康管理背景，从事睡眠习惯记录和压力饮食支持9年。",
                    consultationCount: 2670,
                    successRate: 95,
                    responseTime: 16,
                    price: 320,
                },
                {
                    id: 8,
                    name: "周文博",
                    gender: "男",
                    age: 41,
                    experience: 11,
                    title: "运动健康顾问",
                    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=doctor8&backgroundColor=baffc9",
                    rating: 4.7,
                    reviewCount: 2890,
                    isOnline: true,
                    specialties: [
                        "运动入门",
                        "久坐改善",
                        "体能记录",
                    ],
                    introduction:
                        "运动健康顾问，擅长为久坐、运动基础较弱的用户设计循序渐进的活动记录建议。",
                    background:
                        "运动健康与用户随访背景，从事基础运动指导和体能记录服务11年。",
                    consultationCount: 3890,
                    successRate: 88,
                    responseTime: 22,
                    price: 380,
                },
                {
                    id: 9,
                    name: "吴丽华",
                    gender: "女",
                    age: 39,
                    experience: 10,
                    title: "女性健康顾问",
                    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=doctor9&backgroundColor=ffb3d1",
                    rating: 4.9,
                    reviewCount: 2340,
                    isOnline: false,
                    specialties: ["女性体重管理", "经期记录", "产后管理"],
                    introduction:
                        "女性健康顾问，关注女性在不同阶段的体重变化、饮食节律和运动恢复参考。",
                    background:
                        "女性健康管理与营养服务背景，从事经期、产后和家庭饮食记录支持10年。",
                    consultationCount: 3120,
                    successRate: 94,
                    responseTime: 14,
                    price: 290,
                },
                {
                    id: 10,
                    name: "郑浩然",
                    gender: "男",
                    age: 37,
                    experience: 8,
                    title: "产品使用顾问",
                    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=doctor10&backgroundColor=d1b3ff",
                    rating: 4.8,
                    reviewCount: 1760,
                    isOnline: true,
                    specialties: [
                        "服用打卡",
                        "体验反馈",
                        "依从性建议",
                    ],
                    introduction:
                        "产品使用顾问，协助用户记录产品使用、身体反馈和打卡习惯，异常不适会提醒及时咨询医生。",
                    background:
                        "用户服务与健康产品运营背景，从事产品使用指导和售后随访8年。",
                    consultationCount: 2450,
                    successRate: 92,
                    responseTime: 19,
                    price: 330,
                },
                {
                    id: 11,
                    name: "林雅婷",
                    gender: "女",
                    age: 34,
                    experience: 6,
                    title: "健康建档顾问",
                    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=doctor11&backgroundColor=b3d1ff",
                    rating: 4.8,
                    reviewCount: 1420,
                    isOnline: true,
                    specialties: ["健康档案", "基础指标", "隐私授权"],
                    introduction:
                        "健康建档顾问，帮助用户梳理身高、体重、腰围、目标体重和服务授权等基础信息。",
                    background:
                        "健康档案和用户运营背景，从事基础数据登记、授权说明和随访建档6年。",
                    consultationCount: 1890,
                    successRate: 90,
                    responseTime: 21,
                    price: 260,
                },
                {
                    id: 12,
                    name: "黄志明",
                    gender: "男",
                    age: 48,
                    experience: 16,
                    title: "尊享服务顾问",
                    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=doctor12&backgroundColor=ffd1b3",
                    rating: 4.9,
                    reviewCount: 3560,
                    isOnline: false,
                    specialties: [
                        "尊享随访",
                        "趋势报告",
                        "家庭管理",
                    ],
                    introduction:
                        "尊享服务顾问，面向需要长期陪跑的用户，提供趋势复盘、阶段目标和家庭饮食管理参考。",
                    background:
                        "高阶健康管理服务背景，从事尊享随访、家庭健康管理和趋势报告解读16年。",
                    consultationCount: 5230,
                    successRate: 87,
                    responseTime: 35,
                    price: 500,
                },
                {
                    id: 13,
                    name: "马小芳",
                    gender: "女",
                    age: 31,
                    experience: 5,
                    title: "打卡陪跑顾问",
                    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=doctor13&backgroundColor=b3ffd1",
                    rating: 4.7,
                    reviewCount: 980,
                    isOnline: true,
                    specialties: [
                        "每日打卡",
                        "习惯养成",
                        "阶段鼓励",
                    ],
                    introduction:
                        "打卡陪跑顾问，帮助用户保持体重、饮食、运动和产品使用记录，适合刚开始管理的用户。",
                    background:
                        "健康社群运营背景，从事用户打卡陪跑、习惯养成和阶段复盘5年。",
                    consultationCount: 1560,
                    successRate: 93,
                    responseTime: 17,
                    price: 220,
                },
                {
                    id: 14,
                    name: "何建华",
                    gender: "男",
                    age: 44,
                    experience: 13,
                    title: "社区服务点负责人",
                    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=doctor14&backgroundColor=d1ffb3",
                    rating: 4.8,
                    reviewCount: 2670,
                    isOnline: true,
                    specialties: ["社区活动", "线下筛查", "服务转介"],
                    introduction:
                        "社区服务点负责人，负责线下健康筛查、用户登记、活动预约和必要时的服务转介。",
                    background:
                        "社区健康服务背景，从事线下服务点运营、健康宣教和用户转介13年。",
                    consultationCount: 3780,
                    successRate: 91,
                    responseTime: 24,
                    price: 360,
                },
                {
                    id: 15,
                    name: "徐美丽",
                    gender: "女",
                    age: 40,
                    experience: 11,
                    title: "睡眠管理顾问",
                    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=doctor15&backgroundColor=ffb3ff",
                    rating: 4.9,
                    reviewCount: 2980,
                    isOnline: false,
                    specialties: [
                        "睡眠记录",
                        "夜间饮食",
                        "节律调整",
                    ],
                    introduction:
                        "睡眠管理顾问，帮助用户记录睡眠质量、夜间饮食和作息变化，提供节律改善参考。",
                    background:
                        "睡眠健康教育背景，从事睡眠记录、节律调整和体重管理支持11年。",
                    consultationCount: 4120,
                    successRate: 96,
                    responseTime: 13,
                    price: 340,
                },
                {
                    id: 16,
                    name: "宋志伟",
                    gender: "男",
                    age: 46,
                    experience: 14,
                    title: "机构合作顾问",
                    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=doctor16&backgroundColor=b3ffff",
                    rating: 4.8,
                    reviewCount: 3340,
                    isOnline: true,
                    specialties: ["机构随访", "服务协同", "健康宣教"],
                    introduction:
                        "机构合作顾问，协助社区、机构和平台服务人员进行用户随访协同与健康宣教安排。",
                    background:
                        "机构健康服务和运营管理背景，从事合作服务流程和用户随访协同14年。",
                    consultationCount: 4560,
                    successRate: 89,
                    responseTime: 28,
                    price: 420,
                },
                {
                    id: 17,
                    name: "韩雪梅",
                    gender: "女",
                    age: 32,
                    experience: 6,
                    title: "体态记录顾问",
                    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=doctor17&backgroundColor=ffffb3",
                    rating: 4.7,
                    reviewCount: 1230,
                    isOnline: true,
                    specialties: [
                        "腰围记录",
                        "体脂记录",
                        "阶段对比",
                    ],
                    introduction:
                        "体态记录顾问，帮助用户记录腰围、体脂和阶段照片等变化，用于自我观察和顾问复盘。",
                    background:
                        "健康记录和用户陪伴服务背景，从事体态变化记录与阶段反馈支持6年。",
                    consultationCount: 1780,
                    successRate: 92,
                    responseTime: 20,
                    price: 270,
                },
                {
                    id: 18,
                    name: "冯国强",
                    gender: "男",
                    age: 52,
                    experience: 20,
                    title: "评估复盘顾问",
                    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=doctor18&backgroundColor=d1d1ff",
                    rating: 4.9,
                    reviewCount: 4560,
                    isOnline: false,
                    specialties: [
                        "健康自测",
                        "服务层级",
                        "风险提示",
                    ],
                    introduction:
                        "评估复盘顾问，帮助用户理解健康自测结果、服务层级建议和需要关注的生活方式因素。",
                    background:
                        "健康评估与用户随访背景，从事健康自测、风险提示和服务匹配20年。",
                    consultationCount: 6780,
                    successRate: 95,
                    responseTime: 40,
                    price: 480,
                },
                {
                    id: 19,
                    name: "田晓红",
                    gender: "女",
                    age: 38,
                    experience: 9,
                    title: "阶段复盘顾问",
                    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=doctor19&backgroundColor=ffd1d1",
                    rating: 4.8,
                    reviewCount: 2100,
                    isOnline: true,
                    specialties: [
                        "平台期复盘",
                        "目标调整",
                        "心理支持",
                    ],
                    introduction:
                        "阶段复盘顾问，擅长陪伴用户面对平台期和短期波动，帮助重新设定可执行的阶段目标。",
                    background:
                        "健康教育与用户陪伴背景，从事平台期复盘、目标调整和情绪支持9年。",
                    consultationCount: 2890,
                    successRate: 94,
                    responseTime: 16,
                    price: 310,
                },
                {
                    id: 20,
                    name: "谢文斌",
                    gender: "男",
                    age: 43,
                    experience: 12,
                    title: "数据趋势顾问",
                    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=doctor20&backgroundColor=d1ffd1",
                    rating: 4.7,
                    reviewCount: 2450,
                    isOnline: true,
                    specialties: ["趋势报告", "数据复盘", "目标追踪"],
                    introduction:
                        "数据趋势顾问，帮助用户复盘体重、腰围、睡眠和打卡趋势，识别可继续优化的生活习惯。",
                    background:
                        "数字健康和数据运营背景，从事趋势报告、目标追踪和用户行为分析12年。",
                    consultationCount: 3450,
                    successRate: 90,
                    responseTime: 23,
                    price: 370,
                },
            ],
        };
    },
    computed: {
        filteredDoctors() {
            let filtered = this.doctors;

            // 按搜索关键词筛选
            if (this.searchKeyword) {
                const keyword = this.searchKeyword.toLowerCase();
                filtered = filtered.filter(
                    (doctor) =>
                        doctor.name.toLowerCase().includes(keyword) ||
                        doctor.specialties.some((specialty) =>
                            specialty.toLowerCase().includes(keyword),
                        ) ||
                        doctor.introduction.toLowerCase().includes(keyword),
                );
            }

            return filtered;
        },
    },
    methods: {
        async loadDoctors() {
            try {
                this.loading = true;
                // 模拟API调用延迟
                await new Promise((resolve) => setTimeout(resolve, 1000));
                this.loading = false;
            } catch (error) {
                console.error("加载顾问列表失败:", error);
                this.loading = false;
            }
        },

        handleSearch() {
            // 搜索逻辑已在computed中处理
        },

        viewDoctorDetail(doctor) {
            this.selectedDoctor = doctor;
            this.showDetail = true;
        },

        closeDetail() {
            this.showDetail = false;
            this.selectedDoctor = {};
        },

        makeAppointment(doctor) {
            // 跳转到预约页面，传递顾问信息
            uni.navigateTo({
                url: `/pages/psychologist/appointment?doctorId=${doctor.id}&doctorName=${encodeURIComponent(doctor.name)}&doctorTitle=${encodeURIComponent(doctor.title)}&doctorAvatar=${encodeURIComponent(doctor.avatar)}&doctorSpecialties=${encodeURIComponent(doctor.specialties.join(","))}`,
            });
        },

        goBack() {
            uni.navigateBack();
        },

        goToAppointmentRecord() {
            uni.navigateTo({
                url: "/pages/psychologist/record",
            });
        },
    },

    onShow() {
        this.loadDoctors();
    },
};
</script>

<style lang="scss">
.psychologist-container {
    min-height: 100vh;
    background: linear-gradient(
        to bottom,
        #f0f9ff 0%,
        #e0f2fe 50%,
        #f8fafc 100%
    );
    padding-bottom: 40rpx;
}

.header {
    display: flex;
    flex-direction: column;
    padding: 40rpx 30rpx 20rpx;
    background: linear-gradient(135deg, #3b82f6 0%, #60a5fa 50%, #1e3a8a 100%);
    box-shadow: 0 8rpx 24rpx rgba(59, 130, 246, 0.25);
    border: none;

    .header-left {
        display: flex;
        align-items: center;
        margin-bottom: 10rpx;
    }

    .back-arrow {
        font-size: 40rpx;
        margin-right: 20rpx;
        color: rgba(255, 255, 255, 0.8);
    }

    .header-title {
        font-size: 36rpx;
        font-weight: 700;
        color: #ffffff;
    }

    .header-right {
        .appointment-record {
            display: flex;
            align-items: center;
            background: rgba(255, 255, 255, 0.2);
            padding: 12rpx 20rpx;
            border-radius: 20rpx;
            transition: all 0.3s;
            border: 1rpx solid rgba(255, 255, 255, 0.3);
            backdrop-filter: blur(10rpx);

            &:active {
                transform: scale(0.95);
                background: rgba(255, 255, 255, 0.3);
            }

            .record-icon {
                font-size: 24rpx;
                margin-right: 8rpx;
                color: rgba(255, 255, 255, 0.9);
            }

            .record-text {
                font-size: 24rpx;
                color: rgba(255, 255, 255, 0.9);
                font-weight: 600;
            }
        }
    }

    .header-subtitle {
        padding: 0 30rpx 20rpx;

        .subtitle-text {
            font-size: 24rpx;
            color: rgba(255, 255, 255, 0.8);
        }
    }
}

.search-section {
    padding: 20rpx 30rpx;
    background: transparent;

    .search-bar {
        display: flex;
        align-items: center;
        background: rgba(255, 255, 255, 0.8);
        border-radius: 24rpx;
        padding: 20rpx 30rpx;
        border: none;
        box-shadow: 0 4rpx 16rpx rgba(59, 130, 246, 0.1);
        backdrop-filter: blur(10rpx);

        .search-icon {
            font-size: 32rpx;
            margin-right: 15rpx;
            color: #60a5fa;
        }

        .search-input {
            flex: 1;
            font-size: 28rpx;
            color: #1e293b;
            border: none;
            outline: none;
            background: transparent;
        }
    }
}

.doctor-list {
    padding: 0 30rpx;
}

.empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 120rpx 40rpx;
    text-align: center;

    .empty-emoji {
        font-size: 120rpx;
        margin-bottom: 30rpx;
    }

    .empty-text {
        font-size: 32rpx;
        color: white;
        font-weight: bold;
        margin-bottom: 15rpx;
    }

    .empty-desc {
        font-size: 26rpx;
        color: rgba(255, 255, 255, 0.7);
    }
}

.doctor-card {
    background: rgba(255, 255, 255, 0.95);
    border-radius: 24rpx;
    padding: 32rpx;
    margin-bottom: 20rpx;
    box-shadow: 0 8rpx 24rpx rgba(59, 130, 246, 0.12);
    border: none;
    transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    backdrop-filter: blur(20rpx);

    &:hover {
        transform: translateY(-8rpx);
        box-shadow: 0 16rpx 32rpx rgba(59, 130, 246, 0.18);
    }

    &:active {
        transform: translateY(-4rpx) scale(0.99);
        box-shadow: 0 12rpx 28rpx rgba(59, 130, 246, 0.15);
    }

    .card-header {
        display: flex;
        align-items: center;
        margin-bottom: 20rpx;

        .avatar-container {
            position: relative;
            margin-right: 20rpx;

            .doctor-avatar {
                width: 100rpx;
                height: 100rpx;
                border-radius: 50%;
                border: 3rpx solid rgba(255, 255, 255, 0.8);
            }

            .online-status {
                position: absolute;
                bottom: 5rpx;
                right: 5rpx;
                width: 20rpx;
                height: 20rpx;
                border-radius: 50%;
                background: #ccc;
                border: 2rpx solid white;

                &.online {
                    background: #52c41a;
                }
            }
        }

        .doctor-info {
            flex: 1;

            .name-section {
                display: flex;
                align-items: center;
                margin-bottom: 8rpx;

                .doctor-name {
                    font-size: 32rpx;
                    font-weight: 600;
                    color: #1e293b;
                    margin-right: 10rpx;
                }

                .doctor-gender {
                    font-size: 24rpx;
                    opacity: 0.8;
                }
            }

            .basic-info {
                display: flex;
                gap: 15rpx;

                .info-item {
                    font-size: 22rpx;
                    color: #64748b;
                    background: #f1f5f9;
                    padding: 4rpx 12rpx;
                    border-radius: 12rpx;
                    border: 1rpx solid #e2e8f0;
                }
            }
        }

        .rating-section {
            text-align: right;

            .rating {
                display: flex;
                align-items: center;
                justify-content: flex-end;
                margin-bottom: 5rpx;

                .rating-score {
                    font-size: 28rpx;
                    font-weight: bold;
                    color: #333;
                    margin-right: 5rpx;
                }

                .rating-star {
                    font-size: 20rpx;
                }
            }

            .rating-count {
                font-size: 20rpx;
                color: #999;
            }
        }
    }

    .card-content {
        margin-bottom: 20rpx;

        .specialties {
            margin-bottom: 15rpx;

            .specialty-label {
                font-size: 24rpx;
                color: #666;
                margin-right: 10rpx;
            }

            .specialty-tags {
                display: flex;
                flex-wrap: wrap;
                gap: 8rpx;
                margin-top: 8rpx;

                .specialty-tag {
                    font-size: 20rpx;
                    color: var(--theme-color);
                    background: rgba(79, 172, 254, 0.1);
                    padding: 4rpx 12rpx;
                    border-radius: 12rpx;
                }
            }
        }

        .introduction {
            margin-bottom: 15rpx;

            .intro-text {
                font-size: 26rpx;
                color: #666;
                line-height: 1.5;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                line-clamp: 2;
                -webkit-box-orient: vertical;
                overflow: hidden;
            }
        }
    }

    .card-footer {
        display: flex;
        justify-content: flex-end;
        align-items: center;

        .action-buttons {
            .appointment-btn {
                background: var(--theme-color);
                color: white;
                border: none;
                border-radius: 25rpx;
                padding: 12rpx 30rpx;
                font-size: 26rpx;
                font-weight: bold;
            }
        }
    }
}

.loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 120rpx 40rpx;

    .loading-spinner {
        width: 60rpx;
        height: 60rpx;
        border: 4rpx solid rgba(255, 255, 255, 0.3);
        border-top: 4rpx solid white;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin-bottom: 20rpx;
    }

    .loading-text {
        font-size: 28rpx;
        color: white;
    }
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}

.detail-modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 40rpx;
    animation: fadeIn 0.3s ease;
}

.detail-content {
    background: white;
    border-radius: 24rpx;
    width: 100%;
    max-width: 600rpx;
    max-height: 85vh;
    overflow: hidden;
    box-shadow: 0 20rpx 60rpx rgba(0, 0, 0, 0.3);
    animation: slideUp 0.3s ease;
    display: flex;
    flex-direction: column;
}

.detail-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 40rpx 40rpx 20rpx;
    border-bottom: 1rpx solid #f0f0f0;

    .doctor-profile {
        display: flex;
        align-items: center;

        .detail-avatar {
            width: 80rpx;
            height: 80rpx;
            border-radius: 50%;
            margin-right: 20rpx;
        }

        .profile-info {
            .detail-name {
                display: block;
                font-size: 32rpx;
                font-weight: bold;
                color: #333;
                margin-bottom: 8rpx;
            }

            .detail-title {
                font-size: 24rpx;
                color: #666;
            }
        }
    }

    .close-btn {
        width: 60rpx;
        height: 60rpx;
        border-radius: 50%;
        background: #f5f5f5;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 40rpx;
        color: #999;
        font-weight: 300;
    }
}

.detail-body {
    padding: 40rpx;
    flex: 1;
    overflow-y: auto;
    box-sizing: border-box;
    min-height: 0;
}

.detail-section {
    margin-bottom: 30rpx;

    .section-label {
        display: block;
        font-size: 26rpx;
        color: #666;
        margin-bottom: 15rpx;
        font-weight: bold;
    }

    .info-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 20rpx;

        .info-item {
            .info-label {
                display: block;
                font-size: 22rpx;
                color: #999;
                margin-bottom: 8rpx;
            }

            .info-value {
                font-size: 26rpx;
                color: #333;
                font-weight: bold;
            }
        }
    }

    .specialty-list {
        display: flex;
        flex-wrap: wrap;
        gap: 10rpx;

        .specialty-item {
            font-size: 22rpx;
            color: var(--theme-color);
            background: rgba(79, 172, 254, 0.1);
            padding: 8rpx 16rpx;
            border-radius: 15rpx;
        }
    }

    .detail-intro,
    .detail-background {
        font-size: 26rpx;
        color: #333;
        line-height: 1.6;
        word-wrap: break-word;
        word-break: break-all;
        white-space: pre-wrap;
        display: block;
    }
}

.detail-footer {
    padding: 20rpx 40rpx 40rpx;

    .detail-appointment-btn {
        width: 100%;
        height: 80rpx;
        background: var(--theme-color);
        color: white;
        border-radius: 40rpx;
        font-size: 30rpx;
        font-weight: bold;
        border: none;
    }
}

@keyframes fadeIn {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}

@keyframes slideUp {
    from {
        opacity: 0;
        transform: translateY(50rpx);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>
