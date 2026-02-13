# Dashboard Web

지자체 돌봄 매니저를 위한 웹 대시보드 프로젝트입니다.

## 개발 환경 설정

이 프로젝트는 Node.js 환경에서 실행됩니다. 패키지 매니저는 **npm**을 사용합니다.
(참고: 기획 문서 등에서 `pnpm`을 언급할 수 있으나, 현재 프로젝트의 의존성 관리(`package-lock.json`)는 **npm**을 기준으로 되어 있습니다.)

### 필수 요구사항

- Node.js (LTS 버전 권장, v20 이상)
- npm

### 설치 및 실행 방법

1. **Node.js 설치 (NVM 사용 권장)**
   
   NVM(Node Version Manager)을 사용하여 Node.js를 설치하고 버전을 관리하는 것을 권장합니다.

   ```bash
   # NVM 설치 (없는 경우)
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

   # NVM 환경 변수 로드 (설치 직후 터미널 재시작 없이 사용 시)
   export NVM_DIR="$HOME/.nvm"
   [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

   # Node.js LTS 버전 설치 및 사용
   nvm install --lts
   nvm use --lts
   ```

2. **의존성 설치**

   프로젝트 루트 디렉토리(`dashboard-web`)에서 다음 명령어를 실행하여 필요한 패키지를 설치합니다.

   ```bash
   npm install
   ```

3. **개발 서버 실행**

   ```bash
   npm run dev
   ```
   
   서버가 실행되면 브라우저에서 [http://localhost:3000](http://localhost:3000)으로 접속하여 확인할 수 있습니다.

### 빌드 및 배포

프로덕션 환경을 위한 빌드는 다음 명령어를 사용합니다.

```bash
# 빌드
npm run build

# 프로덕션 서버 실행
npm start
```
