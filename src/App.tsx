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
  Gamepad2,
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
  Sparkles,
  Star,
  Trash2,
  Tv,
  Wheat,
} from "lucide-react";
import { CSSProperties, FormEvent, useEffect, useMemo, useState } from "react";

type View = "home" | "tasks" | "recovery" | "triggerDb" | "sakuraSleep" | "cycleLog" | "signs" | "library" | "shopping" | "visitMemo" | "mediaLog" | "gameLog";
type TaskStatus = "todo" | "doing" | "done";
type TaskPriority = "low" | "medium" | "high";
type MoodStatus = "stable" | "uneasy" | "tired" | "slipping" | "recovering";
type NightState = "calm" | "okay" | "hard" | "recovered";
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
type CyclePmsLevel = "none" | "little" | "strong" | "unknown";
type CycleEmotion = "anxiety" | "irritation" | "tearful" | "rushed" | "racingThoughts" | "foggy";
type CycleSymptom = "cramps" | "headache" | "sleepy" | "fatigue" | "nausea" | "backPain" | "appetite";
type CycleActivityImpact = "noteEasy" | "noteHard" | "outingEasy" | "outingHard" | "aiWork" | "passiveOk" | "restFirst";
type PillStatus = "taken" | "notYet" | "missed";
type PillBodyNote = "nausea" | "headache" | "sleepy" | "moodChange" | "spotting";
type PmddLevel = "none" | "light" | "medium" | "strong";
type YesNoStatus = "no" | "yes";
type GameFatigue = "none" | "little" | "strong";
type GameSleepiness = "none" | "little" | "strong";
type GameAfterEffect = "slept" | "worked" | "spacedOut" | "recovered";

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
  todayWord: string;
  currentMood: string;
  nightState: NightState;
  almostCollapsedScene: string;
  helpfulThing: string;
  returnedThing: string;
  createdAt: string;
  status?: MoodStatus;
  bodyNote?: string;
  feelingNote?: string;
  doneOneThing?: string;
  recoveryTrigger?: string;
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

type CycleBodyLog = {
  id: string;
  startDate: string;
  endDate: string;
  cycleMemo: string;
  pmsLevel: CyclePmsLevel;
  emotions: CycleEmotion[];
  symptoms: CycleSymptom[];
  activityImpacts: CycleActivityImpact[];
  pillSheetStartDate?: string;
  pillStartConditionMemo?: string;
  pillStatus?: PillStatus;
  pillTakenTime?: string;
  pillNumber?: string;
  pillMissedMemo?: string;
  pillBodyNotes?: PillBodyNote[];
  pmddLevel?: PmddLevel;
  asNeededMedicine?: YesNoStatus;
  pillFlashback?: YesNoStatus;
  signRelationMemo: string;
  shortMemo: string;
  createdAt: string;
};

type SignCheck = { id: string; date: string; checked: SignId[]; note: string; createdAt: string };
type LibraryMode = "emergency" | "night" | "morning" | "uneasy" | "tired";
type LibraryEntry = { id: string; title: string; body: string; tag: string; favorite?: boolean; modes?: LibraryMode[]; custom?: boolean };

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

type DramaStatus = "watching" | "paused" | "finished";

type DramaLog = {
  id: string;
  title: string;
  season: string;
  currentEpisode: string;
  totalEpisodes: string;
  service: string;
  status: DramaStatus;
  memo: string;
  updatedDate: string;
  createdAt: string;
};

type SimpleMediaKind = "book" | "manga" | "movie" | "drama";

type SimpleMediaLog = {
  id: string;
  title: string;
  kind: SimpleMediaKind;
  memo: string;
  date: string;
  createdAt: string;
};

type GameLog = {
  id: string;
  gameName: string;
  date: string;
  startTime: string;
  endTime: string;
  playMinutes: number;
  fatigue: GameFatigue;
  sleepiness: GameSleepiness;
  focus: number;
  fun: number;
  afterEffect: GameAfterEffect;
  memo: string;
  createdAt: string;
};

const TASK_STORAGE_KEY = "notion-simple-task-manager-v2";
const LEGACY_TASK_STORAGE_KEY = "notion-simple-task-manager";
const RECOVERY_STORAGE_KEY = "notion-recovery-log-v1";
const RECOVERY_TRIGGER_STORAGE_KEY = "recovery-trigger-db-v1";
const SAKURA_SLEEP_STORAGE_KEY = "sakura-sleep-log-v1";
const CYCLE_BODY_LOG_STORAGE_KEY = "cycle-body-log-v1";
const SIGNS_STORAGE_KEY = "early-sign-checks-v1";
const LIBRARY_STORAGE_KEY = "comfort-library-custom-v1";
const SHOPPING_STORAGE_KEY = "shopping-list-mobile-v1";
const VISIT_MEMO_STORAGE_KEY = "visit-nursing-medical-memo-v1";
const READING_LOG_STORAGE_KEY = "reading-log-mobile-v1";
const MANGA_LOG_STORAGE_KEY = "manga-log-mobile-v1";
const MOVIE_LOG_STORAGE_KEY = "movie-log-mobile-v1";
const DRAMA_LOG_STORAGE_KEY = "drama-log-mobile-v1";
const SIMPLE_MEDIA_LOG_STORAGE_KEY = "simple-media-log-mobile-v1";
const GAME_LOG_STORAGE_KEY = "game-log-mobile-v1";

const today = toDateInputValue(new Date());

const menuItems: Array<{ view: Exclude<View, "home">; title: string; description: string; icon: typeof Home }> = [
  { view: "tasks", title: "タスク管理", description: "やること、期限、優先度を整理", icon: ListChecks },
  { view: "visitMemo", title: "訪看・診察メモ", description: "毎日の記録をコピー用に整える", icon: NotebookPen },
  { view: "shopping", title: "買い物リスト", description: "買い忘れを減らす片手用リスト", icon: ShoppingBasket },
  { view: "mediaLog", title: "読書・漫画・映画・ドラマログ", description: "本、漫画、映画、ドラマの進み具合と感想を残す", icon: Film },
  { view: "gameLog", title: "ゲームログ", description: "疲労、眠気、集中、回復への影響を観察する", icon: Gamepad2 },
  { view: "sakuraSleep", title: "睡眠ログ さくら版", description: "寝方、場所、起床感、安心感を残す", icon: Moon },
  { view: "cycleLog", title: "周期・体調ログ", description: "PMS/生理と回復、睡眠、感情、活動量のつながりを見る", icon: CalendarDays },
  { view: "recovery", title: "回復ログ", description: "体調と気持ちを短く記録", icon: HeartPulse },
  { view: "triggerDb", title: "回復トリガーDB", description: "効いた回復策の条件をためる", icon: Clipboard },
  { view: "signs", title: "崩れ始めサイン チェックUI", description: "早めのサインを拾って守りを固める", icon: ClipboardCheck },
  { view: "library", title: "安心文庫ビューア", description: "安心文をタグで保存して読み返す", icon: BookOpen },
];

const moodOptions: Array<{ value: MoodStatus; label: string }> = [
  { value: "stable", label: "安定" },
  { value: "uneasy", label: "やや不安" },
  { value: "tired", label: "疲れている" },
  { value: "slipping", label: "崩れ始め" },
  { value: "recovering", label: "回復中" },
];

const moodLabel = Object.fromEntries(moodOptions.map((item) => [item.value, item.label])) as Record<MoodStatus, string>;
const nightStateOptions: Array<[NightState, string]> = [
  ["calm", "穏やか"],
  ["okay", "まあまあ"],
  ["hard", "しんどかった"],
  ["recovered", "崩れたけど戻れた"],
];
const nightStateLabel = Object.fromEntries(nightStateOptions) as Record<NightState, string>;
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
const cyclePmsOptions: Array<[CyclePmsLevel, string]> = [["unknown", "わからない"], ["none", "少ない"], ["little", "少しある"], ["strong", "強め"]];
const cyclePmsLabel = Object.fromEntries(cyclePmsOptions) as Record<CyclePmsLevel, string>;
const cycleEmotionOptions: Array<{ id: CycleEmotion; label: string }> = [
  { id: "anxiety", label: "不安" },
  { id: "irritation", label: "イライラ" },
  { id: "tearful", label: "泣きやすい" },
  { id: "rushed", label: "焦り" },
  { id: "racingThoughts", label: "思考暴走" },
  { id: "foggy", label: "ぼーっとする" },
];
const cycleSymptomOptions: Array<{ id: CycleSymptom; label: string }> = [
  { id: "cramps", label: "腹痛" },
  { id: "headache", label: "頭痛" },
  { id: "sleepy", label: "眠気" },
  { id: "fatigue", label: "だるさ" },
  { id: "nausea", label: "吐き気" },
  { id: "backPain", label: "腰痛" },
  { id: "appetite", label: "食欲変化" },
];
const cycleActivityOptions: Array<{ id: CycleActivityImpact; label: string }> = [
  { id: "noteEasy", label: "noteを書きやすい" },
  { id: "noteHard", label: "noteを書きにくい" },
  { id: "outingEasy", label: "外出しやすい" },
  { id: "outingHard", label: "外出しんどい" },
  { id: "aiWork", label: "AI作業ならできる" },
  { id: "passiveOk", label: "受動的なことならできる" },
  { id: "restFirst", label: "休息優先" },
];
const cycleEmotionLabel = Object.fromEntries(cycleEmotionOptions.map((item) => [item.id, item.label])) as Record<CycleEmotion, string>;
const cycleSymptomLabel = Object.fromEntries(cycleSymptomOptions.map((item) => [item.id, item.label])) as Record<CycleSymptom, string>;
const cycleActivityLabel = Object.fromEntries(cycleActivityOptions.map((item) => [item.id, item.label])) as Record<CycleActivityImpact, string>;
const pillStatusOptions: Array<[PillStatus, string]> = [["taken", "飲んだ"], ["notYet", "まだ"], ["missed", "飲み忘れ"]];
const pillBodyNoteOptions: Array<{ id: PillBodyNote; label: string }> = [
  { id: "nausea", label: "吐き気" },
  { id: "headache", label: "頭痛" },
  { id: "sleepy", label: "眠気" },
  { id: "moodChange", label: "気分変化" },
  { id: "spotting", label: "不正出血" },
];
const pmddLevelOptions: Array<[PmddLevel, string]> = [["none", "なし"], ["light", "軽い"], ["medium", "中くらい"], ["strong", "強い"]];
const yesNoOptions: Array<[YesNoStatus, string]> = [["no", "なし"], ["yes", "あり"]];
const pillStatusLabel = Object.fromEntries(pillStatusOptions) as Record<PillStatus, string>;
const pillBodyNoteLabel = Object.fromEntries(pillBodyNoteOptions.map((item) => [item.id, item.label])) as Record<PillBodyNote, string>;
const pmddLevelLabel = Object.fromEntries(pmddLevelOptions) as Record<PmddLevel, string>;
const yesNoLabel = Object.fromEntries(yesNoOptions) as Record<YesNoStatus, string>;
const gameFatigueOptions: Array<[GameFatigue, string]> = [["none", "疲れない"], ["little", "少し疲れる"], ["strong", "かなり疲れる"]];
const gameSleepinessOptions: Array<[GameSleepiness, string]> = [["none", "なし"], ["little", "少し"], ["strong", "強い"]];
const gameAfterEffectOptions: Array<[GameAfterEffect, string]> = [["slept", "寝た"], ["worked", "作業できた"], ["spacedOut", "ボーッとした"], ["recovered", "完全復活した"]];
const gameFatigueLabel = Object.fromEntries(gameFatigueOptions) as Record<GameFatigue, string>;
const gameSleepinessLabel = Object.fromEntries(gameSleepinessOptions) as Record<GameSleepiness, string>;
const gameAfterEffectLabel = Object.fromEntries(gameAfterEffectOptions) as Record<GameAfterEffect, string>;

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

function calculatePlayMinutes(startTime: string, endTime: string) {
  if (!startTime || !endTime) return 0;
  const [startHour, startMinute] = startTime.split(":").map(Number);
  const [endHour, endMinute] = endTime.split(":").map(Number);
  if ([startHour, startMinute, endHour, endMinute].some((value) => Number.isNaN(value))) return 0;
  const startTotal = startHour * 60 + startMinute;
  let endTotal = endHour * 60 + endMinute;
  if (endTotal < startTotal) endTotal += 24 * 60;
  return endTotal - startTotal;
}

function formatPlayMinutes(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const restMinutes = minutes % 60;
  if (hours === 0) return `${restMinutes}分`;
  if (restMinutes === 0) return `${hours}時間`;
  return `${hours}時間${restMinutes}分`;
}

function formatTimeRange(startTime: string, endTime: string) {
  if (!startTime && !endTime) return "時間未入力";
  if (!endTime) return `${startTime}から`;
  if (!startTime) return `${endTime}まで`;
  return `${startTime} - ${endTime}`;
}

function averageScore(values: number[]) {
  if (values.length === 0) return "0.0";
  const total = values.reduce((sum, value) => sum + value, 0);
  return (total / values.length).toFixed(1);
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
            {view === "sakuraSleep" && <SakuraSleepLogApp />}
            {view === "cycleLog" && <CycleBodyLogApp />}
            {view === "signs" && <SignsCheckUi />}
            {view === "library" && <ComfortLibrary />}
            {view === "shopping" && <ShoppingListApp />}
            {view === "visitMemo" && <VisitMemoApp />}
            {view === "mediaLog" && <MediaLogApp />}
            {view === "gameLog" && <GameLogApp />}
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
  const [date, setDate] = useState(today);
  const [todayWord, setTodayWord] = useState("");
  const [currentMood, setCurrentMood] = useState("");
  const [nightState, setNightState] = useState<NightState>("calm");
  const [almostCollapsedScene, setAlmostCollapsedScene] = useState("");
  const [helpfulThing, setHelpfulThing] = useState("");
  const [returnedThing, setReturnedThing] = useState("");

  useEffect(() => window.localStorage.setItem(RECOVERY_STORAGE_KEY, JSON.stringify(logs)), [logs]);

  function saveLog(event: FormEvent) {
    event.preventDefault();
    setLogs((current) => [
      {
        id: createId("recovery"),
        date,
        todayWord,
        currentMood,
        nightState,
        almostCollapsedScene,
        helpfulThing,
        returnedThing,
        createdAt: new Date().toISOString(),
      },
      ...current,
    ]);
    setDate(today);
    setTodayWord("");
    setCurrentMood("");
    setNightState("calm");
    setAlmostCollapsedScene("");
    setHelpfulThing("");
    setReturnedThing("");
  }

  return (
    <section className="panel two-column">
      <form className="stack" onSubmit={saveLog}>
        <label className="field">
          <span>日付</span>
          <input type="date" value={date} onChange={(event) => setDate(event.target.value)} />
        </label>
        <label className="field">
          <span>今日のひとこと</span>
          <input value={todayWord} onChange={(event) => setTodayWord(event.target.value)} />
        </label>
        <TextArea label="今の気分" value={currentMood} onChange={setCurrentMood} />
        <fieldset className="branch-group">
          <legend>夜の状態</legend>
          <div className="choice-grid">
            {nightStateOptions.map(([value, label]) => (
              <button className={nightState === value ? "selected" : ""} key={value} type="button" onClick={() => setNightState(value)}>
                {label}
              </button>
            ))}
          </div>
        </fieldset>
        <TextArea label="崩れそうだった場面" value={almostCollapsedScene} onChange={setAlmostCollapsedScene} />
        <TextArea label="役に立ったもの" value={helpfulThing} onChange={setHelpfulThing} />
        <TextArea label="戻れたこと" value={returnedThing} onChange={setReturnedThing} />
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

function CycleBodyLogApp() {
  const [logs, setLogs] = useState<CycleBodyLog[]>(readStorage<CycleBodyLog[]>(CYCLE_BODY_LOG_STORAGE_KEY, []));
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState("");
  const [cycleMemo, setCycleMemo] = useState("");
  const [pmsLevel, setPmsLevel] = useState<CyclePmsLevel>("unknown");
  const [emotions, setEmotions] = useState<CycleEmotion[]>([]);
  const [symptoms, setSymptoms] = useState<CycleSymptom[]>([]);
  const [activityImpacts, setActivityImpacts] = useState<CycleActivityImpact[]>([]);
  const [pillSheetStartDate, setPillSheetStartDate] = useState(today);
  const [pillStartConditionMemo, setPillStartConditionMemo] = useState("生理が来た日に開始");
  const [pillStatus, setPillStatus] = useState<PillStatus>("notYet");
  const [pillTakenTime, setPillTakenTime] = useState("");
  const [pillNumber, setPillNumber] = useState("");
  const [pillMissedMemo, setPillMissedMemo] = useState("");
  const [pillBodyNotes, setPillBodyNotes] = useState<PillBodyNote[]>([]);
  const [pmddLevel, setPmddLevel] = useState<PmddLevel>("none");
  const [asNeededMedicine, setAsNeededMedicine] = useState<YesNoStatus>("no");
  const [pillFlashback, setPillFlashback] = useState<YesNoStatus>("no");
  const [signRelationMemo, setSignRelationMemo] = useState("");
  const [shortMemo, setShortMemo] = useState("");

  useEffect(() => window.localStorage.setItem(CYCLE_BODY_LOG_STORAGE_KEY, JSON.stringify(logs)), [logs]);

  const sortedLogs = [...logs].sort((a, b) => b.startDate.localeCompare(a.startDate) || b.createdAt.localeCompare(a.createdAt));
  const pmsStrongCount = logs.filter((log) => log.pmsLevel === "strong").length;
  const restFirstCount = logs.filter((log) => log.activityImpacts.includes("restFirst")).length;
  const pillTakenCount = logs.filter((log) => log.pillStatus === "taken").length;
  const pillMissedCount = logs.filter((log) => log.pillStatus === "missed").length;

  function toggleEmotion(id: CycleEmotion, checked: boolean) {
    setEmotions((current) => (checked ? [...current, id] : current.filter((item) => item !== id)));
  }

  function toggleSymptom(id: CycleSymptom, checked: boolean) {
    setSymptoms((current) => (checked ? [...current, id] : current.filter((item) => item !== id)));
  }

  function toggleActivityImpact(id: CycleActivityImpact, checked: boolean) {
    setActivityImpacts((current) => (checked ? [...current, id] : current.filter((item) => item !== id)));
  }

  function togglePillBodyNote(id: PillBodyNote, checked: boolean) {
    setPillBodyNotes((current) => (checked ? [...current, id] : current.filter((item) => item !== id)));
  }

  function addLog(event: FormEvent) {
    event.preventDefault();
    setLogs((current) => [
      {
        id: createId("cycle-body"),
        startDate: startDate || today,
        endDate,
        cycleMemo: cycleMemo.trim(),
        pmsLevel,
        emotions,
        symptoms,
        activityImpacts,
        pillSheetStartDate: pillSheetStartDate || today,
        pillStartConditionMemo: pillStartConditionMemo.trim(),
        pillStatus,
        pillTakenTime,
        pillNumber: pillNumber.trim(),
        pillMissedMemo: pillMissedMemo.trim(),
        pillBodyNotes,
        pmddLevel,
        asNeededMedicine,
        pillFlashback,
        signRelationMemo: signRelationMemo.trim(),
        shortMemo: shortMemo.trim(),
        createdAt: new Date().toISOString(),
      },
      ...current,
    ]);
    setStartDate(today);
    setEndDate("");
    setCycleMemo("");
    setPmsLevel("unknown");
    setEmotions([]);
    setSymptoms([]);
    setActivityImpacts([]);
    setPillSheetStartDate(today);
    setPillStartConditionMemo("生理が来た日に開始");
    setPillStatus("notYet");
    setPillTakenTime("");
    setPillNumber("");
    setPillMissedMemo("");
    setPillBodyNotes([]);
    setPmddLevel("none");
    setAsNeededMedicine("no");
    setPillFlashback("no");
    setSignRelationMemo("");
    setShortMemo("");
  }

  return (
    <section className="panel two-column cycle-log">
      <form className="stack" onSubmit={addLog}>
        <div className="result-box">
          <strong>周期そのものより、生活への影響を見る</strong>
          <p>PMDD・回復状態・服薬・体調変化を、あとから見返せるように軽く残すログです。</p>
        </div>

        <section className="pill-check-panel">
          <div className="section-title">
            <Check size={16} />
            <h2>ピル服薬チェック</h2>
          </div>
          <div className="pill-status-check">
            <BranchGroup label="今日飲んだか" value={pillStatus} options={pillStatusOptions} onChange={setPillStatus} />
          </div>
          <div className="status-row cycle-dates">
            <label className="field">
              <span>シート開始日</span>
              <input type="date" value={pillSheetStartDate} onChange={(event) => setPillSheetStartDate(event.target.value)} />
            </label>
            <label className="field">
              <span>飲んだ時間</span>
              <input type="time" value={pillTakenTime} onChange={(event) => setPillTakenTime(event.target.value)} onInput={(event) => setPillTakenTime(event.currentTarget.value)} />
            </label>
          </div>
          <div className="status-row cycle-dates">
            <label className="field">
              <span>何錠目か</span>
              <input inputMode="numeric" value={pillNumber} onChange={(event) => setPillNumber(event.target.value)} placeholder="例: 3" />
            </label>
            <label className="field">
              <span>飲み始め条件メモ</span>
              <input value={pillStartConditionMemo} onChange={(event) => setPillStartConditionMemo(event.target.value)} placeholder="生理が来た日に開始" />
            </label>
          </div>
          <TextArea label="飲み忘れメモ" value={pillMissedMemo} onChange={setPillMissedMemo} />
        </section>

        <div className="status-row cycle-dates">
          <label className="field">
            <span>開始日</span>
            <input type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} />
          </label>
          <label className="field">
            <span>終了日</span>
            <input type="date" value={endDate} onChange={(event) => setEndDate(event.target.value)} />
          </label>
        </div>
        <TextArea label="周期メモ" value={cycleMemo} onChange={setCycleMemo} />
        <BranchGroup label="PMSっぽさ" value={pmsLevel} options={cyclePmsOptions} onChange={setPmsLevel} />
        <BranchGroup label="PMDDっぽさ" value={pmddLevel} options={pmddLevelOptions} onChange={setPmddLevel} />

        <fieldset className="branch-group">
          <legend>体調メモ</legend>
          <div className="check-grid">
            {pillBodyNoteOptions.map((item) => (
              <label className="check-card" key={item.id}>
                <input type="checkbox" checked={pillBodyNotes.includes(item.id)} onChange={(event) => togglePillBodyNote(item.id, event.target.checked)} />
                <span>{item.label}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className="cycle-binary-grid">
          <BranchGroup label="頓服の有無" value={asNeededMedicine} options={yesNoOptions} onChange={setAsNeededMedicine} />
          <BranchGroup label="フラッシュバックの有無" value={pillFlashback} options={yesNoOptions} onChange={setPillFlashback} />
        </div>

        <fieldset className="branch-group">
          <legend>感情変化</legend>
          <div className="check-grid">
            {cycleEmotionOptions.map((item) => (
              <label className="check-card" key={item.id}>
                <input type="checkbox" checked={emotions.includes(item.id)} onChange={(event) => toggleEmotion(item.id, event.target.checked)} />
                <span>{item.label}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset className="branch-group">
          <legend>身体症状</legend>
          <div className="check-grid">
            {cycleSymptomOptions.map((item) => (
              <label className="check-card" key={item.id}>
                <input type="checkbox" checked={symptoms.includes(item.id)} onChange={(event) => toggleSymptom(item.id, event.target.checked)} />
                <span>{item.label}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset className="branch-group">
          <legend>活動への影響</legend>
          <div className="check-grid">
            {cycleActivityOptions.map((item) => (
              <label className="check-card" key={item.id}>
                <input type="checkbox" checked={activityImpacts.includes(item.id)} onChange={(event) => toggleActivityImpact(item.id, event.target.checked)} />
                <span>{item.label}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <TextArea label="崩れ始めサインとの関連メモ" value={signRelationMemo} onChange={setSignRelationMemo} />
        <TextArea label="一言メモ" value={shortMemo} onChange={setShortMemo} />
        <button className="primary-button full" type="submit">
          <Plus size={18} />
          周期・体調ログを保存
        </button>
      </form>

      <div className="stack">
        <section className="mini-stats trigger-stats">
          <Stat label="記録数" value={`${logs.length}件`} />
          <Stat label="PMS強め" value={`${pmsStrongCount}件`} />
          <Stat label="休息優先" value={`${restFirstCount}件`} />
        </section>
        <section className="mini-stats trigger-stats">
          <Stat label="飲んだ" value={`${pillTakenCount}件`} />
          <Stat label="飲み忘れ" value={`${pillMissedCount}件`} />
          <Stat label="服薬チェック" value="localStorage" />
        </section>
        {sortedLogs.length === 0 ? (
          <Empty text="周期・体調ログはまだありません。" />
        ) : (
          sortedLogs.map((log) => {
            const period = log.endDate ? `${formatDate(log.startDate)} - ${formatDate(log.endDate)}` : `${formatDate(log.startDate)}から`;
            const emotionLabels = log.emotions.map((item) => cycleEmotionLabel[item]);
            const symptomLabels = log.symptoms.map((item) => cycleSymptomLabel[item]);
            const activityLabels = log.activityImpacts.map((item) => cycleActivityLabel[item]);
            const pillStatusText = log.pillStatus ? pillStatusLabel[log.pillStatus] : "未入力";
            const pillBodyNoteLabels = (log.pillBodyNotes || []).map((item) => pillBodyNoteLabel[item]);

            return (
              <article className="sleep-card cycle-card" key={log.id}>
                <div className="log-head">
                  <strong>{period}</strong>
                  <button className="icon-button danger" type="button" onClick={() => setLogs((current) => current.filter((item) => item.id !== log.id))} aria-label="削除">
                    <Trash2 size={16} />
                  </button>
                </div>
                <div className="trigger-tags">
                  <span>服薬: {pillStatusText}</span>
                  {log.pillTakenTime ? <span>服薬時間: {log.pillTakenTime}</span> : null}
                  {log.pillNumber ? <span>{log.pillNumber}錠目</span> : null}
                  {log.pmddLevel ? <span>PMDD: {pmddLevelLabel[log.pmddLevel]}</span> : null}
                  {log.asNeededMedicine ? <span>頓服: {yesNoLabel[log.asNeededMedicine]}</span> : null}
                  {log.pillFlashback ? <span>フラッシュバック: {yesNoLabel[log.pillFlashback]}</span> : null}
                  <span>PMS: {cyclePmsLabel[log.pmsLevel]}</span>
                  {emotionLabels.map((label) => (
                    <span key={`emotion-${label}`}>{label}</span>
                  ))}
                  {symptomLabels.map((label) => (
                    <span key={`symptom-${label}`}>{label}</span>
                  ))}
                  {pillBodyNoteLabels.map((label) => (
                    <span key={`pill-body-${label}`}>{label}</span>
                  ))}
                </div>
                {log.pillSheetStartDate || log.pillStartConditionMemo || log.pillMissedMemo ? (
                  <p>
                    <strong>ピル服薬チェック</strong>
                    {[
                      log.pillSheetStartDate ? `シート開始 ${formatDate(log.pillSheetStartDate)}` : "",
                      log.pillStartConditionMemo ? `開始条件: ${log.pillStartConditionMemo}` : "",
                      log.pillMissedMemo ? `飲み忘れ: ${log.pillMissedMemo}` : "",
                    ]
                      .filter(Boolean)
                      .join(" / ")}
                  </p>
                ) : null}
                {activityLabels.length > 0 ? (
                  <p>
                    <strong>活動への影響</strong>
                    {activityLabels.join(" / ")}
                  </p>
                ) : null}
                {log.cycleMemo ? (
                  <p>
                    <strong>周期メモ</strong>
                    {log.cycleMemo}
                  </p>
                ) : null}
                {log.signRelationMemo ? (
                  <p>
                    <strong>崩れ始めサインとの関連</strong>
                    {log.signRelationMemo}
                  </p>
                ) : null}
                {log.shortMemo ? <p>{log.shortMemo}</p> : null}
              </article>
            );
          })
        )}
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

function GameLogApp() {
  const [logs, setLogs] = useState<GameLog[]>(() => readStorage<GameLog[]>(GAME_LOG_STORAGE_KEY, []));
  const [gameName, setGameName] = useState("");
  const [date, setDate] = useState(today);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [fatigue, setFatigue] = useState<GameFatigue>("little");
  const [sleepiness, setSleepiness] = useState<GameSleepiness>("none");
  const [focus, setFocus] = useState(3);
  const [fun, setFun] = useState(4);
  const [afterEffect, setAfterEffect] = useState<GameAfterEffect>("spacedOut");
  const [memo, setMemo] = useState("");

  useEffect(() => window.localStorage.setItem(GAME_LOG_STORAGE_KEY, JSON.stringify(logs)), [logs]);

  const previewMinutes = calculatePlayMinutes(startTime, endTime);
  const sortedLogs = [...logs].sort((a, b) => b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt));
  const strongFatigueCount = logs.filter((log) => log.fatigue === "strong").length;
  const sleepyCount = logs.filter((log) => log.sleepiness !== "none").length;
  const sleepRouteCount = logs.filter((log) => log.afterEffect === "slept").length;

  function addLog(event: FormEvent) {
    event.preventDefault();
    if (!gameName.trim()) return;
    setLogs((current) => [
      {
        id: createId("game"),
        gameName: gameName.trim(),
        date: date || today,
        startTime,
        endTime,
        playMinutes: previewMinutes,
        fatigue,
        sleepiness,
        focus,
        fun,
        afterEffect,
        memo: memo.trim(),
        createdAt: new Date().toISOString(),
      },
      ...current,
    ]);
    setGameName("");
    setDate(today);
    setStartTime("");
    setEndTime("");
    setFatigue("little");
    setSleepiness("none");
    setFocus(3);
    setFun(4);
    setAfterEffect("spacedOut");
    setMemo("");
  }

  return (
    <section className="panel two-column game-log">
      <form className="stack" onSubmit={addLog}>
        <div className="result-box">
          <strong>ゲーム後の状態変化を見るログ</strong>
          <p>時間管理ではなく、疲労・眠気・集中・回復への影響をゲームごとに残します。</p>
        </div>

        <label className="field">
          <span>ゲーム名</span>
          <input value={gameName} onChange={(event) => setGameName(event.target.value)} placeholder="例: FF、MGS" />
        </label>

        <div className="status-row game-time-grid">
          <label className="field">
            <span>日付</span>
            <input type="date" value={date} onChange={(event) => setDate(event.target.value)} />
          </label>
          <label className="field">
            <span>開始時間</span>
            <input type="time" value={startTime} onChange={(event) => setStartTime(event.target.value)} onInput={(event) => setStartTime(event.currentTarget.value)} />
          </label>
          <label className="field">
            <span>終了時間</span>
            <input type="time" value={endTime} onChange={(event) => setEndTime(event.target.value)} onInput={(event) => setEndTime(event.currentTarget.value)} />
          </label>
        </div>

        <div className="game-duration-preview">
          <span>プレイ時間</span>
          <strong>{previewMinutes > 0 ? formatPlayMinutes(previewMinutes) : "時間を入れると自動計算"}</strong>
        </div>

        <BranchGroup label="疲労感" value={fatigue} options={gameFatigueOptions} onChange={setFatigue} />
        <BranchGroup label="眠気" value={sleepiness} options={gameSleepinessOptions} onChange={setSleepiness} />
        <SliderField label="集中度" value={focus} onChange={setFocus} />
        <SliderField label="楽しさ" value={fun} onChange={setFun} />
        <BranchGroup label="その後どうなったか" value={afterEffect} options={gameAfterEffectOptions} onChange={setAfterEffect} />
        <TextArea label="一言メモ" value={memo} onChange={setMemo} />

        <button className="primary-button full" type="submit">
          <Plus size={18} />
          ゲームログを保存
        </button>
      </form>

      <div className="stack">
        <section className="mini-stats trigger-stats">
          <Stat label="記録数" value={`${logs.length}件`} />
          <Stat label="かなり疲れる" value={`${strongFatigueCount}件`} />
          <Stat label="眠気あり" value={`${sleepyCount}件`} />
        </section>
        <section className="mini-stats trigger-stats">
          <Stat label="寝る導線" value={`${sleepRouteCount}件`} />
          <Stat label="平均集中" value={logs.length ? `${averageScore(logs.map((log) => log.focus))}/5` : "-"} />
          <Stat label="平均楽しさ" value={logs.length ? `${averageScore(logs.map((log) => log.fun))}/5` : "-"} />
        </section>

        {sortedLogs.length === 0 ? (
          <Empty text="ゲームログはまだありません。" />
        ) : (
          sortedLogs.map((log) => (
            <article className="sleep-card game-card" key={log.id}>
              <div className="log-head">
                <strong>
                  {log.gameName} / {formatDate(log.date)}
                </strong>
                <button className="icon-button danger" type="button" onClick={() => setLogs((current) => current.filter((item) => item.id !== log.id))} aria-label="削除">
                  <Trash2 size={16} />
                </button>
              </div>
              <div className="trigger-tags">
                <span>{formatTimeRange(log.startTime, log.endTime)}</span>
                <span>{log.playMinutes > 0 ? formatPlayMinutes(log.playMinutes) : "時間未計算"}</span>
                <span>疲労: {gameFatigueLabel[log.fatigue]}</span>
                <span>眠気: {gameSleepinessLabel[log.sleepiness]}</span>
                <span>その後: {gameAfterEffectLabel[log.afterEffect]}</span>
              </div>
              <div className="game-score-row">
                <span>集中 {log.focus}/5</span>
                <span>楽しさ {log.fun}/5</span>
              </div>
              {log.memo ? <p>{log.memo}</p> : null}
            </article>
          ))
        )}
      </div>
    </section>
  );
}

function MediaLogApp() {
  const [activeTab, setActiveTab] = useState<"books" | "manga" | "movies" | "dramas">("books");
  const [readingLogs, setReadingLogs] = useState<ReadingLog[]>(() => readStorage<ReadingLog[]>(READING_LOG_STORAGE_KEY, []));
  const [mangaLogs, setMangaLogs] = useState<ReadingLog[]>(() => readStorage<ReadingLog[]>(MANGA_LOG_STORAGE_KEY, []));
  const [movieLogs, setMovieLogs] = useState<MovieLog[]>(() => readStorage<MovieLog[]>(MOVIE_LOG_STORAGE_KEY, []));
  const [dramaLogs, setDramaLogs] = useState<DramaLog[]>(() => readStorage<DramaLog[]>(DRAMA_LOG_STORAGE_KEY, []));
  const [simpleLogs, setSimpleLogs] = useState<SimpleMediaLog[]>(() => readStorage<SimpleMediaLog[]>(SIMPLE_MEDIA_LOG_STORAGE_KEY, []));
  const [bookTitle, setBookTitle] = useState("");
  const [bookAuthor, setBookAuthor] = useState("");
  const [bookStatus, setBookStatus] = useState<BookStatus>("want");
  const [bookMemo, setBookMemo] = useState("");
  const [bookDate, setBookDate] = useState(today);
  const [mangaTitle, setMangaTitle] = useState("");
  const [mangaAuthor, setMangaAuthor] = useState("");
  const [mangaStatus, setMangaStatus] = useState<BookStatus>("want");
  const [mangaMemo, setMangaMemo] = useState("");
  const [mangaDate, setMangaDate] = useState(today);
  const [movieTitle, setMovieTitle] = useState("");
  const [movieDate, setMovieDate] = useState(today);
  const [movieMood, setMovieMood] = useState("");
  const [movieMemo, setMovieMemo] = useState("");
  const [rewatchScore, setRewatchScore] = useState(3);
  const [dramaTitle, setDramaTitle] = useState("");
  const [dramaSeason, setDramaSeason] = useState("");
  const [dramaCurrentEpisode, setDramaCurrentEpisode] = useState("");
  const [dramaTotalEpisodes, setDramaTotalEpisodes] = useState("");
  const [dramaService, setDramaService] = useState("");
  const [dramaStatus, setDramaStatus] = useState<DramaStatus>("watching");
  const [dramaMemo, setDramaMemo] = useState("");
  const [dramaUpdatedDate, setDramaUpdatedDate] = useState(today);
  const [simpleTitle, setSimpleTitle] = useState("");
  const [simpleKind, setSimpleKind] = useState<SimpleMediaKind>("book");
  const [simpleMemo, setSimpleMemo] = useState("");
  const [simpleDate, setSimpleDate] = useState(today);

  useEffect(() => window.localStorage.setItem(READING_LOG_STORAGE_KEY, JSON.stringify(readingLogs)), [readingLogs]);
  useEffect(() => window.localStorage.setItem(MANGA_LOG_STORAGE_KEY, JSON.stringify(mangaLogs)), [mangaLogs]);
  useEffect(() => window.localStorage.setItem(MOVIE_LOG_STORAGE_KEY, JSON.stringify(movieLogs)), [movieLogs]);
  useEffect(() => window.localStorage.setItem(DRAMA_LOG_STORAGE_KEY, JSON.stringify(dramaLogs)), [dramaLogs]);
  useEffect(() => window.localStorage.setItem(SIMPLE_MEDIA_LOG_STORAGE_KEY, JSON.stringify(simpleLogs)), [simpleLogs]);

  const bookStats = {
    want: readingLogs.filter((item) => item.status === "want").length,
    reading: readingLogs.filter((item) => item.status === "reading").length,
    finished: readingLogs.filter((item) => item.status === "finished").length,
  };

  const mangaStats = {
    want: mangaLogs.filter((item) => item.status === "want").length,
    reading: mangaLogs.filter((item) => item.status === "reading").length,
    finished: mangaLogs.filter((item) => item.status === "finished").length,
  };

  const dramaStats = {
    watching: dramaLogs.filter((item) => item.status === "watching").length,
    paused: dramaLogs.filter((item) => item.status === "paused").length,
    finished: dramaLogs.filter((item) => item.status === "finished").length,
  };

  const sortedBooks = [...readingLogs].sort((a, b) => b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt));
  const sortedManga = [...mangaLogs].sort((a, b) => b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt));
  const sortedMovies = [...movieLogs].sort((a, b) => b.watchedDate.localeCompare(a.watchedDate) || b.createdAt.localeCompare(a.createdAt));
  const sortedDramas = [...dramaLogs].sort((a, b) => b.updatedDate.localeCompare(a.updatedDate) || b.createdAt.localeCompare(a.createdAt));
  const sortedSimpleLogs = [...simpleLogs].sort((a, b) => b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt));
  const simpleMediaKindLabel: Record<SimpleMediaKind, string> = { book: "本", manga: "漫画", movie: "映画", drama: "ドラマ" };

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

  function addManga(event: FormEvent) {
    event.preventDefault();
    if (!mangaTitle.trim()) return;
    setMangaLogs((current) => [
      {
        id: createId("manga"),
        title: mangaTitle.trim(),
        author: mangaAuthor.trim(),
        status: mangaStatus,
        memo: mangaMemo.trim(),
        date: mangaDate || today,
        createdAt: new Date().toISOString(),
      },
      ...current,
    ]);
    setMangaTitle("");
    setMangaAuthor("");
    setMangaStatus("want");
    setMangaMemo("");
    setMangaDate(today);
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

  function addDrama(event: FormEvent) {
    event.preventDefault();
    if (!dramaTitle.trim()) return;
    setDramaLogs((current) => [
      {
        id: createId("drama"),
        title: dramaTitle.trim(),
        season: dramaSeason.trim(),
        currentEpisode: dramaCurrentEpisode.trim(),
        totalEpisodes: dramaTotalEpisodes.trim(),
        service: dramaService.trim(),
        status: dramaStatus,
        memo: dramaMemo.trim(),
        updatedDate: dramaUpdatedDate || today,
        createdAt: new Date().toISOString(),
      },
      ...current,
    ]);
    setDramaTitle("");
    setDramaSeason("");
    setDramaCurrentEpisode("");
    setDramaTotalEpisodes("");
    setDramaService("");
    setDramaStatus("watching");
    setDramaMemo("");
    setDramaUpdatedDate(today);
  }

  function updateBook(id: string, patch: Partial<ReadingLog>) {
    setReadingLogs((current) => current.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  }

  function updateManga(id: string, patch: Partial<ReadingLog>) {
    setMangaLogs((current) => current.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  }

  function updateMovie(id: string, patch: Partial<MovieLog>) {
    setMovieLogs((current) => current.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  }

  function updateDrama(id: string, patch: Partial<DramaLog>) {
    setDramaLogs((current) => current.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  }

  const dramaStatusLabel: Record<DramaStatus, string> = {
    watching: "視聴中",
    paused: "保留",
    finished: "完走",
  };

  function getDramaProgressText(item: DramaLog) {
    const season = item.season ? `${item.season} ` : "";
    const current = item.currentEpisode ? `${item.currentEpisode}話` : "話数未入力";
    const total = item.totalEpisodes ? ` / 全${item.totalEpisodes}話` : "";
    return `${season}${current}${total}`;
  }

  return (
    <section className="media-log">
      <section className="media-hero">
        <div>
          <p className="eyebrow">Books, manga, movies & dramas</p>
          <h2>読んだ気持ち、観た作品、ドラマの進み具合を残す</h2>
        </div>
        <div className="media-counts" aria-label="記録数">
          <span>本 {readingLogs.length}</span>
          <span>漫画 {mangaLogs.length}</span>
          <span>映画 {movieLogs.length}</span>
          <span>ドラマ {dramaLogs.length}</span>
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
              <option value="manga">漫画</option>
              <option value="movie">映画</option>
              <option value="drama">ドラマ</option>
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
                  <span className={`media-kind ${item.kind}`}>{simpleMediaKindLabel[item.kind]}</span>
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
        <button className={activeTab === "manga" ? "active" : ""} type="button" onClick={() => setActiveTab("manga")}>
          漫画ログ
        </button>
        <button className={activeTab === "movies" ? "active" : ""} type="button" onClick={() => setActiveTab("movies")}>
          映画ログ
        </button>
        <button className={activeTab === "dramas" ? "active" : ""} type="button" onClick={() => setActiveTab("dramas")}>
          ドラマログ
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
      ) : activeTab === "manga" ? (
        <>
          <section className="media-stats">
            <Stat label="読みたい" value={`${mangaStats.want}冊`} />
            <Stat label="読んでる" value={`${mangaStats.reading}冊`} />
            <Stat label="読了" value={`${mangaStats.finished}冊`} />
          </section>

          <form className="media-form" onSubmit={addManga}>
            <label className="field">
              <span>タイトル</span>
              <input value={mangaTitle} onChange={(event) => setMangaTitle(event.target.value)} placeholder="漫画のタイトル" />
            </label>
            <label className="field">
              <span>作者</span>
              <input value={mangaAuthor} onChange={(event) => setMangaAuthor(event.target.value)} placeholder="作者名" />
            </label>
            <label className="field">
              <span>状態</span>
              <select value={mangaStatus} onChange={(event) => setMangaStatus(event.target.value as BookStatus)}>
                <option value="want">読みたい</option>
                <option value="reading">読んでる</option>
                <option value="finished">読了</option>
              </select>
            </label>
            <label className="field">
              <span>日付</span>
              <input type="date" value={mangaDate} onChange={(event) => setMangaDate(event.target.value)} />
            </label>
            <label className="field media-wide">
              <span>感想メモ</span>
              <textarea value={mangaMemo} onChange={(event) => setMangaMemo(event.target.value)} placeholder="好きな場面、続きが気になる理由、読後感など" />
            </label>
            <button className="primary-button full media-wide" type="submit">
              <Plus size={18} />
              漫画ログを追加
            </button>
          </form>

          <section className="media-list" aria-label="漫画ログ一覧">
            {sortedManga.length === 0 ? (
              <Empty text="漫画ログはまだありません。" />
            ) : (
              sortedManga.map((item) => (
                <article className="media-card manga-card" key={item.id}>
                  <div className="media-card-head">
                    <BookOpen size={19} />
                    <div>
                      <input value={item.title} onChange={(event) => updateManga(item.id, { title: event.target.value })} aria-label="タイトル" />
                      <small>{item.author || "作者未入力"}</small>
                    </div>
                    <button className="icon-button danger" type="button" onClick={() => setMangaLogs((current) => current.filter((log) => log.id !== item.id))} aria-label="削除">
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="media-card-grid">
                    <label>
                      <span>状態</span>
                      <select value={item.status} onChange={(event) => updateManga(item.id, { status: event.target.value as BookStatus })}>
                        <option value="want">読みたい</option>
                        <option value="reading">読んでる</option>
                        <option value="finished">読了</option>
                      </select>
                    </label>
                    <label>
                      <span>日付</span>
                      <input type="date" value={item.date} onChange={(event) => updateManga(item.id, { date: event.target.value })} />
                    </label>
                  </div>
                  <textarea value={item.memo} onChange={(event) => updateManga(item.id, { memo: event.target.value })} placeholder="感想メモ" />
                </article>
              ))
            )}
          </section>
        </>
      ) : activeTab === "movies" ? (
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
      ) : (
        <>
          <section className="media-stats">
            <Stat label="視聴中" value={`${dramaStats.watching}本`} />
            <Stat label="保留" value={`${dramaStats.paused}本`} />
            <Stat label="完走" value={`${dramaStats.finished}本`} />
          </section>

          <form className="media-form" onSubmit={addDrama}>
            <label className="field">
              <span>タイトル</span>
              <input value={dramaTitle} onChange={(event) => setDramaTitle(event.target.value)} placeholder="ドラマのタイトル" />
            </label>
            <label className="field">
              <span>シーズン</span>
              <input value={dramaSeason} onChange={(event) => setDramaSeason(event.target.value)} placeholder="例: S1、シーズン2" />
            </label>
            <label className="field">
              <span>今どこまで</span>
              <input inputMode="numeric" value={dramaCurrentEpisode} onChange={(event) => setDramaCurrentEpisode(event.target.value)} placeholder="例: 5" />
            </label>
            <label className="field">
              <span>全話数</span>
              <input inputMode="numeric" value={dramaTotalEpisodes} onChange={(event) => setDramaTotalEpisodes(event.target.value)} placeholder="例: 10" />
            </label>
            <label className="field">
              <span>状態</span>
              <select value={dramaStatus} onChange={(event) => setDramaStatus(event.target.value as DramaStatus)}>
                <option value="watching">視聴中</option>
                <option value="paused">保留</option>
                <option value="finished">完走</option>
              </select>
            </label>
            <label className="field">
              <span>サービス</span>
              <input value={dramaService} onChange={(event) => setDramaService(event.target.value)} placeholder="例: Netflix、U-NEXT" />
            </label>
            <label className="field">
              <span>更新日</span>
              <input type="date" value={dramaUpdatedDate} onChange={(event) => setDramaUpdatedDate(event.target.value)} />
            </label>
            <label className="field media-wide">
              <span>メモ</span>
              <textarea value={dramaMemo} onChange={(event) => setDramaMemo(event.target.value)} placeholder="次に見る話、気になる人物、忘れたくない展開など" />
            </label>
            <button className="primary-button full media-wide" type="submit">
              <Plus size={18} />
              ドラマログを追加
            </button>
          </form>

          <section className="media-list" aria-label="ドラマログ一覧">
            {sortedDramas.length === 0 ? (
              <Empty text="ドラマログはまだありません。" />
            ) : (
              sortedDramas.map((item) => (
                <article className="media-card drama-card" key={item.id}>
                  <div className="media-card-head">
                    <Tv size={19} />
                    <div>
                      <input value={item.title} onChange={(event) => updateDrama(item.id, { title: event.target.value })} aria-label="タイトル" />
                      <small>{getDramaProgressText(item)}</small>
                    </div>
                    <button className="icon-button danger" type="button" onClick={() => setDramaLogs((current) => current.filter((log) => log.id !== item.id))} aria-label="削除">
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="media-card-grid">
                    <label>
                      <span>状態</span>
                      <select value={item.status} onChange={(event) => updateDrama(item.id, { status: event.target.value as DramaStatus })}>
                        <option value="watching">視聴中</option>
                        <option value="paused">保留</option>
                        <option value="finished">完走</option>
                      </select>
                    </label>
                    <label>
                      <span>シーズン</span>
                      <input value={item.season} onChange={(event) => updateDrama(item.id, { season: event.target.value })} placeholder="S1" />
                    </label>
                    <label>
                      <span>今どこまで</span>
                      <input inputMode="numeric" value={item.currentEpisode} onChange={(event) => updateDrama(item.id, { currentEpisode: event.target.value })} placeholder="5" />
                    </label>
                    <label>
                      <span>全話数</span>
                      <input inputMode="numeric" value={item.totalEpisodes} onChange={(event) => updateDrama(item.id, { totalEpisodes: event.target.value })} placeholder="10" />
                    </label>
                    <label>
                      <span>サービス</span>
                      <input value={item.service} onChange={(event) => updateDrama(item.id, { service: event.target.value })} placeholder="サービス" />
                    </label>
                    <label>
                      <span>更新日</span>
                      <input type="date" value={item.updatedDate} onChange={(event) => updateDrama(item.id, { updatedDate: event.target.value })} />
                    </label>
                  </div>
                  <div className="drama-progress">
                    <strong>{dramaStatusLabel[item.status]}</strong>
                    <span>{getDramaProgressText(item)}</span>
                    {item.service ? <span>{item.service}</span> : null}
                  </div>
                  <textarea value={item.memo} onChange={(event) => updateDrama(item.id, { memo: event.target.value })} placeholder="メモ" />
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

function SliderField({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void }) {
  return (
    <label className="field slider-field">
      <span>{label}</span>
      <div>
        <input type="range" min="1" max="5" value={value} onChange={(event) => onChange(Number(event.target.value))} />
        <strong>{value}/5</strong>
      </div>
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
  const fields = [
    ["今日のひとこと", log.todayWord],
    ["今の気分", log.currentMood || log.feelingNote],
    ["崩れそうだった場面", log.almostCollapsedScene],
    ["役に立ったもの", log.helpfulThing || log.recoveryTrigger],
    ["戻れたこと", log.returnedThing || log.doneOneThing],
  ].filter(([, text]) => text);

  return (
    <article className="log-card">
      <div className="log-head">
        <strong>
          {formatDate(log.date)} / {nightStateLabel[log.nightState] || (log.status ? moodLabel[log.status] : "記録")}
        </strong>
        <button className="icon-button danger" type="button" onClick={onDelete}>
          <Trash2 size={16} />
        </button>
      </div>
      {fields.map(([label, text]) => (
        <p key={label}>
          <strong>{label}</strong>
          {text}
        </p>
      ))}
    </article>
  );
}

function Empty({ text }: { text: string }) {
  return <p className="empty-state">{text}</p>;
}
