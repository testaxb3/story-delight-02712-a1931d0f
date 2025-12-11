# ELEVENLABS V3: The Technical Mastery Guide for Somatic Audio
> **OBJECTIVE:** Transform text into a physical experience using ElevenLabs V3.
> **CONSTRAINT:** Max 5,000 characters per request.

## 1. The Core Philosophy: "Audio Somatics"
We are not just generating "voiceovers". We are generating **regulation**.
The listener's nervous system mirrors the voice's nervous system.
*   If the voice rushes -> Listener panics.
*   If the voice breathes -> Listener breathes.
*   If the voice whispers -> Listener leans in (intimacy).

---

## 2. Voice Selection (The "Audio Anchor")
For the "Story Delight" Premium Series, we rely on specific voice textures.

### Primary Voices (The "Wise Friend")
*   **Hope (American):** Warm, slight texture, extremely capable of empathy. Best for general tracks.
*   **Sarah (American):** Softer, higher pitch, good for vulnerability and "gentle" topics.
*   **Roger (American):** Deep, resonant, fatherly. Use for "Fatherhood" series or specific "Strength" tracks.

### Settings (CRITICAL)
*   **Model:** `Eleven Multilingual v2` OR `Turbo v2.5` (Check latency vs quality). *Correction: For V3 scripting features, ensure you are targeting the model that supports the specific tags if applicable, but generally for "Story Delight" we prioritize **Stability** and **Style** settings over raw model version if not using specific V3 alpha features.*
*   **Stability:** `45-55%` (Allow natural fluctuation. Too high = robotic. Too low = erratic).
*   **Similarity Boost:** `75%` (Keep the voice identity strong).
*   **Style Exaggeration:** `15-20%` (Just enough to feel human, not enough to be dramatic).

---

## 3. The Pacing & Pause System (The "Heartbeat")
The magic is in the silence. You must engineer the silence.

| Tag | Duration | Purpose | Usage Frequency |
|:---:|:---:|:---|:---:|
| `...` | Micro | Natural thought separation. | Constant |
| `[short pause]` | 1-2s | Let a sentence land. "Sink in". | Every 2-3 sentences |
| `[long pause]` | 3-5s | **The Somatic Reset.** Forces the user to breathe. | Before/After "The Aha Moment" |
| `[break]` | 0.5s | Technical breath (if voice is rushing). | As needed |

### The "Somatic Breath" Pattern
Every track must explicitly model breathing.
```text
[inhales deeply] ... [exhales slowly]
```
*   **Why:** Mirror neurons. The user WILL breathe when they hear this.
*   **Where:** Start of the track, before the "Hope" section, and at the end.

---

## 4. Emotional Texture Tags (V3 Specifics)
Use these brackets to direct the AI's emotional state. *Do not overuse.*

*   **`[warmly]`**: The default state. Safe, inviting.
*   **`[softly]` / `[whispers]`**: For shameful secrets or intimate validations. "I know it hurts."
*   **`[thoughtfully]`**: Slower pace, as if thinking in real-time. Good for the "Science" section.
*   **`[gently]`**: When delivering a hard truth.
*   **`[sighs]`**: Solidarity. "I am tired too." (Use max 2x per track).
*   **`[reassuring]`**: Upbeat but calm. "You've got this."

---

## 5. Phonetic Engineering for 5k Limit
To maximize the 5,000 characters, we cut "filler" words but KEEP "pacing" words.

*   **Bad:** "I want you to know that it is very important to understand that..." (Robotic, wastes chars).
*   **Good:** "[warmly] Here's the truth." (Punchy, human).

### Emphasis Techniques
*   **Italics/Bold** do NOT work in ElevenLabs API usually.
*   **Use Caps for Volume:** "It was NOT your fault." (Slight volume bump).
*   **Use Spacing for Speed:** "Stop. Breathe. Listen." (Forces slow delivery).

---

## 6. The "Somatic Script" Template (Technical View)

```text
[warmly] [Hook Question]? [short pause]
[softly] [Validation Statement]. [sighs]
[long pause]

[thoughtfully] [The Pivot/Insight].
[gently] [The Science/Explanation]. [short pause]
[inhales deeply]
[exhales]

[reassuring] [The Action Step].
[softly] [The Closing Affirmation].
```

---

## 7. Troubleshooting "Robotic" Audio
If the output feels flat:
1.  **Check Punctuation:** Remove commas, add periods. Short sentences = better cadence.
2.  **Add "Filler" Sounds:** "Hmm." "You know..." "Look..." (These make it sound human).
3.  **Lower Stability:** Drop from 50% to 40% to let the AI "act" more.
