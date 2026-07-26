<template>
    <view :class="['about-page', containerClasses]">
        <view class="about-content">
            <view class="section">
                <text class="section-title">应用信息</text>
                <view class="item">
                    <text class="label">应用名称</text>
                    <text class="value">轻益点</text>
                </view>
                <view class="item">
                    <text class="label">版本号</text>
                    <text class="value">1.1.0</text>
                </view>
                <view class="item">
                    <text class="label">描述</text>
                    <text class="value">
                        轻益点是一款体重与代谢健康管理应用，围绕 AKK 菌产品服务、健康自测、AI 顾问、健康档案和随访支持，为用户提供科学、持续、可追踪的健康管理参考。
                    </text>
                </view>
            </view>

            <view class="section">
                <text class="section-title">联系我们</text>
                <view class="item">
                    <text class="label">邮箱</text>
                    <text class="value">support@bioslim.com</text>
                </view>
                <view class="item">
                    <text class="label">电话</text>
                    <text class="value">400-123-4567</text>
                </view>
                <view class="item">
                    <text class="label">地址</text>
                    <text class="value">北京市朝阳区</text>
                </view>
            </view>

            <view class="section">
                <text class="section-title">法律声明</text>
                <text class="tips">
                    本应用所有健康内容仅供参考，不能替代医生诊断或治疗建议。如有疾病、用药或严重不适问题，请咨询医生。
                </text>
            </view>

            <view class="footer">
                <text class="footer-text"
                    >© 2026 瘦益斐浅. All rights reserved.</text
                >
            </view>
        </view>
    </view>
</template>

<script>
export default {
    data() {
        return {};
    },
    computed: {
        containerClasses() {
            if (this.$store) {
                return this.$store.state.theme.isDarkMode ? "dark-mode" : "";
            }
            return "";
        },
    },
    methods: {},
    onLoad() {
        uni.setNavigationBarTitle({
            title: "关于我们",
        });
    },
};
</script>

<style scoped lang="scss">
.about-page {
    background: linear-gradient(
        to bottom,
        #f0f9ff 0%,
        #e0f2fe 50%,
        #f8fafc 100%
    );
    min-height: 100vh;
}

.about-content {
    padding: 20rpx;
}

.section {
    margin-bottom: 25rpx;
    background: rgba(255, 255, 255, 0.95);
    border-radius: 24rpx;
    padding: 25rpx;
    box-shadow: 0 8rpx 24rpx rgba(59, 130, 246, 0.12);
    backdrop-filter: blur(20rpx);
}

.section-title {
    display: block;
    font-size: 28rpx;
    font-weight: 700;
    color: #60a5fa;
    margin-bottom: 20rpx;
}

.item {
    display: flex;
    padding: 15rpx 0;
    border-bottom: 1rpx solid #eee;
    flex-direction: column;
}

.item:last-child {
    border-bottom: none;
}

.label {
    font-size: 22rpx;
    color: #60a5fa;
    font-weight: 500;
    margin-bottom: 5rpx;
}

.value {
    font-size: 22rpx;
    color: #666;
    line-height: 1.5;
}

.tips {
    display: block;
    font-size: 22rpx;
    color: #666;
    line-height: 1.6;
}

.footer {
    display: flex;
    justify-content: center;
    padding: 50rpx 20rpx 30rpx;
}

.footer-text {
    font-size: 20rpx;
    color: #999;
}
</style>
