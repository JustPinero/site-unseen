# Compatibility Rules — Sexuality-Based Matching

## Attendee Attributes

Every simulated attendee has:
- **Name** (randomly generated)
- **Gender**: Male, Female
- **Sexuality**: Heterosexual, Homosexual, Bisexual
- **Age**: 21–55 (configurable range)
- **Ethnicity**: Configurable distribution
- **Interests/Hobbies**: 1–5 selected from a pool (used for compatibility scoring)

## Matching Matrix

Matches are determined by mutual compatibility. **Both** parties must be compatible with each other for a date to occur.

### Heterosexual

| Attendee             | Can Match With                              |
|----------------------|---------------------------------------------|
| Heterosexual Man     | Heterosexual Woman, Bisexual Woman           |
| Heterosexual Woman   | Heterosexual Man, Bisexual Man               |

### Homosexual

| Attendee             | Can Match With                              |
|----------------------|---------------------------------------------|
| Homosexual Man       | Homosexual Man, Bisexual Man                 |
| Homosexual Woman     | Homosexual Woman, Bisexual Woman             |

### Bisexual

| Attendee             | Can Match With                              |
|----------------------|---------------------------------------------|
| Bisexual Man         | Heterosexual Woman, Bisexual Woman, Homosexual Man, Bisexual Man |
| Bisexual Woman       | Heterosexual Man, Bisexual Man, Homosexual Woman, Bisexual Woman |

## Matching Rules

1. **Mutual compatibility required** — both people must appear in each other's compatible pool.
2. **No repeat dates** — two attendees cannot be paired more than once per event.
3. **Randomized selection** — within the compatible pool, matches are selected randomly each round.
4. **Unmatched attendees sit out** — if no compatible partner is available for a round, the attendee waits.
5. **Interests overlap is NOT required for a match** — interests/hobbies affect post-simulation analytics (compatibility score) but do not gate matching.

## Compatibility Score (Post-Date Analytics)

After a date occurs, a compatibility score (0–100) is calculated:
- **Base score**: Random 20–60 (simulates chemistry)
- **Interest overlap bonus**: +10 per shared interest (max +50)
- **Age proximity bonus**: +10 if within 5 years, +5 if within 10 years

This score is used for end-of-simulation stats only — it does not affect whether a match happens.
