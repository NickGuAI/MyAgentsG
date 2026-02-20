# MyAgents Architecture Visualization

> Comprehensive ASCII art diagrams of the MyAgents system architecture and modules.

---

## 1. High-Level System Architecture

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                              MyAgents Desktop Application                           │
│                                   (Tauri v2)                                        │
│                                                                                     │
│  ┌───────────────────────────────────────────────────────────────────────────────┐  │
│  │                           REACT FRONTEND LAYER                                │  │
│  │                     (React 19 + TypeScript + TailwindCSS)                     │  │
│  │                                                                               │  │
│  │   ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌───────────┐  ┌─────────────┐  │  │
│  │   │  Chat    │  │  Chat    │  │ Settings │  │ Launcher  │  │ IM Settings │  │  │
│  │   │  Tab 1   │  │  Tab 2   │  │   Page   │  │   Page    │  │  (Bots)     │  │  │
│  │   │          │  │          │  │          │  │           │  │             │  │  │
│  │   │ TabProv. │  │ TabProv. │  │ Global   │  │ Global    │  │ Tauri IPC   │  │  │
│  │   │ scoped   │  │ scoped   │  │ API      │  │ API       │  │ commands    │  │  │
│  │   └────┬─────┘  └────┬─────┘  └────┬─────┘  └─────┬─────┘  └──────┬──────┘  │  │
│  │        │              │             │              │               │          │  │
│  └────────┼──────────────┼─────────────┼──────────────┼───────────────┼──────────┘  │
│           │              │             │              │               │              │
│  ┌────────┼──────────────┼─────────────┼──────────────┼───────────────┼──────────┐  │
│  │        ▼              ▼             ▼              ▼               ▼   RUST   │  │
│  │  ┌───────────────────────────┐  ┌──────────────────┐  ┌──────────────────┐   │  │
│  │  │    SSE Proxy (sse_proxy)  │  │  HTTP Proxy      │  │  IM Bot Manager  │   │  │
│  │  │  Tab events isolation     │  │  (commands.rs)   │  │ (ManagedImBots)  │   │  │
│  │  │  sse:{tabId}:{event}      │  │  Rust → Sidecar  │  │                  │   │  │
│  │  └───────────┬───────────────┘  └────────┬─────────┘  │ ┌──────────────┐ │   │  │
│  │              │                           │            │ │  Telegram     │ │   │  │
│  │              │    ┌──────────────────────────────┐    │ │  Adapter      │ │   │  │
│  │              │    │     SidecarManager           │    │ ├──────────────┤ │   │  │
│  │              │    │  Session-Centric Model       │    │ │  Feishu       │ │   │  │
│  │              │    │                              │    │ │  Adapter      │ │   │  │
│  │              │    │  Owners: Tab | CronTask |    │    │ ├──────────────┤ │   │  │
│  │              │    │    BackgroundCompletion |    │    │ │  Session      │ │   │  │
│  │              │    │    ImBot                     │    │ │  Router       │ │   │  │
│  │              │    │                              │    │ ├──────────────┤ │   │  │
│  │              │    │  Ports: 31415─31914          │    │ │  Health Mgr   │ │   │  │
│  │              │    └──────┬──────────────┬────────┘    │ ├──────────────┤ │   │  │
│  │              │           │              │             │ │  Msg Buffer   │ │   │  │
│  │              │           │              │             │ └──────────────┘ │   │  │
│  │              │           │              │             └────────┬─────────┘   │  │
│  │              │           │              │                      │             │  │
│  │  ┌───────────┼───────────┼──────────────┼──────────────────────┼──────────┐  │  │
│  │  │           ▼           ▼              ▼                      ▼          │  │  │
│  │  │  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌─────────────┐   │  │  │
│  │  │  │  Sidecar A   │ │  Sidecar B   │ │   Global     │ │  IM Sidecar │   │  │  │
│  │  │  │  session_123 │ │  session_456 │ │   Sidecar    │ │  im:tg:123  │   │  │  │
│  │  │  │  :31415      │ │  :31416      │ │   :31417     │ │  :31418     │   │  │  │
│  │  │  └──────┬───────┘ └──────┬───────┘ └──────┬───────┘ └──────┬──────┘   │  │  │
│  │  │         │                │                │                │           │  │  │
│  │  │     BUN SIDECAR PROCESSES (Claude Agent SDK + TypeScript)             │  │  │
│  │  └─────────┼────────────────┼────────────────┼────────────────┼──────────┘  │  │
│  │            │                │                │                │              │  │
│  └────────────┼────────────────┼────────────────┼────────────────┼──────────────┘  │
│               │                │                │                │                  │
└───────────────┼────────────────┼────────────────┼────────────────┼──────────────────┘
                │                │                │                │
                ▼                ▼                ▼                ▼
   ┌─────────────────┐  ┌────────────────┐  ┌──────────┐  ┌────────────────┐
   │  LLM Providers  │  │  MCP Servers   │  │  Local   │  │  IM Platforms  │
   │  (Anthropic,    │  │  (Tools,       │  │  File    │  │  (Telegram,    │
   │   DeepSeek,     │  │   Skills)      │  │  System  │  │   Feishu/Lark) │
   │   Moonshot ...) │  │                │  │          │  │                │
   └─────────────────┘  └────────────────┘  └──────────┘  └────────────────┘
```

---

## 2. Data Flow Architecture

```
                           USER INPUT
                              │
                              ▼
┌──────────────────────────────────────────────────────────────────────┐
│  FRONTEND (React)                                                    │
│                                                                      │
│  ChatInput ──► useClaudeChat() ──► apiPost('/api/messages/enqueue')  │
│                                         │                            │
│                                         │  invoke('proxy_post')      │
└─────────────────────────────────────────┼────────────────────────────┘
                                          │
                                          ▼
┌──────────────────────────────────────────────────────────────────────┐
│  RUST PROXY LAYER                                                    │
│                                                                      │
│  proxy_post(tab_id, path, body) ──► get_session_port(session_id)    │
│                                         │                            │
│                                         ▼                            │
│                                    reqwest::Client                   │
│                                    POST http://127.0.0.1:{port}     │
└─────────────────────────────────────────┼────────────────────────────┘
                                          │
                                          ▼
┌──────────────────────────────────────────────────────────────────────┐
│  BUN SIDECAR                                                         │
│                                                                      │
│  /api/messages/enqueue                                               │
│       │                                                              │
│       ▼                                                              │
│  enqueueUserMessage() ──► wakeGenerator() ──► messageGenerator()    │
│                                                    │                 │
│                                                    ▼                 │
│                                            Claude Agent SDK          │
│                                            query({                   │
│                                              model, provider,        │
│                                              messages, tools,        │
│                                              mcpServers              │
│                                            })                        │
│                                                    │                 │
│                                                    ▼                 │
│                                            SSE broadcast             │
│                                            chat:message-chunk        │
│                                            chat:tool-use             │
│                                            chat:turn-complete        │
└─────────────────────────────────────────────┼────────────────────────┘
                                              │
                    ┌─────────────────────────┼───────────────────┐
                    ▼                         ▼                   ▼
            ┌──────────────┐    ┌───────────────────┐   ┌──────────────┐
            │  LLM API     │    │  MCP Tool Server  │   │  Local Tools │
            │  Anthropic   │    │  (External)       │   │  Bash, Read, │
            │  DeepSeek    │    │                   │   │  Write, Glob │
            │  Moonshot    │    │                   │   │  Grep, etc.  │
            │  ...         │    │                   │   │              │
            └──────┬───────┘    └─────────┬─────────┘   └──────┬───────┘
                   │                      │                    │
                   └──────────┬───────────┘                    │
                              ▼                                ▼
                    AI Response + Tool Results ────► SSE Stream to Frontend
```

---

## 3. Sidecar Owner Model

```
                          ┌───────────────────────────┐
                          │     SidecarManager         │
                          │                           │
                          │  sidecars: HashMap<        │
                          │    session_id,             │
                          │    SessionSidecar          │
                          │  >                         │
                          └─────────────┬─────────────┘
                                        │
              ┌────────────┬────────────┼────────────┬────────────┐
              ▼            ▼            ▼            ▼            ▼
        ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐
        │ Tab      │ │ CronTask │ │ Bg Compl.│ │ ImBot    │
        │ Owner    │ │ Owner    │ │ Owner    │ │ Owner    │
        │          │ │          │ │          │ │          │
        │ Tab("t1")│ │ Cron("c")│ │ Bg("s1")│ │ Im("tg:x")
        └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘
             │             │            │            │
             └──────┬──────┘            │            │
                    ▼                   ▼            ▼
          ┌─────────────────┐  ┌──────────────┐  ┌──────────────┐
          │  SessionSidecar │  │ SessionSide. │  │ SessionSide. │
          │  session_123    │  │ session_456  │  │ im:tg:user42 │
          │  port: 31415    │  │ port: 31416  │  │ port: 31418  │
          │  owners: {      │  │ owners: {    │  │ owners: {    │
          │    Tab("t1"),   │  │    Bg("s456")│  │   Im("tg:42")│
          │    Cron("c1")   │  │  }           │  │  }           │
          │  }              │  │              │  │              │
          │  healthy: true  │  │  healthy: OK │  │  healthy: OK │
          └────────┬────────┘  └──────┬───────┘  └──────┬───────┘
                   │                  │                  │
                   ▼                  ▼                  ▼
              Bun :31415         Bun :31416         Bun :31418

  LIFECYCLE:
  ──────────
  1. ensure_session_sidecar(session, owner)  →  Start or reuse Sidecar
  2. [Multiple owners can share one Sidecar]
  3. release_session_sidecar(session, owner) →  Remove owner
  4. [All owners released]                   →  Stop Sidecar process
```

---

## 4. Frontend Module Map

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         src/renderer/                                    │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  PAGES                                                          │   │
│  │  ┌──────────┐  ┌──────────────┐  ┌────────────┐                │   │
│  │  │ Chat.tsx │  │ Settings.tsx │  │Launcher.tsx│                │   │
│  │  └──────────┘  └──────────────┘  └────────────┘                │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  CONTEXT (State Management)                                     │   │
│  │  ┌──────────────────┐  ┌─────────────────────┐                 │   │
│  │  │  TabContext.tsx   │  │  TabProvider.tsx     │  Per-tab state │   │
│  │  │  (types & hooks) │  │  (state container)   │  isolation     │   │
│  │  ├──────────────────┤  ├─────────────────────┤                 │   │
│  │  │ FileActionCtx    │  │ ImagePreviewCtx     │                 │   │
│  │  └──────────────────┘  └─────────────────────┘                 │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  HOOKS                                                          │   │
│  │  ┌─────────────┐  ┌──────────────┐  ┌─────────────────┐       │   │
│  │  │useTabState  │  │useClaudeChat │  │useConfig        │       │   │
│  │  │useSystemInit│  │useCronTask   │  │useUpdater       │       │   │
│  │  │useAutoScroll│  │useAgentState │  │useTrayEvents    │       │   │
│  │  │useUndoStack │  │useBgTaskPoll │  │                 │       │   │
│  │  └─────────────┘  └──────────────┘  └─────────────────┘       │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  COMPONENTS                                                     │   │
│  │                                                                 │   │
│  │  Navigation         Chat              Settings & Config         │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌───────────────────┐    │   │
│  │  │CustomTitleBar│  │ ChatInput    │  │WorkspaceConfig    │    │   │
│  │  │TabBar        │  │ MessageList  │  │GlobalAgentsPanel  │    │   │
│  │  │SortableTab   │  │ Message      │  │GlobalSkillsPanel  │    │   │
│  │  │SessionHist.  │  │ ToolUse      │  │AgentDetailPanel   │    │   │
│  │  └──────────────┘  │ QueuedMsg    │  │SkillDetailPanel   │    │   │
│  │                     └──────────────┘  └───────────────────┘    │   │
│  │  IM Settings        Tools Viz         Cron Tasks               │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌───────────────────┐    │   │
│  │  │ImBotList     │  │BashTool      │  │CronTaskButton     │    │   │
│  │  │ImBotDetail   │  │EditTool      │  │CronTaskOverlay    │    │   │
│  │  │ImBotWizard   │  │ReadTool      │  │CronTaskSettings   │    │   │
│  │  │PlatformSelect│  │GrepTool      │  │CronTaskStatusBar  │    │   │
│  │  │BotStatusPanel│  │WebSearchTool │  └───────────────────┘    │   │
│  │  │WhitelistMgr  │  │SkillTool     │                           │   │
│  │  └──────────────┘  └──────────────┘  Launcher                  │   │
│  │                                       ┌───────────────────┐    │   │
│  │  File & Dialog      Markdown          │BrandSection       │    │   │
│  │  ┌──────────────┐  ┌──────────────┐  │WorkspaceCard      │    │   │
│  │  │DirectoryPanel│  │ Markdown     │  │WorkspaceSelector  │    │   │
│  │  │FilePreview   │  │ CodeBlock    │  │RecentTasks        │    │   │
│  │  │ConfirmDialog │  │ MonacoEditor │  └───────────────────┘    │   │
│  │  │DropZone      │  │ Mermaid      │                           │   │
│  │  └──────────────┘  └──────────────┘                           │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  API LAYER                                                      │   │
│  │  ┌──────────────┐  ┌─────────────┐  ┌───────────────────────┐  │   │
│  │  │ apiFetch.ts  │  │proxyFetch.ts│  │  SseConnection.ts     │  │   │
│  │  │ (Global API) │  │(Rust proxy) │  │  sseClient.ts         │  │   │
│  │  ├──────────────┤  ├─────────────┤  ├───────────────────────┤  │   │
│  │  │chatClient.ts │  │tauriClient  │  │  eventBus.ts          │  │   │
│  │  │sessionClient │  │             │  │                       │  │   │
│  │  │cronTaskClient│  │             │  │                       │  │   │
│  │  └──────────────┘  └─────────────┘  └───────────────────────┘  │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌──────────────────┐  ┌──────────────┐  ┌──────────────────┐         │
│  │  config/         │  │  types/      │  │  utils/          │         │
│  │  configService   │  │  chat.ts     │  │  frontendLogger  │         │
│  │  types.ts        │  │  stream.ts   │  │  debug.ts        │         │
│  │  (disk-first I/O)│  │  tab.ts      │  │  pathDetection   │         │
│  └──────────────────┘  └──────────────┘  └──────────────────┘         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 5. Rust Core Module Map

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         src-tauri/src/                                    │
│                                                                          │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │  ENTRY & COMMANDS                                                 │  │
│  │  ┌───────────┐  ┌──────────────────────────────────────────────┐ │  │
│  │  │ main.rs   │  │ commands.rs                                  │ │  │
│  │  │ lib.rs    │  │  cmd_ensure_session_sidecar()                │ │  │
│  │  │ (setup)   │  │  cmd_release_session_sidecar()               │ │  │
│  │  │           │  │  cmd_start_global_sidecar()                  │ │  │
│  │  │           │  │  cmd_get_session_port()                      │ │  │
│  │  │           │  │  cmd_upgrade_session_id()                    │ │  │
│  │  │           │  │  cmd_stop_all_sidecars()                     │ │  │
│  │  │           │  │  cmd_get_platform() / cmd_get_device_id()    │ │  │
│  │  └───────────┘  └──────────────────────────────────────────────┘ │  │
│  └───────────────────────────────────────────────────────────────────┘  │
│                                                                          │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │  CORE SERVICES                                                    │  │
│  │                                                                   │  │
│  │  ┌─────────────────────┐  ┌─────────────────────────────────┐   │  │
│  │  │  sidecar.rs          │  │  sse_proxy.rs                   │   │  │
│  │  │                      │  │                                 │   │  │
│  │  │  SidecarManager      │  │  SseProxyState                 │   │  │
│  │  │  ├─ sidecars HashMap │  │  ├─ connections HashMap        │   │  │
│  │  │  ├─ activations      │  │  ├─ handle_sse_stream()        │   │  │
│  │  │  ├─ port_counter     │  │  └─ Event: sse:{tab}:{event}  │   │  │
│  │  │  │                   │  │                                 │   │  │
│  │  │  SidecarOwner enum   │  └─────────────────────────────────┘   │  │
│  │  │  ├─ Tab(id)          │                                        │  │
│  │  │  ├─ CronTask(id)     │  ┌─────────────────────────────────┐   │  │
│  │  │  ├─ BgCompletion(id) │  │  proxy_config.rs                │   │  │
│  │  │  └─ ImBot(key)       │  │  ├─ System proxy detection     │   │  │
│  │  │                      │  │  ├─ Proxy URL validation       │   │  │
│  │  │  spawn_bun_process() │  │  └─ Certificate handling       │   │  │
│  │  │  health_check()      │  └─────────────────────────────────┘   │  │
│  │  └──────────────────────┘                                        │  │
│  │                                                                   │  │
│  │  ┌─────────────────────┐  ┌─────────────────────────────────┐   │  │
│  │  │  cron_task.rs        │  │  updater.rs                     │   │  │
│  │  │  CronTaskManager     │  │  ├─ Check for updates          │   │  │
│  │  │  ├─ tasks HashMap    │  │  ├─ Download & install         │   │  │
│  │  │  ├─ executing Set    │  │  └─ Version comparison         │   │  │
│  │  │  ├─ create/start/    │  └─────────────────────────────────┘   │  │
│  │  │  │  stop/execute     │                                        │  │
│  │  │  └─ recover tasks    │  ┌─────────────────────────────────┐   │  │
│  │  └──────────────────────┘  │  tray.rs                        │   │  │
│  │                             │  ├─ System tray menu            │   │  │
│  │  ┌─────────────────────┐   │  └─ Show/Hide, Quit             │   │  │
│  │  │  logger.rs           │  └─────────────────────────────────┘   │  │
│  │  │  ├─ ulog_* macros    │                                        │  │
│  │  │  ├─ emit_log! macro  │                                        │  │
│  │  │  └─ Unified log file │                                        │  │
│  │  └──────────────────────┘                                        │  │
│  └───────────────────────────────────────────────────────────────────┘  │
│                                                                          │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │  IM BOT MODULE (src-tauri/src/im/)                                │  │
│  │                                                                   │  │
│  │  ┌─────────────┐  ┌──────────────┐  ┌──────────────────────┐    │  │
│  │  │  mod.rs      │  │ adapter.rs   │  │  telegram.rs          │    │  │
│  │  │  Bot lifecy. │  │ ImAdapter    │  │  TelegramAdapter      │    │  │
│  │  │  Start/Stop  │  │  trait       │  │  ├─ Long polling      │    │  │
│  │  │  Permissions │  │ AnyAdapter   │  │  ├─ Msg coalescing    │    │  │
│  │  │  Tauri cmds  │  │  enum        │  │  ├─ Inline keyboards  │    │  │
│  │  └─────────────┘  └──────────────┘  │  └─ Rate limiting     │    │  │
│  │                                      └──────────────────────┘    │  │
│  │  ┌─────────────┐  ┌──────────────┐  ┌──────────────────────┐    │  │
│  │  │  feishu.rs   │  │  router.rs   │  │  health.rs            │    │  │
│  │  │  FeishuAdapt.│  │ SessionRouter│  │  HealthManager        │    │  │
│  │  │  ├─ WebSocket│  │ ├─ peer →    │  │  ├─ State persist     │    │  │
│  │  │  ├─ Cards    │  │ │  session   │  │  │  every 5s          │    │  │
│  │  │  ├─ Dedup    │  │ ├─ ensure    │  │  ├─ Recovery          │    │  │
│  │  │  └─ Token    │  │ │  sidecar   │  │  └─ Status tracking   │    │  │
│  │  │    refresh   │  │ └─ Sidecar   │  └──────────────────────┘    │  │
│  │  └─────────────┘  │   Owner::     │                              │  │
│  │                    │   ImBot(key)  │  ┌──────────────────────┐    │  │
│  │  ┌─────────────┐  └──────────────┘  │  types.rs              │    │  │
│  │  │  buffer.rs   │                    │  ImConfig, ImMessage   │    │  │
│  │  │  MsgBuffer   │                    │  Platform types        │    │  │
│  │  │  ├─ Queue    │                    └──────────────────────┘    │  │
│  │  │  ├─ Replay   │                                                │  │
│  │  │  └─ Persist  │                                                │  │
│  │  └─────────────┘                                                 │  │
│  └───────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 6. Bun Sidecar Module Map

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          src/server/                                     │
│                      (Bun Sidecar Process)                              │
│                                                                         │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │  index.ts  ─  HTTP Server Entry                                   │  │
│  │  ├─ REST API endpoints (see below)                                │  │
│  │  ├─ SSE stream setup                                              │  │
│  │  └─ Port binding (127.0.0.1:{port})                               │  │
│  └───────────────────────────────────────────────────────────────────┘  │
│                                                                         │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │  CORE SESSION ENGINE                                              │  │
│  │                                                                   │  │
│  │  ┌─────────────────────────────────────────────────────────┐     │  │
│  │  │  agent-session.ts                                        │     │  │
│  │  │  ┌──────────────────────────────────────────────────┐   │     │  │
│  │  │  │  Persistent Session (while(true) generator)      │   │     │  │
│  │  │  │                                                  │   │     │  │
│  │  │  │  messageGenerator() ◄─── wakeGenerator()         │   │     │  │
│  │  │  │       │                       ▲                  │   │     │  │
│  │  │  │       ▼                       │                  │   │     │  │
│  │  │  │  Claude Agent SDK ──► SSE broadcast              │   │     │  │
│  │  │  │  query()               chat:message-chunk        │   │     │  │
│  │  │  │                        chat:tool-use             │   │     │  │
│  │  │  │                        chat:turn-complete        │   │     │  │
│  │  │  └──────────────────────────────────────────────────┘   │     │  │
│  │  │                                                          │     │  │
│  │  │  Key functions:                                          │     │  │
│  │  │  ├─ initializeAgent()        Setup SDK + config          │     │  │
│  │  │  ├─ enqueueUserMessage()     Queue + wake generator      │     │  │
│  │  │  ├─ setMcpServers()          MCP config (abort+resume)   │     │  │
│  │  │  ├─ setAgents()              Agent config (abort+resume) │     │  │
│  │  │  ├─ switchToSession()        Session switch              │     │  │
│  │  │  ├─ resetSession()           New session                 │     │  │
│  │  │  ├─ rewindSession()          Undo last message           │     │  │
│  │  │  ├─ interruptCurrentResponse() Stop AI                   │     │  │
│  │  │  └─ abortPersistentSession() Unified abort mechanism     │     │  │
│  │  └─────────────────────────────────────────────────────────┘     │  │
│  └───────────────────────────────────────────────────────────────────┘  │
│                                                                         │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │  DATA & PERSISTENCE                                               │  │
│  │                                                                   │  │
│  │  ┌──────────────────┐  ┌──────────────────┐  ┌────────────────┐  │  │
│  │  │ SessionStore.ts  │  │ AgentLogger.ts   │  │  UnifiedLogger │  │  │
│  │  │ ├─ createSession │  │ Per-session logs │  │  3-layer merge │  │  │
│  │  │ ├─ getSessionData│  │ ~/.myagents/     │  │  React + Bun   │  │  │
│  │  │ ├─ saveMetadata  │  │ sessions/{id}/   │  │  + Rust → file │  │  │
│  │  │ ├─ messages.jsonl│  │ {date}.log       │  │  unified-{d}.  │  │  │
│  │  │ └─ CRUD ops      │  │                  │  │  log           │  │  │
│  │  └──────────────────┘  └──────────────────┘  └────────────────┘  │  │
│  └───────────────────────────────────────────────────────────────────┘  │
│                                                                         │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │  SUPPORTING MODULES                                               │  │
│  │                                                                   │  │
│  │  ┌──────────────────┐  ┌──────────────────┐  ┌────────────────┐  │  │
│  │  │  sse.ts           │  │ agents/          │  │  tools/        │  │  │
│  │  │  ├─ broadcast()   │  │ agent-loader.ts  │  │ cron-tools.ts  │  │  │
│  │  │  ├─ createClient  │  │ ├─ scanAgents()  │  │ ├─ Background  │  │  │
│  │  │  └─ client mgmt   │  │ ├─ loadEnabled() │  │ │  task tools  │  │  │
│  │  └──────────────────┘  │ └─ readMeta()    │  │ └─ Exit signal │  │  │
│  │                         └──────────────────┘  └────────────────┘  │  │
│  │  ┌──────────────────┐  ┌──────────────────┐  ┌────────────────┐  │  │
│  │  │  logger.ts        │  │ provider-verify  │  │  dir-info.ts   │  │  │
│  │  │  Console intercept│  │ ├─ verifySdk()   │  │  Directory     │  │  │
│  │  │  SSE broadcast    │  │ ├─ checkSub()    │  │  tree builder  │  │  │
│  │  │  chat:log events  │  │ └─ gitBranch()   │  │                │  │  │
│  │  └──────────────────┘  └──────────────────┘  └────────────────┘  │  │
│  │                                                                   │  │
│  │  ┌──────────────────────────────────────────────────────────────┐ │  │
│  │  │  utils/                                                      │ │  │
│  │  │  ├─ platform.ts   (cross-platform env: macOS/Linux/Windows)  │ │  │
│  │  │  ├─ runtime.ts    (bundled Bun path detection)               │ │  │
│  │  │  └─ shell.ts      (shell utilities)                          │ │  │
│  │  └──────────────────────────────────────────────────────────────┘ │  │
│  └───────────────────────────────────────────────────────────────────┘  │
│                                                                         │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │  HTTP API ENDPOINTS                                               │  │
│  │                                                                   │  │
│  │  Session         Chat              Config            System       │  │
│  │  POST /init      POST /messages    POST /mcp/set     GET /health  │  │
│  │  POST /switch    POST /enqueue     POST /agents/set               │  │
│  │  POST /reset     GET  /messages    POST /model/set                │  │
│  │  POST /rewind    POST /chat (SSE)  POST /im/chat                  │  │
│  │  POST /interrupt GET  /metadata    GET  /queue/status             │  │
│  └───────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 7. IM Bot Architecture

```
 External IM Platforms              Rust IM Module                  Bun Sidecars
 ════════════════════              ════════════════                 ════════════

 ┌──────────────────┐        ┌──────────────────────────────────────────────────┐
 │  Telegram API    │        │                   IM Bot Manager                 │
 │                  │        │                                                  │
 │  getUpdates()  ◄─┼────── │  ┌──────────────┐                                │
 │  (long poll)     │        │  │  Telegram     │    ┌──────────────────┐       │
 │                  │        │  │  Adapter      │    │  SessionRouter   │       │
 │  sendMessage() ◄─┼────── │  │  ├─ Poll loop │───►│                  │       │
 │  editMessage() ◄─┼────── │  │  ├─ Coalesce  │    │  Peer mapping:   │       │
 │                  │        │  │  └─ Rate limit│    │  tg:user:42 → ──┼──┐    │
 └──────────────────┘        │  └──────────────┘    │  tg:grp:99  → ──┼──┤    │
                              │                      │  fs:chat:7  → ──┼──┤    │
 ┌──────────────────┐        │  ┌──────────────┐    │                  │  │    │
 │  Feishu/Lark     │        │  │  Feishu       │    │  Semaphore (5)   │  │    │
 │  Open Platform   │        │  │  Adapter      │───►│  Per-peer lock   │  │    │
 │                  │        │  │  ├─ WebSocket  │    └──────────────────┘  │    │
 │  WebSocket    ◄──┼─────  │  │  ├─ Cards      │                         │    │
 │  events          │        │  │  ├─ Dedup      │    ┌──────────────────┐  │    │
 │                  │        │  │  └─ Token      │    │  HealthManager   │  │    │
 │  POST message ◄──┼─────  │  │    refresh     │    │  ├─ Persist 5s   │  │    │
 │  (rich content)  │        │  └──────────────┘    │  ├─ Recovery     │  │    │
 └──────────────────┘        │                      │  └─ Status track │  │    │
                              │                      └──────────────────┘  │    │
                              │                                            │    │
                              │  ┌──────────────┐    ┌─────────────────┐  │    │
                              │  │  MsgBuffer    │    │  Permission     │  │    │
                              │  │  ├─ Queue     │    │  Approval       │  │    │
                              │  │  ├─ Replay    │    │  ├─ TG inline   │  │    │
                              │  │  └─ Persist   │    │  └─ Feishu card │  │    │
                              │  └──────────────┘    └─────────────────┘  │    │
                              └───────────────────────────────────────────┼────┘
                                                                          │
                                  ┌───────────────────────────────────────┘
                                  │
                                  ▼
                        ┌──────────────────┐  ┌──────────────────┐
                        │  Bun Sidecar     │  │  Bun Sidecar     │
                        │  im:tg:user:42   │  │  im:tg:grp:99   │
                        │  :31418          │  │  :31419          │
                        │                  │  │                  │
                        │  POST /api/im/   │  │  POST /api/im/   │
                        │  chat (SSE)      │  │  chat (SSE)      │
                        │       │          │  │       │          │
                        │       ▼          │  │       ▼          │
                        │  Claude SDK      │  │  Claude SDK      │
                        │       │          │  │       │          │
                        │       ▼          │  │       ▼          │
                        │  stream_to_      │  │  stream_to_      │
                        │  telegram()      │  │  telegram()      │
                        └──────────────────┘  └──────────────────┘
```

---

## 8. Storage & Persistence Layout

```
~/.myagents/                              (User data directory)
├── config.json                           App configuration
│   ├── model                             Default LLM model
│   ├── provider                          Default provider ID
│   ├── providerApiKeys                   API keys (encrypted)
│   ├── presetCustomModels                Custom model definitions
│   ├── imBotConfigs[]                    IM Bot configurations
│   └── workspace                         Last workspace path
│
├── sessions/                             Session data store
│   └── {sessionId}/
│       ├── metadata.json                 Title, created_at, tags, model
│       ├── messages.jsonl                Message history (line-delimited)
│       └── attachments/                  File attachments
│           └── {attachmentId}/
│               ├── file.ext
│               └── metadata.json
│
├── agents/                               Global agent definitions
│   └── {agent-name}.md                  Agent config (frontmatter)
│
├── skills/                               Custom skills
│
├── cron-tasks.json                       Background task configs
│
├── im_{botId}_state.json                 IM Bot health state
│                                         (per bot, persisted every 5s)
│
├── logs/
│   ├── unified-{YYYY-MM-DD}.log         Unified 3-layer log
│   │                                     (React + Bun + Rust)
│   └── {date}-{sessionId}.log           Per-session agent log
│
└── .claude/                              Anthropic SDK managed

~/Library/Logs/com.myagents.app/          (macOS system logs)
└── MyAgents.log                          Rust tauri-plugin-log output
                                          (with log rotation)
```

---

## 9. Logging Architecture

```
┌──────────────────────────────────────────────────────────────────────┐
│                        THREE LOG SOURCES                              │
│                                                                      │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐           │
│  │   REACT      │    │  BUN SIDECAR │    │    RUST      │           │
│  │  (Frontend)  │    │  (Backend)   │    │  (Desktop)   │           │
│  │              │    │              │    │              │           │
│  │ console.*    │    │ console.*    │    │ ulog_info!   │           │
│  │      │       │    │      │       │    │ emit_log!    │           │
│  │      ▼       │    │      ▼       │    │ log::info!   │           │
│  │ frontendLog  │    │  logger.ts   │    │      │       │           │
│  │ ger.ts       │    │  intercept   │    │      ▼       │           │
│  │      │       │    │      │       │    │ logger.rs    │           │
│  └──────┼───────┘    └──────┼───────┘    └──────┼───────┘           │
│         │                   │                   │                    │
│         │  POST             │  Direct           │  Direct            │
│         │  /api/            │  write             │  write             │
│         │  unified-log      │  + SSE             │  + Tauri           │
│         │                   │  broadcast         │  event             │
│         ▼                   ▼                    ▼                    │
│  ┌──────────────────────────────────────────────────────────────┐    │
│  │              UNIFIED LOG FILE                                │    │
│  │         ~/.myagents/logs/unified-{YYYY-MM-DD}.log            │    │
│  │                                                              │    │
│  │  [2024-01-15 10:30:00] [REACT] [INFO] Component mounted     │    │
│  │  [2024-01-15 10:30:01] [BUN]   [INFO] Session initialized   │    │
│  │  [2024-01-15 10:30:02] [RUST]  [INFO] Sidecar started       │    │
│  └──────────────────────────────────────────────────────────────┘    │
│                                                                      │
│         ┌─────────────────────────────────────────────────┐          │
│         │  RUST SYSTEM LOG (tauri-plugin-log)              │          │
│         │  ~/Library/Logs/com.myagents.app/MyAgents.log    │          │
│         │  (macOS, with rotation)                          │          │
│         └─────────────────────────────────────────────────┘          │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐    │
│  │  CLIENT LOG PANEL (UI)                                       │    │
│  │  ├─ React logs  → received via frontendLogger buffer         │    │
│  │  ├─ Bun logs    → received via SSE chat:log events           │    │
│  │  └─ Rust logs   → received via Tauri event log:rust          │    │
│  └──────────────────────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────────────────────┘
```

---

## 10. LLM Provider System

```
┌──────────────────────────────────────────────────────────────────┐
│                      PROVIDER REGISTRY                            │
│                                                                  │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐     │
│  │  anthropic-sub │  │  anthropic-api │  │   deepseek     │     │
│  │  (Subscription)│  │  (API Key)     │  │  (deepseek.com)│     │
│  │  Claude 3.5    │  │  Claude 3.5    │  │  DeepSeek V3   │     │
│  │  Claude 3 Opus │  │  Claude 3 Opus │  │  DeepSeek R1   │     │
│  └────────┬───────┘  └────────┬───────┘  └────────┬───────┘     │
│           │                   │                   │              │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐     │
│  │   moonshot     │  │    zhipu       │  │   minimaxi     │     │
│  │  (Kimi)        │  │  (GLM/ChatGLM) │  │  (MiniMax)     │     │
│  │  moonshot-v1   │  │  glm-4-plus   │  │  MiniMax-Text  │     │
│  └────────┬───────┘  └────────┬───────┘  └────────┬───────┘     │
│           │                   │                   │              │
│  ┌────────────────┐  ┌────────────────┐                         │
│  │  siliconflow   │  │   zenmux       │                         │
│  │  (Aggregator)  │  │  (Multiplexer) │                         │
│  │  Multiple LLMs │  │  Route to best │                         │
│  └────────┬───────┘  └────────┬───────┘                         │
│           │                   │                                  │
│           └───────┬───────────┘                                  │
│                   ▼                                              │
│  ┌──────────────────────────────────────────────────────┐       │
│  │              Claude Agent SDK                         │       │
│  │  query({ model, provider, apiKey, baseUrl, ... })     │       │
│  │                                                       │       │
│  │  Provider config applied per-session:                 │       │
│  │  ├─ model name                                        │       │
│  │  ├─ API endpoint (baseUrl)                            │       │
│  │  ├─ Authentication (token / api_key / both)           │       │
│  │  └─ Custom models (user-defined)                      │       │
│  └──────────────────────────────────────────────────────┘       │
└──────────────────────────────────────────────────────────────────┘
```

---

## 11. Tab Initialization & Pre-warm Sequence

```
  Tab Created
      │
      ▼
  Frontend: invoke('ensure_session_sidecar')
      │
      ▼
  Rust: SidecarManager → spawn Bun process on port N
      │
      ▼
  Sidecar Ready (health check OK)
      │
      ├──────────────────────────────────────────┐
      ▼                                          ▼
  POST /api/model/set                    POST /api/mcp/set
  (model sync)                           POST /api/agents/set
      │                                  (provider sync)
      │                                          │
      │  [Model change does NOT                  │
      │   trigger pre-warm]                      ▼
      │                              schedulePreWarm()
      │                              [500ms debounce]
      │                                          │
      │                                          ▼
      │                              startStreamingSession()
      │                              ├─ messageGenerator()
      │                              │  while(true) {
      │                              │    yield* waitForMessage()  ◄── blocked
      │                              │    ... process message ...
      │                              │  }
      │                              ├─ MCP servers connected
      │                              └─ SDK subprocess started
      │                                          │
      │                                          ▼
      │                              PRE-WARM COMPLETE
      │                              (session ready, generator waiting)
      │                                          │
      └──────────────┬──────────────────────────┘
                      │
                      ▼
               User sends message
                      │
                      ▼
               enqueueUserMessage()
                      │
                      ▼
               wakeGenerator()
               (resolves waitForMessage Promise)
                      │
                      ▼
               messageGenerator yields message
                      │
                      ▼
               Claude SDK processes → SSE response
```

---

## 12. Cross-Platform Support

```
┌─────────────────────────────────────────────────────────────────┐
│                     PLATFORM MATRIX                              │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    macOS                                  │   │
│  │  ├─ Build: build_macos.sh → DMG                          │   │
│  │  ├─ Signing: Apple Developer Certificate + Notarization  │   │
│  │  ├─ Bun: bundled aarch64/x64                             │   │
│  │  ├─ Logs: ~/Library/Logs/com.myagents.app/               │   │
│  │  ├─ Data: ~/.myagents/                                   │   │
│  │  └─ Title bar: Overlay + Traffic Light positioning       │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                   Windows                                │   │
│  │  ├─ Build: build_windows.ps1 → NSIS + Portable           │   │
│  │  ├─ Bun: bundled x64                                     │   │
│  │  ├─ Logs: %APPDATA%/MyAgents/logs/                       │   │
│  │  ├─ Data: %APPDATA%/MyAgents/ (or ~/.myagents/)          │   │
│  │  ├─ Env: USERPROFILE, USERNAME, TEMP/TMP                 │   │
│  │  └─ Platform utils: isWindows(), getCrossPlatformEnv()   │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              Bundled Runtime                              │   │
│  │  ├─ Bun binary embedded in app package                   │   │
│  │  ├─ No Node.js/npm/npx required                          │   │
│  │  ├─ getBundledRuntimePath() for detection                │   │
│  │  └─ Zero external dependency guarantee                   │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 13. Skills & Extensions

```
bundled-skills/
├── skill-creator/       Create custom skills interactively
├── summarize/           Document summarization
├── xlsx/                Excel spreadsheet processing
├── pptx/                PowerPoint presentation processing
├── pdf/                 PDF extraction & analysis
└── docx/                Word document processing

  ┌────────────────────────────────────────────────┐
  │  SKILL LIFECYCLE                                │
  │                                                │
  │  Discovery          Loading         Execution  │
  │  ┌─────────┐      ┌──────────┐    ┌────────┐  │
  │  │ Scan    │ ──►  │ Parse    │ ──►│ SDK    │  │
  │  │ bundled │      │ metadata │    │ custom │  │
  │  │ + user  │      │ + perms  │    │ tool   │  │
  │  │ skills  │      │          │    │ call   │  │
  │  └─────────┘      └──────────┘    └────────┘  │
  │                                                │
  │  Frontend: GlobalSkillsPanel → enable/disable  │
  │  Backend:  MCP integration + custom tools      │
  └────────────────────────────────────────────────┘
```
