# Chief of Staff (WhatsApp)

A pocket chief of staff: captures tasks from quick messages, tracks commitments, and remembers what matters across weeks.

This is a complete [eve](https://eve.dev) app: instructions, typed tools, MCP connections, channels, a schedule, and evals.

## Layout

```text
whatsapp-chief-of-staff/
├── package.json
├── agent/
├──   agent.ts
├──   instructions.md
├──   skills/
├──   tools/
├──   connections/
├──   channels/
├──   schedules/
├── evals/
```

## Run

```bash
npm install
npm run dev
```

See `SETUP.md` for connections and channels. Run `npm run eval` with model credentials to verify approval gates and tool round-trips.

## License

MIT
