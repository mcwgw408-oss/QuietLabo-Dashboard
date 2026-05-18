import {
  ArrowLeft,
  Beef,
  BookOpen,
  CalendarDays,
  Check,
  Clipboard,
  ClipboardCheck,
  Coffee,
  Crown,
  Dumbbell,
  Film,
  HeartPulse,
  Home,
  ListChecks,
  Milk,
  Moon,
  NotebookPen,
  PackagePlus,
  Pencil,
  Plus,
  Search,
  Save,
  ShoppingBasket,
  Shuffle,
  Sparkles,
  Star,
  Trash2,
  Wheat,
} from "lucide-react";
import { CSSProperties, FormEvent, useEffect, useMemo, useState } from "react";

type View = "home" | "tasks" | "recovery" | "triggerDb" | "notNow" | "sakuraSleep" | "state" | "signs" | "library" | "roulette" | "shopping" | "visitMemo" | "mediaLog";
type TaskStatus = "todo" | "doing" | "done";
type TaskPriority = "low" | "medium" | "high";
type MoodStatus = "stable" | "uneasy" | "tired" | "slipping" | "recovering";
type Energy = "low" | "middle" | "high";
type Mind = "calm" | "uneasy" | "overloaded";
type Need = "rest" | "light" | "connect";
type SignId = "sleep" | "body" | "thoughts" | "noise" | "messages" | "food" | "irritation" | "isolation";
type CategoryId = "staple" | "side" | "drink" | "daily" | "heavy" | "treat";
type TriggerSpeed = "fast" | "medium" | "slow";
type TriggerDuration = "short" | "medium" | "long";
type TriggerTiming = "morning" | "day" | "night" | "anytime";
type TriggerSocial = "solo" | "connect" | "both";
type SleepMode = "passedOut" | "futon" | "broken" | "planned";
type SleepPlace = "futon" | "chair" | "floor" | "other";
type FlashbackStatus = "none" | "little" | "yes";
type WakeFeeling = "heavy" | "blank" | "okay" | "clear";
type SafetyFeeling = "low" | "middle" | "high";

type Task = {
  id: string;
  title: string;
  status: TaskStatus;
  priority: TaskPriority;
  project: string;
  dueDate: string;
  memo: string;
  createdAt: string;
};

type RecoveryLog = {
  id: string;
  date: string;
  status: MoodStatus;
  bodyNote: string;
  feelingNote: string;
  doneOneThing: string;
  recoveryTrigger: string;
  todayWord: string;
  createdAt: string;
};

type RecoveryTriggerEntry = {
  id: string;
  name: string;
  workedNote: string;
  didntWorkNote: string;
  speed: TriggerSpeed;
  duration: TriggerDuration;
  timing: TriggerTiming;
  social: TriggerSocial;
  memo: string;
  createdAt: string;
};

type NotNowItem = {
  id: string;
  text: string;
  reason: string;
  alternative: string;
  until: "today" | "tonight" | "tomorrow" | "later";
  paused: boolean;
  createdAt: string;
};

type SakuraSleepLog = {
  id: string;
  date: string;
  mode: SleepMode;
  place: SleepPlace;
  flashback: FlashbackStatus;
  wakeFeeling: WakeFeeling;
  safety: SafetyFeeling;
  memo: string;
  createdAt: string;
};

type BranchState = { energy: Energy; mind: Mind; need: Need };
type SignCheck = { id: string; date: string; checked: SignId[]; note: string; createdAt: string };
type LibraryMode = "emergency" | "night" | "morning" | "uneasy" | "tired";
type LibraryEntry = { id: string; title: string; body: string; tag: string; favorite?: boolean; modes?: LibraryMode[]; custom?: boolean };
type RouletteAction = { id: string; text: string; category: string; favorite?: boolean; custom?: boolean };
type RouletteHistory = { id: string; text: string; status: "drawn" | "done" | "skipped"; createdAt: string };

type ShoppingItem = {
  id: string;
  name: string;
  category: CategoryId;
  checked: boolean;
  today: boolean;
  createdAt: number;
  checkedAt?: number;
};

type VisitMemoDay = {
  id: string;
  date: string;
  sleepHours: string;
  bowel: "yes" | "no" | "";
  breakfast: string;
  lunch: string;
  dinner: string;
  snack: string;
  medicineCount: string;
};

type VisitMemo = {
  days: VisitMemoDay[];
  other: string;
  achieved: string;
  happy: string;
  mustTalk: string;
  chat: string;
};

type VisitMemoSummaryKey = Exclude<keyof VisitMemo, "days">;

type BookStatus = "want" | "reading" | "finished";

type ReadingLog = {
  id: string;
  title: string;
  author: string;
  status: BookStatus;
  memo: string;
  date: string;
  createdAt: string;
};

type MovieLog = {
  id: string;
  title: string;
  watchedDate: string;
  mood: string;
  memo: string;
  rewatchScore: number;
  createdAt: string;
};

type SimpleMediaKind = "book" | "movie";

type SimpleMediaLog = {
  id: string;
  title: string;
  kind: SimpleMediaKind;
  memo: string;
  date: string;
  createdAt: string;
};

const TASK_STORAGE_KEY = "notion-simple-task-manager-v2";
const LEGACY_TASK_STORAGE_KEY = "notion-simple-task-manager";
const RECOVERY_STORAGE_KEY = "notion-recovery-log-v1";
const RECOVERY_TRIGGER_STORAGE_KEY = "recovery-trigger-db-v1";
const NOT_NOW_STORAGE_KEY = "not-now-list-v1";
const SAKURA_SLEEP_STORAGE_KEY = "sakura-sleep-log-v1";
const BRANCH_STORAGE_KEY = "state-branch-ui-v1";
const SIGNS_STORAGE_KEY = "early-sign-checks-v1";
const LIBRARY_STORAGE_KEY = "comfort-library-custom-v1";
const ROULETTE_ACTIONS_STORAGE_KEY = "today-roulette-actions-v1";
const ROULETTE_HISTORY_STORAGE_KEY = "today-roulette-history-v1";
const SHOPPING_STORAGE_KEY = "shopping-list-mobile-v1";
const VISIT_MEMO_STORAGE_KEY = "visit-nursing-medical-memo-v1";
const READING_LOG_STORAGE_KEY = "reading-log-mobile-v1";
const MOVIE_LOG_STORAGE_KEY = "movie-log-mobile-v1";
const SIMPLE_MEDIA_LOG_STORAGE_KEY = "simple-media-log-mobile-v1";

const today = toDateInputValue(new Date());

const menuItems: Array<{ view: Exclude<View, "home">; title: string; description: string; icon: typeof Home }> = [
  { view: "tasks", title: "タスク管理", description: "やること、期限、優先度を整理", icon: ListChecks },
  { view: "recovery", title: "回復ログ", description: "体調と気持ちを短く記録", icon: HeartPulse },
  { view: "triggerDb", title: "回復トリガーDB", description: "効いた回復策の条件をためる", icon: Clipboard },
  { view: "notNow", title: "今はやらないリスト", description: "禁止ではなく、今日は保留にする", icon: ClipboardCheck },
  { view: "sakuraSleep", title: "睡眠ログ さくら版", description: "寝方、場所、起床感、安心感を残す", icon: Moon },
  { view: "state", title: "今の状態 分岐UI", description: "今の状態から次の一手を選ぶ", icon: Sparkles },
  { view: "signs", title: "崩れ始めサイン チェックUI", description: "早めのサインを拾って守りを固める", icon: ClipboardCheck },
  { view: "library", title: "安心文庫ビューア", description: "安心文をタグで保存して読み返す", icon: BookOpen },
  { view: "roulette", title: "今日やることルーレット", description: "迷った時に小さな行動を1つ選ぶ", icon: Shuffle },
  { view: "shopping", title: "買い物リスト", description: "買い忘れを減らす片手用リスト", icon: ShoppingBasket },
  { view: "visitMemo", title: "訪看・診察メモ", description: "毎日の記録をコピー用に整える", icon: NotebookPen },
  { view: "mediaLog", title: "読書・映画ログ", description: "本と映画の感想をスマホで残す", icon: Film },
];

const moodOptions: Array<{ value: MoodStatus; label: string }> = [
  { value: "stable", label: "安定" },
  { value: "uneasy", label: "やや不安" },
  { value: "tired", label: "疲れている" },
  { value: "slipping", label: "崩れ始め" },
  { value: "recovering", label: "回復中" },
];

const moodLabel = Object.fromEntries(moodOptions.map((item) => [item.value, item.label])) as Record<MoodStatus, string>;
const priorityLabel: Record<TaskPriority, string> = { low: "低", medium: "中", high: "高" };
const statusLabel: Record<TaskStatus, string> = { todo: "未着手", doing: "進行中", done: "完了" };
const triggerSpeedOptions: Array<[TriggerSpeed, string]> = [["fast", "即効性あり"], ["medium", "少し後で効く"], ["slow", "じわじわ"]];
const triggerDurationOptions: Array<[TriggerDuration, string]> = [["short", "短め"], ["medium", "半日くらい"], ["long", "長く続く"]];
const triggerTimingOptions: Array<[TriggerTiming, string]> = [["morning", "朝向け"], ["day", "日中向け"], ["night", "夜向け"], ["anytime", "いつでも"]];
const triggerSocialOptions: Array<[TriggerSocial, string]> = [["solo", "一人向け"], ["connect", "つながる系"], ["both", "どちらも"]];
const triggerSpeedLabel = Object.fromEntries(triggerSpeedOptions) as Record<TriggerSpeed, string>;
const triggerDurationLabel = Object.fromEntries(triggerDurationOptions) as Record<TriggerDuration, string>;
const triggerTimingLabel = Object.fromEntries(triggerTimingOptions) as Record<TriggerTiming, string>;
const triggerSocialLabel = Object.fromEntries(triggerSocialOptions) as Record<TriggerSocial, string>;
const notNowUntilOptions: Array<[NotNowItem["until"], string]> = [["today", "今日は保留"], ["tonight", "夜だけ保留"], ["tomorrow", "明日見直す"], ["later", "しばらく保留"]];
const notNowUntilLabel = Object.fromEntries(notNowUntilOptions) as Record<NotNowItem["until"], string>;
const libraryModeOptions: Array<[LibraryMode, string]> = [["emergency", "緊急用"], ["night", "夜用"], ["morning", "朝用"], ["uneasy", "不安"], ["tired", "疲れ"]];
const libraryModeLabel = Object.fromEntries(libraryModeOptions) as Record<LibraryMode, string>;
const sleepModeOptions: Array<[SleepMode, string]> = [["passedOut", "気絶型"], ["futon", "布団で寝た"], ["broken", "途中で途切れた"], ["planned", "予定して寝た"]];
const sleepPlaceOptions: Array<[SleepPlace, string]> = [["futon", "布団"], ["chair", "座椅子"], ["floor", "床・その場"], ["other", "その他"]];
const flashbackOptions: Array<[FlashbackStatus, string]> = [["none", "なし"], ["little", "少し"], ["yes", "あり"]];
const wakeFeelingOptions: Array<[WakeFeeling, string]> = [["heavy", "重い"], ["blank", "ぼんやり"], ["okay", "まあまあ"], ["clear", "すっきり"]];
const safetyFeelingOptions: Array<[SafetyFeeling, string]> = [["low", "安心少なめ"], ["middle", "少し安心"], ["high", "安心できた"]];
const sleepModeLabel = Object.fromEntries(sleepModeOptions) as Record<SleepMode, string>;
const sleepPlaceLabel = Object.fromEntries(sleepPlaceOptions) as Record<SleepPlace, string>;
const flashbackLabel = Object.fromEntries(flashbackOptions) as Record<FlashbackStatus, string>;
const wakeFeelingLabel = Object.fromEntries(wakeFeelingOptions) as Record<WakeFeeling, string>;
const safetyFeelingLabel = Object.fromEntries(safetyFeelingOptions) as Record<SafetyFeeling, string>;

const signOptions: Array<{ id: SignId; label: string; guide: string }> = [
  { id: "sleep", label: "眠りが浅い", guide: "寝る前の刺激を減らして、予定を詰めすぎない。" },
  { id: "body", label: "体が重い", guide: "水分、食事、横になる時間を先に確保する。" },
  { id: "thoughts", label: "考えが止まらない", guide: "紙に書き出して、判断は明日に回す。" },
  { id: "noise", label: "音や光がつらい", guide: "通知、照明、画面の明るさを弱める。" },
  { id: "messages", label: "連絡が重い", guide: "返信する時間を決めて、それまでは見ない。" },
  { id: "food", label: "食事が抜けがち", guide: "食べやすいものを先に置く。" },
  { id: "irritation", label: "焦りやすい", guide: "タスクを1つだけ残して、他を保留にする。" },
  { id: "isolation", label: "抱え込みやすい", guide: "一言だけ誰かに送る選択肢を持つ。" },
];

const defaultLibrary: LibraryEntry[] = [
  { id: "enough", title: "今日はここまでで十分", body: "できた量ではなく、続けようとしていることを数えていい。", tag: "休み", favorite: true, modes: ["tired", "night"] },
  { id: "slow", title: "急がなくていい", body: "今の速度を基準にして、呼吸と水分と安全な場所を先にする。", tag: "落ち着き", modes: ["emergency", "uneasy", "night"] },
  { id: "one", title: "次は1つだけ", body: "全部を整えなくていい。1つ終えたら、その時点で見直せばいい。", tag: "行動", modes: ["morning", "tired"] },
  { id: "safe", title: "今は安全を先にする", body: "判断や返信よりも、体を置ける場所、飲み物、明るさを整えることを優先していい。", tag: "緊急", favorite: true, modes: ["emergency", "uneasy"] },
  { id: "night", title: "夜は結論を出さない", body: "夜の気持ちは強く見えることがある。メモだけ残して、結論は明日の自分に渡していい。", tag: "夜", modes: ["night", "uneasy"] },
  { id: "morning", title: "朝は小さく始める", body: "起きた瞬間に全部を決めなくていい。水分、光、ひとつの用事からで十分。", tag: "朝", modes: ["morning", "tired"] },
];

const defaultRouletteActions: RouletteAction[] = [
  { id: "water", text: "水を飲む", category: "回復" },
  { id: "breath", text: "深呼吸を4回する", category: "回復" },
  { id: "log", text: "回復ログを1行書く", category: "記録" },
  { id: "desk", text: "机の上を1つ片付ける", category: "生活" },
  { id: "music", text: "好きな音楽を1曲流す", category: "回復" },
  { id: "task", text: "タスクを1つだけ進める", category: "作業" },
];

const shoppingCategories: Array<{ id: CategoryId; label: string; icon: typeof ShoppingBasket; color: string }> = [
  { id: "staple", label: "主食", icon: Wheat, color: "#45745f" },
  { id: "side", label: "おかず", icon: Beef, color: "#b8584c" },
  { id: "drink", label: "飲み物", icon: Milk, color: "#3f70a4" },
  { id: "daily", label: "日用品", icon: Home, color: "#75685b" },
  { id: "heavy", label: "重いもの", icon: Dumbbell, color: "#5f5f77" },
  { id: "treat", label: "ぜいたく枠", icon: Crown, color: "#b07726" },
];

const frequentItems: Array<{ name: string; category: CategoryId }> = [
  { name: "米", category: "staple" },
  { name: "食パン", category: "staple" },
  { name: "卵", category: "side" },
  { name: "納豆", category: "side" },
  { name: "牛乳", category: "drink" },
  { name: "お茶", category: "drink" },
  { name: "トイレットペーパー", category: "daily" },
  { name: "洗剤", category: "daily" },
  { name: "水 2L", category: "heavy" },
  { name: "猫砂", category: "heavy" },
  { name: "アイス", category: "treat" },
  { name: "チョコ", category: "treat" },
];

const shoppingCategoryById = Object.fromEntries(shoppingCategories.map((category) => [category.id, category])) as Record<
  CategoryId,
  (typeof shoppingCategories)[number]
>;

function createId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function toDateInputValue(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function readStorage<T>(key: string, fallback: T): T {
  try {
    const saved = window.localStorage.getItem(key);
    return saved ? (JSON.parse(saved) as T) : fallback;
  } catch {
    return fallback;
  }
}

function normalizeTask(item: Partial<Task> & { notes?: string; title?: string }): Task | null {
  if (!item.title) return null;
  return {
    id: item.id || createId("task"),
    title: String(item.title),
    status: item.status === "doing" || item.status === "done" ? item.status : "todo",
    priority: item.priority === "low" || item.priority === "high" ? item.priority : "medium",
    project: item.project || "Inbox",
    dueDate: item.dueDate || "",
    memo: item.memo || item.notes || "",
    createdAt: item.createdAt || new Date().toISOString(),
  };
}

function loadTasks() {
  const current = readStorage<Array<Partial<Task>>>(TASK_STORAGE_KEY, []).map(normalizeTask).filter(Boolean) as Task[];
  if (current.length > 0) return current;
  return readStorage<Array<Partial<Task> & { notes?: string }>>(LEGACY_TASK_STORAGE_KEY, []).map(normalizeTask).filter(Boolean) as Task[];
}

function createShoppingItem(name: string, category: CategoryId, todayOnly = true): ShoppingItem {
  return {
    id: globalThis.crypto?.randomUUID?.() || createId("shopping"),
    name,
    category,
    checked: false,
    today: todayOnly,
    createdAt: Date.now(),
  };
}

function loadShoppingItems() {
  const fallback = [createShoppingItem("卵", "side"), createShoppingItem("牛乳", "drink"), createShoppingItem("食パン", "staple")];
  return readStorage<ShoppingItem[]>(SHOPPING_STORAGE_KEY, fallback);
}

function createVisitMemoDay(date = today): VisitMemoDay {
  return {
    id: globalThis.crypto?.randomUUID?.() || createId("visit-memo-day"),
    date,
    sleepHours: "",
    bowel: "",
    breakfast: "",
    lunch: "",
    dinner: "",
    snack: "",
    medicineCount: "0",
  };
}

function loadVisitMemo(): VisitMemo {
  return readStorage<VisitMemo>(VISIT_MEMO_STORAGE_KEY, createEmptyVisitMemo());
}

function createEmptyVisitMemo(): VisitMemo {
  return {
    days: [createVisitMemoDay()],
    other: "",
    achieved: "",
    happy: "",
    mustTalk: "",
    chat: "",
  };
}

function hasVisitMemoContent(memo: VisitMemo) {
  return (
    memo.days.some((day) =>
      [day.sleepHours, day.breakfast, day.lunch, day.dinner, day.snack, day.medicineCount].some((value) => value.trim() && value.trim() !== "0") || day.bowel,
    ) ||
    [memo.other, memo.achieved, memo.happy, memo.mustTalk, memo.chat].some((value) => value.trim())
  );
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("ja-JP", { month: "numeric", day: "numeric", weekday: "short" }).format(new Date(`${date}T00:00:00`));
}

function formatTime(value: string) {
  return new Intl.DateTimeFormat("ja-JP", { hour: "2-digit", minute: "2-digit" }).format(new Date(value));
}

export function App() {
  const [view, setView] = useState<View>("home");
  const title = view === "home" ? "ミニアプリ集" : menuItems.find((item) => item.view === view)?.title || "ミニアプリ集";

  return (
    <main className="app-shell">
      <section className="app-frame">
        <header className="topbar">
          <button
            className="home-button"
            type="button"
            onClick={() => setView(view === "home" ? "shopping" : "home")}
            aria-label="ホームへ戻る"
          >
            {view === "home" ? <ShoppingBasket size={19} /> : <ArrowLeft size={19} />}
          </button>
          <div>
            <p className="eyebrow">Life dashboard</p>
            <h1>{title}</h1>
          </div>
        </header>

        {view === "home" ? (
          <HomeView setView={setView} />
        ) : (
          <>
            <nav className="quick-tabs" aria-label="ミニアプリ切り替え">
              {menuItems.map((item) => (
                <button key={item.view} className={view === item.view ? "active" : ""} type="button" onClick={() => setView(item.view)}>
                  {item.title}
                </button>
              ))}
            </nav>
            {view === "tasks" && <TaskManager />}
            {view === "recovery" && <RecoveryLogApp />}
            {view === "triggerDb" && <RecoveryTriggerDbApp />}
            {view === "notNow" && <NotNowListApp />}
            {view === "sakuraSleep" && <SakuraSleepLogApp />}
            {view === "state" && <StateBranchUi />}
            {view === "signs" && <SignsCheckUi />}
            {view === "library" && <ComfortLibrary />}
            {view === "roulette" && <RouletteApp />}
            {view === "shopping" && <ShoppingListApp />}
            {view === "visitMemo" && <VisitMemoApp />}
            {view === "mediaLog" && <MediaLogApp />}
          </>
        )}
      </section>
    </main>
  );
}

function HomeView({ setView }: { setView: (view: View) => void }) {
  const tasks = loadTasks();
  const shopping = readStorage<ShoppingItem[]>(SHOPPING_STORAGE_KEY, []);
  const openTasks = tasks.filter((task) => task.status !== "done").length;
  const shoppingLeft = shopping.filter((item) => item.today && !item.checked).length;

  return (
    <>
      <section className="home-summary">
        <Stat label="未完了タスク" value={`${openTasks}件`} />
        <Stat label="今日の買い物" value={`${shoppingLeft}件`} />
        <Stat label="保存先" value="localStorage" />
      </section>
      <section className="home-grid" aria-label="ホームメニュー">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button className="menu-card" key={item.view} type="button" onClick={() => setView(item.view)}>
              <span className="menu-icon">
                <Icon size={23} />
              </span>
              <strong>{item.title}</strong>
              <small>{item.description}</small>
            </button>
          );
        })}
      </section>
    </>
  );
}

function TaskManager() {
  const [tasks, setTasks] = useState<Task[]>(loadTasks);
  const [title, setTitle] = useState("");
  const [filter, setFilter] = useState<TaskStatus | "all">("all");

  useEffect(() => window.localStorage.setItem(TASK_STORAGE_KEY, JSON.stringify(tasks)), [tasks]);

  const visibleTasks = tasks
    .filter((task) => filter === "all" || task.status === filter)
    .sort((a, b) => (a.status === b.status ? b.createdAt.localeCompare(a.createdAt) : statusRank(a.status) - statusRank(b.status)));

  function addTask(event: FormEvent) {
    event.preventDefault();
    if (!title.trim()) return;
    setTasks((current) => [
      { id: createId("task"), title: title.trim(), project: "Inbox", dueDate: "", priority: "medium", memo: "", status: "todo", createdAt: new Date().toISOString() },
      ...current,
    ]);
    setTitle("");
  }

  function updateTask(id: string, patch: Partial<Task>) {
    setTasks((current) => current.map((task) => (task.id === id ? { ...task, ...patch } : task)));
  }

  return (
    <section className="panel">
      <form className="inline-form" onSubmit={addTask}>
        <label>
          <span>タスク名</span>
          <input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="例: 申請書を確認する" />
        </label>
        <button className="primary-button" type="submit">
          <Plus size={18} />
          追加
        </button>
      </form>
      <div className="segmented">
        {(["all", "todo", "doing", "done"] as const).map((item) => (
          <button key={item} className={filter === item ? "active" : ""} type="button" onClick={() => setFilter(item)}>
            {item === "all" ? "すべて" : statusLabel[item]}
          </button>
        ))}
      </div>
      <div className="task-list">
        {visibleTasks.length === 0 ? (
          <Empty text="表示できるタスクはありません。" />
        ) : (
          visibleTasks.map((task) => (
            <article className={`task-card ${task.status}`} key={task.id}>
              <button className="check-button" type="button" onClick={() => updateTask(task.id, { status: task.status === "done" ? "todo" : "done" })}>
                {task.status === "done" ? <Check size={17} /> : null}
              </button>
              <div className="task-main">
                <input className="task-title" value={task.title} onChange={(event) => updateTask(task.id, { title: event.target.value })} />
                <div className="task-meta">
                  <span>{statusLabel[task.status]}</span>
                  <span>優先度 {priorityLabel[task.priority]}</span>
                  {task.dueDate ? (
                    <span>
                      <CalendarDays size={14} />
                      {task.dueDate}
                    </span>
                  ) : null}
                </div>
              </div>
              <select value={task.status} onChange={(event) => updateTask(task.id, { status: event.target.value as TaskStatus })}>
                <option value="todo">未着手</option>
                <option value="doing">進行中</option>
                <option value="done">完了</option>
              </select>
              <button className="icon-button danger" type="button" onClick={() => setTasks((current) => current.filter((item) => item.id !== task.id))}>
                <Trash2 size={16} />
              </button>
            </article>
          ))
        )}
      </div>
    </section>
  );
}

function RecoveryLogApp() {
  const [logs, setLogs] = useState<RecoveryLog[]>(readStorage<RecoveryLog[]>(RECOVERY_STORAGE_KEY, []));
  const [status, setStatus] = useState<MoodStatus>("stable");
  const [bodyNote, setBodyNote] = useState("");
  const [feelingNote, setFeelingNote] = useState("");
  const [doneOneThing, setDoneOneThing] = useState("");
  const [recoveryTrigger, setRecoveryTrigger] = useState("");
  const [todayWord, setTodayWord] = useState("");

  useEffect(() => window.localStorage.setItem(RECOVERY_STORAGE_KEY, JSON.stringify(logs)), [logs]);

  function saveLog(event: FormEvent) {
    event.preventDefault();
    setLogs((current) => [{ id: createId("recovery"), date: today, status, bodyNote, feelingNote, doneOneThing, recoveryTrigger, todayWord, createdAt: new Date().toISOString() }, ...current]);
    setBodyNote("");
    setFeelingNote("");
    setDoneOneThing("");
    setRecoveryTrigger("");
    setTodayWord("");
  }

  return (
    <section className="panel two-column">
      <form className="stack" onSubmit={saveLog}>
        <div className="choice-grid five">
          {moodOptions.map((item) => (
            <button className={status === item.value ? "selected" : ""} key={item.value} type="button" onClick={() => setStatus(item.value)}>
              {item.label}
            </button>
          ))}
        </div>
        <TextArea label="体の状態" value={bodyNote} onChange={setBodyNote} />
        <TextArea label="気持ちの状態" value={feelingNote} onChange={setFeelingNote} />
        <TextArea label="できたことを1つ" value={doneOneThing} onChange={setDoneOneThing} />
        <TextArea label="効いた回復トリガー" value={recoveryTrigger} onChange={setRecoveryTrigger} />
        <label className="field">
          <span>今日のひとこと</span>
          <input value={todayWord} onChange={(event) => setTodayWord(event.target.value)} placeholder="今日はここまでで十分" />
        </label>
        <button className="primary-button full" type="submit">
          <Plus size={18} />
          保存
        </button>
      </form>
      <div className="stack">
        {logs.length === 0 ? <Empty text="まだログはありません。" /> : logs.map((log) => <LogCard key={log.id} log={log} onDelete={() => setLogs((current) => current.filter((item) => item.id !== log.id))} />)}
      </div>
    </section>
  );
}

function RecoveryTriggerDbApp() {
  const [entries, setEntries] = useState<RecoveryTriggerEntry[]>(readStorage<RecoveryTriggerEntry[]>(RECOVERY_TRIGGER_STORAGE_KEY, []));
  const [name, setName] = useState("");
  const [workedNote, setWorkedNote] = useState("");
  const [didntWorkNote, setDidntWorkNote] = useState("");
  const [speed, setSpeed] = useState<TriggerSpeed>("fast");
  const [duration, setDuration] = useState<TriggerDuration>("medium");
  const [timing, setTiming] = useState<TriggerTiming>("anytime");
  const [social, setSocial] = useState<TriggerSocial>("solo");
  const [memo, setMemo] = useState("");
  const [timingFilter, setTimingFilter] = useState<TriggerTiming | "all">("all");
  const [socialFilter, setSocialFilter] = useState<TriggerSocial | "all">("all");

  useEffect(() => window.localStorage.setItem(RECOVERY_TRIGGER_STORAGE_KEY, JSON.stringify(entries)), [entries]);

  const visibleEntries = entries
    .filter((entry) => timingFilter === "all" || entry.timing === timingFilter)
    .filter((entry) => socialFilter === "all" || entry.social === socialFilter)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  function addEntry(event: FormEvent) {
    event.preventDefault();
    if (!name.trim() && !workedNote.trim()) return;
    setEntries((current) => [
      {
        id: createId("recovery-trigger"),
        name: name.trim() || "名前なしの回復トリガー",
        workedNote: workedNote.trim(),
        didntWorkNote: didntWorkNote.trim(),
        speed,
        duration,
        timing,
        social,
        memo: memo.trim(),
        createdAt: new Date().toISOString(),
      },
      ...current,
    ]);
    setName("");
    setWorkedNote("");
    setDidntWorkNote("");
    setSpeed("fast");
    setDuration("medium");
    setTiming("anytime");
    setSocial("solo");
    setMemo("");
  }

  return (
    <section className="panel two-column">
      <form className="stack" onSubmit={addEntry}>
        <label className="field">
          <span>トリガー名</span>
          <input value={name} onChange={(event) => setName(event.target.value)} placeholder="例: 10分散歩 / 温かい飲み物 / LINEする" />
        </label>
        <TextArea label="効いたこと" value={workedNote} onChange={setWorkedNote} />
        <TextArea label="効かなかったこと" value={didntWorkNote} onChange={setDidntWorkNote} />
        <BranchGroup label="即効性" value={speed} options={triggerSpeedOptions} onChange={setSpeed} />
        <BranchGroup label="持続性" value={duration} options={triggerDurationOptions} onChange={setDuration} />
        <BranchGroup label="向いている時間帯" value={timing} options={triggerTimingOptions} onChange={setTiming} />
        <BranchGroup label="使う場面" value={social} options={triggerSocialOptions} onChange={setSocial} />
        <TextArea label="補足メモ" value={memo} onChange={setMemo} />
        <button className="primary-button full" type="submit">
          <Plus size={18} />
          DBに追加
        </button>
      </form>

      <div className="stack">
        <section className="mini-stats trigger-stats">
          <Stat label="登録数" value={`${entries.length}件`} />
          <Stat label="即効性あり" value={`${entries.filter((entry) => entry.speed === "fast").length}件`} />
          <Stat label="夜向け" value={`${entries.filter((entry) => entry.timing === "night").length}件`} />
        </section>

        <div className="segmented wrap" aria-label="時間帯で絞り込み">
          <button className={timingFilter === "all" ? "active" : ""} type="button" onClick={() => setTimingFilter("all")}>
            全時間帯
          </button>
          {triggerTimingOptions.map(([value, label]) => (
            <button className={timingFilter === value ? "active" : ""} key={value} type="button" onClick={() => setTimingFilter(value)}>
              {label}
            </button>
          ))}
        </div>

        <div className="segmented wrap" aria-label="場面で絞り込み">
          <button className={socialFilter === "all" ? "active" : ""} type="button" onClick={() => setSocialFilter("all")}>
            全場面
          </button>
          {triggerSocialOptions.map(([value, label]) => (
            <button className={socialFilter === value ? "active" : ""} key={value} type="button" onClick={() => setSocialFilter(value)}>
              {label}
            </button>
          ))}
        </div>

        <div className="stack">
          {visibleEntries.length === 0 ? (
            <Empty text="まだ回復トリガーはありません。" />
          ) : (
            visibleEntries.map((entry) => (
              <article className="recovery-trigger-card" key={entry.id}>
                <div className="log-head">
                  <strong>{entry.name}</strong>
                  <button className="icon-button danger" type="button" onClick={() => setEntries((current) => current.filter((item) => item.id !== entry.id))} aria-label="削除">
                    <Trash2 size={16} />
                  </button>
                </div>
                <div className="trigger-tags">
                  <span>{triggerSpeedLabel[entry.speed]}</span>
                  <span>{triggerDurationLabel[entry.duration]}</span>
                  <span>{triggerTimingLabel[entry.timing]}</span>
                  <span>{triggerSocialLabel[entry.social]}</span>
                </div>
                {entry.workedNote ? (
                  <p>
                    <strong>効いたこと</strong>
                    {entry.workedNote}
                  </p>
                ) : null}
                {entry.didntWorkNote ? (
                  <p>
                    <strong>効かなかったこと</strong>
                    {entry.didntWorkNote}
                  </p>
                ) : null}
                {entry.memo ? (
                  <p>
                    <strong>メモ</strong>
                    {entry.memo}
                  </p>
                ) : null}
              </article>
            ))
          )}
        </div>
      </div>
    </section>
  );
}

function NotNowListApp() {
  const [items, setItems] = useState<NotNowItem[]>(
    readStorage<NotNowItem[]>(NOT_NOW_STORAGE_KEY, [
      { id: "night-decision", text: "夜の重大判断をしない", reason: "疲れている時間帯は判断を明日に回す", alternative: "メモだけ残す", until: "tomorrow", paused: false, createdAt: new Date().toISOString() },
      { id: "sns-scroll", text: "SNSを見すぎない", reason: "刺激が増えすぎる時は距離を取る", alternative: "タイマーを10分にする", until: "today", paused: false, createdAt: new Date().toISOString() },
      { id: "dissociation-shopping", text: "解離っぽい時は通販しない", reason: "あとで見直せるように保留する", alternative: "カートではなくメモに置く", until: "tomorrow", paused: false, createdAt: new Date().toISOString() },
      { id: "new-plan", text: "今日は新しい予定を入れない", reason: "回復の余白を守る", alternative: "候補日だけメモする", until: "today", paused: false, createdAt: new Date().toISOString() },
    ]),
  );
  const [text, setText] = useState("");
  const [reason, setReason] = useState("");
  const [alternative, setAlternative] = useState("");
  const [until, setUntil] = useState<NotNowItem["until"]>("today");

  useEffect(() => window.localStorage.setItem(NOT_NOW_STORAGE_KEY, JSON.stringify(items)), [items]);

  const activeItems = items.filter((item) => !item.paused);
  const pausedItems = items.filter((item) => item.paused);

  function addItem(event: FormEvent) {
    event.preventDefault();
    if (!text.trim()) return;
    setItems((current) => [
      {
        id: createId("not-now"),
        text: text.trim(),
        reason: reason.trim(),
        alternative: alternative.trim(),
        until,
        paused: false,
        createdAt: new Date().toISOString(),
      },
      ...current,
    ]);
    setText("");
    setReason("");
    setAlternative("");
    setUntil("today");
  }

  function updateItem(id: string, patch: Partial<NotNowItem>) {
    setItems((current) => current.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  }

  function renderItem(item: NotNowItem) {
    return (
      <article className={item.paused ? "not-now-card paused" : "not-now-card"} key={item.id}>
        <button className="check-button" type="button" onClick={() => updateItem(item.id, { paused: !item.paused })} aria-label={item.paused ? "保留を戻す" : "今日は保留にする"}>
          {item.paused ? <Check size={17} /> : null}
        </button>
        <div>
          <div className="log-head">
            <strong>{item.text}</strong>
            <button className="icon-button danger" type="button" onClick={() => setItems((current) => current.filter((currentItem) => currentItem.id !== item.id))} aria-label="削除">
              <Trash2 size={16} />
            </button>
          </div>
          <div className="trigger-tags">
            <span>{notNowUntilLabel[item.until]}</span>
            <span>{item.paused ? "保留済み" : "まだ見える場所に置く"}</span>
          </div>
          {item.reason ? (
            <p>
              <strong>理由</strong>
              {item.reason}
            </p>
          ) : null}
          {item.alternative ? (
            <p>
              <strong>代わりに</strong>
              {item.alternative}
            </p>
          ) : null}
        </div>
      </article>
    );
  }

  return (
    <section className="panel two-column">
      <form className="stack" onSubmit={addItem}>
        <div className="result-box">
          <strong>禁止じゃなく、今日は保留</strong>
          <p>あとで考えればいいことを、今の自分から少し離しておくためのリストです。</p>
        </div>
        <label className="field">
          <span>今はやらないこと</span>
          <input value={text} onChange={(event) => setText(event.target.value)} placeholder="例: 夜の重大判断をしない" />
        </label>
        <TextArea label="保留にする理由" value={reason} onChange={setReason} />
        <TextArea label="代わりにすること" value={alternative} onChange={setAlternative} />
        <BranchGroup label="いつまで保留する？" value={until} options={notNowUntilOptions} onChange={setUntil} />
        <button className="primary-button full" type="submit">
          <Plus size={18} />
          保留リストに追加
        </button>
      </form>

      <div className="stack">
        <section className="mini-stats trigger-stats">
          <Stat label="見える保留" value={`${activeItems.length}件`} />
          <Stat label="保留済み" value={`${pausedItems.length}件`} />
          <Stat label="合計" value={`${items.length}件`} />
        </section>
        {activeItems.length === 0 ? <Empty text="今見える保留はありません。" /> : activeItems.map(renderItem)}
        {pausedItems.length > 0 ? (
          <section className="stack" aria-label="保留済み">
            <div className="section-title">
              <Check size={16} />
              <h2>今日は保留にしたもの</h2>
            </div>
            {pausedItems.map(renderItem)}
          </section>
        ) : null}
      </div>
    </section>
  );
}

function SakuraSleepLogApp() {
  const [logs, setLogs] = useState<SakuraSleepLog[]>(readStorage<SakuraSleepLog[]>(SAKURA_SLEEP_STORAGE_KEY, []));
  const [date, setDate] = useState(today);
  const [mode, setMode] = useState<SleepMode>("passedOut");
  const [place, setPlace] = useState<SleepPlace>("futon");
  const [flashback, setFlashback] = useState<FlashbackStatus>("none");
  const [wakeFeeling, setWakeFeeling] = useState<WakeFeeling>("blank");
  const [safety, setSafety] = useState<SafetyFeeling>("middle");
  const [memo, setMemo] = useState("");

  useEffect(() => window.localStorage.setItem(SAKURA_SLEEP_STORAGE_KEY, JSON.stringify(logs)), [logs]);

  const sortedLogs = [...logs].sort((a, b) => b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt));
  const passedOutCount = logs.filter((log) => log.mode === "passedOut").length;
  const flashbackCount = logs.filter((log) => log.flashback !== "none").length;
  const safeCount = logs.filter((log) => log.safety === "high").length;

  function addLog(event: FormEvent) {
    event.preventDefault();
    setLogs((current) => [
      {
        id: createId("sakura-sleep"),
        date: date || today,
        mode,
        place,
        flashback,
        wakeFeeling,
        safety,
        memo: memo.trim(),
        createdAt: new Date().toISOString(),
      },
      ...current,
    ]);
    setDate(today);
    setMode("passedOut");
    setPlace("futon");
    setFlashback("none");
    setWakeFeeling("blank");
    setSafety("middle");
    setMemo("");
  }

  return (
    <section className="panel two-column">
      <form className="stack" onSubmit={addLog}>
        <div className="result-box">
          <strong>普通の睡眠アプリじゃなくて、さくら用</strong>
          <p>長さよりも、寝落ち方・場所・フラッシュバック・起きた感じ・安心感を短く残します。</p>
        </div>
        <label className="field">
          <span>日付</span>
          <input type="date" value={date} onChange={(event) => setDate(event.target.value)} />
        </label>
        <BranchGroup label="寝方" value={mode} options={sleepModeOptions} onChange={setMode} />
        <BranchGroup label="寝た場所" value={place} options={sleepPlaceOptions} onChange={setPlace} />
        <BranchGroup label="フラッシュバック" value={flashback} options={flashbackOptions} onChange={setFlashback} />
        <BranchGroup label="起床感" value={wakeFeeling} options={wakeFeelingOptions} onChange={setWakeFeeling} />
        <BranchGroup label="安心感" value={safety} options={safetyFeelingOptions} onChange={setSafety} />
        <TextArea label="メモ" value={memo} onChange={setMemo} />
        <button className="primary-button full" type="submit">
          <Plus size={18} />
          睡眠ログを保存
        </button>
      </form>

      <div className="stack">
        <section className="mini-stats trigger-stats">
          <Stat label="記録数" value={`${logs.length}件`} />
          <Stat label="気絶型" value={`${passedOutCount}件`} />
          <Stat label="安心できた" value={`${safeCount}件`} />
        </section>
        {flashbackCount > 0 ? (
          <div className="result-box">
            <strong>フラッシュバックあり/少し: {flashbackCount}件</strong>
            <p>多い時は、寝る前の刺激や予定量を少し減らすサインにできます。</p>
          </div>
        ) : null}
        {sortedLogs.length === 0 ? (
          <Empty text="睡眠ログはまだありません。" />
        ) : (
          sortedLogs.map((log) => (
            <article className="sleep-card" key={log.id}>
              <div className="log-head">
                <strong>{formatDate(log.date)}</strong>
                <button className="icon-button danger" type="button" onClick={() => setLogs((current) => current.filter((item) => item.id !== log.id))} aria-label="削除">
                  <Trash2 size={16} />
                </button>
              </div>
              <div className="trigger-tags">
                <span>{sleepModeLabel[log.mode]}</span>
                <span>{sleepPlaceLabel[log.place]}</span>
                <span>フラッシュバック: {flashbackLabel[log.flashback]}</span>
                <span>起床感: {wakeFeelingLabel[log.wakeFeeling]}</span>
                <span>安心感: {safetyFeelingLabel[log.safety]}</span>
              </div>
              {log.memo ? <p>{log.memo}</p> : null}
            </article>
          ))
        )}
      </div>
    </section>
  );
}

function StateBranchUi() {
  const [state, setState] = useState<BranchState>(readStorage<BranchState>(BRANCH_STORAGE_KEY, { energy: "middle", mind: "calm", need: "light" }));
  useEffect(() => window.localStorage.setItem(BRANCH_STORAGE_KEY, JSON.stringify(state)), [state]);
  const result = getStateResult(state);

  return (
    <section className="panel">
      <BranchGroup label="エネルギー" value={state.energy} options={[["low", "低い"], ["middle", "ふつう"], ["high", "高め"]]} onChange={(energy) => setState((current) => ({ ...current, energy }))} />
      <BranchGroup label="頭と心" value={state.mind} options={[["calm", "落ち着き"], ["uneasy", "不安"], ["overloaded", "過負荷"]]} onChange={(mind) => setState((current) => ({ ...current, mind }))} />
      <BranchGroup label="今ほしいもの" value={state.need} options={[["rest", "休み"], ["light", "軽い行動"], ["connect", "つながる"]]} onChange={(need) => setState((current) => ({ ...current, need }))} />
      <div className="result-box">
        <strong>{result.title}</strong>
        <p>{result.body}</p>
        <small>{result.action}</small>
      </div>
    </section>
  );
}

function SignsCheckUi() {
  const [history, setHistory] = useState<SignCheck[]>(readStorage<SignCheck[]>(SIGNS_STORAGE_KEY, []));
  const [checked, setChecked] = useState<SignId[]>([]);
  const [note, setNote] = useState("");
  useEffect(() => window.localStorage.setItem(SIGNS_STORAGE_KEY, JSON.stringify(history)), [history]);
  const guides = signOptions.filter((item) => checked.includes(item.id)).map((item) => item.guide);
  const level = checked.length >= 5 ? "守りを固める" : checked.length >= 3 ? "早めに軽くする" : "様子を見る";

  return (
    <section className="panel two-column">
      <div className="stack">
        <div className="result-box">
          <strong>{level}</strong>
          <p>{checked.length}個チェック中。多い日は予定、通知、刺激を減らす合図にできます。</p>
        </div>
        <div className="check-grid">
          {signOptions.map((item) => (
            <label className="check-card" key={item.id}>
              <input type="checkbox" checked={checked.includes(item.id)} onChange={(event) => setChecked((current) => (event.target.checked ? [...current, item.id] : current.filter((id) => id !== item.id)))} />
              <span>{item.label}</span>
            </label>
          ))}
        </div>
        <TextArea label="メモ" value={note} onChange={setNote} />
        <button
          className="primary-button full"
          type="button"
          onClick={() => {
            setHistory((current) => [{ id: createId("sign"), date: today, checked, note, createdAt: new Date().toISOString() }, ...current]);
            setChecked([]);
            setNote("");
          }}
        >
          <Plus size={18} />
          保存
        </button>
      </div>
      <div className="stack">
        {guides.length > 0 ? (
          <div className="guide-card">
            <strong>今日の守り方</strong>
            {guides.map((guide) => (
              <p key={guide}>{guide}</p>
            ))}
          </div>
        ) : (
          <Empty text="当てはまるサインを選ぶと守り方が出ます。" />
        )}
        {history.slice(0, 6).map((item) => (
          <article className="history-card" key={item.id}>
            <strong>
              {formatDate(item.date)} / {item.checked.length}個
            </strong>
            {item.note ? <p>{item.note}</p> : null}
          </article>
        ))}
      </div>
    </section>
  );
}

function ComfortLibrary() {
  const [customEntries, setCustomEntries] = useState<LibraryEntry[]>(readStorage<LibraryEntry[]>(LIBRARY_STORAGE_KEY, []));
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [tag, setTag] = useState("自分用");
  const [filter, setFilter] = useState("すべて");
  const [modeFilter, setModeFilter] = useState<LibraryMode | "all" | "favorite">("all");
  const [selectedModes, setSelectedModes] = useState<LibraryMode[]>(["uneasy"]);
  useEffect(() => window.localStorage.setItem(LIBRARY_STORAGE_KEY, JSON.stringify(customEntries)), [customEntries]);
  const entries = [...customEntries, ...defaultLibrary];
  const tags = ["すべて", ...Array.from(new Set(entries.map((entry) => entry.tag)))];
  const visible = entries
    .filter((entry) => filter === "すべて" || entry.tag === filter)
    .filter((entry) => modeFilter === "all" || (modeFilter === "favorite" ? entry.favorite : entry.modes?.includes(modeFilter)));

  function addEntry(event: FormEvent) {
    event.preventDefault();
    if (!title.trim() || !body.trim()) return;
    setCustomEntries((current) => [{ id: createId("book"), title: title.trim(), body: body.trim(), tag: tag.trim() || "自分用", modes: selectedModes, custom: true }, ...current]);
    setTitle("");
    setBody("");
    setSelectedModes(["uneasy"]);
  }

  function updateCustomEntry(id: string, patch: Partial<LibraryEntry>) {
    setCustomEntries((current) => current.map((entry) => (entry.id === id ? { ...entry, ...patch } : entry)));
  }

  function toggleSelectedMode(mode: LibraryMode) {
    setSelectedModes((current) => (current.includes(mode) ? current.filter((item) => item !== mode) : [...current, mode]));
  }

  return (
    <section className="panel">
      <div className="result-box">
        <strong>今の状態から探す</strong>
        <p>緊急、夜、朝、不安、疲れ。今の状態に近い入口から安心文を探せます。</p>
      </div>
      <form className="library-form" onSubmit={addEntry}>
        <label className="field">
          <span>タイトル</span>
          <input value={title} onChange={(event) => setTitle(event.target.value)} />
        </label>
        <label className="field">
          <span>タグ</span>
          <input value={tag} onChange={(event) => setTag(event.target.value)} />
        </label>
        <TextArea label="本文" value={body} onChange={setBody} />
        <fieldset className="branch-group">
          <legend>使う場面</legend>
          <div className="segmented wrap">
            {libraryModeOptions.map(([mode, label]) => (
              <button className={selectedModes.includes(mode) ? "active" : ""} key={mode} type="button" onClick={() => toggleSelectedMode(mode)}>
                {label}
              </button>
            ))}
          </div>
        </fieldset>
        <button className="primary-button full" type="submit">
          <Plus size={18} />
          追加
        </button>
      </form>
      <div className="segmented wrap" aria-label="今の状態から探す">
        <button className={modeFilter === "all" ? "active" : ""} type="button" onClick={() => setModeFilter("all")}>
          すべて
        </button>
        <button className={modeFilter === "favorite" ? "active" : ""} type="button" onClick={() => setModeFilter("favorite")}>
          お気に入り
        </button>
        {libraryModeOptions.map(([mode, label]) => (
          <button className={modeFilter === mode ? "active" : ""} key={mode} type="button" onClick={() => setModeFilter(mode)}>
            {label}
          </button>
        ))}
      </div>
      <div className="segmented wrap">
        {tags.map((item) => (
          <button key={item} className={filter === item ? "active" : ""} type="button" onClick={() => setFilter(item)}>
            {item}
          </button>
        ))}
      </div>
      <div className="library-grid">
        {visible.map((entry) => (
          <article className="library-card" key={entry.id}>
            <div className="library-card-head">
              <span>{entry.tag}</span>
              {entry.custom ? (
                <button className={entry.favorite ? "tiny active" : "tiny"} type="button" onClick={() => updateCustomEntry(entry.id, { favorite: !entry.favorite })} aria-label="お気に入り">
                  ★
                </button>
              ) : entry.favorite ? (
                <span className="favorite-mark">★</span>
              ) : null}
            </div>
            <strong>{entry.title}</strong>
            {entry.modes?.length ? (
              <div className="trigger-tags">
                {entry.modes.map((mode) => (
                  <span key={mode}>{libraryModeLabel[mode]}</span>
                ))}
              </div>
            ) : null}
            <p>{entry.body}</p>
            {entry.custom ? (
              <button className="text-button" type="button" onClick={() => setCustomEntries((current) => current.filter((item) => item.id !== entry.id))}>
                削除
              </button>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  );
}

function RouletteApp() {
  const [actions, setActions] = useState<RouletteAction[]>(readStorage<RouletteAction[]>(ROULETTE_ACTIONS_STORAGE_KEY, defaultRouletteActions));
  const [history, setHistory] = useState<RouletteHistory[]>(readStorage<RouletteHistory[]>(ROULETTE_HISTORY_STORAGE_KEY, []));
  const [current, setCurrent] = useState<RouletteAction | null>(null);
  const [newAction, setNewAction] = useState("");
  const [category, setCategory] = useState("回復");
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  useEffect(() => window.localStorage.setItem(ROULETTE_ACTIONS_STORAGE_KEY, JSON.stringify(actions)), [actions]);
  useEffect(() => window.localStorage.setItem(ROULETTE_HISTORY_STORAGE_KEY, JSON.stringify(history)), [history]);
  const pool = favoritesOnly ? actions.filter((item) => item.favorite) : actions;

  function draw() {
    if (pool.length === 0) return;
    const action = pool[Math.floor(Math.random() * pool.length)];
    setCurrent(action);
    setHistory((items) => [{ id: createId("roulette-history"), text: action.text, status: "drawn" as const, createdAt: new Date().toISOString() }, ...items].slice(0, 20));
  }

  return (
    <section className="panel two-column">
      <div className="stack">
        <div className="roulette-box">
          <Shuffle size={34} />
          <strong>{current ? current.text : "ボタンを押すと1つ選びます"}</strong>
          <small>{current?.category || "迷った時の小さな一手"}</small>
          <button className="primary-button full" type="button" onClick={draw}>
            <Shuffle size={18} />
            まわす
          </button>
        </div>
        <label className="check-card">
          <input type="checkbox" checked={favoritesOnly} onChange={(event) => setFavoritesOnly(event.target.checked)} />
          <span>お気に入りだけでまわす</span>
        </label>
        <form
          className="task-form compact"
          onSubmit={(event) => {
            event.preventDefault();
            if (!newAction.trim()) return;
            setActions((items) => [{ id: createId("roulette"), text: newAction.trim(), category, custom: true }, ...items]);
            setNewAction("");
          }}
        >
          <label className="field wide">
            <span>行動</span>
            <input value={newAction} onChange={(event) => setNewAction(event.target.value)} placeholder="例: 洗濯物を1つたたむ" />
          </label>
          <label className="field">
            <span>分類</span>
            <input value={category} onChange={(event) => setCategory(event.target.value)} />
          </label>
          <button className="primary-button" type="submit">
            <Plus size={18} />
            追加
          </button>
        </form>
      </div>
      <div className="stack">
        {actions.map((action) => (
          <article className="row" key={action.id}>
            <button className={action.favorite ? "tiny active" : "tiny"} type="button" onClick={() => setActions((items) => items.map((item) => (item.id === action.id ? { ...item, favorite: !item.favorite } : item)))}>
              ★
            </button>
            <p>
              {action.text}
              <small>{action.category}</small>
            </p>
            {action.custom ? (
              <button className="icon-button danger" type="button" onClick={() => setActions((items) => items.filter((item) => item.id !== action.id))}>
                <Trash2 size={16} />
              </button>
            ) : null}
          </article>
        ))}
        {history.length > 0 ? <div className="history-line">最新: {history[0].text} ({formatTime(history[0].createdAt)})</div> : null}
      </div>
    </section>
  );
}

function ShoppingListApp() {
  const [items, setItems] = useState<ShoppingItem[]>(loadShoppingItems);
  const [name, setName] = useState("");
  const [category, setCategory] = useState<CategoryId>("side");
  const [showTodayOnly, setShowTodayOnly] = useState(true);
  const [query, setQuery] = useState("");

  useEffect(() => window.localStorage.setItem(SHOPPING_STORAGE_KEY, JSON.stringify(items)), [items]);

  const visibleItems = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return items
      .filter((item) => (showTodayOnly ? item.today : true))
      .filter((item) => item.name.toLowerCase().includes(needle) || shoppingCategoryById[item.category].label.includes(needle))
      .sort((a, b) => {
        if (a.checked !== b.checked) return a.checked ? 1 : -1;
        if (a.checked && b.checked) return (b.checkedAt || 0) - (a.checkedAt || 0);
        return a.createdAt - b.createdAt;
      });
  }, [items, query, showTodayOnly]);

  const activeItems = visibleItems.filter((item) => !item.checked);
  const checkedItems = visibleItems.filter((item) => item.checked);
  const activeCount = activeItems.length;
  const checkedCount = checkedItems.length;

  function addItem(event?: FormEvent) {
    event?.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    setItems((current) => [createShoppingItem(trimmed, category), ...current]);
    setName("");
  }

  function updateItem(id: string, patch: Partial<ShoppingItem>) {
    setItems((current) => current.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  }

  function toggleItem(id: string) {
    setItems((current) => current.map((item) => (item.id === id ? { ...item, checked: !item.checked, checkedAt: item.checked ? undefined : Date.now() } : item)));
  }

  function renderShoppingItem(item: ShoppingItem) {
    return (
      <article className={item.checked ? "shopping-item checked" : "shopping-item"} key={item.id}>
        <button className="check-circle" type="button" onClick={() => toggleItem(item.id)} aria-label={`${item.name}を切り替え`}>
          {item.checked ? <Check size={18} /> : null}
        </button>
        <div className="item-name-cell">
          <input value={item.name} onChange={(event) => updateItem(item.id, { name: event.target.value })} aria-label="品名" />
          {item.checked ? <small>{shoppingCategoryById[item.category].label}</small> : null}
        </div>
        <button type="button" className={item.today ? "today-toggle active" : "today-toggle"} onClick={() => updateItem(item.id, { today: !item.today })}>
          今日
        </button>
        <button className="delete-button" type="button" onClick={() => setItems((current) => current.filter((currentItem) => currentItem.id !== item.id))} aria-label={`${item.name}を削除`}>
          <Trash2 size={17} />
        </button>
      </article>
    );
  }

  return (
    <section className="shopping-panel">
      <section className="status-row" aria-label="買い物の進み具合">
        <div>
          <span>残り</span>
          <strong>{activeCount}</strong>
        </div>
        <div>
          <span>済み</span>
          <strong>{checkedCount}</strong>
        </div>
        <button type="button" onClick={() => setShowTodayOnly((current) => !current)} className={showTodayOnly ? "pill active" : "pill"}>
          今日だけ
        </button>
      </section>

      <form className="add-form" onSubmit={addItem}>
        <label className="input-wrap">
          <PackagePlus size={18} />
          <input value={name} onChange={(event) => setName(event.target.value)} placeholder="買うものを追加" />
        </label>
        <button className="add-button" type="submit" aria-label="追加">
          <Plus size={22} />
        </button>
      </form>

      <section className="category-picker" aria-label="カテゴリ選択">
        {shoppingCategories.map((item) => {
          const Icon = item.icon;
          return (
            <button key={item.id} type="button" className={category === item.id ? "category-chip selected" : "category-chip"} style={{ "--chip-color": item.color } as CSSProperties} onClick={() => setCategory(item.id)}>
              <Icon size={16} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </section>

      <section className="quick-add" aria-label="よく買うもの">
        <div className="section-title">
          <Sparkles size={16} />
          <h2>よく買うもの</h2>
        </div>
        <div className="quick-grid">
          {frequentItems.map((item) => (
            <button key={`${item.category}-${item.name}`} type="button" onClick={() => setItems((current) => [createShoppingItem(item.name, item.category), ...current])}>
              <span>{item.name}</span>
              <small>{shoppingCategoryById[item.category].label}</small>
            </button>
          ))}
        </div>
      </section>

      <div className="search-row">
        <Search size={17} />
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="リスト内を検索" />
      </div>

      <section className="shopping-list" aria-label="買うもの一覧">
        {visibleItems.length === 0 ? (
          <div className="empty">
            <Coffee size={28} />
            <p>今の条件では表示するものがありません。</p>
          </div>
        ) : (
          <>
            {shoppingCategories.map((group) => {
              const groupItems = activeItems.filter((item) => item.category === group.id);
              if (groupItems.length === 0) return null;
              const Icon = group.icon;
              return (
                <div className="category-section" key={group.id}>
                  <div className="category-heading" style={{ "--heading-color": group.color } as CSSProperties}>
                    <Icon size={17} />
                    <h2>{group.label}</h2>
                  </div>
                  <div className="item-stack">{groupItems.map(renderShoppingItem)}</div>
                </div>
              );
            })}
            {checkedItems.length > 0 ? (
              <div className="category-section checked-section">
                <div className="category-heading" style={{ "--heading-color": "#6b776f" } as CSSProperties}>
                  <Check size={17} />
                  <h2>チェック済み</h2>
                </div>
                <div className="item-stack">{checkedItems.map(renderShoppingItem)}</div>
              </div>
            ) : null}
          </>
        )}
      </section>

      {items.some((item) => item.checked) ? (
        <button className="clear-button" type="button" onClick={() => setItems((current) => current.filter((item) => !item.checked))}>
          チェック済みを片付ける
        </button>
      ) : null}
    </section>
  );
}

function MediaLogApp() {
  const [activeTab, setActiveTab] = useState<"books" | "movies">("books");
  const [readingLogs, setReadingLogs] = useState<ReadingLog[]>(() => readStorage<ReadingLog[]>(READING_LOG_STORAGE_KEY, []));
  const [movieLogs, setMovieLogs] = useState<MovieLog[]>(() => readStorage<MovieLog[]>(MOVIE_LOG_STORAGE_KEY, []));
  const [simpleLogs, setSimpleLogs] = useState<SimpleMediaLog[]>(() => readStorage<SimpleMediaLog[]>(SIMPLE_MEDIA_LOG_STORAGE_KEY, []));
  const [bookTitle, setBookTitle] = useState("");
  const [bookAuthor, setBookAuthor] = useState("");
  const [bookStatus, setBookStatus] = useState<BookStatus>("want");
  const [bookMemo, setBookMemo] = useState("");
  const [bookDate, setBookDate] = useState(today);
  const [movieTitle, setMovieTitle] = useState("");
  const [movieDate, setMovieDate] = useState(today);
  const [movieMood, setMovieMood] = useState("");
  const [movieMemo, setMovieMemo] = useState("");
  const [rewatchScore, setRewatchScore] = useState(3);
  const [simpleTitle, setSimpleTitle] = useState("");
  const [simpleKind, setSimpleKind] = useState<SimpleMediaKind>("book");
  const [simpleMemo, setSimpleMemo] = useState("");
  const [simpleDate, setSimpleDate] = useState(today);

  useEffect(() => window.localStorage.setItem(READING_LOG_STORAGE_KEY, JSON.stringify(readingLogs)), [readingLogs]);
  useEffect(() => window.localStorage.setItem(MOVIE_LOG_STORAGE_KEY, JSON.stringify(movieLogs)), [movieLogs]);
  useEffect(() => window.localStorage.setItem(SIMPLE_MEDIA_LOG_STORAGE_KEY, JSON.stringify(simpleLogs)), [simpleLogs]);

  const bookStats = {
    want: readingLogs.filter((item) => item.status === "want").length,
    reading: readingLogs.filter((item) => item.status === "reading").length,
    finished: readingLogs.filter((item) => item.status === "finished").length,
  };

  const sortedBooks = [...readingLogs].sort((a, b) => b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt));
  const sortedMovies = [...movieLogs].sort((a, b) => b.watchedDate.localeCompare(a.watchedDate) || b.createdAt.localeCompare(a.createdAt));
  const sortedSimpleLogs = [...simpleLogs].sort((a, b) => b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt));

  function addSimpleLog(event: FormEvent) {
    event.preventDefault();
    if (!simpleTitle.trim()) return;
    setSimpleLogs((current) => [
      {
        id: createId("simple-media"),
        title: simpleTitle.trim(),
        kind: simpleKind,
        memo: simpleMemo.trim(),
        date: simpleDate || today,
        createdAt: new Date().toISOString(),
      },
      ...current,
    ]);
    setSimpleTitle("");
    setSimpleKind("book");
    setSimpleMemo("");
    setSimpleDate(today);
  }

  function addBook(event: FormEvent) {
    event.preventDefault();
    if (!bookTitle.trim()) return;
    setReadingLogs((current) => [
      {
        id: createId("reading"),
        title: bookTitle.trim(),
        author: bookAuthor.trim(),
        status: bookStatus,
        memo: bookMemo.trim(),
        date: bookDate || today,
        createdAt: new Date().toISOString(),
      },
      ...current,
    ]);
    setBookTitle("");
    setBookAuthor("");
    setBookStatus("want");
    setBookMemo("");
    setBookDate(today);
  }

  function addMovie(event: FormEvent) {
    event.preventDefault();
    if (!movieTitle.trim()) return;
    setMovieLogs((current) => [
      {
        id: createId("movie"),
        title: movieTitle.trim(),
        watchedDate: movieDate || today,
        mood: movieMood.trim(),
        memo: movieMemo.trim(),
        rewatchScore,
        createdAt: new Date().toISOString(),
      },
      ...current,
    ]);
    setMovieTitle("");
    setMovieDate(today);
    setMovieMood("");
    setMovieMemo("");
    setRewatchScore(3);
  }

  function updateBook(id: string, patch: Partial<ReadingLog>) {
    setReadingLogs((current) => current.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  }

  function updateMovie(id: string, patch: Partial<MovieLog>) {
    setMovieLogs((current) => current.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  }

  return (
    <section className="media-log">
      <section className="media-hero">
        <div>
          <p className="eyebrow">Books & movies</p>
          <h2>読んだ気持ち、観た余韻を残す</h2>
        </div>
        <div className="media-counts" aria-label="記録数">
          <span>本 {readingLogs.length}</span>
          <span>映画 {movieLogs.length}</span>
        </div>
      </section>

      <section className="simple-media-panel" aria-label="簡易ログ">
        <div className="section-title">
          <NotebookPen size={16} />
          <h2>簡易ログ</h2>
        </div>
        <form className="simple-media-form" onSubmit={addSimpleLog}>
          <label className="field">
            <span>タイトル</span>
            <input value={simpleTitle} onChange={(event) => setSimpleTitle(event.target.value)} placeholder="タイトル" />
          </label>
          <label className="field">
            <span>種類</span>
            <select value={simpleKind} onChange={(event) => setSimpleKind(event.target.value as SimpleMediaKind)}>
              <option value="book">本</option>
              <option value="movie">映画</option>
            </select>
          </label>
          <label className="field">
            <span>日付</span>
            <input type="date" value={simpleDate} onChange={(event) => setSimpleDate(event.target.value)} />
          </label>
          <label className="field simple-media-wide">
            <span>感想</span>
            <textarea value={simpleMemo} onChange={(event) => setSimpleMemo(event.target.value)} placeholder="短くメモするだけでOK" />
          </label>
          <button className="primary-button full simple-media-wide" type="submit">
            <Plus size={18} />
            簡易ログを追加
          </button>
        </form>

        <div className="simple-media-list">
          {sortedSimpleLogs.length === 0 ? (
            <Empty text="簡易ログはまだありません。" />
          ) : (
            sortedSimpleLogs.map((item) => (
              <article className="simple-media-card" key={item.id}>
                <div className="simple-media-head">
                  <span className={item.kind === "book" ? "media-kind book" : "media-kind movie"}>{item.kind === "book" ? "本" : "映画"}</span>
                  <div>
                    <strong>{item.title}</strong>
                    <small>{item.date ? formatDate(item.date) : "日付未入力"}</small>
                  </div>
                  <button className="icon-button danger" type="button" onClick={() => setSimpleLogs((current) => current.filter((log) => log.id !== item.id))} aria-label="削除">
                    <Trash2 size={16} />
                  </button>
                </div>
                {item.memo ? <p>{item.memo}</p> : null}
              </article>
            ))
          )}
        </div>
      </section>

      <div className="segmented media-tabs" aria-label="ログ切り替え">
        <button className={activeTab === "books" ? "active" : ""} type="button" onClick={() => setActiveTab("books")}>
          読書ログ
        </button>
        <button className={activeTab === "movies" ? "active" : ""} type="button" onClick={() => setActiveTab("movies")}>
          映画ログ
        </button>
      </div>

      {activeTab === "books" ? (
        <>
          <section className="media-stats">
            <Stat label="読みたい" value={`${bookStats.want}冊`} />
            <Stat label="読んでる" value={`${bookStats.reading}冊`} />
            <Stat label="読了" value={`${bookStats.finished}冊`} />
          </section>

          <form className="media-form" onSubmit={addBook}>
            <label className="field">
              <span>タイトル</span>
              <input value={bookTitle} onChange={(event) => setBookTitle(event.target.value)} placeholder="本のタイトル" />
            </label>
            <label className="field">
              <span>作者</span>
              <input value={bookAuthor} onChange={(event) => setBookAuthor(event.target.value)} placeholder="作者名" />
            </label>
            <label className="field">
              <span>状態</span>
              <select value={bookStatus} onChange={(event) => setBookStatus(event.target.value as BookStatus)}>
                <option value="want">読みたい</option>
                <option value="reading">読んでる</option>
                <option value="finished">読了</option>
              </select>
            </label>
            <label className="field">
              <span>日付</span>
              <input type="date" value={bookDate} onChange={(event) => setBookDate(event.target.value)} />
            </label>
            <label className="field media-wide">
              <span>感想メモ</span>
              <textarea value={bookMemo} onChange={(event) => setBookMemo(event.target.value)} placeholder="印象に残った言葉、読みたい理由、読後感など" />
            </label>
            <button className="primary-button full media-wide" type="submit">
              <Plus size={18} />
              読書ログを追加
            </button>
          </form>

          <section className="media-list" aria-label="読書ログ一覧">
            {sortedBooks.length === 0 ? (
              <Empty text="読書ログはまだありません。" />
            ) : (
              sortedBooks.map((item) => (
                <article className="media-card book-card" key={item.id}>
                  <div className="media-card-head">
                    <BookOpen size={19} />
                    <div>
                      <input value={item.title} onChange={(event) => updateBook(item.id, { title: event.target.value })} aria-label="タイトル" />
                      <small>{item.author || "作者未入力"}</small>
                    </div>
                    <button className="icon-button danger" type="button" onClick={() => setReadingLogs((current) => current.filter((log) => log.id !== item.id))} aria-label="削除">
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="media-card-grid">
                    <label>
                      <span>状態</span>
                      <select value={item.status} onChange={(event) => updateBook(item.id, { status: event.target.value as BookStatus })}>
                        <option value="want">読みたい</option>
                        <option value="reading">読んでる</option>
                        <option value="finished">読了</option>
                      </select>
                    </label>
                    <label>
                      <span>日付</span>
                      <input type="date" value={item.date} onChange={(event) => updateBook(item.id, { date: event.target.value })} />
                    </label>
                  </div>
                  <textarea value={item.memo} onChange={(event) => updateBook(item.id, { memo: event.target.value })} placeholder="感想メモ" />
                </article>
              ))
            )}
          </section>
        </>
      ) : (
        <>
          <form className="media-form" onSubmit={addMovie}>
            <label className="field">
              <span>タイトル</span>
              <input value={movieTitle} onChange={(event) => setMovieTitle(event.target.value)} placeholder="映画のタイトル" />
            </label>
            <label className="field">
              <span>視聴日</span>
              <input type="date" value={movieDate} onChange={(event) => setMovieDate(event.target.value)} />
            </label>
            <label className="field">
              <span>気分</span>
              <input value={movieMood} onChange={(event) => setMovieMood(event.target.value)} placeholder="例: しみじみ、元気、重め" />
            </label>
            <label className="field">
              <span>もう一度観たい度</span>
              <input type="range" min="1" max="5" value={rewatchScore} onChange={(event) => setRewatchScore(Number(event.target.value))} />
            </label>
            <div className="rewatch-preview media-wide" aria-label="もう一度観たい度">
              {Array.from({ length: 5 }, (_, index) => (
                <Star key={index} size={20} fill={index < rewatchScore ? "currentColor" : "none"} />
              ))}
              <strong>{rewatchScore}/5</strong>
            </div>
            <label className="field media-wide">
              <span>感想メモ</span>
              <textarea value={movieMemo} onChange={(event) => setMovieMemo(event.target.value)} placeholder="好きだった場面、今の気分との相性、誰かに勧めたい理由など" />
            </label>
            <button className="primary-button full media-wide" type="submit">
              <Plus size={18} />
              映画ログを追加
            </button>
          </form>

          <section className="media-list" aria-label="映画ログ一覧">
            {sortedMovies.length === 0 ? (
              <Empty text="映画ログはまだありません。" />
            ) : (
              sortedMovies.map((item) => (
                <article className="media-card movie-card" key={item.id}>
                  <div className="media-card-head">
                    <Film size={19} />
                    <div>
                      <input value={item.title} onChange={(event) => updateMovie(item.id, { title: event.target.value })} aria-label="タイトル" />
                      <small>{item.watchedDate ? formatDate(item.watchedDate) : "視聴日未入力"}</small>
                    </div>
                    <button className="icon-button danger" type="button" onClick={() => setMovieLogs((current) => current.filter((log) => log.id !== item.id))} aria-label="削除">
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="media-card-grid">
                    <label>
                      <span>視聴日</span>
                      <input type="date" value={item.watchedDate} onChange={(event) => updateMovie(item.id, { watchedDate: event.target.value })} />
                    </label>
                    <label>
                      <span>気分</span>
                      <input value={item.mood} onChange={(event) => updateMovie(item.id, { mood: event.target.value })} placeholder="気分" />
                    </label>
                  </div>
                  <div className="rewatch-preview">
                    {Array.from({ length: 5 }, (_, index) => (
                      <Star key={index} size={18} fill={index < item.rewatchScore ? "currentColor" : "none"} />
                    ))}
                    <input type="range" min="1" max="5" value={item.rewatchScore} onChange={(event) => updateMovie(item.id, { rewatchScore: Number(event.target.value) })} aria-label="もう一度観たい度" />
                  </div>
                  <textarea value={item.memo} onChange={(event) => updateMovie(item.id, { memo: event.target.value })} placeholder="感想メモ" />
                </article>
              ))
            )}
          </section>
        </>
      )}
    </section>
  );
}

function VisitMemoApp() {
  const [memo, setMemo] = useState<VisitMemo>(loadVisitMemo);
  const [showOutput, setShowOutput] = useState(false);
  const [isEditing, setIsEditing] = useState(() => !hasVisitMemoContent(loadVisitMemo()));
  const [saveStatus, setSaveStatus] = useState("");
  const [copyStatus, setCopyStatus] = useState("");
  const [copiedSnapshot, setCopiedSnapshot] = useState("");

  useEffect(() => window.localStorage.setItem(VISIT_MEMO_STORAGE_KEY, JSON.stringify(memo)), [memo]);

  const output = useMemo(() => buildVisitMemoText(memo), [memo]);

  function addDay() {
    const lastDate = memo.days[memo.days.length - 1]?.date;
    const nextDate = lastDate ? addDays(lastDate, 1) : today;
    setMemo((current) => ({ ...current, days: [...current.days, createVisitMemoDay(nextDate)] }));
  }

  function updateDay(id: string, patch: Partial<VisitMemoDay>) {
    setMemo((current) => ({
      ...current,
      days: current.days.map((day) => (day.id === id ? { ...day, ...patch } : day)),
    }));
  }

  function removeDay(id: string) {
    if (!window.confirm("この日付の記録を削除しますか？")) return;
    setMemo((current) => {
      const days = current.days.filter((day) => day.id !== id);
      return { ...current, days: days.length > 0 ? days : [createVisitMemoDay()] };
    });
  }

  function clearSummaryField(key: VisitMemoSummaryKey) {
    setMemo((current) => ({ ...current, [key]: "" }));
  }

  function clearAllMemo() {
    if (!window.confirm("すべて削除しますか？")) return;
    setMemo(createEmptyVisitMemo());
    setIsEditing(true);
    setSaveStatus("");
    setCopiedSnapshot("");
    setCopyStatus("");
  }

  function saveMemo() {
    window.localStorage.setItem(VISIT_MEMO_STORAGE_KEY, JSON.stringify(memo));
    setIsEditing(false);
    setSaveStatus("保存しました");
    window.setTimeout(() => setSaveStatus(""), 1800);
  }

  function deleteCopiedMemo() {
    if (!window.confirm("コピー済みの記録を削除しますか？")) return;
    setMemo(createEmptyVisitMemo());
    setCopiedSnapshot("");
    setCopyStatus("コピー済みの記録を削除しました");
    window.setTimeout(() => setCopyStatus(""), 1800);
  }

  async function copyOutput() {
    try {
      await navigator.clipboard.writeText(output);
      setCopyStatus("コピーしました！");
      setCopiedSnapshot(output);
    } catch {
      setCopyStatus("コピーできませんでした");
    }
    window.setTimeout(() => setCopyStatus(""), 1800);
  }

  return (
    <section className="visit-memo">
      <div className="memo-actions">
        <button className="primary-button" type="button" onClick={addDay} disabled={!isEditing}>
          <Plus size={18} />
          日付を追加
        </button>
        <button className="text-button neutral" type="button" onClick={() => setShowOutput((current) => !current)}>
          <ClipboardCheck size={17} />
          コピー用テキストを見る
        </button>
        <button className="primary-button" type="button" onClick={copyOutput}>
          <Clipboard size={17} />
          コピーする
        </button>
        <button className="primary-button save-button" type="button" onClick={saveMemo}>
          <Save size={17} />
          保存
        </button>
        <button className="text-button neutral edit-button" type="button" onClick={() => setIsEditing((current) => !current)}>
          <Pencil size={17} />
          {isEditing ? "編集中" : "編集"}
        </button>
        <button className="text-button danger-soft" type="button" onClick={clearAllMemo}>
          <Trash2 size={17} />
          すべて削除
        </button>
      </div>
      <p className="save-status">{saveStatus || (isEditing ? "編集できます。終わったら保存してください。" : "編集ボタンで内容を直せます。")}</p>

      <section className="memo-days" aria-label="日付ごとの記録">
        {memo.days.map((day, index) => (
          <article className="memo-day-card" key={day.id}>
            <div className="memo-day-head">
              <h2>{index + 1}日目</h2>
              <button className="text-button danger-soft compact" type="button" onClick={() => removeDay(day.id)} disabled={!isEditing}>
                <Trash2 size={16} />
                削除
              </button>
            </div>
            <div className="memo-grid">
              <label className="field">
                <span>日付</span>
                <input type="date" value={day.date} onChange={(event) => updateDay(day.id, { date: event.target.value })} disabled={!isEditing} />
              </label>
              <label className="field">
                <span>睡眠時間</span>
                <input value={day.sleepHours} onChange={(event) => updateDay(day.id, { sleepHours: event.target.value })} placeholder="5時間" disabled={!isEditing} />
              </label>
              <label className="field">
                <span>お通じ</span>
                <select value={day.bowel} onChange={(event) => updateDay(day.id, { bowel: event.target.value as VisitMemoDay["bowel"] })} disabled={!isEditing}>
                  <option value="">未入力</option>
                  <option value="yes">◯</option>
                  <option value="no">×</option>
                </select>
              </label>
              <label className="field">
                <span>朝食</span>
                <input value={day.breakfast} onChange={(event) => updateDay(day.id, { breakfast: event.target.value })} placeholder="フルグラ" disabled={!isEditing} />
              </label>
              <label className="field">
                <span>昼食</span>
                <input value={day.lunch} onChange={(event) => updateDay(day.id, { lunch: event.target.value })} placeholder="焼きそば" disabled={!isEditing} />
              </label>
              <label className="field">
                <span>夕食</span>
                <input value={day.dinner} onChange={(event) => updateDay(day.id, { dinner: event.target.value })} placeholder="海鮮丼" disabled={!isEditing} />
              </label>
              <label className="field">
                <span>間食</span>
                <input value={day.snack} onChange={(event) => updateDay(day.id, { snack: event.target.value })} placeholder="フルグラ少し" disabled={!isEditing} />
              </label>
              <label className="field">
                <span>頓服回数</span>
                <input inputMode="numeric" value={day.medicineCount} onChange={(event) => updateDay(day.id, { medicineCount: event.target.value })} placeholder="0" disabled={!isEditing} />
              </label>
            </div>
          </article>
        ))}
      </section>

      <section className="memo-summary panel">
        <SummaryTextArea label="その他" value={memo.other} onChange={(other) => setMemo((current) => ({ ...current, other }))} onClear={() => clearSummaryField("other")} disabled={!isEditing} />
        <SummaryTextArea label="できたこと、やれたこと、頑張れたこと" value={memo.achieved} onChange={(achieved) => setMemo((current) => ({ ...current, achieved }))} onClear={() => clearSummaryField("achieved")} disabled={!isEditing} />
        <SummaryTextArea label="嬉しかったこと、嬉しい" value={memo.happy} onChange={(happy) => setMemo((current) => ({ ...current, happy }))} onClear={() => clearSummaryField("happy")} disabled={!isEditing} />
        <SummaryTextArea label="これだけは忘れずに話したいこと" value={memo.mustTalk} onChange={(mustTalk) => setMemo((current) => ({ ...current, mustTalk }))} onClear={() => clearSummaryField("mustTalk")} disabled={!isEditing} />
        <SummaryTextArea label="雑談メモ" value={memo.chat} onChange={(chat) => setMemo((current) => ({ ...current, chat }))} onClear={() => clearSummaryField("chat")} disabled={!isEditing} />
      </section>

      {showOutput ? (
        <section className="copy-panel">
          <div className="copy-head">
            <h2>コピー用テキスト</h2>
            <button className="primary-button" type="button" onClick={copyOutput}>
              <Clipboard size={17} />
              コピーする
            </button>
          </div>
          <pre>{output}</pre>
          <button className="primary-button copy-main-button" type="button" onClick={copyOutput}>
            <Clipboard size={18} />
            コピーする
          </button>
          {copiedSnapshot === output && output ? (
            <button className="text-button danger-soft copy-main-button" type="button" onClick={deleteCopiedMemo}>
              <Trash2 size={18} />
              コピー済みとして削除する
            </button>
          ) : null}
          {copyStatus ? <p className="copy-status">{copyStatus}</p> : null}
        </section>
      ) : null}
    </section>
  );
}

function statusRank(status: TaskStatus) {
  return { doing: 0, todo: 1, done: 2 }[status];
}

function getStateResult(state: BranchState) {
  if (state.energy === "low" || state.need === "rest") return { title: "回復を先にする", body: "今日は増やさない日。水分、横になる、通知を減らす、どれか1つで十分です。", action: "おすすめ: 回復ログを書くか、予定を1つ減らす" };
  if (state.mind === "overloaded") return { title: "刺激を下げる", body: "画面、音、会話量を少し減らして、次の予定を1つだけ残すのがよさそうです。", action: "おすすめ: 10分だけ通知を切る" };
  if (state.need === "connect") return { title: "短くつながる", body: "長文ではなく、スタンプや一言だけで外との接点を作るのが合っています。", action: "おすすめ: 送る相手を1人だけ選ぶ" };
  return { title: "小さく進める", body: "今は軽い行動が合いそうです。5分で終わるものを1つだけ選びましょう。", action: "おすすめ: タスク管理から1つ進行中にする" };
}

function addDays(date: string, days: number) {
  const value = new Date(`${date}T00:00:00`);
  value.setDate(value.getDate() + days);
  return toDateInputValue(value);
}

function formatMemoDate(date: string) {
  if (!date) return "";
  const value = new Date(`${date}T00:00:00`);
  if (Number.isNaN(value.getTime())) return date;
  return `${value.getMonth() + 1}/${value.getDate()}`;
}

function bulletLines(value: string) {
  return value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => `* ${line}`);
}

function appendBulletSection(lines: string[], title: string, value: string) {
  const bullets = bulletLines(value);
  if (bullets.length === 0) return;
  lines.push("", title, "", ...bullets);
}

function buildVisitMemoText(memo: VisitMemo) {
  const lines: string[] = [];

  memo.days.forEach((day, index) => {
    if (index > 0) lines.push("");
    const bowelMark = day.bowel === "yes" ? "◯" : day.bowel === "no" ? "×" : "";
    lines.push(`${formatMemoDate(day.date)}睡眠時間${day.sleepHours}${bowelMark}`);
    if (day.breakfast.trim()) lines.push(`朝、${day.breakfast.trim()}`);
    if (day.lunch.trim()) lines.push(`昼、${day.lunch.trim()}`);
    if (day.dinner.trim()) lines.push(`夜、${day.dinner.trim()}`);
    if (day.snack.trim()) lines.push(`間食、${day.snack.trim()}`);
    lines.push(`頓服${day.medicineCount.trim()}回`);
  });

  appendBulletSection(lines, "その他", memo.other);
  appendBulletSection(lines, "できたこと、やれたこと、頑張れたこと", memo.achieved);
  appendBulletSection(lines, "嬉しかったこと、嬉しい", memo.happy);
  appendBulletSection(lines, "これだけは忘れずに話したいこと", memo.mustTalk);
  appendBulletSection(lines, "※雑談", memo.chat);

  return lines.join("\n").trim();
}

function SummaryTextArea({ label, value, onChange, onClear, disabled }: { label: string; value: string; onChange: (value: string) => void; onClear: () => void; disabled?: boolean }) {
  return (
    <div className="summary-field">
      <div className="summary-field-head">
        <span>{label}</span>
        <button className="text-button danger-soft compact" type="button" onClick={onClear} disabled={disabled || !value.trim()}>
          <Trash2 size={15} />
          空にする
        </button>
      </div>
      <textarea value={value} onChange={(event) => onChange(event.target.value)} disabled={disabled} />
    </div>
  );
}

function TextArea({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="field">
      <span>{label}</span>
      <textarea value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

function BranchGroup<T extends string>({ label, value, options, onChange }: { label: string; value: T; options: Array<[T, string]>; onChange: (value: T) => void }) {
  return (
    <fieldset className="branch-group">
      <legend>{label}</legend>
      <div className="choice-grid">
        {options.map(([optionValue, labelText]) => (
          <button className={value === optionValue ? "selected" : ""} key={optionValue} type="button" onClick={() => onChange(optionValue)}>
            {labelText}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function LogCard({ log, onDelete }: { log: RecoveryLog; onDelete: () => void }) {
  return (
    <article className="log-card">
      <div className="log-head">
        <strong>
          {formatDate(log.date)} / {moodLabel[log.status]}
        </strong>
        <button className="icon-button danger" type="button" onClick={onDelete}>
          <Trash2 size={16} />
        </button>
      </div>
      {[log.bodyNote, log.feelingNote, log.doneOneThing, log.recoveryTrigger, log.todayWord].filter(Boolean).map((text, index) => (
        <p key={index}>{text}</p>
      ))}
    </article>
  );
}

function Empty({ text }: { text: string }) {
  return <p className="empty-state">{text}</p>;
}
