# Writing

Write for **a tired reader whose first language isn't English**. Every sentence must survive one read. The rules come from ASD-STE100 Simplified Technical English. Domain terms stay exact: "OCR", "p95", "idempotent".

## Headings

- One full sentence. A subject, a verb, one finding.
- No final period. Sentence case. Twelve words or fewer.
- Use the real numbers when you have them.

| Wrong | Right |
|---|---|
| Broader layouts. Same fidelity. | The new contracts accept more layouts and keep every check |
| One cut too many. | Reader v2 adds one extra boundary in one packet |
| Small study. Open notebook. | How we measured these results |

## Sentences

- 25 words or fewer. One fact each.
- Active voice. Name who does it: "Reader v2 adds a boundary", not "a boundary is added".
- Use "can", "must", and "will". Not "should", "may", "might", or "could".
- No semicolons, no "e.g.", no "i.e.", no "etc.".

## Words

- **One word, one meaning.** If the page says "rule", it never says "contract" for the same thing.
- Plain words: "use", not "utilize". "Show", not "demonstrate".
- Explain a project term once, where it first appears.
- No made-up labels. "SHARED LOGIC / NO EXEMPTIONS" means nothing to a new reader. "Same rules for every document" does.

## Numbers

- Show both sides: "23 of 24", not just "96%".
- A unit after every number: "142 ms".
- Copy every number from a source file. Never estimate.
- Name the denominator: "6 of 8 packets", and say what one item is.

## Facts and guesses

- Mark a guess as a guess: "The new heading likely explains the extra cut. We infer this from the layout." Never state a cause you did not measure.
- Say what a result does not cover. That goes in `method`.

## The method section

`method` answers these questions, one short line each. Skip a question that does not apply.

1. **Protocol.** How many runs, retries, and what concurrency?
2. **Sample.** How many items, from where, and are they typical?
3. **Labels.** Who made the answer key? Did a second person check it?
4. **Coverage.** What inputs were not tested?
5. **Uncertainty.** Why might the result not hold elsewhere?
6. **Sources.** Which files, with links.

## Check before you build

1. Is every heading one full sentence with no final period?
2. Does every tag and label make sense to a new reader?
3. Is the longest sentence 25 words or fewer?
4. Does any text say "should", "may", "might", "could", ";", "e.g.", "i.e.", or "etc."?
5. Do two words name the same thing? Keep one.
