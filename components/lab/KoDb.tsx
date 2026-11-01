"use client";
import { useEffect, useRef, useState } from "react";

/**
 * In-browser toy version of KO-DB's ideas: an in-memory table, a write-ahead log
 * replayed on restart, and keys hashed across shards.
 */

const SHARDS = 3;
type WalEntry = { lsn: number; op: "SET" | "DEL"; key: string; value?: string };
type Line = { kind: "in" | "out" | "err" | "sys"; text: string };

function fnv1a(s: string) {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h;
}
const shardOf = (k: string) => fnv1a(k) % SHARDS;

const SEED: WalEntry[] = [
  { lsn: 1, op: "SET", key: "user:1", value: "ziad" },
  { lsn: 2, op: "SET", key: "lang", value: "go" },
  { lsn: 3, op: "SET", key: "role", value: "backend" },
  { lsn: 4, op: "SET", key: "coffee", value: "required" },
];

function apply(table: Map<string, string>, e: WalEntry) {
  if (e.op === "SET") table.set(e.key, e.value!);
  else table.delete(e.key);
}

export function KoDb() {
  const [wal, setWal] = useState<WalEntry[]>(SEED);
  const [table, setTable] = useState<Map<string, string>>(() => {
    const t = new Map<string, string>();
    SEED.forEach((e) => apply(t, e));
    return t;
  });
  const [down, setDown] = useState(false);
  const [lines, setLines] = useState<Line[]>([
    { kind: "sys", text: "KO-DB toy shell · type HELP · try: SET name ziad → GET name → CRASH" },
  ]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [hIdx, setHIdx] = useState(-1);
  const [hot, setHot] = useState<{ shard: number; key: string } | null>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const replaying = useRef(false);
  // latest state for callbacks fired from timers (demo script, WAL replay)
  const st = useRef({ wal, table, down });
  st.current = { wal, table, down };

  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: "smooth" });
  }, [lines]);

  const print = (...ls: Line[]) => setLines((prev) => [...prev, ...ls].slice(-60));

  const recover = () => {
    const { wal } = st.current;
    if (replaying.current) return;
    replaying.current = true;
    print({ kind: "sys", text: `↻ restarting… replaying ${wal.length} WAL entries` });
    const t = new Map<string, string>();
    wal.forEach((e, i) => {
      setTimeout(() => {
        apply(t, e);
        setTable(new Map(t));
        setHot({ shard: shardOf(e.key), key: e.key });
        print({ kind: "out", text: `  lsn=${e.lsn} ${e.op} ${e.key}${e.value ? " " + e.value : ""}  → shard-${shardOf(e.key)}` });
        if (i === wal.length - 1) {
          setDown(false);
          replaying.current = false;
          print({ kind: "sys", text: `✓ recovered ${t.size} keys, zero data loss` });
        }
      }, 180 * (i + 1));
    });
    if (wal.length === 0) {
      setDown(false);
      replaying.current = false;
    }
  };

  const run = (raw: string) => {
    const { wal, table, down } = st.current;
    const cmd = raw.trim();
    if (!cmd) return;
    print({ kind: "in", text: cmd });
    setHistory((h) => [cmd, ...h].slice(0, 30));
    setHIdx(-1);
    const [op, key, ...rest] = cmd.split(/\s+/);
    const OP = op.toUpperCase();
    const value = rest.join(" ");

    if (OP === "HELP") {
      return print(
        { kind: "out", text: "SET <key> <value>   write (WAL first, then memtable)" },
        { kind: "out", text: "GET <key>           read, routed by fnv1a(key) % 3" },
        { kind: "out", text: "DEL <key>           delete (tombstone in WAL)" },
        { kind: "out", text: "KEYS | WAL | STATS  inspect" },
        { kind: "out", text: "CRASH               kill the process (memtable is lost)" },
        { kind: "out", text: "RESTART             replay the WAL to recover" },
        { kind: "out", text: "CLEAR               clear the screen" },
      );
    }
    if (OP === "CLEAR") return setLines([]);
    if (OP === "CRASH") {
      if (down) return print({ kind: "err", text: "(error) already down, try RESTART" });
      setDown(true);
      setTable(new Map());
      return print({ kind: "err", text: "💥 process killed · memtable wiped · WAL on disk survives" });
    }
    if (OP === "RESTART") {
      if (!down) return print({ kind: "out", text: "already running" });
      return recover();
    }
    if (down) return print({ kind: "err", text: "(error) connection refused: tcp://ko-db:6380, try RESTART" });

    if (OP === "SET") {
      if (!key || !value) return print({ kind: "err", text: "(error) usage: SET <key> <value>" });
      const e: WalEntry = { lsn: (wal.at(-1)?.lsn ?? 0) + 1, op: "SET", key, value };
      setWal((w) => [...w, e]);
      setTable((t) => new Map(t).set(key, value));
      setHot({ shard: shardOf(key), key });
      return print({ kind: "out", text: `OK  (wal lsn=${e.lsn} · shard-${shardOf(key)})` });
    }
    if (OP === "GET") {
      if (!key) return print({ kind: "err", text: "(error) usage: GET <key>" });
      setHot({ shard: shardOf(key), key });
      const v = table.get(key);
      return print({ kind: "out", text: v === undefined ? `(nil)  shard-${shardOf(key)}` : `"${v}"  shard-${shardOf(key)}` });
    }
    if (OP === "DEL") {
      if (!key) return print({ kind: "err", text: "(error) usage: DEL <key>" });
      const had = table.has(key);
      if (had) {
        const e: WalEntry = { lsn: (wal.at(-1)?.lsn ?? 0) + 1, op: "DEL", key };
        setWal((w) => [...w, e]);
        setTable((t) => {
          const n = new Map(t);
          n.delete(key);
          return n;
        });
      }
      return print({ kind: "out", text: `(integer) ${had ? 1 : 0}` });
    }
    if (OP === "KEYS") return print({ kind: "out", text: table.size ? [...table.keys()].join("  ") : "(empty)" });
    if (OP === "WAL") return print(...wal.slice(-8).map((e) => ({ kind: "out" as const, text: `lsn=${e.lsn} ${e.op} ${e.key}${e.value ? " " + e.value : ""}` })));
    if (OP === "STATS")
      return print({ kind: "out", text: `keys=${table.size} wal_entries=${wal.length} shards=${SHARDS} ` + [0, 1, 2].map((s) => `s${s}=${[...table.keys()].filter((k) => shardOf(k) === s).length}`).join(" ") });
    print({ kind: "err", text: `(error) unknown command '${op}', try HELP` });
  };

  const demo = () => {
    const script = ["SET name ziad", "SET stack go", "GET name", "CRASH", "GET name", "RESTART"];
    script.forEach((c, i) => setTimeout(() => run(c), i * 700));
  };

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.25fr_1fr]">
      <div
        className="flex h-[420px] flex-col overflow-hidden rounded-[24px] bg-black ring-1 ring-night-line"
        onClick={() => inputRef.current?.focus()}
      >
        <div className="flex items-center justify-between border-b border-night-line px-4 py-3">
          <div className="flex gap-1.5">
            <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
            <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
            <span className="h-3 w-3 rounded-full bg-[#28c840]" />
          </div>
          <span className="font-mono text-[11px] text-white/40">ko-db@{down ? "down" : "tcp:6380"}</span>
          <button onClick={demo} className="rounded-full bg-white/10 px-3 py-1 font-mono text-[11px] text-white/80 hover:bg-white/20">
            ▶ run demo
          </button>
        </div>
        <div ref={scroller} className="flex-1 overflow-y-auto px-4 py-3 font-mono text-[12.5px] leading-relaxed">
          {lines.map((l, i) => (
            <div
              key={i}
              className={l.kind === "in" ? "text-white" : l.kind === "err" ? "text-[#ff8a65]" : l.kind === "sys" ? "text-accent" : "text-white/60"}
            >
              {l.kind === "in" && <span className="text-ok">ko-db› </span>}
              {l.text}
            </div>
          ))}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              run(input);
              setInput("");
            }}
            className="flex items-center"
          >
            <span className="text-ok">ko-db›&nbsp;</span>
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "ArrowUp" && history.length) {
                  e.preventDefault();
                  const n = Math.min(hIdx + 1, history.length - 1);
                  setHIdx(n);
                  setInput(history[n]);
                } else if (e.key === "ArrowDown") {
                  e.preventDefault();
                  const n = hIdx - 1;
                  setHIdx(n);
                  setInput(n >= 0 ? history[n] : "");
                }
              }}
              aria-label="KO-DB command"
              spellCheck={false}
              autoCapitalize="off"
              autoComplete="off"
              className="flex-1 bg-transparent text-white caret-accent outline-none"
              placeholder="type HELP"
            />
          </form>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="rounded-[24px] bg-night-2 p-5 ring-1 ring-night-line">
          <div className="flex items-center justify-between">
            <p className="font-mono text-[11px] uppercase tracking-wider text-white/40">Shards · fnv1a(key) % 3</p>
            <button
              onClick={() => run(down ? "RESTART" : "CRASH")}
              className={`rounded-full px-3 py-1 font-mono text-[11px] text-white transition ${down ? "bg-ok/80 hover:bg-ok" : "bg-accent hover:brightness-110"}`}
            >
              {down ? "↻ restart" : "💥 crash"}
            </button>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2">
            {[0, 1, 2].map((s) => {
              const keys = [...table.keys()].filter((k) => shardOf(k) === s);
              return (
                <div key={s} className={`min-h-[118px] rounded-2xl p-3 ring-1 transition ${down ? "bg-black/50 ring-night-line" : hot?.shard === s ? "bg-accent/10 ring-accent/60" : "bg-white/[0.04] ring-night-line"}`}>
                  <div className="font-mono text-[10.5px] text-white/40">shard-{s}</div>
                  <ul className="mt-2 space-y-1">
                    {down ? (
                      <li className="font-mono text-[11px] text-white/25">offline</li>
                    ) : (
                      keys.slice(0, 5).map((k) => (
                        <li key={k} className={`truncate rounded-md px-1.5 py-0.5 font-mono text-[11px] ${hot?.key === k ? "bg-accent text-white" : "bg-white/5 text-white/75"}`}>
                          {k}
                        </li>
                      ))
                    )}
                    {!down && keys.length > 5 && <li className="font-mono text-[10px] text-white/40">+{keys.length - 5} more</li>}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
        <div className="flex-1 rounded-[24px] bg-night-2 p-5 ring-1 ring-night-line">
          <p className="font-mono text-[11px] uppercase tracking-wider text-white/40">Write-ahead log (on disk)</p>
          <ol className="mt-3 space-y-1 font-mono text-[11px]">
            {wal.slice(-6).map((e) => (
              <li key={e.lsn} className="flex gap-3 text-white/70">
                <span className="w-10 text-white/30">#{e.lsn}</span>
                <span className={e.op === "DEL" ? "text-[#ff8a65]" : "text-ok"}>{e.op}</span>
                <span className="truncate">
                  {e.key}
                  {e.value && <span className="text-white/40"> = {e.value}</span>}
                </span>
              </li>
            ))}
          </ol>
          <p className="mt-3 text-[12.5px] leading-snug text-white/45">Every write hits the log before memory. Crash the process and the log rebuilds everything.</p>
        </div>
      </div>
    </div>
  );
}
