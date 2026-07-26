import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function read(relativePath) {
    return fs.readFileSync(path.join(root, relativePath), "utf8");
}

const helper = read("common/ai/healthAdvisor.js");
const messagePage = read("pages/message/message.vue");
const detailPage = read("pages/message/conversation-detail.vue");
const listPage = read("pages/message/conversation-list.vue");

function loadHelperExports() {
    const executableSource = helper
        .replaceAll("export const ", "const ")
        .replaceAll("export function ", "function ");

    return new Function(`
        ${executableSource}
        return {
            HEALTH_ADVISOR_TITLE,
            buildHealthAdvisorMessagePayload,
            stripHealthAdvisorPrompt,
            normalizeAiConversationTitle,
            sanitizeLegacyAiResponse,
            normalizeConversationRecord
        };
    `)();
}

const {
    HEALTH_ADVISOR_TITLE,
    buildHealthAdvisorMessagePayload,
    stripHealthAdvisorPrompt,
    normalizeAiConversationTitle,
    sanitizeLegacyAiResponse,
    normalizeConversationRecord,
} = loadHelperExports();

assert.match(
    helper,
    /HEALTH_ADVISOR_TITLE\s*=\s*"轻益点智能顾问"/,
    "AI helper must define the light-benefit health advisor title",
);

assert.match(
    helper,
    /AI_HEALTH_ADVISOR_SYSTEM_PROMPT/,
    "AI helper must define a health-management system prompt",
);

assert.match(
    helper,
    /体重与代谢健康管理/,
    "AI system prompt must anchor answers in weight and metabolic health management",
);

assert.match(
    helper,
    /不能替代医生诊断/,
    "AI system prompt must include medical-compliance disclaimer",
);

assert.match(
    helper,
    /buildHealthAdvisorMessagePayload/,
    "AI helper must expose a request payload builder",
);

assert.match(
    helper,
    /sanitizeLegacyAiResponse/,
    "AI helper must expose a legacy-career-response fallback",
);

assert.match(
    messagePage,
    /buildHealthAdvisorMessagePayload\(\s*userContent\s*,\s*this\.conversationId/,
    "main AI chat page must send health-advisor context with every message",
);

assert.doesNotMatch(
    messagePage,
    /title:\s*"新对话"/,
    "main AI chat page must not create conversations with a generic legacy title",
);

assert.match(
    messagePage,
    /normalizeAiConversationTitle\(/,
    "main AI chat page must normalize backend-provided legacy conversation titles",
);

assert.match(
    messagePage,
    /sanitizeLegacyAiResponse\(/,
    "main AI chat page must sanitize old career-style AI responses",
);

assert.match(
    detailPage,
    /buildHealthAdvisorMessagePayload\(\s*userContent\s*,\s*this\.conversationId/,
    "conversation detail page must send health-advisor context with every message",
);

assert.match(
    detailPage,
    /normalizeMessageRecord\(/,
    "conversation detail page must sanitize old career-style AI responses",
);

assert.match(
    listPage,
    /normalizeConversationRecord\(/,
    "conversation list must normalize legacy titles and previews before display",
);

const payload = buildHealthAdvisorMessagePayload("我想做体重管理", "conv-1");
assert.equal(payload.assistantRole, HEALTH_ADVISOR_TITLE);
assert.match(payload.msgContent, /体重与代谢健康管理/);
assert.equal(stripHealthAdvisorPrompt(payload.msgContent), "我想做体重管理");

assert.equal(normalizeAiConversationTitle("职业伴侣"), HEALTH_ADVISOR_TITLE);
assert.match(
    sanitizeLegacyAiResponse("我是你的职业伴侣，可以帮你准备简历。", "我想减重"),
    /轻益点智能健康顾问/,
);

assert.deepEqual(
    normalizeConversationRecord({
        title: "AI职场顾问",
        lastMessage: "我可以帮你做职业规划。",
    }),
    {
        title: HEALTH_ADVISOR_TITLE,
        lastMessage:
            "可咨询体重管理、AKK 菌产品服务、打卡随访、饮食运动、睡眠情绪等健康管理问题。",
    },
);

console.log("AI health advisor contract passed");
