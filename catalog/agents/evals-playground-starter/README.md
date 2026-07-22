# Evals Playground Starter

A tiny agent plus a numbered eval suite that walks the assertion surfaces one file at a time — the reference you want when wiring `eve eval` on real agents.

Demos: `t.succeeded`, `calledTool`, `parked`, `t.check`, soft vs gate, judge.

## Layout

```text
evals-playground-starter/
├── agent/
│   ├── tools/get_weather.ts      # stub
│   └── tools/issue_refund.ts     # approval: always()
├── evals/
│   ├── 01-succeeded.eval.ts
│   ├── 02-called-tool.eval.ts
│   ├── 03-parked.eval.ts
│   ├── 04-check-includes.eval.ts
│   └── 05-judge.eval.ts          # soft LLM judge
```

## Run

```bash
npm install
npm run eval
```

Or one file:

```bash
npx eve eval 02-called-tool
npx eve eval --strict   # soft threshold misses fail the build
```

## Make it yours

Copy an eval file into your own agent and swap the prompt/tool names. Keep gates for wiring (`succeeded`, `calledTool`, `parked`) and soft/judge for fuzzy quality.

## License

MIT
