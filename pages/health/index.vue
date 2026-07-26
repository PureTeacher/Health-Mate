<template>
    <view
        :class="['health-container', containerClasses]"
        :style="{ '--theme-color': themeColor }"
    >
        <!-- 顶部导航 -->
        <!-- <view class="header">
		  <view class="header-left">
			<text class="back-arrow" @click="goBack">⬅️</text>
			<text class="header-title">科普内容</text>
		  </view>
		  <view class="header-subtitle">
			<text class="subtitle-text">科学减重，健康共管</text>
		  </view>
		</view> -->

        <!-- 分类导航 -->
        <view class="category-section">
            <scroll-view class="category-scroll" scroll-x>
                <view
                    class="category-item"
                    :class="{ active: currentCategory === 'all' }"
                    @click="filterByCategory('all')"
                >
                    <text class="category-icon">📚</text>
                    <text class="category-text">全部</text>
                </view>
                <view
                    class="category-item"
                    :class="{ active: currentCategory === 'mental' }"
                    @click="filterByCategory('mental')"
                >
                    <text class="category-icon">💡</text>
                    <text class="category-text">科学减重</text>
                </view>
                <view
                    class="category-item"
                    :class="{ active: currentCategory === 'nutrition' }"
                    @click="filterByCategory('nutrition')"
                >
                    <text class="category-icon">🍎</text>
                    <text class="category-text">肠道微生态</text>
                </view>
                <view
                    class="category-item"
                    :class="{ active: currentCategory === 'exercise' }"
                    @click="filterByCategory('exercise')"
                >
                    <text class="category-icon">🏃</text>
                    <text class="category-text">饮食运动</text>
                </view>
                <view
                    class="category-item"
                    :class="{ active: currentCategory === 'sleep' }"
                    @click="filterByCategory('sleep')"
                >
                    <text class="category-icon">🌙</text>
                    <text class="category-text">睡眠情绪</text>
                </view>
                <view
                    class="category-item"
                    :class="{ active: currentCategory === 'disease' }"
                    @click="filterByCategory('disease')"
                >
                    <text class="category-icon">⚕️</text>
                    <text class="category-text">产品指南</text>
                </view>
            </scroll-view>
        </view>

        <!-- 文章列表 -->
        <view class="article-list" v-if="!loading">
            <view v-if="filteredArticles.length === 0" class="empty-state">
                <text class="empty-emoji">📚</text>
                <text class="empty-text">暂无相关文章</text>
                <text class="empty-desc">请选择其他分类查看</text>
            </view>

            <view v-else>
                <view
                    v-for="(article, index) in filteredArticles"
                    :key="article.id"
                    class="article-card"
                    @click="viewArticle(article)"
                >
                    <view class="card-header">
                        <view
                            class="article-category"
                            :class="getCategoryClass(article.category)"
                        >
                            <text class="category-text">{{
                                getCategoryName(article.category)
                            }}</text>
                        </view>
                        <view class="article-meta">
                            <text class="read-count"
                                >{{ article.readCount }}阅读</text
                            >
                            <text class="publish-time">{{
                                formatDate(article.publishTime)
                            }}</text>
                        </view>
                    </view>

                    <view class="card-content">
                        <text class="article-title">{{ article.title }}</text>
                        <text class="article-summary">{{
                            article.summary
                        }}</text>

                        <view class="article-tags">
                            <text
                                v-for="tag in article.tags"
                                :key="tag"
                                class="tag"
                            >
                                {{ tag }}
                            </text>
                        </view>
                    </view>

                    <view class="card-footer">
                        <view class="author-info">
                            <text class="author-name">{{
                                article.author
                            }}</text>
                            <text class="author-title">{{
                                article.authorTitle
                            }}</text>
                        </view>
                        <view class="read-more">
                            <text class="read-text">阅读全文</text>
                            <text class="arrow">➡️</text>
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

        <!-- 文章详情弹窗 -->
        <view class="article-modal" v-if="showArticle" @click="closeArticle">
            <view class="article-content" @click.stop>
                <view class="article-header">
                    <view
                        class="article-category"
                        :class="getCategoryClass(selectedArticle.category)"
                    >
                        <text class="category-text">{{
                            getCategoryName(selectedArticle.category)
                        }}</text>
                    </view>
                    <view class="close-btn" @click="closeArticle">×</view>
                </view>

                <view class="article-body">
                    <text class="article-title">{{
                        selectedArticle.title
                    }}</text>

                    <view class="article-meta">
                        <view class="meta-item">
                            <text class="meta-label">作者</text>
                            <text class="meta-value"
                                >{{ selectedArticle.author }} ·
                                {{ selectedArticle.authorTitle }}</text
                            >
                        </view>
                        <view class="meta-item">
                            <text class="meta-label">发布时间</text>
                            <text class="meta-value">{{
                                formatDate(selectedArticle.publishTime)
                            }}</text>
                        </view>
                        <view class="meta-item">
                            <text class="meta-label">阅读量</text>
                            <text class="meta-value">{{
                                selectedArticle.readCount
                            }}</text>
                        </view>
                    </view>

                    <view class="article-tags">
                        <text
                            v-for="tag in selectedArticle.tags"
                            :key="tag"
                            class="tag"
                        >
                            {{ tag }}
                        </text>
                    </view>

                    <view class="article-content-text">
                        <text class="content-text">{{
                            selectedArticle.content
                        }}</text>
                    </view>
                </view>

                <view class="article-footer">
                    <button class="close-btn" @click="closeArticle">
                        关闭
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
            themeColor: "#f093fb",
            loading: true,
            currentCategory: "all",
            showArticle: false,
            selectedArticle: {},
            articles: [
                {
                    id: 1,
                    title: "为什么体重管理要关注肠道微生态",
                    summary:
                        "体重变化不只和热量有关，也和饮食结构、肠道菌群、睡眠情绪及长期习惯相关。",
                    content:
                        "体重管理是一个长期过程。除了控制总能量摄入和增加活动量，肠道微生态、睡眠质量、压力状态和饮食结构都会影响管理效果。轻益点强调以健康档案、持续打卡和顾问随访帮助用户观察趋势，而不是追求短期极端变化。\n\n健康建议仅供参考。如存在明确疾病、用药或严重不适，请咨询医生。",
                    category: "mental",
                    author: "轻益点团队",
                    authorTitle: "健康管理内容组",
                    publishTime: "2024-01-15",
                    readCount: 1256,
                    tags: ["科学减重", "肠道微生态", "长期管理"],
                },
                {
                    id: 2,
                    title: "AKK 菌是什么",
                    summary:
                        "AKK 菌是肠道黏液层相关的重要菌群之一，是体重与代谢健康研究中的前沿方向。",
                    content:
                        "AKK 菌与肠道屏障、代谢状态和炎症水平等方向存在研究关联。轻益点围绕 AKK 菌产品服务，配合健康自测、打卡记录和顾问随访，为用户提供更可持续的体重管理参考。\n\n相关内容用于科普，不构成诊断或治疗建议。",
                    category: "nutrition",
                    author: "轻益点团队",
                    authorTitle: "微生态科普组",
                    publishTime: "2024-01-14",
                    readCount: 892,
                    tags: ["AKK菌", "肠道微生态", "代谢健康"],
                },
                {
                    id: 3,
                    title: "一份更容易坚持的饮食记录法",
                    summary:
                        "不用追求复杂表格，先记录主食、蛋白质、蔬菜、加餐和饮水，就能帮助发现习惯线索。",
                    content:
                        "饮食记录的目的不是制造压力，而是帮助你看见习惯。建议先记录每餐主食量、蛋白质来源、蔬菜摄入、加餐和饮水。连续记录一到两周后，再结合体重、睡眠和运动变化观察趋势。\n\n如果存在糖尿病、肾病、胃肠疾病等情况，饮食方案应咨询医生或营养师。",
                    category: "exercise",
                    author: "轻益点团队",
                    authorTitle: "生活方式顾问",
                    publishTime: "2024-01-13",
                    readCount: 743,
                    tags: ["饮食记录", "运动", "打卡"],
                },
                {
                    id: 4,
                    title: "睡眠和情绪为什么会影响体重管理",
                    summary:
                        "睡眠不足、压力和情绪进食都可能影响食欲、作息和执行力，建议和体重一起记录。",
                    content:
                        "体重管理不只发生在餐桌和运动场。睡眠不足、压力过高、情绪进食都可能影响食欲、作息和长期执行力。轻益点建议把睡眠时长、睡眠质量和情绪状态纳入打卡记录，用趋势观察替代单日波动。\n\n如果持续失眠、明显情绪困扰或情绪低落，请及时寻求专业帮助。",
                    category: "sleep",
                    author: "轻益点团队",
                    authorTitle: "身心健康顾问",
                    publishTime: "2024-01-12",
                    readCount: 1089,
                    tags: ["睡眠", "情绪", "食欲管理"],
                },
                {
                    id: 5,
                    title: "轻益点产品使用前需要记录什么",
                    summary:
                        "建议先记录身高体重、腰围、目标体重、饮食运动、睡眠情绪和基础健康情况。",
                    content:
                        "开始使用产品服务前，建议先建立基础健康档案，包括身高、体重、腰围、目标体重、饮食运动习惯、睡眠情绪状态和基础健康情况。这样后续才能用趋势看变化，而不是只看单次体重。\n\n如有疾病、用药、备孕、孕期或哺乳等情况，请先咨询医生。",
                    category: "disease",
                    author: "轻益点团队",
                    authorTitle: "产品服务组",
                    publishTime: "2024-01-11",
                    readCount: 1567,
                    tags: ["产品指南", "健康档案", "随访"],
                },
                {
                    id: 6,
                    title: "怎样看待体重平台期",
                    summary:
                        "平台期常见于长期管理过程，建议结合饮食、运动、睡眠、压力和服用依从性一起复盘。",
                    content:
                        "体重平台期并不等于失败。长期管理中，体重、腰围、睡眠、压力、饮食运动和服用依从性都需要一起看。轻益点后续会通过阶段报告帮助用户复盘趋势，并在必要时建议预约顾问。\n\n请避免极端节食或自行停用医生开具的药物。如有医学问题，请咨询医生。",
                    category: "mental",
                    author: "轻益点团队",
                    authorTitle: "健康管理内容组",
                    publishTime: "2024-01-10",
                    readCount: 2134,
                    tags: ["平台期", "趋势报告", "长期管理"],
                },
            ],
        };
    },
    computed: {
        filteredArticles() {
            if (this.currentCategory === "all") {
                return this.articles;
            }
            return this.articles.filter(
                (article) => article.category === this.currentCategory,
            );
        },
    },
    methods: {
        async loadArticles() {
            try {
                this.loading = true;
                // 模拟API调用延迟
                await new Promise((resolve) => setTimeout(resolve, 1000));
                this.loading = false;
            } catch (error) {
                console.error("加载文章失败:", error);
                this.loading = false;
            }
        },

        filterByCategory(category) {
            this.currentCategory = category;
        },

        getCategoryName(category) {
            const categoryMap = {
                mental: "科学减重",
                nutrition: "肠道微生态",
                exercise: "饮食运动",
                sleep: "睡眠情绪",
                disease: "产品指南",
            };
            return categoryMap[category] || "其他";
        },

        getCategoryClass(category) {
            const classMap = {
                mental: "category-mental",
                nutrition: "category-nutrition",
                exercise: "category-exercise",
                sleep: "category-sleep",
                disease: "category-disease",
            };
            return classMap[category] || "category-default";
        },

        formatDate(dateStr) {
            const date = new Date(dateStr);
            const now = new Date();
            const diff = now - date;
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));

            if (days === 0) {
                return "今天";
            } else if (days === 1) {
                return "昨天";
            } else if (days < 7) {
                return `${days}天前`;
            } else {
                return date.toLocaleDateString("zh-CN", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                });
            }
        },

        viewArticle(article) {
            this.selectedArticle = article;
            this.showArticle = true;
        },

        closeArticle() {
            this.showArticle = false;
            this.selectedArticle = {};
        },

        goBack() {
            uni.navigateBack();
        },
    },

    onShow() {
        this.loadArticles();
    },
};
</script>

<style lang="scss">
.health-container {
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
    background: white;
    border-bottom: 1rpx solid #e2e8f0;

    .header-left {
        display: flex;
        align-items: center;
        margin-bottom: 10rpx;
    }

    .back-arrow {
        font-size: 40rpx;
        margin-right: 20rpx;
        color: #64748b;
    }

    .header-title {
        font-size: 36rpx;
        font-weight: 600;
        color: #1e293b;
    }

    .header-subtitle {
        .subtitle-text {
            font-size: 24rpx;
            color: #64748b;
        }
    }
}

.category-section {
    padding: 20rpx 30rpx;
    background: transparent;

    .category-scroll {
        white-space: nowrap;
    }

    .category-item {
        display: inline-flex;
        flex-direction: column;
        align-items: center;
        padding: 20rpx 30rpx;
        margin-right: 20rpx;
        background: rgba(255, 255, 255, 0.8);
        border-radius: 20rpx;
        transition: all 0.3s;
        min-width: 120rpx;
        border: 1rpx solid rgba(0, 0, 0, 0.05);
        backdrop-filter: blur(10rpx);

        &.active {
            background: linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%);
            transform: scale(1.05);
            border-color: #60a5fa;
            box-shadow: 0 8rpx 20rpx rgba(59, 130, 246, 0.25);

            .category-text {
                color: white;
            }
        }

        .category-icon {
            font-size: 32rpx;
            margin-bottom: 8rpx;
            opacity: 0.8;
        }

        .category-text {
            font-size: 22rpx;
            color: #60a5fa;
            font-weight: 600;
        }
    }
}

.article-list {
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
        opacity: 0.6;
    }

    .empty-text {
        font-size: 32rpx;
        color: #64748b;
        font-weight: 600;
        margin-bottom: 15rpx;
    }

    .empty-desc {
        font-size: 26rpx;
        color: #94a3b8;
    }
}

.article-card {
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
        justify-content: space-between;
        align-items: center;
        margin-bottom: 24rpx;

        .article-category {
            padding: 8rpx 16rpx;
            border-radius: 12rpx;
            font-size: 20rpx;
            font-weight: 500;

            &.category-mental {
                background: #dbeafe;
                color: #1d4ed8;
                border: 1rpx solid #bfdbfe;
            }

            &.category-nutrition {
                background: #dcfce7;
                color: #16a34a;
                border: 1rpx solid #bbf7d0;
            }

            &.category-exercise {
                background: #fef3c7;
                color: #d97706;
                border: 1rpx solid #fde68a;
            }

            &.category-sleep {
                background: #e9d5ff;
                color: #7c3aed;
                border: 1rpx solid #ddd6fe;
            }

            &.category-disease {
                background: #fee2e2;
                color: #dc2626;
                border: 1rpx solid #fecaca;
            }

            &.category-default {
                background: #f1f5f9;
                color: #64748b;
                border: 1rpx solid #e2e8f0;
            }
        }

        .article-meta {
            text-align: right;

            .read-count {
                display: block;
                font-size: 20rpx;
                color: #94a3b8;
                margin-bottom: 5rpx;
            }

            .publish-time {
                font-size: 18rpx;
                color: #cbd5e1;
            }
        }
    }

    .card-content {
        margin-bottom: 24rpx;

        .article-title {
            display: block;
            font-size: 30rpx;
            font-weight: 600;
            color: #1e293b;
            margin-bottom: 15rpx;
            line-height: 1.4;
        }

        .article-summary {
            display: block;
            font-size: 24rpx;
            color: #64748b;
            line-height: 1.6;
            margin-bottom: 15rpx;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
        }

        .article-tags {
            display: flex;
            flex-wrap: wrap;
            gap: 10rpx;

            .tag {
                font-size: 18rpx;
                color: #3b82f6;
                background: #f1f5f9;
                padding: 4rpx 12rpx;
                border-radius: 12rpx;
                border: 1rpx solid #e2e8f0;
            }
        }
    }

    .card-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .author-info {
            .author-name {
                display: block;
                font-size: 22rpx;
                color: #1e293b;
                font-weight: 600;
                margin-bottom: 4rpx;
            }

            .author-title {
                font-size: 18rpx;
                color: #94a3b8;
            }
        }

        .read-more {
            display: flex;
            align-items: center;

            .read-text {
                font-size: 22rpx;
                color: #3b82f6;
                margin-right: 8rpx;
            }

            .arrow {
                font-size: 18rpx;
                color: #3b82f6;
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
        border: 4rpx solid #e2e8f0;
        border-top: 4rpx solid #3b82f6;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin-bottom: 20rpx;
    }

    .loading-text {
        font-size: 28rpx;
        color: #64748b;
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

.article-modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 40rpx;
    animation: fadeIn 0.3s ease;
}

.article-content {
    background: white;
    border-radius: 20rpx;
    width: 100%;
    max-width: 600rpx;
    max-height: 85vh;
    overflow: hidden;
    box-shadow: 0 20rpx 60rpx rgba(0, 0, 0, 0.15);
    animation: slideUp 0.3s ease;
    display: flex;
    flex-direction: column;
    border: 1rpx solid #e2e8f0;
}

.article-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 40rpx 40rpx 20rpx;
    border-bottom: 1rpx solid #e2e8f0;

    .article-category {
        padding: 8rpx 16rpx;
        border-radius: 12rpx;
        font-size: 20rpx;
        font-weight: 500;

        &.category-mental {
            background: #dbeafe;
            color: #1d4ed8;
            border: 1rpx solid #bfdbfe;
        }

        &.category-nutrition {
            background: #dcfce7;
            color: #16a34a;
            border: 1rpx solid #bbf7d0;
        }

        &.category-exercise {
            background: #fef3c7;
            color: #d97706;
            border: 1rpx solid #fde68a;
        }

        &.category-sleep {
            background: #e9d5ff;
            color: #7c3aed;
            border: 1rpx solid #ddd6fe;
        }

        &.category-disease {
            background: #fee2e2;
            color: #dc2626;
            border: 1rpx solid #fecaca;
        }
    }

    .close-btn {
        width: 60rpx;
        height: 60rpx;
        border-radius: 50%;
        background: #f1f5f9;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 40rpx;
        color: #64748b;
        font-weight: 300;
        border: 1rpx solid #e2e8f0;
    }
}

.article-body {
    padding: 40rpx;
    flex: 1;
    overflow-y: auto;
    box-sizing: border-box;
    min-height: 0;

    .article-title {
        display: block;
        font-size: 32rpx;
        font-weight: 600;
        color: #1e293b;
        margin-bottom: 20rpx;
        line-height: 1.4;
    }

    .article-meta {
        display: flex;
        flex-direction: column;
        gap: 10rpx;
        margin-bottom: 20rpx;

        .meta-item {
            display: flex;
            justify-content: space-between;

            .meta-label {
                font-size: 22rpx;
                color: #94a3b8;
                font-weight: 500;
            }

            .meta-value {
                font-size: 22rpx;
                color: #1e293b;
                font-weight: 500;
            }
        }
    }

    .article-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 10rpx;
        margin-bottom: 30rpx;

        .tag {
            font-size: 18rpx;
            color: #3b82f6;
            background: #f1f5f9;
            padding: 6rpx 12rpx;
            border-radius: 12rpx;
            border: 1rpx solid #e2e8f0;
        }
    }

    .article-content-text {
        .content-text {
            font-size: 26rpx;
            color: #1e293b;
            line-height: 1.8;
            word-wrap: break-word;
            word-break: break-all;
            white-space: pre-wrap;
            display: block;
        }
    }
}

.article-footer {
    padding: 20rpx 40rpx 40rpx;

    .close-btn {
        width: 100%;
        height: 80rpx;
        background: #3b82f6;
        color: white;
        border-radius: 40rpx;
        font-size: 30rpx;
        font-weight: 600;
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
