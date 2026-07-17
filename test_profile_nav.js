// 临时回归测试：验证所有 rec-* 推荐企业能在企业画像页正常解析
const fs = require('fs');
const vm = require('vm');

const context = {
  console,
  Math,
  Date,
  JSON,
  Object,
  Array,
  String,
  Number,
  Boolean,
  parseInt,
  parseFloat,
  isNaN,
  isFinite,
  setTimeout,
  setInterval,
  clearTimeout,
  clearInterval,
  Promise
};
vm.createContext(context);

const code = fs.readFileSync('./js/data.js', 'utf8');
vm.runInContext(code, context);

const MockAPI = vm.runInContext('MockAPI', context);
const ALL_ENTERPRISES = vm.runInContext('ALL_ENTERPRISES', context);

const recIds = [
  'rec-1', 'rec-2', 'rec-3', 'rec-4', 'rec-5', 'rec-6',
  'rec-7', 'rec-8', 'rec-9', 'rec-10', 'rec-11'
];

let passCount = 0;
let failCount = 0;

function check(field, value, expectedType) {
  if (value === undefined || value === null) {
    console.error(`  ❌ ${field} 缺失`);
    failCount++;
    return;
  }
  if (expectedType && typeof value !== expectedType) {
    console.error(`  ❌ ${field} 类型错误: ${typeof value}`);
    failCount++;
    return;
  }
  passCount++;
}

(async () => {
  for (const id of recIds) {
    const detail = await MockAPI.getEnterpriseDetail(id);
    if (!detail) {
      console.error(`❌ ${id}: 未找到企业数据`);
      failCount += 8;
      continue;
    }
    console.log(`✅ ${id}: ${detail.name}`);
    check('name', detail.name, 'string');
    check('industry_role', detail.industry_role, 'string');
    check('is_local', detail.is_local, 'boolean');
    check('credit_code', detail.credit_code, 'string');
    check('annual_revenue', detail.annual_revenue, 'number');
    check('employee_count', detail.employee_count, 'number');
    check('registered_capital', detail.registered_capital, 'number');
    check('tags', detail.tags, 'object');
  }

  console.log('\n--- 回归测试其它企业画像跳转 ID ---');
  const otherIds = ['e-a', 'e-b', 'e-c', 'ent-001'];
  for (const id of otherIds) {
    const detail = await MockAPI.getEnterpriseDetail(id);
    console.log(detail ? `✅ ${id}: ${detail.name}` : `❌ ${id}: 未找到`);
    if (!detail) failCount++;
  }

  console.log('\n--- 回归测试产业链图谱“环节企业列表”企业可跳转 ---');
  const nodeIds = ['cr-l4-1', 'cr-l4-5', 'cr-l3-4', 'cr-unknown-node'];
  for (const nodeId of nodeIds) {
    const list = await MockAPI.getNodeEnterprises(nodeId);
    const navigable = list.filter(e => !e.placeholder);
    let nodePass = true;
    for (const e of navigable) {
      const detail = await MockAPI.getEnterpriseDetail(e.id);
      if (!detail) {
        console.error(`❌ ${nodeId} / ${e.name} (${e.id}): 画像解析失败`);
        nodePass = false;
        failCount++;
      }
    }
    if (nodePass) {
      console.log(`✅ ${nodeId}: ${navigable.length} 家企业均可跳转画像页`);
      passCount++;
    }
  }

  console.log('\n--- 异常场景：无效企业 ID ---');
  const invalidDetail = await MockAPI.getEnterpriseDetail('invalid-id-xyz');
  if (invalidDetail === null) {
    console.log('✅ 无效 ID 正确返回 null，画像页将回退到选择企业页');
    passCount++;
  } else {
    console.error('❌ 无效 ID 未返回 null');
    failCount++;
  }

  console.log(`\n结果：通过 ${passCount} 项，失败 ${failCount} 项`);
  process.exit(failCount > 0 ? 1 : 0);
})();
