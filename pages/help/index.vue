<template>
    <view :class="['help-page', containerClasses]">
        <!-- 帮助内容 -->
        <view class="help-content">
            <!-- 快速导航 -->
            <view class="section">
                <text class="section-title">快速导航</text>
                <view class="quick-nav">
                    <view
                        class="nav-item"
                        @click="scrollToSection('getting-started')"
                    >
                        <text class="nav-icon">🚀</text>
                        <text class="nav-text">快速开始</text>
                    </view>
                    <view class="nav-item" @click="scrollToSection('features')">
                        <text class="nav-icon">✨</text>
                        <text class="nav-text">功能介绍</text>
                    </view>
                    <view class="nav-item" @click="scrollToSection('faq')">
                        <text class="nav-icon">❓</text>
                        <text class="nav-text">常见问题</text>
                    </view>
                    <view class="nav-item" @click="scrollToSection('contact')">
                        <text class="nav-icon">📞</text>
                        <text class="nav-text">联系我们</text>
                    </view>
                </view>
            </view>

            <!-- 快速开始 -->
            <view class="section" id="getting-started">
                <text class="section-title">🚀 快速开始</text>
                <view class="help-card">
                    <text class="card-title">第一步：注册账号</text>
                    <text class="card-text">
                        下载应用后点击"注册"，使用邮箱或手机号创建您的账号，设置安全的密码。
                    </text>
                </view>
                <view class="help-card">
                    <text class="card-title">第二步：完善个人信息</text>
                    <text class="card-text">
                        登录后进入个人中心，完善头像、性别、年龄等信息，帮助我们更好地为您服务。
                    </text>
                </view>
                <view class="help-card">
                    <text class="card-title">第三步：开始使用功能</text>
                    <text class="card-text">
                        浏览健康自测、AI 健康顾问、顾问预约、科普内容等核心功能。
                    </text>
                </view>
            </view>

            <!-- 功能介绍 -->
            <view class="section" id="features">
                <text class="section-title">✨ 功能介绍</text>

                <view class="help-card">
                    <text class="card-title">健康自测</text>
                    <text class="card-text">
                        收集 BMI、体重目标、饮食、运动、睡眠、情绪等信息，用于生成健康管理参考建议。
                    </text>
                </view>

                <view class="help-card">
                    <text class="card-title">顾问随访</text>
                    <text class="card-text">
                        可预约健康顾问、营养师或线下服务点，获得产品使用和生活方式管理参考。
                    </text>
                </view>

                <view class="help-card">
                    <text class="card-title">健康记录追踪</text>
                    <text class="card-text">
                        记录并追踪健康自测、打卡和随访记录，帮助观察体重与生活习惯变化。
                    </text>
                </view>

                <view class="help-card">
                    <text class="card-title">消息通知</text>
                    <text class="card-text">
                        接收顾问预约确认、打卡提醒、健康建议等重要信息。
                    </text>
                </view>

                <view class="help-card">
                    <text class="card-title">隐私保护</text>
                    <text class="card-text">
                        所有个人信息和健康数据都应在用户授权范围内使用，并采取必要的隐私保护措施。
                    </text>
                </view>
            </view>

            <!-- 常见问题 -->
            <view class="section" id="faq">
                <text class="section-title">❓ 常见问题</text>

                <view class="help-card">
                    <text class="card-title">Q: 我的数据安全吗？</text>
                    <text class="card-text">
                        A:
                        是的，我们采用业界领先的加密技术保护您的所有数据。所有个人信息和测试结果都被加密存储在安全的服务器上。我们遵守最严格的数据隐私政策，绝不向第三方泄露您的信息。
                    </text>
                </view>

                <view class="help-card">
                    <text class="card-title">Q: 如何修改我的账号信息？</text>
                    <text class="card-text">
                        A: 进入个人中心 →
                        账号管理，您可以修改邮箱、手机号、头像等信息。
                    </text>
                </view>

                <view class="help-card">
                    <text class="card-title">Q: 忘记密码怎么办？</text>
                    <text class="card-text">
                        A:
                        在登录页面点击"忘记密码"，通过邮箱或手机号验证后可以重置密码。
                    </text>
                </view>

                <view class="help-card">
                    <text class="card-title">Q: 平台顾问是否真实存在？</text>
                    <text class="card-text">
                        A: 健康顾问、营养师和服务点信息会在平台内展示资质与服务范围，便于用户选择。
                    </text>
                </view>

                <view class="help-card">
                    <text class="card-title">Q: 如何取消或修改预约？</text>
                    <text class="card-text">
                        A:
                        进入我的预约，选择要修改的预约，点击"修改"或"取消"按钮。建议提前与顾问或服务点沟通。
                    </text>
                </view>

                <view class="help-card">
                    <text class="card-title">Q: 测试结果是否可信？</text>
                    <text class="card-text">
                        A:
                        健康自测结果仅用于健康管理参考，不能替代医生诊断或治疗建议。
                    </text>
                </view>
            </view>

            <!-- 联系我们 -->
            <view class="section" id="contact">
                <text class="section-title">📞 联系我们</text>

                <view class="help-card">
                    <text class="card-title">遇到问题？</text>
                    <text class="card-text">
                        如果您遇到任何问题或有建议，欢迎通过以下方式联系我们：
                    </text>
                </view>

                <view class="contact-methods">
                    <view class="method" @click="goToFeedback">
                        <text class="method-icon">💬</text>
                        <view class="method-info">
                            <text class="method-name">在线反馈</text>
                            <text class="method-desc">提交反馈和建议</text>
                        </view>
                    </view>
                    <view class="method">
                        <text class="method-icon">✉️</text>
                        <view class="method-info">
                            <text class="method-name">电子邮箱</text>
                            <text class="method-desc"
                                >support@bioslim.com</text
                            >
                        </view>
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
export default {
    methods: {
        goBack() {
            uni.navigateBack();
        },
        scrollToSection(sectionId) {
            // 简单实现，uni-app中可能需要使用scroll-into-view
            const query = uni.createSelectorQuery();
            query
                .select(`#${sectionId}`)
                .boundingClientRect((rect) => {
                    if (rect) {
                        uni.pageScrollTo({
                            duration: 300,
                        });
                    }
                })
                .exec();
        },
        goToFeedback() {
            uni.navigateTo({
                url: "/pages/feedback/index",
            });
        },
    },
    computed: {
        containerClasses() {
            if (this.$store) {
                return this.$store.state.theme.isDarkMode ? "dark-mode" : "";
            }
            return "";
        },
    },
};
</script>

<style lang="scss" scoped>
.help-page {
    background: linear-gradient(
        to bottom,
        #f0f9ff 0%,
        #e0f2fe 50%,
        #f8fafc 100%
    );
    min-height: 100vh;
    padding-bottom: 30rpx;

    &.dark-mode {
        background: #1a1a1a;
    }
}

/* 帮助内容 */
.help-content {
    padding: 20rpx;
}

.section {
    margin-bottom: 30rpx;
}

.section-title {
    display: block;
    font-size: 32rpx;
    font-weight: 700;
    color: #3b82f6;
    margin-bottom: 15rpx;
    padding-bottom: 10rpx;
    border-bottom: 3rpx solid #60a5fa;

    .dark-mode & {
        color: #fff;
    }
}

.quick-nav {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 15rpx;
    margin-bottom: 20rpx;
}

.nav-item {
    background: rgba(255, 255, 255, 0.95);
    border-radius: 24rpx;
    padding: 20rpx;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 8rpx 24rpx rgba(59, 130, 246, 0.12);
    backdrop-filter: blur(20rpx);

    .dark-mode & {
        background: #2a2a2a;
    }

    &:hover {
        transform: translateY(-4rpx);
        box-shadow: 0 12rpx 32rpx rgba(59, 130, 246, 0.18);
    }

    &:active {
        opacity: 0.8;
        transform: scale(0.98);
    }

    .nav-icon {
        font-size: 40rpx;
        margin-bottom: 10rpx;
    }

    .nav-text {
        font-size: 24rpx;
        color: #60a5fa;
        font-weight: 700;

        .dark-mode & {
            color: #fff;
        }
    }
}

.help-card {
    background: rgba(255, 255, 255, 0.95);
    border-radius: 24rpx;
    padding: 20rpx;
    margin-bottom: 15rpx;
    border-left: 4rpx solid #3b82f6;
    box-shadow: 0 8rpx 24rpx rgba(59, 130, 246, 0.12);
    backdrop-filter: blur(20rpx);

    .dark-mode & {
        background: #2a2a2a;
    }

    .card-title {
        display: block;
        font-size: 26rpx;
        font-weight: 700;
        color: #60a5fa;
        margin-bottom: 10rpx;

        .dark-mode & {
            color: #fff;
        }
    }

    .card-text {
        display: block;
        font-size: 24rpx;
        color: #666;
        line-height: 1.6;

        .dark-mode & {
            color: #ccc;
        }
    }
}

.contact-methods {
    display: flex;
    flex-direction: column;
    gap: 15rpx;
}

.method {
    background: rgba(255, 255, 255, 0.95);
    border-radius: 24rpx;
    padding: 20rpx;
    display: flex;
    align-items: center;
    gap: 15rpx;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 8rpx 24rpx rgba(59, 130, 246, 0.12);
    backdrop-filter: blur(20rpx);

    .dark-mode & {
        background: #2a2a2a;
    }

    &:hover {
        transform: translateY(-4rpx);
    }

    &:active {
        opacity: 0.8;
    }

    .method-icon {
        font-size: 40rpx;
    }

    .method-info {
        flex: 1;
        display: flex;
        flex-direction: column;

        .method-name {
            display: block;
            font-size: 26rpx;
            font-weight: 700;
            color: #60a5fa;
            margin-bottom: 5rpx;

            .dark-mode & {
                color: #fff;
            }
        }

        .method-desc {
            display: block;
            font-size: 22rpx;
            color: #999;

            .dark-mode & {
                color: #999;
            }
        }
    }
}
</style>
