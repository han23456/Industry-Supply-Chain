import pandas as pd
import json
import re
import os

os.makedirs('data', exist_ok=True)

PROVINCE_MAP = {
    '北京': '北京市', '天津': '天津市', '上海': '上海市', '重庆': '重庆市',
    '河北': '河北省', '山西': '山西省', '辽宁': '辽宁省', '吉林': '吉林省',
    '黑龙江': '黑龙江省', '江苏': '江苏省', '浙江': '浙江省', '安徽': '安徽省',
    '福建': '福建省', '江西': '江西省', '山东': '山东省', '河南': '河南省',
    '湖北': '湖北省', '湖南': '湖南省', '广东': '广东省', '海南': '海南省',
    '四川': '四川省', '贵州': '贵州省', '云南': '云南省', '陕西': '陕西省',
    '甘肃': '甘肃省', '青海': '青海省', '台湾': '台湾省',
    '内蒙古': '内蒙古自治区', '广西': '广西壮族自治区', '西藏': '西藏自治区',
    '宁夏': '宁夏回族自治区', '新疆': '新疆维吾尔自治区',
    '香港': '香港特别行政区', '澳门': '澳门特别行政区',
}

def extract_province(address):
    if not address or not isinstance(address, str):
        return '未知'
    for short in PROVINCE_MAP:
        if short in address:
            return short
    return '未知'

def clean_row(record):
    for k, v in record.items():
        if pd.isna(v):
            record[k] = ''
        elif isinstance(v, float):
            record[k] = round(v, 2)
    return record

def safe_df(df):
    df = df.fillna('')
    return df

def parse_capital(val):
    if not val or not isinstance(val, str):
        return 0
    val = val.replace(',', '').replace('，', '')
    m = re.search(r'([\d.]+)\s*万', val)
    if m:
        return float(m.group(1))
    m = re.search(r'([\d.]+)\s*亿', val)
    if m:
        return float(m.group(1)) * 10000
    return 0

def capital_distribution(df, col='注册资本'):
    if col not in df.columns:
        return {}
    vals = df[col].apply(parse_capital)
    bins = [0, 1000, 5000, 10000, 50000, float('inf')]
    labels = ['1000万以下', '1000-5000万', '5000万-1亿', '1-5亿', '5亿以上']
    grouped = pd.cut(vals, bins=bins, labels=labels, right=False)
    dist = grouped.value_counts().to_dict()
    return {str(k): int(v) for k, v in dist.items()}

def write_json(path, data):
    with open(path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

# ===================== 1. 全国产值统筹归集 =====================
print("处理: 全国产值统筹归集")
df_gc = safe_df(pd.read_excel('全国产值统筹归集-20260429.xlsx', sheet_name=0))

for col in ['集团总营收（万元）', '企业营收（万元）']:
    df_gc[col] = pd.to_numeric(df_gc[col], errors='coerce').fillna(0)

gc_stats = {
    'group_count': int(df_gc['集团名称'].nunique()),
    'enterprise_count': int(len(df_gc)),
    'qianhai_count': int((df_gc['所属区域'] == '前海').sum()),
    'yidi_count': int((df_gc['所属区域'] == '异地').sum()),
    'total_revenue': float(round(df_gc.groupby('集团名称')['集团总营收（万元）'].first().sum(), 2)),
}

gc_table = [clean_row(r) for r in df_gc.to_dict(orient='records')]

level_region = df_gc.groupby(['企业层级', '所属区域']).size().unstack(fill_value=0)
level_data = []
for level_name in level_region.index:
    level_data.append({
        'name': level_name,
        'qianhai': int(level_region.loc[level_name].get('前海', 0)),
        'yidi': int(level_region.loc[level_name].get('异地', 0))
    })

write_json('data/gongchan.json', {
    'stats': gc_stats,
    'level_chart': level_data,
    'province_chart': df_gc['省'].value_counts().head(10).to_dict(),
    'capital_chart': capital_distribution(df_gc),
    'industry_chart': df_gc['所属行业'].value_counts().head(10).to_dict(),
    'group_revenue_chart': df_gc.groupby('集团名称')['集团总营收（万元）'].first().sort_values(ascending=False).head(10).to_dict(),
    'table': gc_table
})

# ===================== 2. 在地企业产贸一体化 =====================
print("处理: 在地企业产贸一体化")
xl_cm = pd.ExcelFile('在地企业产贸一体化-20260429.xlsx')

cm_sheets = {}
cm_all_dfs = []
cm_short_labels = {
    '四上制造业所属集团在前海无商贸，在异地无商贸': '集团-双无商贸',
    '四上制造业所属集团在前海无商贸，在异地有商贸': '集团-异地有商贸',
    '四上制造业（非集团）在前海无商贸，在异地无商贸': '非集团-双无商贸',
    '四上制造业（非集团）在前海无商贸，在异地有商贸': '非集团-异地有商贸',
}

for sheet_name in xl_cm.sheet_names:
    df = safe_df(pd.read_excel(xl_cm, sheet_name=sheet_name))
    cm_sheets[sheet_name] = [clean_row(r) for r in df.to_dict(orient='records')]
    cm_all_dfs.append(df)

df_cm_concat = pd.concat(cm_all_dfs, ignore_index=True)

group_count = df_cm_concat['集团名称'].dropna().nunique() if '集团名称' in df_cm_concat.columns else 0
non_group_count = len(cm_all_dfs[2]) + len(cm_all_dfs[3]) if len(cm_all_dfs) >= 4 else 0
qianhai_no_commerce = len(cm_all_dfs[0]) + len(cm_all_dfs[2]) if len(cm_all_dfs) >= 4 else 0
yidi_has_commerce = len(cm_all_dfs[1]) + len(cm_all_dfs[3]) if len(cm_all_dfs) >= 4 else 0

# sheet1 企业名称去重
s1_count = cm_all_dfs[0]['企业名称'].dropna().nunique() if len(cm_all_dfs) >= 1 and '企业名称' in cm_all_dfs[0].columns else 0
# sheet2 所属区域为"前海"的企业名称去重
s2_count = 0
if len(cm_all_dfs) >= 2 and '企业名称' in cm_all_dfs[1].columns:
    df_qh = cm_all_dfs[1]
    if '所属区域' in df_qh.columns:
        s2_count = df_qh[df_qh['所属区域'] == '前海']['企业名称'].dropna().nunique()
    else:
        s2_count = df_qh['企业名称'].dropna().nunique()
# sheet3 企业名称去重
s3_count = cm_all_dfs[2]['企业名称'].dropna().nunique() if len(cm_all_dfs) >= 3 and '企业名称' in cm_all_dfs[2].columns else 0
# sheet4 企业名称去重
s4_count = cm_all_dfs[3]['企业名称'].dropna().nunique() if len(cm_all_dfs) >= 4 and '企业名称' in cm_all_dfs[3].columns else 0

cm_total = s1_count + s2_count + s3_count + s4_count

cm_stats = {
    'group_count': int(group_count) if pd.notna(group_count) else 0,
    'non_group_count': int(non_group_count),
    'qianhai_no_commerce': int(qianhai_no_commerce),
    'yidi_has_commerce': int(yidi_has_commerce),
    'total_enterprises': int(cm_total),
    'has_commerce': int(s2_count + s4_count),
}

cm_category_chart = []
for sheet_name in xl_cm.sheet_names:
    short = cm_short_labels.get(sheet_name, sheet_name)
    cm_category_chart.append({'name': short, 'value': len(cm_sheets[sheet_name])})

if '所属行业' in df_cm_concat.columns:
    cm_industry_chart = df_cm_concat['所属行业'].value_counts().head(10).to_dict()
else:
    cm_industry_chart = {}

write_json('data/chanmao.json', {
    'stats': cm_stats,
    'category_chart': cm_category_chart,
    'industry_chart': cm_industry_chart,
    'capital_chart': capital_distribution(df_cm_concat),
    'sheets': cm_sheets,
    'sheet_names': xl_cm.sheet_names
})

# ===================== 3. 在地未纳统企业筛查 =====================
print("处理: 在地未纳统企业筛查")
xl_wnd = pd.ExcelFile('在地未纳统企业筛查-20260429.xlsx')

wnd_sheets = {}
wnd_all_groups = set()
wnd_nation_groups = set()
total_enterprises = 0
wnd_all_dfs = []

wnd_first_sheet_df = None

for sheet_name in xl_wnd.sheet_names:
    df = safe_df(pd.read_excel(xl_wnd, sheet_name=sheet_name))
    wnd_sheets[sheet_name] = [clean_row(r) for r in df.to_dict(orient='records')]
    wnd_all_dfs.append(df)

    if '集团名称' in df.columns:
        groups = df['集团名称'].dropna().unique()
        wnd_all_groups.update(groups)
        if any(kw in sheet_name for kw in ['1家', '2家', '3家', '4家', '以上']):
            wnd_nation_groups.update(groups)

    total_enterprises += len(df)

    if wnd_first_sheet_df is None and '没有纳统' in sheet_name:
        wnd_first_sheet_df = df

# 未纳统企业营收：所有sheet的企业营收（万元）求和
non_nation_revenue = 0
for df in wnd_all_dfs:
    if '企业营收（万元）' in df.columns:
        rev = pd.to_numeric(df['企业营收（万元）'], errors='coerce').fillna(0).sum()
        non_nation_revenue += float(rev)
    elif '集团总营收（万元）' in df.columns:
        rev = pd.to_numeric(df['集团总营收（万元）'], errors='coerce').fillna(0).sum()
        non_nation_revenue += float(rev)

wnd_industry_chart = {}
if wnd_first_sheet_df is not None and '集团名称' in wnd_first_sheet_df.columns:
    df_no_nat = wnd_first_sheet_df.copy()
    if '所属行业' in df_no_nat.columns:
        wnd_industry_chart = df_no_nat.groupby('集团名称')['所属行业'].first().value_counts().head(10).to_dict()

wnd_stats = {
    'total_groups': len(wnd_all_groups),
    'nation_groups': len(wnd_nation_groups),
    'non_nation_groups': len(wnd_all_groups - wnd_nation_groups),
    'total_enterprises': total_enterprises,
    'non_nation_revenue': non_nation_revenue,
}

wnd_capital_chart = capital_distribution(pd.concat(wnd_all_dfs, ignore_index=True)) if wnd_all_dfs else {}

write_json('data/weinadong.json', {
    'stats': wnd_stats,
    'capital_chart': wnd_capital_chart,
    'sheets': wnd_sheets,
    'sheet_names': xl_wnd.sheet_names
})

# ===================== 4. 500强清单 =====================
print("处理: 500强清单")
df_500 = safe_df(pd.read_excel('未在前海投资的中国500强企业清单-20260508.xlsx', sheet_name=0))

for col in ['营业收入（万元）']:
    df_500[col] = pd.to_numeric(df_500[col], errors='coerce').fillna(0)

df_500['省份'] = df_500['总部地址'].apply(extract_province)

# 按榜单类型统计中国500强 / 民营500强
list_col = df_500.columns[0]
china_500_count = int((df_500[list_col] == '2025中国企业500强').sum())
private_500_count = int((df_500[list_col] == '2025中国民营企业500强').sum())

bins = [0, 1000000, 5000000, 10000000, 50000000, float('inf')]
bin_labels = ['100亿以下', '100-500亿', '500-1000亿', '1000-5000亿', '5000亿以上']
df_500['营收分段'] = pd.cut(df_500['营业收入（万元）'], bins=bins, labels=bin_labels, right=False)
revenue_dist = df_500['营收分段'].value_counts().to_dict()
revenue_distribution = {str(k): int(v) for k, v in revenue_dist.items()}

stats_500 = {
    'total_count': int(len(df_500)),
    'total_revenue': float(round(df_500['营业收入（万元）'].sum(), 2)),
    'china_500_count': china_500_count,
    'private_500_count': private_500_count,
}

# 删除列表中不需要的字段
if '营收分段' in df_500.columns:
    df_500 = df_500.drop(columns=['营收分段'])

table_500 = [clean_row(r) for r in df_500.to_dict(orient='records')]

write_json('data/top500.json', {
    'stats': stats_500,
    'province_chart': df_500['省份'].value_counts().head(10).to_dict(),
    'top10_chart': df_500.nlargest(10, '营业收入（万元）').set_index('企业名称')['营业收入（万元）'].to_dict(),
    'revenue_distribution': revenue_distribution,
    'table': table_500
})

# ===================== 总体情况 =====================
print("处理: 总体情况")
overview = {
    'total_groups': gc_stats['group_count'],
    'total_enterprises': gc_stats['enterprise_count'] + cm_stats['total_enterprises'] + wnd_stats['total_enterprises'] + stats_500['total_count'],
    'qianhai_enterprises': gc_stats['qianhai_count'],
    'yidi_enterprises': gc_stats['yidi_count'],
    'top500_count': stats_500['total_count'],
    'modules': [
        {
            'name': '全国产值统筹归集',
            'short_name': '全国产值统筹',
            'key': 'gongchan',
            'enterprise_count': gc_stats['enterprise_count'],
            'group_count': gc_stats['group_count'],
            'qianhai_count': gc_stats['qianhai_count'],
            'yidi_count': gc_stats['yidi_count'],
            'desc': f"覆盖 {gc_stats['group_count']} 个集团，{gc_stats['enterprise_count']} 家企业"
        },
        {
            'name': '在地企业产贸一体化',
            'short_name': '产贸一体化',
            'key': 'chanmao',
            'enterprise_count': cm_stats['total_enterprises'],
            'group_count': cm_stats['group_count'],
            'non_group_count': cm_stats['non_group_count'],
            'qianhai_no_commerce': cm_stats['qianhai_no_commerce'],
            'desc': f"集团 {cm_stats['group_count']} 个，非集团企业 {cm_stats['non_group_count']} 家"
        },
        {
            'name': '在地未纳统企业筛查',
            'short_name': '在地未纳统',
            'key': 'weinadong',
            'enterprise_count': wnd_stats['total_enterprises'],
            'group_count': wnd_stats['total_groups'],
            'non_nation_groups': wnd_stats['non_nation_groups'],
            'desc': f"筛查集团 {wnd_stats['total_groups']} 个，涉及企业 {wnd_stats['total_enterprises']} 家"
        },
        {
            'name': '未在前海投资的500强',
            'short_name': '500强未投资',
            'key': 'top500',
            'enterprise_count': stats_500['total_count'],
            'group_count': 0,
            'total_revenue': stats_500['total_revenue'],
            'desc': f"{stats_500['total_count']} 家企业，总营收 {stats_500['total_revenue']/10000:.0f} 亿元"
        }
    ]
}

write_json('data/overview.json', overview)

print("数据处理完成！")
