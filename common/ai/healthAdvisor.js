export const HEALTH_ADVISOR_TITLE = "轻益点智能顾问";

export const AI_HEALTH_ADVISOR_SYSTEM_PROMPT = [
    "你是轻益点智能健康顾问，服务于瘦益斐浅轻益点体重与代谢健康管理 APP/小程序。",
    "回答只围绕体重与代谢健康管理、肠道微生态、AKK 菌产品服务、健康档案、打卡随访、饮食、运动、睡眠和情绪支持。",
    "可以根据用户提供的 BMI、体重、腰围、体脂、饮食、运动、睡眠、情绪、产品使用和身体反馈，给出温和、可执行的参考建议。",
    "所有建议必须使用谨慎表达，例如辅助、建议、参考、有助于，不承诺效果，不写治愈、保证减重、替代药物或无风险。",
    "涉及疾病、用药、孕期备孕、严重不适、异常指标或疑似不良反应时，必须提示用户咨询医生。AI 建议不能替代医生诊断或治疗。",
    "尊重用户授权、隐私保护和数据安全，不主动索要无关隐私信息。",
].join("\n");

const PROMPT_START = "[轻益点健康顾问上下文]";
const PROMPT_END = "[用户问题]";

const STRONG_LEGACY_AI_PATTERN =
    /(职业伴侣|AI职场顾问|职业规划|职业导师|职场干货|求职|简历|面试|跳槽|晋升|薪资|岗位|Offer-Mate|择途)/i;
const WEAK_LEGACY_AI_PATTERN = /(职业|职场)/;
const HEALTH_ANCHOR_PATTERN =
    /(轻益点|瘦益斐浅|健康|体重|减重|代谢|BMI|腰围|体脂|饮食|运动|睡眠|情绪|肠道|微生态|AKK|打卡|随访|营养|医生|产品)/i;

export function stripHealthAdvisorPrompt(content = "") {
    if (!content) return "";

    const text = String(content);
    const promptEndIndex = text.indexOf(PROMPT_END);
    if (promptEndIndex === -1) {
        return text;
    }

    return text.slice(promptEndIndex + PROMPT_END.length).trim();
}

export function buildHealthAdvisorMessagePayload(msgContent, conversationId) {
    const userContent = stripHealthAdvisorPrompt(msgContent).trim();
    const contextualMsgContent = [
        PROMPT_START,
        AI_HEALTH_ADVISOR_SYSTEM_PROMPT,
        PROMPT_END,
        userContent,
    ].join("\n");

    return {
        msgContent: contextualMsgContent,
        msgType: "text",
        conversationId,
        aiRole: "light_benefit_health_advisor",
        assistantRole: HEALTH_ADVISOR_TITLE,
        productName: "轻益点",
        brandName: "瘦益斐浅",
        businessScenario: "weight_metabolic_health_management",
        systemPrompt: AI_HEALTH_ADVISOR_SYSTEM_PROMPT,
        userVisibleContent: userContent,
    };
}

export function hasLegacyCareerTone(content = "") {
    const text = stripHealthAdvisorPrompt(content);

    if (STRONG_LEGACY_AI_PATTERN.test(text)) {
        return true;
    }

    return WEAK_LEGACY_AI_PATTERN.test(text) && !HEALTH_ANCHOR_PATTERN.test(text);
}

export function normalizeAiConversationTitle(
    title,
    fallback = HEALTH_ADVISOR_TITLE,
) {
    const cleanTitle = stripHealthAdvisorPrompt(title).trim();

    if (
        !cleanTitle ||
        cleanTitle === "新对话" ||
        cleanTitle === "对话详情" ||
        hasLegacyCareerTone(cleanTitle)
    ) {
        return fallback;
    }

    return cleanTitle
        .replace(/职业伴侣|AI职场顾问/g, HEALTH_ADVISOR_TITLE)
        .replace(/职业规划/g, "健康管理")
        .replace(/职业导师/g, "健康顾问")
        .replace(/职场干货/g, "健康科普");
}

export function buildLegacyAiFallback(userContent = "") {
    const question = stripHealthAdvisorPrompt(userContent).trim();
    const questionLine = question
        ? `针对“${question.slice(0, 80)}”，建议先结合身高、体重、腰围、目标体重、近期饮食运动、睡眠情绪和产品使用情况做基础判断。`
        : "建议先补充身高、体重、腰围、目标体重、近期饮食运动、睡眠情绪和产品使用情况，便于获得更贴合的健康管理参考。";

    return [
        "我是轻益点智能健康顾问，可以围绕体重与代谢健康管理、AKK 菌产品服务、健康档案、打卡随访、饮食运动、睡眠情绪提供参考建议。",
        questionLine,
        "你可以先完成健康自测和连续打卡，再按周观察体重、腰围、饮食、运动、睡眠和情绪趋势；如需要更细致的复盘，可预约健康顾问或服务点。",
        "如果涉及疾病、用药、孕期备孕、持续疼痛、严重不适、异常指标或疑似不良反应，请优先咨询医生。AI 建议不能替代医生诊断或治疗。",
    ].join("\n\n");
}

export function sanitizeLegacyAiResponse(content = "", userContent = "") {
    const cleanContent = stripHealthAdvisorPrompt(content).trim();

    if (!hasLegacyCareerTone(cleanContent)) {
        return cleanContent;
    }

    return buildLegacyAiFallback(userContent);
}

export function normalizeMessageRecord(message = {}, latestUserContent = "") {
    const normalizedMessage = { ...message };
    const fromUserId = String(normalizedMessage.fromUserId);

    if (fromUserId === "0") {
        normalizedMessage.msgContent = sanitizeLegacyAiResponse(
            normalizedMessage.msgContent,
            latestUserContent,
        );
    } else {
        normalizedMessage.msgContent = stripHealthAdvisorPrompt(
            normalizedMessage.msgContent,
        );
    }

    return normalizedMessage;
}

export function normalizeConversationPreview(preview = "") {
    const cleanPreview = stripHealthAdvisorPrompt(preview).trim();

    if (!cleanPreview) {
        return "";
    }

    if (hasLegacyCareerTone(cleanPreview)) {
        return "可咨询体重管理、AKK 菌产品服务、打卡随访、饮食运动、睡眠情绪等健康管理问题。";
    }

    return cleanPreview
        .replace(/职业伴侣|AI职场顾问/g, HEALTH_ADVISOR_TITLE)
        .replace(/职业规划/g, "健康管理")
        .replace(/职业导师/g, "健康顾问")
        .replace(/职场干货/g, "健康科普");
}

export function normalizeConversationRecord(conversation = {}) {
    return {
        ...conversation,
        title: normalizeAiConversationTitle(conversation.title),
        lastMessage: normalizeConversationPreview(conversation.lastMessage),
    };
}
