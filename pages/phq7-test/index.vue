<template>
    <view
        :class="['test-container', containerClasses]"
        :style="{ '--theme-color': themeColor }"
    >
        <!-- 角色引导区 -->
        <view class="guide-area">
            <text class="guide-emoji">☀️</text>
            <view class="guide-speech">
                <text>Hi~ 我是轻益点健康助手！\n先做自测，再匹配服务方案哦~</text>
            </view>
        </view>

        <!-- 测评分类导航 -->
        <scroll-view class="category-nav" scroll-x>
            <view
                v-for="(item, index) in categories"
                :key="index"
                class="category-item"
                :class="{ active: currentCategory === index }"
                @click="switchCategory(index)"
            >
                <text class="category-emoji">{{ item.emoji }}</text>
                <text>{{ item.name }}</text>
            </view>
        </scroll-view>

        <!-- 测评卡片列表 -->
        <view class="test-list">
            <view
                v-for="test in filteredTests"
                :key="test.id"
                class="test-card"
                @click="startTest(test)"
            >
                <view class="card-badge" v-if="test.isNew">NEW</view>
                <view class="test-cover-emoji">{{ test.emoji }}</view>
                <view class="test-info">
                    <text class="test-title">{{ test.title }}</text>
                    <text class="test-desc">{{ test.description }}</text>
                    <view class="test-meta">
                        <text class="meta-item"
                            >{{ test.questionCount }}题 · 约{{
                                test.duration
                            }}分钟</text
                        >
                    </view>
                </view>
            </view>
        </view>

        <!-- 历史记录入口 -->
        <view class="history-entrance" @click="navToHistory">
            <text>查看历史测评记录</text>
            <text class="emoji">➡️</text>
        </view>

        <!-- 测评说明弹窗 -->
        <uni-popup ref="infoPopup" type="dialog">
            <view class="test-info-popup">
                <text class="popup-title">{{ currentTest.title }}测评说明</text>
                <scroll-view scroll-y class="popup-content">
                    <text>{{ currentTest.detailDescription }}</text>
                    <view class="warning-box">
                        <text class="emoji">⚠️</text
                        >本测评结果仅供参考，不能作为临床诊断依据
                    </view>
                </scroll-view>
                <button class="start-btn" @click="confirmStart">
                    开始测评
                </button>
            </view>
        </uni-popup>
    </view>
</template>

<script>
export default {
    data() {
        return {
            themeColor: "#5d9bff",
            currentCategory: 0,
            currentTest: {},
            categories: [
                {
                    name: "体重管理",
                    emoji: "🎯",
                    type: "planning",
                },
                {
                    name: "生活方式",
                    emoji: "🚀",
                    type: "development",
                },
                {
                    name: "睡眠情绪",
                    emoji: "💡",
                    type: "skills",
                },
                {
                    name: "产品反馈",
                    emoji: "🔄",
                    type: "transformation",
                },
            ],
            testList: [
                {
                    id: "phq7",
                    title: "BMI与体重目标评估",
                    description: "评估体重状态与管理目标",
                    emoji: "🎯",
                    questionCount: 9,
                    duration: 3,
                    type: "planning",
                    path: "/pages/phq7-test/do-test",
                    isNew: false,
                    detailDescription:
                        "本自测用于了解身高体重、腰围、目标体重和基础生活习惯，帮助生成健康管理参考建议。结果仅供参考，不能替代医生诊断。",
                },
                {
                    id: "gad7",
                    title: "饮食运动习惯评估",
                    description: "了解饮食结构、运动频率与执行难点",
                    emoji: "✅",
                    path: "/pages/phq7-test/gad7",
                    questionCount: 7,
                    duration: 3,
                    type: "planning",
                    isNew: true,
                    detailDescription:
                        "本自测用于了解饮食、运动、久坐、加餐等习惯，帮助匹配基础服务、增值服务或尊享服务建议。",
                },
                {
                    id: "cpss",
                    title: "代谢风险初筛",
                    description: "记录基础代谢相关风险因素",
                    emoji: "💪",
                    questionCount: 14,
                    duration: 5,
                    type: "development",
                    path: "/pages/phq7-test/cpss",
                    isNew: false,
                    detailDescription:
                        "本自测用于记录血糖、血脂、脂肪肝、家族史等基础风险因素。如存在明确疾病或用药问题，请咨询医生。",
                },
                {
                    id: "ucla",
                    title: "长期管理准备度",
                    description: "评估打卡、随访和家庭支持情况",
                    emoji: "🌱",
                    questionCount: 20,
                    duration: 5,
                    type: "development",
                    path: "/pages/phq7-test/ucla",
                    isNew: false,
                    detailDescription:
                        "本自测用于了解你是否适合进入长期打卡、顾问随访和阶段趋势报告管理。",
                },
                {
                    id: "its",
                    title: "情绪与食欲评估",
                    description: "观察情绪进食、压力和食欲波动",
                    emoji: "🔧",
                    questionCount: 12,
                    duration: 4,
                    type: "skills",
                    path: "/pages/phq7-test/its",
                    isNew: false,
                    detailDescription:
                        "本自测用于了解压力、情绪进食和食欲波动情况，帮助生成生活方式参考建议。",
                },
                {
                    id: "psqi",
                    title: "睡眠质量评估",
                    description: "观察睡眠时长、质量和白天精力",
                    emoji: "🚀",
                    questionCount: 7,
                    duration: 3,
                    type: "skills",
                    path: "/pages/phq7-test/psqi",
                    isNew: false,
                    detailDescription:
                        "本自测用于了解睡眠与体重管理之间的关联，结果仅供健康管理参考。",
                },
                {
                    id: "sds",
                    title: "产品体验反馈",
                    description: "记录使用体验、依从性与身体反馈",
                    emoji: "⚖️",
                    questionCount: 10,
                    duration: 4,
                    type: "transformation",
                    path: "/pages/phq7-test/sds",
                    isNew: false,
                    detailDescription:
                        "本反馈用于记录产品口感、服用便捷性、依从性和身体感受，帮助后续服务优化。",
                },
            ],
        };
    },
    computed: {
        filteredTests() {
            const currentType = this.categories[this.currentCategory].type;
            return this.testList.filter((item) => item.type === currentType);
        },
    },
    methods: {
        goBack() {
            uni.reLaunch({
                url: "/pages/index/index",
            });
        },
        switchCategory(index) {
            this.currentCategory = index;
        },
        startTest(test) {
            this.currentTest = test;
            this.$refs.infoPopup.open();
        },
        confirmStart() {
            this.$refs.infoPopup.close();
            uni.navigateTo({
                url: this.currentTest.path,
            });
        },
        navToHistory() {
            uni.navigateTo({
                url: "/pages/phq7-test/history",
            });
        },
    },
};
</script>

<style lang="scss">
.test-container {
    min-height: 100vh;
    background: linear-gradient(
        to bottom,
        #f0f9ff 0%,
        #e0f2fe 50%,
        #f8fafc 100%
    );
    padding-bottom: 120rpx;
}

.test-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 30rpx;
    background: linear-gradient(135deg, #3b82f6 0%, #60a5fa 50%, #1e3a8a 100%);
    box-shadow: 0 8rpx 24rpx rgba(59, 130, 246, 0.25);
    border: none;

    .header-left {
        display: flex;
        align-items: center;
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
}

.guide-area {
    display: flex;
    padding: 30rpx;
    background: rgba(255, 255, 255, 0.95);
    margin: 20rpx;
    border-radius: 24rpx;
    box-shadow: 0 8rpx 24rpx rgba(59, 130, 246, 0.12);
    backdrop-filter: blur(20rpx);

    .guide-emoji {
        font-size: 80rpx;
        margin-right: 20rpx;
    }

    .guide-speech {
        flex: 1;
        background: linear-gradient(
            135deg,
            rgba(59, 130, 246, 0.05) 0%,
            rgba(96, 165, 250, 0.05) 100%
        );
        padding: 20rpx;
        border-radius: 16rpx;
        position: relative;
        border: 1rpx solid rgba(59, 130, 246, 0.1);

        &::before {
            content: "";
            position: absolute;
            left: -16rpx;
            top: 30rpx;
            border-width: 10rpx;
            border-style: solid;
            border-color: transparent rgba(59, 130, 246, 0.05) transparent
                transparent;
        }

        text {
            font-size: 28rpx;
            line-height: 1.6;
            color: #333;
        }
    }
}

.category-nav {
    white-space: nowrap;
    padding: 20rpx 0;
    margin: 0 30rpx;

    .category-item {
        display: inline-flex;
        flex-direction: column;
        align-items: center;
        padding: 0 30rpx;
        opacity: 0.6;
        transition: all 0.3s;

        &.active {
            opacity: 1;
            transform: scale(1.05);
            text {
                color: #60a5fa;
                font-weight: 700;
            }
        }

        .category-emoji {
            font-size: 50rpx;
            margin-bottom: 10rpx;
        }

        text {
            font-size: 26rpx;
            color: #666;
        }
    }
}

.test-list {
    padding: 0 30rpx;
}

.test-card {
    background: rgba(255, 255, 255, 0.95);
    border-radius: 24rpx;
    margin-bottom: 30rpx;
    overflow: hidden;
    position: relative;
    box-shadow: 0 8rpx 24rpx rgba(59, 130, 246, 0.12);
    display: flex;
    height: 200rpx;
    transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    backdrop-filter: blur(20rpx);

    &:hover {
        transform: translateY(-8rpx);
        box-shadow: 0 16rpx 32rpx rgba(59, 130, 246, 0.18);
    }

    .card-badge {
        position: absolute;
        top: 20rpx;
        right: 20rpx;
        background: #3b82f6;
        color: white;
        padding: 4rpx 12rpx;
        border-radius: 20rpx;
        font-size: 22rpx;
        z-index: 2;
        font-weight: 700;
    }

    .test-cover-emoji {
        width: 220rpx;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 80rpx;
        background: linear-gradient(
            135deg,
            rgba(59, 130, 246, 0.08) 0%,
            rgba(59, 130, 246, 0.04) 100%
        );
    }

    .test-info {
        flex: 1;
        padding: 25rpx;
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        .test-title {
            font-size: 32rpx;
            font-weight: bold;
            color: #333;
        }

        .test-desc {
            font-size: 26rpx;
            color: #666;
            margin: 10rpx 0;
        }

        .test-meta {
            display: flex;
            font-size: 24rpx;
            color: #999;

            .meta-item {
                margin-right: 10rpx;
            }
        }
    }
}

.history-entrance {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 25rpx;
    background: rgba(255, 255, 255, 0.95);
    margin: 40rpx 30rpx 0;
    border-radius: 24rpx;
    color: #60a5fa;
    font-size: 28rpx;
    font-weight: 600;
    box-shadow: 0 8rpx 24rpx rgba(59, 130, 246, 0.12);
    transition: all 0.3s;
    backdrop-filter: blur(20rpx);

    &:hover {
        transform: translateY(-4rpx);
        color: #3b82f6;
    }

    .emoji {
        font-size: 30rpx;
        margin-left: 10rpx;
    }
}

/* 弹窗样式 */
.test-info-popup {
    width: 650rpx;
    padding: 40rpx;
    border-radius: 24rpx;
    background: rgba(255, 255, 255, 0.98);
    box-shadow: 0 20rpx 60rpx rgba(0, 0, 0, 0.2);

    .popup-title {
        display: block;
        text-align: center;
        font-size: 36rpx;
        font-weight: 700;
        margin-bottom: 30rpx;
        color: #60a5fa;
    }

    .popup-content {
        max-height: 60vh;
        margin-bottom: 30rpx;
        font-size: 28rpx;
        line-height: 1.8;
        color: #555;

        .warning-box {
            display: flex;
            align-items: center;
            background: linear-gradient(
                135deg,
                rgba(59, 130, 246, 0.08) 0%,
                rgba(59, 130, 246, 0.04) 100%
            );
            padding: 20rpx;
            border-radius: 16rpx;
            margin-top: 30rpx;
            border: 1rpx solid rgba(59, 130, 246, 0.2);

            .emoji {
                font-size: 36rpx;
                margin-right: 15rpx;
            }

            text {
                flex: 1;
                font-size: 26rpx;
                color: #60a5fa;
                font-weight: 600;
            }
        }
    }

    .start-btn {
        background: linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%);
        color: white;
        border-radius: 24rpx;
        font-weight: 700;
        box-shadow: 0 8rpx 20rpx rgba(59, 130, 246, 0.25);
    }
}
</style>
