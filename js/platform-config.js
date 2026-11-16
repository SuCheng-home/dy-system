/**
 * 统建四大平台应用配置：统一公共数据平台 / 统一应用管理 / 开放式平台 / 公共数据中心
 * 页面清单逐条对应 素材/<应用>/xuqiu.txt；数据为演示口径，后续对接现有前后端。
 * 表格列 type：check / drag / link('文本>页面key') / tag('文本|tone') / chips / avatar / seal / ops / mono
 * ops 项：'文本>页面key' 为跳转，其余为演示按钮；删除类自动标红。
 */
window.DY = window.DY || {};

(function () {
  const P = {};
  DY.PLATFORM = P;

  P.APPS = [
    {
      key: 'dp', name: '统一公共数据平台', short: '公共数据平台', en: 'Unified Public Data Platform',
      icon: 'database', color: '#1677ff',
      intro: '全校人员、组织、场地、教务与学籍基础数据的统一维护入口，为各业务应用提供唯一可信数据源。',
    },
    {
      key: 'appc', name: '统一应用管理', short: '应用中心', en: 'Unified Application Center',
      icon: 'appstore', color: '#0d9488',
      intro: '集成校内与第三方应用，按角色、按教师统一授权访问，集中管控登录安全策略。',
    },
    {
      key: 'open', name: '开放式平台', short: '开放平台', en: 'Open API Platform',
      icon: 'api', color: '#d97706',
      intro: '面向第三方开放基础数据与业务数据 API，统一应用注册、接口授权、文档与调用监控。',
    },
    {
      key: 'std', name: '公共数据中心', short: '数据标准中心', en: 'Data Standards Center',
      icon: 'layers', color: '#1f7a3a',
      intro: '学校信息化管理标准体系：信息标准、代码编码标准、技术标准与管理规范，保障数据统一交换与共享。',
    },
  ];

  const CAMPUS = ['本部校区', '城南校区'];

  /* ============================================================
   * 1. 统一公共数据平台
   * ============================================================ */
  const TEACHER_ROWS = [
    ['', '潘国良', '10001', '校长室、化学', '校长', '138****2201', '在职|ok', ['编辑', '权限配置>teacher-perm', '重置密码', '禁用']],
    ['', '顾准山', '10002', '校长室、数学', '副校长', '139****1873', '在职|ok', ['编辑', '权限配置>teacher-perm', '重置密码', '禁用']],
    ['', '王伟', '10003', '校长室、历史', '副校长', '137****5520', '在职|ok', ['编辑', '权限配置>teacher-perm', '重置密码', '禁用']],
    ['', '陈秀娟', '10004', '办公室、语文', '学校管理员', '135****0912', '在职|ok', ['编辑', '权限配置>teacher-perm', '重置密码', '禁用']],
    ['', '苏诚', '10005', '教务处、数学', '教务管理员', '130****2952', '在职|ok', ['编辑', '权限配置>teacher-perm', '重置密码', '禁用']],
    ['', '吴福舟', '10006', '高二年级部、信息', '年级主任', '136****7781', '在职|ok', ['编辑', '权限配置>teacher-perm', '重置密码', '禁用']],
    ['', '巴展翔', '10007', '政治、高三年级组', '班主任', '139****6604', '在职|ok', ['编辑', '权限配置>teacher-perm', '重置密码', '禁用']],
    ['', '白玉娜', '10008', '教辅', '任课教师', '158****3317', '已禁用|muted', ['编辑', '权限配置>teacher-perm', '重置密码', '启用']],
    ['', '包云娟', '10009', '高三年级部、数学', '班主任', '187****4409', '在职|ok', ['编辑', '权限配置>teacher-perm', '重置密码', '禁用']],
    ['', '边卫刚', '10010', '语文、高三年级组', '任课教师', '152****8826', '在职|ok', ['编辑', '权限配置>teacher-perm', '重置密码', '禁用']],
  ];

  const DEPT_TREE = [
    {
      label: '江苏省丹阳高级中学', open: true, children: [
        { label: '校长室' }, { label: '办公室' }, { label: '教务处', active: true }, { label: '学生发展处' },
        { label: '总务处' }, { label: '高一年级部' }, { label: '高二年级部' }, { label: '高三年级部' }, { label: '教辅' },
      ],
    },
  ];

  P.ROLES = [
    { key: 'admin', name: '系统管理员', desc: '平台全部功能', members: ['陈秀娟'], level: 1 },
    { key: 'principal', name: '校长室', desc: '全校数据查看与审批', members: ['潘国良', '顾准山', '王伟'], level: 0.8 },
    { key: 'academic', name: '教务管理员', desc: '课程、排课、考试、学籍', members: ['苏诚', '吴福舟'], level: 0.6 },
    { key: 'grade', name: '年级主任', desc: '本年级班级与学生', members: ['吴福舟', '包云娟'], level: 0.45 },
    { key: 'head', name: '班主任', desc: '本班学生、家校、评价', members: ['巴展翔', '包云娟'], level: 0.35 },
    { key: 'teacher', name: '任课教师', desc: '日常办公与教学', members: ['边卫刚', '白玉娜', '步飞', '步金花'], level: 0.25 },
    { key: 'logistics', name: '后勤人员', desc: '报修、资产、宿舍', members: ['步月华'], level: 0.2 },
    { key: 'temp', name: '临时人员', desc: '临时教师 / 校外人员', members: ['(57 人)'], level: 0.1 },
  ];

  P.TEMP_STATS = {
    kpis: [
      ['累计临时人员', '1,284', ''], ['当前临时人员', '57', ''], ['待审核', '12', 'warn'],
      ['转正数量', '86', 'ok'], ['转正比例', '6.7%', 'ok'],
    ],
    types: [
      ['临时学生', 312, 18, 4, 41, 2],
      ['临时校友', 205, 9, 3, 37, 1],
      ['临时教师', 46, 6, 1, 8, 0],
      ['校外人员', 721, 24, 4, 0, 6],
    ],
    forms: [['访客登记', 486], ['活动报名', 352], ['问卷调查', 214], ['电子签到', 168], ['招聘报名', 64]],
    sources: [['流程审批', 38, '#1677ff'], ['数据收集', 34, '#0d9488'], ['电子签到', 28, '#d97706']],
    monthly: [['5月', 120], ['6月', 168], ['7月', 64], ['8月', 92], ['9月', 236], ['10月', 284], ['11月', 198]],
    daily: [4, 7, 3, 9, 12, 6, 5, 11, 8, 14, 10, 6, 9, 13],
  };

  P.MENUS = {};
  P.MENUS.dp = [
    {
      group: '概览', items: [
        { key: 'overview', label: '平台概览', icon: 'board', view: 'dpOverview', desc: '基础数据规模、模块入口与数据完整度一览。' },
      ],
    },
    {
      group: '人员管理', items: [
        {
          key: 'teachers', label: '教师管理', icon: 'teacher', count: '412 人', view: 'table',
          desc: '添加人员，批量录入 / 批量更新教师信息，导出教师信息，重置登录密码；可为指定人员配置 WEB 端与移动端功能权限。',
          tree: DEPT_TREE,
          filters: [{ select: ['全部状态', '在职', '已禁用'] }, { search: '姓名 / 工号 / 手机号' }],
          actions: ['*添加人员', '批量录入', '批量更新', '导出'],
          columns: [
            { type: 'check' }, { label: '姓名', type: 'link', align: 'left' }, { label: '工号' },
            { label: '部门', align: 'left' }, { label: '角色' }, { label: '手机号' },
            { label: '状态', type: 'tag' }, { label: '操作', type: 'ops' },
          ],
          rows: TEACHER_ROWS, total: 412,
        },
        {
          key: 'teacher-perm', label: '人员权限配置', hidden: true, parent: 'teachers', view: 'permEditor', mode: 'person',
          desc: '为指定人员单独配置 WEB 端以及移动端各个功能的使用权限，优先级高于角色权限。',
        },
        {
          key: 'roles', label: '角色权限', icon: 'shield', count: '8 个角色', view: 'permEditor', mode: 'role',
          desc: '自定义各类角色，设置角色名称及人员；为角色配置 WEB 端以及移动端各个功能的使用权限。',
        },
        {
          key: 'temp-stats', label: '临时人员统计', icon: 'analytics', count: '57 人', view: 'tempStats',
          desc: '累计 / 当前临时人员、待审核、转正数量及比例；各类型人数、常用表单、来源途径、月度使用、审核情况与每日新增。',
        },
      ],
    },
    {
      group: '学校与组织', items: [
        { key: 'school', label: '学校设置', icon: 'dorm', count: '2 个校区', view: 'school', desc: '创建主校区，编辑名称、性质、简介与校徽；为主校区创建分校区并排序。' },
        { key: 'semester', label: '学年学期', icon: 'calendar', count: '2026-2027', view: 'semester', desc: '设置学校的学年与学期信息，并自动生成校历。' },
        {
          key: 'dept', label: '部门设置', icon: 'org', count: '18 个', view: 'table',
          desc: '按校区添加部门，设置部门名称与所在场地，自动关联所属人员名单；支持批量录入 / 更新、导出与拖拽排序。',
          filters: [{ select: CAMPUS }, { search: '部门名称' }],
          actions: ['*新增部门', '批量录入', '批量更新', '导出'],
          columns: [
            { type: 'drag' }, { label: '部门名称', align: 'left' }, { label: '所在场地' }, { label: '负责人' },
            { label: '人员数', type: 'link' }, { label: '操作', type: 'ops' },
          ],
          rows: [
            ['', '校长室', '行政楼 3F 301', '潘国良', '3>teachers', ['编辑', '人员名单>teachers', '删除']],
            ['', '办公室', '行政楼 3F 305', '陈秀娟', '6>teachers', ['编辑', '人员名单>teachers', '删除']],
            ['', '教务处', '行政楼 2F 201', '苏诚', '9>teachers', ['编辑', '人员名单>teachers', '删除']],
            ['', '学生发展处', '行政楼 2F 210', '吴福舟', '7>teachers', ['编辑', '人员名单>teachers', '删除']],
            ['', '总务处', '行政楼 1F 103', '步月华', '12>teachers', ['编辑', '人员名单>teachers', '删除']],
            ['', '高一年级部', '教学楼 A 1F', '柳响成', '68>teachers', ['编辑', '人员名单>teachers', '删除']],
            ['', '高二年级部', '教学楼 B 1F', '吴福舟', '71>teachers', ['编辑', '人员名单>teachers', '删除']],
            ['', '高三年级部', '教学楼 C 1F', '包云娟', '74>teachers', ['编辑', '人员名单>teachers', '删除']],
          ],
          total: 18,
        },
        {
          key: 'subject', label: '学科设置', icon: 'dict', count: '14 门', view: 'table',
          desc: '添加、编辑、删除学科并拖拽排序；为不同校区设置学科，将选中学科添加到相应校区。',
          filters: [{ select: ['全部校区', ...CAMPUS] }, { search: '学科名称' }],
          actions: ['*新增学科', '添加到校区'],
          columns: [
            { type: 'check' }, { type: 'drag' }, { label: '学科名称', align: 'left' }, { label: '学科编码' },
            { label: '适用校区', type: 'chips' }, { label: '操作', type: 'ops' },
          ],
          rows: [
            ['', '', '语文', 'YW', CAMPUS, ['编辑', '删除']],
            ['', '', '数学', 'SX', CAMPUS, ['编辑', '删除']],
            ['', '', '英语', 'YY', CAMPUS, ['编辑', '删除']],
            ['', '', '物理', 'WL', CAMPUS, ['编辑', '删除']],
            ['', '', '化学', 'HX', CAMPUS, ['编辑', '删除']],
            ['', '', '生物', 'SW', CAMPUS, ['编辑', '删除']],
            ['', '', '政治', 'ZZ', CAMPUS, ['编辑', '删除']],
            ['', '', '历史', 'LS', CAMPUS, ['编辑', '删除']],
            ['', '', '地理', 'DL', ['本部校区'], ['编辑', '删除']],
            ['', '', '信息技术', 'XX', ['本部校区'], ['编辑', '删除']],
          ],
          total: 14,
        },
        {
          key: 'venue', label: '场地设置', icon: 'venue', count: '438 间', view: 'table',
          desc: '按校区配置建筑物 → 楼层 → 房间；每个房间可设置类型、容纳人数、电子班牌；支持批量录入 / 更新与导出。',
          tree: [
            {
              label: '本部校区', open: true, children: [
                { label: '行政楼（4 层）' }, { label: '教学楼 A（5 层）', active: true, open: true, children: [{ label: '1F' }, { label: '2F' }, { label: '3F' }] },
                { label: '教学楼 B（5 层）' }, { label: '实验楼（4 层）' }, { label: '图书馆（3 层）' }, { label: '体育馆' },
              ],
            },
            { label: '城南校区', children: [{ label: '综合楼' }] },
          ],
          filters: [{ select: ['全部类型', '普通教室', '实验室', '功能室', '办公室', '会议室'] }, { search: '房间号 / 名称' }],
          actions: ['*新增建筑', '新增楼层', '新增房间', '批量录入', '批量更新', '导出'],
          columns: [
            { label: '房间号' }, { label: '房间名称', align: 'left' }, { label: '楼层' }, { label: '房间类型' },
            { label: '容纳人数' }, { label: '电子班牌', type: 'tag' }, { label: '操作', type: 'ops' },
          ],
          rows: [
            ['A101', '高一(1)班', '1F', '普通教室', '50', '已绑定|ok', ['编辑', '删除']],
            ['A102', '高一(2)班', '1F', '普通教室', '50', '已绑定|ok', ['编辑', '删除']],
            ['A103', '高一(3)班', '1F', '普通教室', '50', '已绑定|ok', ['编辑', '删除']],
            ['A104', '公开课教室', '1F', '功能室', '120', '已绑定|ok', ['编辑', '删除']],
            ['A201', '高一(5)班', '2F', '普通教室', '50', '未绑定|muted', ['编辑', '删除']],
            ['A205', '物理实验室', '2F', '实验室', '48', '未绑定|muted', ['编辑', '删除']],
            ['A301', '年级办公室', '3F', '办公室', '16', '未绑定|muted', ['编辑', '删除']],
          ],
          total: 46,
        },
        {
          key: 'seal', label: '公章管理', icon: 'seal', count: '5 枚', view: 'table',
          desc: '新增公章（名称、部门、落款文字、颁发单位、图片、状态），停用后其他功能无法使用；编辑删除，查看使用情况并导出使用流水。',
          actions: ['*新增公章'],
          columns: [
            { label: '公章', type: 'seal' }, { label: '公章名称', align: 'left' }, { label: '部门' }, { label: '落款文字' },
            { label: '颁发单位' }, { label: '状态', type: 'tag' }, { label: '操作', type: 'ops' },
          ],
          rows: [
            ['', '学校行政章', '办公室', '江苏省丹阳高级中学', '丹阳市教育局', '启用|ok', ['编辑', '使用情况', '删除']],
            ['', '教务处章', '教务处', '江苏省丹阳高级中学教务处', '江苏省丹阳高级中学', '启用|ok', ['编辑', '使用情况', '删除']],
            ['', '学籍专用章', '教务处', '江苏省丹阳高级中学', '丹阳市教育局', '启用|ok', ['编辑', '使用情况', '删除']],
            ['', '总务处章', '总务处', '江苏省丹阳高级中学总务处', '江苏省丹阳高级中学', '停用|muted', ['编辑', '使用情况', '删除']],
          ],
          secondary: {
            title: '公章使用流水', actions: ['导出流水'],
            columns: [
              { label: '公章编号', type: 'mono' }, { label: '类别' }, { label: '文件名称', align: 'left' }, { label: '文件编号', type: 'mono' },
              { label: '文件状态', type: 'tag' }, { label: '相关对象' }, { label: '使用人' }, { label: '使用时间' }, { label: '操作', type: 'ops' },
            ],
            rows: [
              ['GZ-001', '行政章', '关于 2026 年秋学期校历安排的通知', 'DZ〔2026〕31 号', '已归档|ok', '全体教职工', '陈秀娟', '2026-11-10 09:12', ['查看文件']],
              ['GZ-003', '学籍专用章', '在读证明（高二(3)班 陈思远）', 'XJ-2026-1187', '已出具|ok', '陈思远', '苏诚', '2026-11-08 15:40', ['查看文件']],
              ['GZ-002', '教务处章', '期中考试监考安排表', 'JW-2026-064', '审批中|warn', '高三年级部', '苏诚', '2026-11-06 10:05', ['查看文件']],
            ],
          },
        },
      ],
    },
    {
      group: '教务数据', items: [
        {
          key: 'periods', label: '课程时段', icon: 'clock', count: '13 个时段', view: 'table',
          desc: '按校区查看课程时段，新增时段（名称、时间、属性），修改起止时间；支持搜索、批量更新 / 录入、导出与拖拽排序。',
          filters: [{ seg: CAMPUS }, { search: '课程时段名称' }],
          actions: ['*新增时段', '批量录入', '批量更新', '导出'],
          columns: [
            { type: 'drag' }, { label: '时段名称', align: 'left' }, { label: '开始时间' }, { label: '结束时间' },
            { label: '属性', type: 'tag' }, { label: '操作', type: 'ops' },
          ],
          rows: [
            ['', '早读', '07:20', '07:40', '上午|info', ['编辑', '删除']],
            ['', '第一节', '07:50', '08:30', '上午|info', ['编辑', '删除']],
            ['', '第二节', '08:40', '09:20', '上午|info', ['编辑', '删除']],
            ['', '大课间', '09:20', '09:50', '活动|muted', ['编辑', '删除']],
            ['', '第三节', '09:50', '10:30', '上午|info', ['编辑', '删除']],
            ['', '第四节', '10:40', '11:20', '上午|info', ['编辑', '删除']],
            ['', '第五节', '13:40', '14:20', '下午|warn', ['编辑', '删除']],
            ['', '第六节', '14:30', '15:10', '下午|warn', ['编辑', '删除']],
            ['', '第七节', '15:20', '16:00', '下午|warn', ['编辑', '删除']],
            ['', '晚自习一', '18:30', '19:50', '晚上|ok', ['编辑', '删除']],
          ],
          total: 13,
        },
        {
          key: 'grade-class', label: '年级班级', icon: 'apps', count: '66 个班', view: 'table',
          desc: '创建年级（名称、学科、年级长、下级行政及学科信息），为各年级创建行政班与教学班。',
          tree: [{ label: '2026-2027 学年', open: true, children: [{ label: '高一年级（22 班）', active: true }, { label: '高二年级（22 班）' }, { label: '高三年级（22 班）' }] }],
          summary: [['年级长', '柳响成'], ['年级学科', '语数英物化生政史地信'], ['下级行政', '高一年级部'], ['学科组长', '9 人']],
          filters: [{ seg: ['全部', '行政班', '教学班'] }],
          actions: ['*创建年级', '创建班级', '编辑年级'],
          columns: [
            { label: '班级名称', align: 'left' }, { label: '班级类型', type: 'tag' }, { label: '班主任' },
            { label: '学生数' }, { label: '所在教室' }, { label: '操作', type: 'ops' },
          ],
          rows: [
            ['高一(1)班', '行政班|info', '柳响成', '48', 'A101', ['编辑', '学生名单', '删除']],
            ['高一(2)班', '行政班|info', '步飞', '49', 'A102', ['编辑', '学生名单', '删除']],
            ['高一(3)班', '行政班|info', '步金花', '47', 'A103', ['编辑', '学生名单', '删除']],
            ['物理选考 1 班', '教学班|warn', '顾准山', '42', 'A205', ['编辑', '学生名单', '删除']],
            ['化学选考 1 班', '教学班|warn', '潘国良', '39', '实验楼 302', ['编辑', '学生名单', '删除']],
          ],
          total: 22,
        },
        { key: 'post', label: '岗位安排', icon: 'teacher', count: '3 个年级', view: 'post', desc: '按年级设置行政班 / 走班岗位安排表：每科周课时、学科顺序、任课教师、备课组长、班主任；统计每位教师岗位工作量。' },
        {
          key: 'assign-class', label: '学生分班', icon: 'student', count: '3 次分班', view: 'table',
          desc: '按年级新建分班，下载模板处理数据后导入 Excel 完成全级分班；设置分班是否为当前状态，更新学生唯一当前班级。',
          steps: ['新建分班名称', '下载分班数据模板', '处理分班数据', '导入 Excel 文件', '设为当前分班'],
          filters: [{ select: ['全部年级', '高一年级', '高二年级', '高三年级'] }],
          actions: ['*新建分班', '下载模板', '导入 Excel'],
          columns: [
            { label: '分班名称', align: 'left' }, { label: '年级' }, { label: '班级数' }, { label: '学生数' },
            { label: '导入时间' }, { label: '当前状态', type: 'tag' }, { label: '操作', type: 'ops' },
          ],
          rows: [
            ['高一新生分班（2026 秋）', '高一年级', '22', '1,058', '2026-08-26 14:20', '当前|ok', ['维护名单', '导出']],
            ['高二选科分班（2026 秋）', '高二年级', '22', '1,046', '2026-08-28 10:02', '当前|ok', ['维护名单', '导出']],
            ['高二分班（2026 春）', '高二年级', '20', '1,051', '2026-02-12 09:30', '历史|muted', ['设为当前', '维护名单', '导出']],
          ],
        },
        {
          key: 'curriculum', label: '课程体系', icon: 'menu', count: '86 门课程', view: 'table',
          desc: '按校区、学年、学期与年级自动生成课程体系；在年级学科基础上自定义新课程，设置核心素养范畴、学分与性质。',
          filters: [{ select: CAMPUS }, { select: ['2026-2027 学年'] }, { select: ['第一学期', '第二学期'] }, { select: ['高一年级', '高二年级', '高三年级'] }],
          actions: ['*自动生成课程体系', '新增课程'],
          columns: [
            { label: '课程名称', align: 'left' }, { label: '所属学科' }, { label: '核心素养范畴', type: 'chips' },
            { label: '学分' }, { label: '课程性质', type: 'tag' }, { label: '来源', type: 'tag' }, { label: '操作', type: 'ops' },
          ],
          rows: [
            ['语文（必修上）', '语文', ['语言建构', '审美鉴赏'], '4', '必修|info', '自动生成|muted', ['编辑']],
            ['数学（必修一）', '数学', ['数学抽象', '逻辑推理'], '4', '必修|info', '自动生成|muted', ['编辑']],
            ['物理（必修一）', '物理', ['物理观念', '科学思维'], '2', '必修|info', '自动生成|muted', ['编辑']],
            ['季子文化研学', '历史', ['家国情怀', '史料实证'], '1', '选修|ok', '自定义|warn', ['编辑', '删除']],
            ['人工智能初步', '信息技术', ['计算思维', '数字化学习'], '1', '选择性必修|warn', '自定义|warn', ['编辑', '删除']],
          ],
          total: 86,
        },
      ],
    },
    {
      group: '学籍档案', items: [
        {
          key: 'enrollment', label: '学籍管理', icon: 'idcard', count: '3,186 人', view: 'table',
          desc: '以校区和自然年建立学籍档案；单个录入或批量导入，修改学籍，批量办理离校；按学籍性质、在校状态、身份、性别、入学年份查看导出；设置打印模板。',
          filters: [{ select: CAMPUS }, { select: ['入学年份', '2026', '2025', '2024'] }, { select: ['学籍性质', '本校学籍', '借读'] }, { select: ['在校状态', '在校', '休学', '离校'] }, { select: ['身份', '走读', '住校'] }, { select: ['性别', '男', '女'] }, { search: '姓名 / 学籍号' }],
          actions: ['*新增学籍', '批量导入', '批量离校', '导出', '打印模板'],
          columns: [
            { type: 'check' }, { label: '姓名', type: 'link' }, { label: '学籍号', type: 'mono' }, { label: '性别' }, { label: '班级' },
            { label: '入学年份' }, { label: '学籍性质' }, { label: '在校状态', type: 'tag' }, { label: '操作', type: 'ops' },
          ],
          rows: [
            ['', '陈思远', 'G3211812009120034', '男', '高二(3)班', '2025', '本校学籍', '在校|ok', ['编辑', '打印', '办理离校']],
            ['', '林语桐', 'G3211812009081102', '女', '高二(3)班', '2025', '本校学籍', '在校|ok', ['编辑', '打印', '办理离校']],
            ['', '周子墨', 'G3211812008110457', '男', '高三(5)班', '2024', '本校学籍', '在校|ok', ['编辑', '打印', '办理离校']],
            ['', '许安然', 'G3211812010030219', '女', '高一(1)班', '2026', '本校学籍', '在校|ok', ['编辑', '打印', '办理离校']],
            ['', '韩一鸣', 'G3211812009050813', '男', '高二(7)班', '2025', '借读', '休学|warn', ['编辑', '打印', '办理离校']],
          ],
          total: 3186,
        },
        {
          key: 'alumni', label: '校友管理', icon: 'meeting', count: '9,742 人', view: 'table',
          desc: '学籍操作为离校的学生自动流转为校友；按校区、时间筛选，姓名 / 学籍号 / 身份证搜索；自定义显示字段与表头；编辑、复读返校、删除；录入临时校友并审核转正。',
          filters: [{ select: CAMPUS }, { select: ['离校年份', '2026', '2025', '2024'] }, { search: '姓名 / 学籍号 / 身份证' }],
          actions: ['*录入临时校友', '批量录入', '扫码录入', '显示字段', '表头设置'],
          columns: [
            { label: '姓名', type: 'link' }, { label: '学籍号', type: 'mono' }, { label: '原班级' }, { label: '离校年份' },
            { label: '毕业去向' }, { label: '来源', type: 'tag' }, { label: '操作', type: 'ops' },
          ],
          rows: [
            ['沈嘉禾', 'G3211812007090118', '高三(2)班', '2026', '南京大学', '学籍流转|info', ['编辑', '复读返校', '删除']],
            ['顾北辰', 'G3211812007040522', '高三(6)班', '2026', '东南大学', '学籍流转|info', ['编辑', '复读返校', '删除']],
            ['孙若溪', 'G3211812006110340', '高三(1)班', '2025', '复旦大学', '学籍流转|info', ['编辑', '复读返校', '删除']],
            ['陆明远', '—', '1998 届', '1998', '校友企业家', '临时转正|ok', ['编辑', '删除']],
          ],
          total: 9742,
          secondary: {
            title: '临时校友待审核', actions: ['批量通过'],
            columns: [{ label: '姓名' }, { label: '自报届别' }, { label: '原班级' }, { label: '录入方式', type: 'tag' }, { label: '提交时间' }, { label: '操作', type: 'ops' }],
            rows: [
              ['钱文博', '2003 届', '高三(4)班', '扫码录入|info', '2026-11-11 20:14', ['审核通过', '驳回']],
              ['赵思齐', '2010 届', '高三(9)班', '扫码录入|info', '2026-11-10 08:51', ['审核通过', '驳回']],
              ['吴清扬', '1995 届', '高三(2)班', '管理员录入|muted', '2026-11-09 16:22', ['审核通过', '驳回']],
            ],
          },
        },
        {
          key: 'temp-staff', label: '临时人员', icon: 'visit', count: '57 人', view: 'table',
          desc: '自动汇总临时学生、临时校友、临时教师、校外人员（来源于流程审批、数据收集、电子签到的公开填写）；管理员可配置应用功能权限，支持修改、删除与导出明细。',
          filters: [{ seg: ['全部', '临时学生', '临时校友', '临时教师', '校外人员'] }, { search: '姓名 / 手机号' }],
          actions: ['*权限配置>teacher-perm', '数据统计>temp-stats', '导出明细'],
          columns: [
            { label: '姓名' }, { label: '人员类型', type: 'tag' }, { label: '数据来源' }, { label: '手机号' },
            { label: '登记时间' }, { label: '状态', type: 'tag' }, { label: '操作', type: 'ops' },
          ],
          rows: [
            ['刘海洋', '校外人员|muted', '电子签到 · 家长开放日', '139****0021', '2026-11-12 08:31', '有效|ok', ['编辑', '删除']],
            ['马晓彤', '临时学生|info', '流程审批 · 插班申请', '151****7720', '2026-11-11 14:02', '待审核|warn', ['编辑', '删除']],
            ['钱文博', '临时校友|ok', '数据收集 · 校友登记', '186****3365', '2026-11-11 20:14', '待审核|warn', ['编辑', '删除']],
            ['杨帆', '临时教师|warn', '流程审批 · 代课教师', '137****9902', '2026-11-03 09:00', '有效|ok', ['编辑', '删除']],
            ['张蕾', '校外人员|muted', '数据收集 · 讲座报名', '188****1146', '2026-11-02 19:45', '有效|ok', ['编辑', '删除']],
          ],
          total: 57,
        },
      ],
    },
  ];

  P.DP_HEALTH = [['教师信息', 98], ['学籍信息', 95], ['场地信息', 91], ['部门信息', 100], ['课程时段', 100], ['岗位安排', 86]];
  P.DP_UPDATES = [
    ['苏诚', '批量更新了 高一年级 课程时段', '10 分钟前'],
    ['陈秀娟', '新增角色「后勤人员」并配置 12 项权限', '1 小时前'],
    ['苏诚', '导入 高二选科分班（2026 秋）1,046 人', '昨天 10:02'],
    ['步月华', '更新 教学楼 A 房间电子班牌绑定', '昨天 08:40'],
  ];

  P.SCHOOL_INFO = {
    name: '江苏省丹阳高级中学',
    nature: '公办 · 普通高级中学',
    intro: '江苏省四星级高中、国家级示范高中。校训「正谊明道，成德达材」。',
    branches: [
      { name: '本部校区', main: true, addr: '丹阳市主城区', classes: 58 },
      { name: '城南校区', main: false, addr: '丹阳市城南片区', classes: 8 },
    ],
  };

  P.SEMESTERS = [
    ['2026-2027', '第一学期', '2026-08-31', '2027-01-24', '21', '当前|ok', ['编辑', '生成校历']],
    ['2026-2027', '第二学期', '2027-02-20', '2027-07-04', '20', '未开始|muted', ['编辑', '生成校历']],
    ['2025-2026', '第二学期', '2026-02-14', '2026-07-03', '20', '已结束|muted', ['查看校历']],
  ];

  P.POST = {
    subjects: [
      ['语文', 5, '边卫刚'], ['数学', 5, '顾准山'], ['英语', 5, '步金花'], ['物理', 3, '巴展翔'],
      ['化学', 3, '潘国良'], ['生物', 2, '步月华'], ['政治', 2, '巴展翔'], ['历史', 2, '王伟'],
    ],
    classes: [
      ['高一(1)班', '柳响成', ['边卫刚', '柳响成', '步金花', '巴展翔', '潘国良', '步月华', '巴展翔', '王伟']],
      ['高一(2)班', '步飞', ['边卫刚', '步飞', '步金花', '杨帆', '潘国良', '步月华', '巴展翔', '王伟']],
      ['高一(3)班', '步金花', ['白玉娜', '顾准山', '步金花', '杨帆', '吴福舟', '步月华', '巴展翔', '王伟']],
      ['高一(4)班', '包云娟', ['白玉娜', '包云娟', '步金花', '巴展翔', '吴福舟', '步月华', '巴展翔', '王伟']],
      ['高一(5)班', '边卫刚', ['边卫刚', '包云娟', '陈秀娟', '巴展翔', '潘国良', '步月华', '巴展翔', '王伟']],
    ],
    walk: [
      ['物理选考 1 班', '物理', '巴展翔', '4', '42'], ['物理选考 2 班', '物理', '杨帆', '4', '40'],
      ['化学选考 1 班', '化学', '潘国良', '4', '39'], ['历史选考 1 班', '历史', '王伟', '4', '45'],
    ],
    stats: [
      ['边卫刚', '语文', '15', '2', '1', '6', '3', '27'],
      ['巴展翔', '物理 / 政治', '18', '1', '0', '8', '1', '28'],
      ['步金花', '英语', '20', '0', '1', '4', '2', '27'],
      ['潘国良', '化学', '10', '1', '0', '2', '0', '13'],
      ['王伟', '历史', '14', '2', '1', '6', '0', '23'],
    ],
  };

  /* ============================================================
   * 2. 统一应用管理
   * ============================================================ */
  P.APP_CATS = ['家校互动', '教学教务', '德育管理', '校园办公', '总务后勤', '学生评价', '系统管理', '独立系统'];
  P.MARKET = [
    { name: '通知公告', desc: '发送丰富样式的通知消息，可按需选择发送范围，支持回复与已读未读统计。', cat: '家校互动', type: 'sys', installed: true, icon: 'notice', color: '#e2553d' },
    { name: '场馆预约', desc: '在线预约会议室、报告厅、投影仪等公共资源，避免冲突。', cat: '校园办公', type: 'sys', installed: true, icon: 'venue', color: '#f0b400' },
    { name: '报修管理', desc: '缩短报修流程，方便学校领导查看各设备报修情况。', cat: '总务后勤', type: 'sys', installed: true, icon: 'repair', color: '#2fae7a' },
    { name: '食谱订餐', desc: '每周食谱发布与订餐，家长了解孩子在校饮食。', cat: '家校互动', type: 'sys', installed: true, icon: 'menu', color: '#d94848' },
    { name: '领导看板', desc: '汇总师生请假、出勤等情况，帮助领导了解学校详情。', cat: '系统管理', type: 'sys', installed: true, icon: 'board', color: '#2aa3a3' },
    { name: '短信管理', desc: '面向未关注平台的用户发送短信通知，如招生报名。', cat: '系统管理', type: 'sys', installed: true, icon: 'sms', color: '#6b8a3a' },
    { name: '公文流转', desc: '公文起草、审批、签收与归档全流程线上流转。', cat: '校园办公', type: 'sys', installed: true, icon: 'docflow', color: '#1677ff' },
    { name: '班级评价', desc: '文明班级评比与班级日常评价统计。', cat: '学生评价', type: 'sys', installed: true, icon: 'classrank', color: '#7a8a4a' },
    { name: '成绩管理', desc: '单科成绩导入、发布与分析，方便简单。', cat: '教学教务', type: 'sys', installed: false, icon: 'score', color: '#8e6bbf' },
    { name: '作业', desc: '老师可在电脑端和手机端布置作业，学生在线提交。', cat: '教学教务', type: 'sys', installed: false, icon: 'docflow', color: '#555b66' },
    { name: '建议箱', desc: '家长可对学校教学、安全管理等提出建议，分类传递。', cat: '家校互动', type: 'sys', installed: false, icon: 'suggest', color: '#d6336c' },
    { name: '宿舍管理', desc: '宿舍分配、查寝与卫生检查。', cat: '德育管理', type: 'sys', installed: false, icon: 'dorm', color: '#0f9b8e' },
    { name: '一卡通', desc: '农行校园一卡通对接，消费与门禁数据同步。', cat: '独立系统', type: 'int', installed: true, icon: 'idcard', color: '#3aa0e8' },
    { name: '班牌管理系统', desc: '电子班牌内容发布与设备管理。', cat: '独立系统', type: 'int', installed: true, icon: 'hardware', color: '#1677ff' },
    { name: '成绩分析系统', desc: '第三方考试成绩深度分析，单点登录接入。', cat: '教学教务', type: 'int', installed: true, icon: 'analytics', color: '#2fae7a' },
    { name: '网站管理系统', desc: '学校门户网站栏目与文章管理。', cat: '独立系统', type: 'int', installed: true, icon: 'website', color: '#2aa3a3' },
    { name: '录播平台', desc: '常态化录播与公开课直播。', cat: '教学教务', type: 'int', installed: false, icon: 'av', color: '#e08a1e' },
    { name: '精准教学', desc: '课堂练习与学情诊断系统。', cat: '教学教务', type: 'int', installed: false, icon: 'eval', color: '#7c5cc4' },
  ];

  P.MENUS.appc = [
    {
      group: '应用', items: [
        { key: 'market', label: '学校统一应用', icon: 'appstore', view: 'appMarket', desc: '统一查看并管理学校已安装 / 未安装的系统应用与集成应用，按适用类型筛选，一处打开所有应用。' },
        {
          key: 'integrate', label: '第三方应用集成', icon: 'api', view: 'table',
          desc: '集成第三方应用，配置接入方式（单点登录 / OAuth2.0 / 链接跳转），并为不同教师开放访问权限。',
          filters: [{ seg: ['全部', '已启用', '已停用'] }, { search: '应用名称' }],
          actions: ['*集成应用'],
          columns: [
            { label: '应用名称', type: 'link', align: 'left' }, { label: '提供方' }, { label: '接入方式', type: 'tag' },
            { label: '访问地址', type: 'mono', align: 'left' }, { label: '授权范围' }, { label: '状态', type: 'tag' }, { label: '操作', type: 'ops' },
          ],
          rows: [
            ['一卡通', '农业银行', 'SSO 单点登录|info', 'https://ecard.example/sso', '全体教职工', '已启用|ok', ['配置', '授权>app-auth', '停用']],
            ['班牌管理系统', '班牌厂商', 'OAuth2.0|ok', 'https://banpai.example/oauth', '班主任、管理员', '已启用|ok', ['配置', '授权>app-auth', '停用']],
            ['成绩分析系统', '第三方', 'OAuth2.0|ok', 'https://score.example/login', '教务、年级主任', '已启用|ok', ['配置', '授权>app-auth', '停用']],
            ['网站管理系统', '自建', '链接跳转|muted', 'https://www.example/admin', '办公室', '已启用|ok', ['配置', '授权>app-auth', '停用']],
            ['录播平台', '第三方', 'SSO 单点登录|info', 'https://record.example/sso', '—', '已停用|muted', ['配置', '授权>app-auth', '启用']],
          ],
        },
      ],
    },
    {
      group: '授权管理', items: [
        {
          key: 'roles', label: '角色管理', icon: 'shield', view: 'table',
          desc: '定义角色并维护角色说明，角色是应用授权的基本单位。',
          filters: [{ search: '角色名称' }],
          actions: ['*新增角色'],
          columns: [
            { label: '角色名称', align: 'left' }, { label: '角色说明', align: 'left' }, { label: '用户数', type: 'link' },
            { label: '可访问应用' }, { label: '操作', type: 'ops' },
          ],
          rows: P.ROLES.map((r, i) => [r.name, r.desc, `${[1, 3, 2, 2, 66, 318, 14, 57][i]}>role-users`, `${Math.max(2, Math.round(r.level * 18))} 个`, ['编辑', '角色用户>role-users', '应用授权>app-auth', '删除']]),
        },
        { key: 'role-users', label: '角色用户', icon: 'users', view: 'roleUsers', desc: '为角色添加或移除用户，用户继承角色的全部应用访问权限。' },
        { key: 'app-auth', label: '应用授权', icon: 'key', view: 'authMatrix', desc: '按「角色 × 应用」授权，指定不同用户访问不同的应用。' },
        {
          key: 'teacher-auth', label: '教师授权', icon: 'teacher', view: 'table',
          desc: '在角色授权之外，为指定教师单独开放或收回应用访问权限。',
          filters: [{ select: ['全部部门', '校长室', '教务处', '高一年级部', '高二年级部', '高三年级部'] }, { search: '教师姓名' }],
          actions: ['*开放权限'],
          columns: [
            { label: '教师', align: 'left' }, { label: '部门' }, { label: '所属角色' },
            { label: '额外开放应用', type: 'chips' }, { label: '有效期' }, { label: '操作', type: 'ops' },
          ],
          rows: [
            ['苏诚', '教务处', '教务管理员', ['成绩分析系统', '录播平台'], '长期', ['调整', '收回']],
            ['吴福舟', '高二年级部', '年级主任', ['领导看板'], '至 2027-01-24', ['调整', '收回']],
            ['边卫刚', '语文、高三年级组', '任课教师', ['网站管理系统'], '至 2026-12-31', ['调整', '收回']],
            ['杨帆', '物理（临时教师）', '临时人员', ['场馆预约'], '至 2026-11-30', ['调整', '收回']],
          ],
        },
      ],
    },
    {
      group: '登录安全', items: [
        { key: 'security', label: '统一登录设置', icon: 'shield', view: 'loginSecurity', desc: '统一设置登录失败锁定、管理员双因子登录、密码加密与会话超时策略；右侧可直接体验登录流程。' },
        {
          key: 'login-logs', label: '登录日志', icon: 'log', view: 'table',
          desc: '记录所有登录行为，含失败、锁定与会话超时；可对锁定账号手动解锁。',
          filters: [{ seg: ['全部', '成功', '失败', '已锁定'] }, { date: '2026-11-13' }, { search: '账号 / 姓名' }],
          actions: ['导出'],
          columns: [
            { label: '账号', type: 'mono' }, { label: '姓名' }, { label: '登录方式' }, { label: '校区' },
            { label: 'IP' }, { label: '结果', type: 'tag' }, { label: '时间' },
          ],
          rows: [
            ['admin', '陈秀娟', '账号密码 + 短信验证码', '本部校区', '10.12.3.41', '成功|ok', '2026-11-13 08:02'],
            ['10005', '苏诚', '账号密码', '本部校区', '10.12.5.18', '成功|ok', '2026-11-13 07:56'],
            ['10010', '边卫刚', '账号密码', '—', '10.12.8.77', '密码错误 (3/3)|danger', '2026-11-13 07:41'],
            ['10010', '边卫刚', '账号密码', '—', '10.12.8.77', '锁定 15 分钟|warn', '2026-11-13 07:41'],
            ['admin', '陈秀娟', '会话超时', '本部校区', '10.12.3.41', '15 分钟无操作失效|muted', '2026-11-12 17:33'],
          ],
          secondary: {
            title: '当前锁定账号',
            columns: [{ label: '账号', type: 'mono' }, { label: '姓名' }, { label: '锁定原因' }, { label: '解锁时间' }, { label: '操作', type: 'ops' }],
            rows: [['10010', '边卫刚', '连续 3 次账号或密码错误', '2026-11-13 07:56', ['立即解锁']]],
          },
        },
      ],
    },
  ];

  /* ============================================================
   * 3. 开放式平台
   * ============================================================ */
  const PAGE_PARAMS = [['page', 'int', '否', '页码，默认 1'], ['size', 'int', '否', '每页条数，默认 20，最大 200']];
  const SCHOOL_PARAM = ['schoolId', 'string', '是', '学校 ID'];
  P.API_BASE = 'https://{开放平台域名}/open/v1';
  P.APIS = {
    base: [
      {
        key: 'teacher', name: '教师基础数据', method: 'GET', path: '/teachers', desc: '按学校 / 部门分页获取教师基础信息。',
        params: [SCHOOL_PARAM, ['deptId', 'string', '否', '部门 ID'], ['keyword', 'string', '否', '姓名 / 工号模糊查询'], ...PAGE_PARAMS],
        fields: [['userId', 'string', '教师用户 ID', 'T10005'], ['name', 'string', '姓名', '苏诚'], ['jobNo', 'string', '工号', '10005'], ['gender', 'int', '性别（见代码标准）', 1], ['mobile', 'string', '手机号（脱敏）', '130****2952'], ['deptIds', 'array', '所属部门', ['D003']], ['subjects', 'array', '任教学科', ['数学']], ['status', 'int', '1 在职 / 0 禁用', 1]],
        usecase: { actors: ['第三方应用', '学校管理员'], cases: ['申请教师数据接口授权', '获取 access_token', '分页拉取教师列表', '按部门筛选教师', '增量同步教师变更'] },
      },
      {
        key: 'student', name: '学生基础数据', method: 'GET', path: '/students', desc: '按年级 / 班级分页获取学生基础信息。',
        params: [SCHOOL_PARAM, ['gradeId', 'string', '否', '年级 ID'], ['classId', 'string', '否', '班级 ID'], ['studentNo', 'string', '否', '学籍号'], ...PAGE_PARAMS],
        fields: [['studentId', 'string', '学生 ID', 'S20250034'], ['name', 'string', '姓名', '陈思远'], ['studentNo', 'string', '学籍号', 'G3211812009120034'], ['gender', 'int', '性别', 1], ['gradeId', 'string', '年级 ID', 'G2025'], ['classId', 'string', '班级 ID', 'C2025-03'], ['enrollYear', 'int', '入学年份', 2025], ['status', 'int', '在校状态', 1]],
        usecase: { actors: ['第三方应用', '学校管理员'], cases: ['申请学生数据接口授权', '获取 access_token', '按班级拉取学生名单', '按学籍号查询学生', '同步学生在校状态'] },
      },
      { key: 'semester-current', name: '当前学期', method: 'GET', path: '/semesters/current', desc: '获取学校当前所在学期。', params: [SCHOOL_PARAM], fields: [['semesterId', 'string', '学期 ID', 'SM20261'], ['name', 'string', '学期名称', '2026-2027 第一学期'], ['startDate', 'date', '开始日期', '2026-08-31'], ['endDate', 'date', '结束日期', '2027-01-24']] },
      { key: 'school', name: '学校信息', method: 'GET', path: '/school', desc: '获取学校基本信息。', params: [SCHOOL_PARAM], fields: [['schoolId', 'string', '学校 ID', 'DYGZ'], ['name', 'string', '学校名称', '江苏省丹阳高级中学'], ['nature', 'string', '办学性质', '公办'], ['logo', 'string', '校徽地址', 'https://.../seal.png']] },
      { key: 'campus', name: '校区', method: 'GET', path: '/campuses', desc: '获取学校全部校区。', params: [SCHOOL_PARAM], fields: [['campusId', 'string', '校区 ID', 'CP01'], ['name', 'string', '校区名称', '本部校区'], ['isMain', 'bool', '是否主校区', true], ['sort', 'int', '排序', 1]] },
      { key: 'school-year', name: '学年', method: 'GET', path: '/school-years', desc: '获取学年列表。', params: [SCHOOL_PARAM], fields: [['yearId', 'string', '学年 ID', 'Y2026'], ['name', 'string', '学年名称', '2026-2027'], ['isCurrent', 'bool', '是否当前', true]] },
      { key: 'semesters', name: '学期', method: 'GET', path: '/semesters', desc: '获取学年下的学期。', params: [SCHOOL_PARAM, ['yearId', 'string', '否', '学年 ID']], fields: [['semesterId', 'string', '学期 ID', 'SM20261'], ['name', 'string', '学期名称', '第一学期'], ['weeks', 'int', '教学周数', 21]] },
      { key: 'grades', name: '年级', method: 'GET', path: '/grades', desc: '获取校区年级列表。', params: [SCHOOL_PARAM, ['campusId', 'string', '否', '校区 ID']], fields: [['gradeId', 'string', '年级 ID', 'G2026'], ['name', 'string', '年级名称', '高一年级'], ['leaderId', 'string', '年级长', 'T10011']] },
      { key: 'classes', name: '班级', method: 'GET', path: '/classes', desc: '获取年级下的行政班 / 教学班。', params: [SCHOOL_PARAM, ['gradeId', 'string', '否', '年级 ID'], ['type', 'int', '否', '1 行政班 / 2 教学班']], fields: [['classId', 'string', '班级 ID', 'C2026-01'], ['name', 'string', '班级名称', '高一(1)班'], ['type', 'int', '班级类型', 1], ['headTeacherId', 'string', '班主任', 'T10011'], ['roomId', 'string', '教室', 'A101']] },
      { key: 'subjects', name: '学科', method: 'GET', path: '/subjects', desc: '获取校区学科。', params: [SCHOOL_PARAM, ['campusId', 'string', '否', '校区 ID']], fields: [['subjectId', 'string', '学科 ID', 'SX'], ['name', 'string', '学科名称', '数学'], ['sort', 'int', '排序', 2]] },
      { key: 'buildings', name: '建筑物', method: 'GET', path: '/buildings', desc: '获取校区建筑物。', params: [SCHOOL_PARAM, ['campusId', 'string', '否', '校区 ID']], fields: [['buildingId', 'string', '建筑 ID', 'BA'], ['name', 'string', '建筑名称', '教学楼 A'], ['floors', 'int', '楼层数', 5]] },
      { key: 'rooms', name: '场地房间', method: 'GET', path: '/rooms', desc: '获取建筑物下的房间。', params: [SCHOOL_PARAM, ['buildingId', 'string', '否', '建筑 ID'], ['floor', 'int', '否', '楼层'], ['type', 'string', '否', '房间类型代码']], fields: [['roomId', 'string', '房间 ID', 'A101'], ['name', 'string', '房间名称', '高一(1)班'], ['type', 'string', '房间类型', '01'], ['capacity', 'int', '容纳人数', 50], ['boardSn', 'string', '电子班牌编号', 'BP-0101']] },
      { key: 'depts', name: '部门', method: 'GET', path: '/departments', desc: '获取部门树。', params: [SCHOOL_PARAM, ['campusId', 'string', '否', '校区 ID']], fields: [['deptId', 'string', '部门 ID', 'D003'], ['name', 'string', '部门名称', '教务处'], ['parentId', 'string', '上级部门', 'D000'], ['roomId', 'string', '所在场地', 'XZ201']] },
      { key: 'parents', name: '学生家长', method: 'GET', path: '/students/{studentId}/parents', desc: '获取学生绑定的家长。', params: [['studentId', 'string', '是', '学生 ID（路径参数）']], fields: [['parentId', 'string', '家长 ID', 'P88012'], ['name', 'string', '家长姓名', '陈建国'], ['relation', 'string', '关系', '父亲'], ['mobile', 'string', '手机号（脱敏）', '139****5566']] },
    ],
    biz: [
      { key: 'periods', name: '课程时段', method: 'GET', path: '/course-periods', desc: '获取校区课程时段。', params: [SCHOOL_PARAM, ['campusId', 'string', '是', '校区 ID']], fields: [['periodId', 'string', '时段 ID', 'PD02'], ['name', 'string', '时段名称', '第一节'], ['start', 'time', '开始', '07:50'], ['end', 'time', '结束', '08:30'], ['attr', 'string', '属性', '上午']] },
      { key: 'tt-teacher', name: '教师课表', method: 'GET', path: '/timetables/teacher', desc: '获取教师周课表。', params: [['teacherId', 'string', '是', '教师 ID'], ['semesterId', 'string', '是', '学期 ID'], ['week', 'int', '否', '教学周']], fields: [['weekday', 'int', '星期', 1], ['periodId', 'string', '时段', 'PD02'], ['subject', 'string', '学科', '数学'], ['classId', 'string', '班级', 'C2025-03'], ['roomId', 'string', '教室', 'B203']] },
      { key: 'tt-student', name: '学生课表', method: 'GET', path: '/timetables/student', desc: '获取学生个人课表（含走班）。', params: [['studentId', 'string', '是', '学生 ID'], ['semesterId', 'string', '是', '学期 ID'], ['week', 'int', '否', '教学周']], fields: [['weekday', 'int', '星期', 1], ['periodId', 'string', '时段', 'PD02'], ['subject', 'string', '学科', '物理'], ['teacher', 'string', '教师', '巴展翔'], ['roomId', 'string', '教室', 'A205']] },
      { key: 'tt-class', name: '班级课表', method: 'GET', path: '/timetables/class', desc: '获取行政班课表。', params: [['classId', 'string', '是', '班级 ID'], ['semesterId', 'string', '是', '学期 ID']], fields: [['weekday', 'int', '星期', 1], ['periodId', 'string', '时段', 'PD02'], ['subject', 'string', '学科', '语文'], ['teacher', 'string', '教师', '边卫刚']] },
      { key: 'tt-room', name: '场地课表', method: 'GET', path: '/timetables/room', desc: '获取场地占用课表。', params: [['roomId', 'string', '是', '场地 ID'], ['semesterId', 'string', '是', '学期 ID']], fields: [['weekday', 'int', '星期', 3], ['periodId', 'string', '时段', 'PD05'], ['classId', 'string', '班级', '物理选考 1 班'], ['teacher', 'string', '教师', '巴展翔']] },
      { key: 'exams', name: '考试列表（含监考安排）', method: 'GET', path: '/exams', desc: '获取考试列表，附带每场考试的监考安排。', params: [SCHOOL_PARAM, ['semesterId', 'string', '是', '学期 ID'], ['gradeId', 'string', '否', '年级 ID']], fields: [['examId', 'string', '考试 ID', 'EX202611'], ['name', 'string', '考试名称', '高三期中考试'], ['modeId', 'string', '考试模式', 'M02'], ['sessions', 'array', '场次（科目、时间、考场）', [{ subject: '语文', time: '2026-11-18 08:00', room: 'A101' }]], ['invigilators', 'array', '监考安排', [{ room: 'A101', teachers: ['边卫刚', '白玉娜'] }]]] },
      { key: 'exam-modes', name: '考试模式', method: 'GET', path: '/exam-modes', desc: '获取考试模式（如选考 3+1+2）。', params: [SCHOOL_PARAM], fields: [['modeId', 'string', '模式 ID', 'M02'], ['name', 'string', '模式名称', '3+1+2 选考'], ['subjects', 'array', '科目组合', ['语文', '数学', '英语', '物理', '化学', '生物']]] },
    ],
  };

  P.OPEN_APPS = [
    ['学生画像', '20102', '学生评价', '微校+', 'ak_8f3c****2e1a', '已启用|ok'],
    ['一卡通', '20104', '总务后勤', 'Web / 移动端', 'ak_1b9d****77c0', '已启用|ok'],
    ['班牌管理系统', '20105', '家校互动', '班牌', 'ak_c02e****9b13', '已启用|ok'],
    ['成绩分析系统', '20109', '教学教务', 'Web', 'ak_5a71****f04d', '已启用|ok'],
    ['录播平台', '20107', '教学教务', 'Web', 'ak_e4d2****3a88', '待审核|warn'],
  ];

  P.MENUS.open = [
    {
      group: '概览', items: [
        { key: 'overview', label: '平台概览', icon: 'board', view: 'openOverview', desc: '接入应用、开放接口与调用情况一览，以及第三方接入流程。' },
      ],
    },
    {
      group: '应用接入', items: [
        {
          key: 'apps', label: '应用管理', icon: 'appstore', view: 'table',
          desc: '注册第三方应用，生成 AppKey / AppSecret，管理应用类型与适用平台。',
          filters: [{ select: ['全部应用类型', '学生评价', '总务后勤', '家校互动', '教学教务'] }, { select: ['全部平台', 'Web', '移动端', '微校+', '班牌'] }, { search: '应用名称 / 应用编码' }],
          actions: ['*注册应用!register'],
          columns: [
            { label: '应用名称', type: 'link' }, { label: '应用编码', type: 'mono' }, { label: '应用类型' }, { label: '适用平台' },
            { label: 'AppKey', type: 'mono' }, { label: '状态', type: 'tag' }, { label: '操作', type: 'ops' },
          ],
          rows: P.OPEN_APPS.map(r => [...r, ['接口授权>auth', '编辑', '重置密钥', '删除']]),
        },
        { key: 'auth', label: '第三方应用授权', icon: 'key', view: 'apiAuth', desc: '为每个第三方应用勾选可调用的基础数据与业务数据接口，未授权接口调用将被拒绝。' },
      ],
    },
    {
      group: '接口文档', items: [
        { key: 'api-base', label: '基础数据接口', icon: 'database', view: 'apiDocs', apiGroup: 'base', desc: '教师、学生、学期、学校、校区、学年、年级、班级、学科、建筑物、场地房间、部门、学生家长。' },
        { key: 'api-biz', label: '业务数据接口', icon: 'timetable', view: 'apiDocs', apiGroup: 'biz', desc: '课程时段、教师 / 学生 / 班级 / 场地课表、考试列表（附监考安排）、考试模式。' },
      ],
    },
    {
      group: '监控', items: [
        {
          key: 'logs', label: '调用日志', icon: 'log', view: 'table',
          desc: '记录每次接口调用的应用、接口、状态码与耗时。',
          filters: [{ select: ['全部应用', ...P.OPEN_APPS.map(r => r[0])] }, { seg: ['全部', '成功', '失败'] }, { date: '2026-11-13' }],
          actions: ['导出'],
          columns: [{ label: '时间' }, { label: '应用' }, { label: '接口', type: 'mono', align: 'left' }, { label: '方法' }, { label: '状态码', type: 'tag' }, { label: '耗时' }],
          rows: [
            ['11-13 09:41:07', '班牌管理系统', '/timetables/class', 'GET', '200|ok', '38 ms'],
            ['11-13 09:40:52', '成绩分析系统', '/students', 'GET', '200|ok', '112 ms'],
            ['11-13 09:40:11', '一卡通', '/teachers', 'GET', '200|ok', '64 ms'],
            ['11-13 09:39:30', '录播平台', '/rooms', 'GET', '403 未授权|danger', '6 ms'],
            ['11-13 09:38:02', '学生画像', '/exams', 'GET', '200|ok', '95 ms'],
          ],
          total: 18426,
        },
      ],
    },
  ];

  /* ============================================================
   * 4. 公共数据中心（数据标准）
   * ============================================================ */
  const F = (name, code, type, len, req, note) => [name, code, type, len, req ? '是' : '否', note];
  P.STD_INFO = [
    { key: 'school', name: '学校信息', fields: [F('学校标识码', 'XXBSM', 'C', 10, 1, '教育部学校标识码'), F('学校名称', 'XXMC', 'C', 60, 1, ''), F('办学性质', 'BXXZ', 'C', 2, 1, '见代码：办学性质'), F('学校简介', 'XXJJ', 'T', '—', 0, ''), F('校徽', 'XH', 'C', 255, 0, '图片地址'), F('建校年月', 'JXNY', 'D', 6, 0, 'YYYYMM')] },
    { key: 'period', name: '时段信息', fields: [F('时段编号', 'SDBH', 'C', 10, 1, ''), F('校区编号', 'XQBH', 'C', 10, 1, '关联校区信息'), F('时段名称', 'SDMC', 'C', 20, 1, '如：第一节'), F('开始时间', 'KSSJ', 'T', 5, 1, 'HH:mm'), F('结束时间', 'JSSJ', 'T', 5, 1, 'HH:mm'), F('时段属性', 'SDSX', 'C', 2, 1, '见代码：时段属性'), F('排序号', 'PXH', 'N', 3, 1, '')] },
    { key: 'venue', name: '场地信息', fields: [F('房间编号', 'FJBH', 'C', 20, 1, ''), F('建筑物编号', 'JZWBH', 'C', 10, 1, ''), F('楼层', 'LC', 'N', 3, 1, ''), F('房间名称', 'FJMC', 'C', 40, 1, ''), F('房间类型', 'FJLX', 'C', 2, 1, '见代码：场地类型'), F('容纳人数', 'RNRS', 'N', 4, 0, ''), F('电子班牌编号', 'DZBPBH', 'C', 30, 0, '')] },
    { key: 'teacher', name: '教师信息', fields: [F('教职工号', 'JZGH', 'C', 20, 1, '校内唯一'), F('姓名', 'XM', 'C', 36, 1, ''), F('性别码', 'XBM', 'C', 1, 1, 'GB/T 2261.1'), F('出生日期', 'CSRQ', 'D', 8, 0, 'YYYYMMDD'), F('身份证件号', 'SFZJH', 'C', 20, 1, '加密存储'), F('手机号', 'SJH', 'C', 11, 1, '展示时脱敏'), F('所属部门', 'SSBM', 'C', 200, 1, '多个以逗号分隔'), F('任教学科', 'RJXK', 'C', 100, 0, ''), F('在职状态', 'ZZZT', 'C', 1, 1, '见代码：在职状态')] },
    { key: 'grade', name: '年级信息', fields: [F('年级编号', 'NJBH', 'C', 10, 1, ''), F('年级名称', 'NJMC', 'C', 20, 1, ''), F('入学年份', 'RXNF', 'N', 4, 1, ''), F('年级长', 'NJZ', 'C', 20, 0, '教职工号'), F('学段', 'XD', 'C', 2, 1, '见代码：学段')] },
    { key: 'class', name: '班级信息', fields: [F('班级编号', 'BJBH', 'C', 20, 1, ''), F('年级编号', 'NJBH', 'C', 10, 1, ''), F('班级名称', 'BJMC', 'C', 30, 1, ''), F('班级类型', 'BJLX', 'C', 1, 1, '见代码：班级类型'), F('班主任', 'BZR', 'C', 20, 0, '教职工号'), F('教室', 'JS', 'C', 20, 0, '房间编号')] },
    { key: 'enroll', name: '学籍信息', fields: [F('学籍号', 'XJH', 'C', 30, 1, '全国学籍号'), F('姓名', 'XM', 'C', 36, 1, ''), F('性别码', 'XBM', 'C', 1, 1, ''), F('身份证件号', 'SFZJH', 'C', 20, 1, '加密存储'), F('入学年份', 'RXNF', 'N', 4, 1, ''), F('学籍性质', 'XJXZ', 'C', 2, 1, '见代码：学籍性质'), F('在校状态', 'ZXZT', 'C', 1, 1, '见代码：在校状态'), F('当前班级', 'DQBJ', 'C', 20, 1, '班级编号')] },
    { key: 'dept', name: '部门信息', fields: [F('部门编号', 'BMBH', 'C', 10, 1, ''), F('部门名称', 'BMMC', 'C', 40, 1, ''), F('上级部门', 'SJBM', 'C', 10, 0, ''), F('所在场地', 'SZCD', 'C', 20, 0, '房间编号'), F('排序号', 'PXH', 'N', 3, 1, '')] },
    { key: 'subject', name: '学科信息', fields: [F('学科编码', 'XKBM', 'C', 10, 1, ''), F('学科名称', 'XKMC', 'C', 20, 1, ''), F('适用校区', 'SYXQ', 'C', 100, 1, '校区编号，多值'), F('排序号', 'PXH', 'N', 3, 1, '')] },
    { key: 'campus', name: '校区信息', fields: [F('校区编号', 'XQBH', 'C', 10, 1, ''), F('校区名称', 'XQMC', 'C', 40, 1, ''), F('是否主校区', 'SFZXQ', 'B', 1, 1, ''), F('校区地址', 'XQDZ', 'C', 120, 0, ''), F('排序号', 'PXH', 'N', 3, 1, '')] },
    { key: 'year', name: '学年信息', fields: [F('学年编号', 'XNBH', 'C', 10, 1, ''), F('学年名称', 'XNMC', 'C', 20, 1, '如 2026-2027'), F('开始日期', 'KSRQ', 'D', 8, 1, ''), F('结束日期', 'JSRQ', 'D', 8, 1, ''), F('是否当前', 'SFDQ', 'B', 1, 1, '')] },
    { key: 'term', name: '学期信息', fields: [F('学期编号', 'XQBH', 'C', 10, 1, ''), F('学年编号', 'XNBH', 'C', 10, 1, ''), F('学期类型', 'XQLX', 'C', 1, 1, '见代码：学期类型'), F('开始日期', 'KSRQ', 'D', 8, 1, ''), F('结束日期', 'JSRQ', 'D', 8, 1, ''), F('教学周数', 'JXZS', 'N', 2, 1, '')] },
    { key: 'role', name: '角色信息', fields: [F('角色编号', 'JSBH', 'C', 10, 1, ''), F('角色名称', 'JSMC', 'C', 30, 1, ''), F('角色说明', 'JSSM', 'C', 200, 0, ''), F('权限集合', 'QXJH', 'T', '—', 1, 'WEB / 移动端功能点'), F('是否内置', 'SFNZ', 'B', 1, 1, '内置角色不可删除')] },
  ];

  P.STD_CODES = [
    { key: 'gender', name: '性别（GB/T 2261.1）', rows: [['0', '未知的性别', ''], ['1', '男', ''], ['2', '女', ''], ['9', '未说明的性别', '']] },
    { key: 'enroll-nature', name: '学籍性质', rows: [['01', '本校学籍', ''], ['02', '借读', '学籍在外校'], ['03', '寄读', '']] },
    { key: 'in-school', name: '在校状态', rows: [['1', '在校', ''], ['2', '休学', ''], ['3', '离校', '自动流转至校友管理'], ['4', '复学', '']] },
    { key: 'room-type', name: '场地类型', rows: [['01', '普通教室', ''], ['02', '实验室', ''], ['03', '功能室', ''], ['04', '办公室', ''], ['05', '会议室', ''], ['06', '宿舍', ''], ['07', '运动场馆', '']] },
    { key: 'class-type', name: '班级类型', rows: [['1', '行政班', ''], ['2', '教学班', '走班 / 选考']] },
    { key: 'period-attr', name: '时段属性', rows: [['1', '上午', ''], ['2', '下午', ''], ['3', '晚上', ''], ['4', '活动', '大课间 / 午休']] },
    { key: 'term-type', name: '学期类型', rows: [['1', '第一学期', '秋季'], ['2', '第二学期', '春季']] },
    { key: 'course-nature', name: '课程性质', rows: [['1', '必修', ''], ['2', '选择性必修', ''], ['3', '选修', '']] },
    { key: 'temp-type', name: '临时人员类型', rows: [['1', '临时学生', ''], ['2', '临时校友', ''], ['3', '临时教师', ''], ['4', '校外人员', '来源：流程审批 / 数据收集 / 电子签到']] },
    { key: 'job-status', name: '在职状态', rows: [['1', '在职', ''], ['0', '禁用', ''], ['2', '离职', '']] },
  ];

  const S = (desc, actors, cases, fields) => ({ desc, actors, cases, fields });
  P.STD_SPECS = [
    { key: 'post', name: '岗位安排', ...S('教务部门按年级设置行政班与走班岗位安排表，统计教师工作量。', ['教务管理员', '教师'], ['设置学科周课时', '分配任课教师', '设置班主任与备课组长', '统计教师工作量', '查看个人岗位'], [['gradeId', 'string', '年级'], ['classId', 'string', '班级'], ['subjectId', 'string', '学科'], ['teacherId', 'string', '任课教师'], ['weekHours', 'int', '周课时'], ['isLeader', 'bool', '是否备课组长']]) },
    { key: 'score', name: '成绩管理', ...S('考试成绩录入、导入、审核发布与统计分析。', ['教务管理员', '任课教师', '学生 / 家长'], ['导入成绩', '录入单科成绩', '审核发布', '查看成绩分析', '查询个人成绩'], [['examId', 'string', '考试'], ['studentId', 'string', '学生'], ['subjectId', 'string', '学科'], ['score', 'decimal', '分数'], ['rankClass', 'int', '班级排名'], ['rankGrade', 'int', '年级排名']]) },
    { key: 'exam', name: '考试安排', ...S('创建考试、编排考场与座位、安排监考。', ['教务管理员', '监考教师', '学生'], ['创建考试', '编排考场座位', '安排监考', '查看监考任务', '查看考场座位'], [['examId', 'string', '考试'], ['modeId', 'string', '考试模式'], ['subjectId', 'string', '科目'], ['roomId', 'string', '考场'], ['startTime', 'datetime', '开始时间'], ['invigilators', 'array', '监考教师']]) },
    { key: 'survey', name: '走班调研', ...S('发布选科意向调研，汇总学生选科组合。', ['教务管理员', '学生 / 家长'], ['发布调研', '填报选科意向', '统计组合分布', '导出调研结果'], [['surveyId', 'string', '调研'], ['studentId', 'string', '学生'], ['combination', 'string', '选科组合'], ['submitTime', 'datetime', '提交时间']]) },
    { key: 'walk-schedule', name: '走班排课', ...S('基于选科结果生成教学班并自动排课。', ['教务管理员'], ['生成教学班', '设置排课规则', '自动排课', '手动调课', '发布课表'], [['classId', 'string', '教学班'], ['weekday', 'int', '星期'], ['periodId', 'string', '时段'], ['roomId', 'string', '场地'], ['teacherId', 'string', '教师']]) },
    { key: 'admin-schedule', name: '行政班排课', ...S('按行政班与岗位安排自动生成课表。', ['教务管理员', '教师', '学生'], ['导入岗位安排', '设置排课约束', '自动排课', '调代课', '查看课表'], [['classId', 'string', '行政班'], ['weekday', 'int', '星期'], ['periodId', 'string', '时段'], ['subjectId', 'string', '学科'], ['teacherId', 'string', '教师']]) },
    { key: 'elective', name: '课程选修', ...S('发布选修课程，学生在线选课。', ['教务管理员', '授课教师', '学生'], ['发布选修课程', '在线选课', '调整名额', '课程考勤评价'], [['courseId', 'string', '课程'], ['studentId', 'string', '学生'], ['credit', 'decimal', '学分'], ['status', 'int', '选课状态']]) },
    { key: 'class-eval', name: '班级评比', ...S('按检查项对班级进行日常评比与文明班级统计。', ['值周教师', '学生处', '班主任'], ['设置评比项', '录入评比分', '统计排名', '查看本班得分'], [['classId', 'string', '班级'], ['itemId', 'string', '评比项'], ['score', 'decimal', '得分'], ['date', 'date', '日期'], ['checker', 'string', '检查人']]) },
    { key: 'club', name: '社团报名', ...S('社团发布、学生报名与审核。', ['社团指导教师', '学生'], ['发布社团', '在线报名', '审核报名', '社团活动记录'], [['clubId', 'string', '社团'], ['studentId', 'string', '学生'], ['status', 'int', '审核状态'], ['applyTime', 'datetime', '报名时间']]) },
    { key: 'dorm', name: '宿舍管理', ...S('宿舍分配、查寝与卫生检查。', ['宿管', '班主任', '学生'], ['分配床位', '查寝考勤', '卫生检查', '查看住宿信息'], [['roomId', 'string', '宿舍'], ['bedNo', 'int', '床位'], ['studentId', 'string', '学生'], ['checkResult', 'string', '检查结果']]) },
    { key: 'goods', name: '物品管理', ...S('物品入库、领用申请、审批与发放。', ['后勤管理员', '教师'], ['物品入库', '领用申请', '审批', '发放登记', '库存统计'], [['goodsId', 'string', '物品'], ['qty', 'int', '数量'], ['applicant', 'string', '申请人'], ['status', 'int', '审批状态']]) },
    { key: 'repair', name: '报修管理', ...S('在线报修、派单、维修与评价。', ['报修人', '后勤管理员', '维修工'], ['提交报修', '派单', '维修反馈', '评价', '报修统计'], [['repairId', 'string', '报修单'], ['roomId', 'string', '地点'], ['category', 'string', '类别'], ['worker', 'string', '维修人'], ['status', 'int', '状态']]) },
    { key: 'archive', name: '专业化档案', ...S('教师专业发展档案：荣誉、论文、课题、培训。', ['教师', '教科室'], ['填报成果', '审核成果', '档案查询', '导出档案'], [['teacherId', 'string', '教师'], ['type', 'string', '成果类型'], ['title', 'string', '名称'], ['level', 'string', '级别'], ['date', 'date', '获得时间']]) },
  ];

  P.MENUS.std = [
    {
      group: '概览', items: [
        { key: 'overview', label: '标准体系', icon: 'layers', view: 'stdOverview', desc: '为信息交换和资源共享提供基础条件，保证数据在采集、交换、传输过程中分类和描述统一、科学、规范。' },
      ],
    },
    {
      group: '数据标准', items: [
        { key: 'info', label: '信息标准', icon: 'database', view: 'stdMaster', source: 'info', desc: '学校、时段、场地、教师、年级、班级、学籍、部门、学科、校区、学年、学期、角色 13 类信息的标准字段及字段说明。' },
        { key: 'code', label: '代码编码标准', icon: 'dict', view: 'stdMaster', source: 'code', desc: '各业务共用的代码表，统一编码与取值。' },
      ],
    },
    {
      group: '业务规范', items: [
        { key: 'spec', label: '业务输出规范', icon: 'docflow', view: 'stdSpec', desc: '岗位安排、成绩管理、考试安排等 13 项业务的功能描述、用例图与数据结构。' },
      ],
    },
    {
      group: '技术与管理', items: [
        {
          key: 'tech', label: '技术标准', icon: 'api', view: 'table',
          desc: '接口、数据交换与安全的技术约定。',
          actions: ['*新增标准'],
          columns: [{ label: '标准编号', type: 'mono' }, { label: '标准名称', align: 'left' }, { label: '类别', type: 'tag' }, { label: '版本' }, { label: '发布日期' }, { label: '操作', type: 'ops' }],
          rows: [
            ['DZ-JS-001', '开放接口设计规范（RESTful）', '接口规范|info', 'v1.4', '2026-09-01', ['查看', '下载']],
            ['DZ-JS-002', '数据交换与同步规范', '数据交换|ok', 'v1.2', '2026-09-01', ['查看', '下载']],
            ['DZ-JS-003', '身份认证与授权规范（OAuth2.0）', '安全规范|warn', 'v1.1', '2026-09-01', ['查看', '下载']],
            ['DZ-JS-004', '敏感数据加密与脱敏规范', '安全规范|warn', 'v1.0', '2026-09-01', ['查看', '下载']],
          ],
        },
        {
          key: 'mgmt', label: '管理规范', icon: 'audit', view: 'table',
          desc: '保证信息化系统建设、使用、管理、维护规范有序的管理制度。',
          actions: ['*新增规范'],
          columns: [{ label: '编号', type: 'mono' }, { label: '规范名称', align: 'left' }, { label: '责任部门' }, { label: '版本' }, { label: '发布日期' }, { label: '操作', type: 'ops' }],
          rows: [
            ['DZ-GL-001', '基础数据维护管理办法', '教务处', 'v1.0', '2026-09-01', ['查看', '下载']],
            ['DZ-GL-002', '数据共享与开放审批制度', '办公室', 'v1.0', '2026-09-01', ['查看', '下载']],
            ['DZ-GL-003', '账号与权限管理制度', '办公室', 'v1.0', '2026-09-01', ['查看', '下载']],
            ['DZ-GL-004', '信息系统运维与应急预案', '总务处', 'v1.0', '2026-09-01', ['查看', '下载']],
          ],
        },
      ],
    },
  ];
})();
