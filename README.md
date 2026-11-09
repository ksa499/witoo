# Witoo 웹앱 (PWA)

React + TypeScript + Vite 로 만든 모바일 웹앱입니다. 디자인 프로토타입의 67개 화면이 모두 연결되어 있고,
폰에서 "홈 화면에 추가"하면 앱처럼 설치해서 쓸 수 있어요.

## 실행 (VS Code)
1. Node.js LTS 설치 (https://nodejs.org)
2. VS Code 에서 이 폴더 열기 → 터미널(`Ctrl + ~`)
3. `npm install`
4. `npm run dev` → 터미널에 나온 주소(http://localhost:5173) 를 브라우저로 열기
   - 같은 와이파이의 폰에서는 터미널에 나온 `Network:` 주소로 접속

## 빌드 / 배포
- `npm run build` → `dist/` 폴더가 생성됩니다 (정적 파일 — Netlify, Vercel, GitHub Pages, Firebase Hosting 등에 그대로 올리면 됨)
- `npm run preview` → 빌드 결과를 로컬에서 확인
- PWA(홈 화면 설치, 오프라인)는 **https 주소**에서 동작합니다. (localhost 는 예외)

## 더블클릭으로 열리는 HTML 한 파일 만들기
`npm run build` 후 `python3 tools/make-single-html.py` → `witoo.html` (이미지·폰트가 모두 들어간 단일 파일, 설치 없이 브라우저로 열림)

## QR 코드로 폰에 설치
- 기본으로는 QR 이 보이지 않아요. 주소 끝에 `?qr` 을 붙여 PC 브라우저(화면 너비 900px 이상)에서 열면(예: `https://내주소/?qr`) 오른쪽에 **"폰으로 열기" QR** 이 나와요. 폰 카메라로 스캔하면 지금 보고 있는 주소가 열려요.
- 설치(홈 화면 추가)까지 하려면 **https 로 배포된 주소**에서 이 QR 을 스캔해야 해요.
  1. `npm run build`
  2. `dist/` 폴더를 Netlify Drop (https://app.netlify.com/drop) 에 끌어다 놓기 → `https://....netlify.app` 주소 생성 (가입만 하면 무료)
  3. 그 주소를 PC 브라우저로 열면 그 주소의 QR 이 나옵니다 → 폰으로 스캔 → 홈 화면에 추가
- 개발 중 `npm run dev` 의 `Network:` 주소는 http 라서 화면 확인은 되지만 "설치"는 안 될 수 있어요.

## 폰에 앱처럼 설치
- Android Chrome: 메뉴 → "홈 화면에 추가" / "앱 설치"
- iPhone Safari: 공유 버튼 → "홈 화면에 추가"

## 폴더 구조
```
src/
  App.tsx            393×852 화면 틀을 기기 크기에 맞춰 가운데 정렬 + 배율 조정
  dc.tsx             화면 로직 어댑터 (renderVals 클래스 → React 컴포넌트)
  screens/           화면별 파일  (Splash, Start, Signup, Login, PwFind, Intro, Setup,
                                  Home, Sim, Peg, Drawer, My, Alerts)  + 같은 이름의 .css
    Main.tsx         앱 전체 상태(data)와 화면 전환 (go / patch)
  ds/witoo.js        디자인 시스템 컴포넌트 (Button, ChoiceButton, TabBar, TopBar …)
  styles/            tokens.css(색·폰트), ds.css, screens.css, app.css
public/
  img/               화면에서 쓰는 이미지(캐릭터, 가전 아이콘, 방 …)
  fonts/             Freesentation, Galmuri11
  icons/             PWA 아이콘
```

## 알아둘 것
- 화면 로직은 프로토타입에서 그대로 옮겨서, 각 화면 파일 위쪽의 `class Component` 안에 있어요.
  서버 연동은 `Main.tsx` 의 `go` / `patch` (공유 데이터 `data`) 와 각 화면의 `onPatch` 호출 지점에 붙이면 됩니다.
- 로그인/회원가입은 데모용 가짜 계정(`user@example.com` / `password1`)으로 동작해요. 로그인 화면에서 이메일·비밀번호 칸을 누르면 자동 입력됩니다.
- 파일 상단 `// @ts-nocheck` 는 프로토타입 코드를 그대로 옮긴 부분이라 타입을 아직 달지 않았다는 표시예요.
  화면을 하나씩 정리하면서 지워 나가세요.
- 화면 확인용 주소: `http://localhost:5173/#home/`, `#peg/card`, `#my/notif` 처럼 `#화면/상태` 로 바로 열 수 있어요.

## GitHub Pages 배포
1. 저장소 Settings → Pages → Source 를 **GitHub Actions** 로 설정
2. `main` 브랜치에 push 하면 자동 빌드·배포 (`.github/workflows/deploy.yml`)
3. 주소: `https://<아이디>.github.io/<저장소이름>/`
