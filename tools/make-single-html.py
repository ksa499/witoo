#!/usr/bin/env python3
"""dist/ (npm run build 결과) 를 더블클릭으로 열리는 단일 HTML 파일로 묶어요.
사용: npm run build && python3 tools/make-single-html.py   ->  witoo.html"""
import base64, mimetypes, os, re, sys
root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
dist = os.path.join(root, 'dist')
KEEP_FONTS = ('Freesentation-4Regular', 'Freesentation-5Medium', 'Freesentation-6SemiBold', 'Freesentation-7Bold', 'Galmuri11-Bold')
MT = {'.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.woff2': 'font/woff2'}
def uri(path):
    ext = os.path.splitext(path)[1]
    return f'data:{MT[ext]};base64,' + base64.b64encode(open(path, 'rb').read()).decode()
def inline_assets(text):
    def sub(m):
        rel = m.group(1)
        p = os.path.join(dist, rel.lstrip('/'))
        if rel.startswith('/fonts/') and not any(k in rel for k in KEEP_FONTS):
            return 'data:font/woff2;base64,'          # 안 쓰는 굵기는 비워 둠
        return uri(p) if os.path.exists(p) else m.group(0)
    return re.sub(r'(/(?:img|fonts)/[A-Za-z0-9_.\-]+\.(?:svg|png|jpg|woff2))', sub, text)
html = open(os.path.join(dist, 'index.html'), encoding='utf-8').read()
css_m = re.search(r'<link rel="stylesheet"[^>]*href="(/assets/[^"]+\.css)"[^>]*>', html)
js_m = re.search(r'<script type="module"[^>]*src="(/assets/[^"]+\.js)"[^>]*></script>', html)
css = inline_assets(open(dist + css_m.group(1), encoding='utf-8').read())
js = inline_assets(open(dist + js_m.group(1), encoding='utf-8').read()).replace('</script', '<\\/script')
html = html.replace(css_m.group(0), '<style>' + css + '</style>')
html = html.replace(js_m.group(0), '')
html = re.sub(r'<link rel="(?:manifest|apple-touch-icon|icon)"[^>]*>', '', html)
html = re.sub(r'<script[^>]*registerSW[^>]*></script>', '', html)
html = html.replace('</body>', '<script type="module">' + js + '</script></body>')
out = os.path.join(root, 'witoo.html')
open(out, 'w', encoding='utf-8').write(html)
print('만들었어요:', out, round(os.path.getsize(out) / 1e6, 1), 'MB')
