## LiveKit API

Livekit API 명세

1. LiveKit 토큰 생성
- Endpoint: POST /livekit/token
- 설명: LiveKit 방에 참여하기 위한 JWT 토큰을 생성합니다.
- 요청 본문 (Request Body):
    - roomName (string, 필수): 참여할 방의 이름
    - participantName (string, 필수): 참가자의 이름
- 성공 응답 (200 OK):
    - token (string): 생성된 JWT 토큰
- 실패 응답 (400 Bad Request):
    - errorMessage (string): "roomName and participantName are required"
1. LiveKit 웹훅 수신
- Endpoint: POST /livekit/webhook
- Content-Type: application/webhook+json
- 설명: LiveKit 서버에서 발생하는 이벤트를 수신합니다. (예: 참가자 입장/퇴장)
- 헤더 (Headers):
    - Authorization (string, 필수): 웹훅 유효성 검증을 위한 인증 헤더
- 요청 본문 (Request Body):
    - LiveKit 웹훅 이벤트 객체 (JSON)
- 성공 응답 (200 OK):
    - "ok" (string)
1. AI 서버 입력 수신
- Endpoint: POST /livekit/ai-input
- 설명: AI 서버로부터 입력을 받아 STOMP를 통해 클라이언트에 전파합니다.
- 요청 본문 (Request Body):
    - AI 서버로부터 받은 입력 데이터 (형식은 AI 서버와 협의 필요)
- 성공 응답 (200 OK):
    - "ok" (string)
- 추가 동작:
    - 수신된 aiInput 데이터를 /topic/ai-updates STOMP 토픽으로 메시지를 발행합니다. 클라이언트는 이 토픽을 구독하여 실시간으로 AI 데이터를 수신할 수 있습니다.

네, LivekitService.java 파일의 코드와 로직에 대해 상세히 설명해 드리겠습니다.

이 클래스는 LiveKit 미디어 서버와의 연동을 담당하는 핵심 서비스입니다. LiveKit은 실시간 비디오/오디오 통신을 쉽게 구현할 수 있도록 도와주는 오픈소스 플랫폼입니다.
LivekitService는 크게 두 가지 주요 기능을 수행합니다.

1. 인증 토큰 생성 (`createToken` 메소드)
2. LiveKit 서버로부터의 이벤트 수신 및 처리 (`handleWebhook` 메소드)

각 메소드에 대해 "왜 필요한지", "언제 호출되는지", 그리고 "코드 로직은 무엇인지" 중심으로 설명하겠습니다.

---

1. createToken(String roomName, String participantName) 메소드

무엇을 하는가?
이 메소드는 특정 사용자가 특정 LiveKit 룸에 참여할 수 있도록 허용하는 인증 토큰(JWT)을 생성합니다.

왜 필요한가?
LiveKit은 보안을 위해 아무나 미디어 룸에 접속할 수 없도록 설계되었습니다. 클라이언트(웹 브라우저, 모바일 앱 등)가 LiveKit 서버에 접속하려면, "나는 이 룸에 들어갈
권한이 있다"는 것을 증명하는 일종의 입장권이 필요합니다. 이 입장권이 바로 AccessToken이며, 서버에서 안전하게 발급해야 합니다. createToken 메소드가 바로 이 역할을
수행합니다. API Key와 Secret을 서버에만 보관함으로써, 허가된 사용자에게만 토큰을 발급해 줄 수 있습니다.

언제 호출되는가?
사용자가 실시간 강의 시청 등 LiveKit 룸에 참여하려고 할 때, 클라이언트의 요청에 의해 호출됩니다. 일반적인 호출 흐름은 다음과 같습니다.

1. 클라이언트 (사용자): "실시간 강의 입장" 버튼을 클릭합니다.
2. 클라이언트 → 백엔드 서버: 백엔드 API(예: /api/live/join/{roomId})를 호출하여 토큰을 요청합니다. 이때, 참여할 룸의 이름과 사용자 정보를 함께 보냅니다.
3. 백엔드 서버 (Controller): 요청을 받아 LivekitService.createToken() 메소드를 호출합니다.
4. 백엔드 서버 (Service): 이 메소드에서 토큰을 생성하여 Controller에게 반환합니다.
5. 백엔드 서버 → 클라이언트: 생성된 토큰을 API 응답으로 클라이언트에게 전달합니다.
6. 클라이언트: 전달받은 토큰을 사용하여 LiveKit SDK를 통해 LiveKit 미디어 서버에 접속합니다.

코드 상세 설명

```
1 // application.properties 또는 yml 파일에서 livekit.api.key 값을 주입받습니다.
2 @Value("${livekit.api.key}")
3 private String LIVEKIT_API_KEY;
4
5 // application.properties 또는 yml 파일에서 livekit.api.secret 값을 주입받습니다.
6 @Value("${livekit.api.secret}")
7 private String LIVEKIT_API_SECRET;
8
9 public String createToken(String roomName, String participantName) {

```

10     // 1. AccessToken 객체를 API Key와 Secret으로 초기화합니다.
11     AccessToken token = new AccessToken(LIVEKIT_API_KEY, LIVEKIT_API_SECRET);
12
13     // 2. 토큰에 참여자 이름과 신원(고유 식별자)을 설정합니다.
14     token.setName(participantName);
15     token.setIdentity(participantName);
16
17     // 3. 토큰에 권한을 추가합니다.
18     //    - RoomJoin(true): 룸에 참여할 수 있는 권한
19     //    - RoomName(roomName): 지정된 'roomName'의 룸에만 참여할 수 있도록 제한
20     token.addGrants(new RoomJoin(true), new RoomName(roomName));
21
22     // 4. 모든 정보가 담긴 토큰을 JWT(JSON Web Token) 형식의 문자열로 변환하여 반환합니다.
23     return token.toJwt();
24 }

---

1. handleWebhook(String authHeader, String body) 메소드

무엇을 하는가?
LiveKit 서버에서 발생하는 다양한 이벤트(예: 룸 생성, 참여자 입장/퇴장 등)를 실시간으로 통지받아 처리합니다.

왜 필요한가?
애플리케이션 서버는 LiveKit 서버에서 일어나는 모든 일을 알 수 없습니다. 예를 들어, 특정 룸의 모든 참여자가 퇴장했을 때 해당 룸을 비활성화하거나, 참여자 활동
로그를 데이터베이스에 기록하고 싶을 수 있습니다. Webhook을 사용하면 LiveKit 서버가 특정 이벤트가 발생할 때마다 우리 백엔드 서버의 특정 URL로 HTTP 요청을
보내주므로, 이러한 이벤트에 맞춰 필요한 비즈니스 로직을 수행할 수 있습니다.

언제 호출되는가?
이 메소드는 LiveKit 서버에 의해 직접 호출됩니다. 개발자가 LiveKit 서버 설정에 Webhook URL(예: [https://our-service.com/api/livekit-webhook](https://our-service.com/api/livekit-webhook))을 등록해두면, LiveKit
서버에서 이벤트가 발생할 때마다 해당 URL로 POST 요청을 보냅니다.

호출 흐름은 다음과 같습니다.

1. LiveKit 서버: 룸이 시작되거나, 참여자가 입장하는 등 이벤트가 발생합니다.
2. LiveKit 서버 → 백엔드 서버: 미리 설정된 Webhook URL로 이벤트 정보(body)와 인증 헤더(authHeader)를 담아 POST 요청을 보냅니다.
3. 백엔드 서버 (Controller): /api/livekit-webhook과 같은 엔드포인트에서 이 요청을 받습니다.
4. 백엔드 서버 (Controller): 요청의 body와 header를 추출하여 LivekitService.handleWebhook() 메소드를 호출합니다.
5. 백엔드 서버 (Service): 이 메소드에서 Webhook 요청이 정말 LiveKit 서버로부터 온 것인지 검증하고, 이벤트 내용에 따라 필요한 작업을 수행합니다.

코드 상세 설명

```
1 public void handleWebhook(String authHeader, String body) {
2     // 1. Webhook 요청을 검증하고 파싱하기 위한 WebhookReceiver 객체를 생성합니다.
3     //    API Key와 Secret을 사용하여 요청의 신뢰성을 확인합니다.
4     WebhookReceiver webhookReceiver = new WebhookReceiver(LIVEKIT_API_KEY, LIVEKIT_API_SECRET);
5     try {
6         // 2. receive 메소드는 다음 두 가지를 수행합니다.
7         //    a. authHeader의 서명을 검증하여 이 요청이 위조되지 않았고, 실제 우리 LiveKit 서버에서 온 것인지 확인합니다.
8         //    b. 검증이 성공하면, JSON 형태의 body를 WebhookEvent 객체로 변환(파싱)합니다.
9         WebhookEvent event = webhookReceiver.receive(body, authHeader);

```

10
11         // 3. 수신된 이벤트를 콘솔에 출력합니다. (현재는 로깅만 수행)
12         System.out.println("LiveKit Webhook: " + event.toString());
13
14         // 4. TODO 주석: 이 부분에 실제 비즈니스 로직을 추가해야 합니다.
15         //    예: event.getEvent() 종류에 따라 DB 업데이트, 알림 전송 등
16         // TODO: Add business logic (e.g., DB updates, etc.)
17     } catch (Exception e) {
18         // 5. 서명 검증에 실패하거나 파싱 중 오류가 발생하면 예외를 처리합니다.
19         System.err.println("Error validating webhook event: " + e.getMessage());
20     }
21 }

요약

- `LivekitService`는 Reciplay 애플리케이션과 LiveKit 미디어 서버를 연결하는 다리 역할을 합니다.
- `createToken`은 사용자 인증을 담당하며, 사용자가 룸에 참여하기 전에 호출됩니다.
- `handleWebhook`은 서버 간의 실시간 이벤트 동기화를 담당하며, LiveKit 서버에서 이벤트가 발생했을 때 자동으로 호출됩니다.