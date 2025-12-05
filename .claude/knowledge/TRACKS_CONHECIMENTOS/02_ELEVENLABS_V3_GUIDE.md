# ElevenLabs V3 Prompting Guide

> **ALWAYS consult this guide before creating any audio scripts for the NEP System.**

## Voice Selection (CRITICAL)

The voice must match the desired delivery:
- **Emotionally diverse voices**: Best for expressive content (vary tones in recordings)
- **Neutral voices**: More stable across languages and styles
- Choose from [V3 optimized voices](https://elevenlabs.io/app/voice-library/collections/aF6JALq9R6tXwCczjhKH)

**Current NEP Voice**: Hope (or Sarah for alternatives)

---

## Stability Settings

| Setting | Description | Use Case |
|---------|-------------|----------|
| **Creative** | More emotional, expressive, prone to hallucinations | Maximum expressiveness |
| **Natural** | Closest to original voice, balanced | Default for NEP content |
| **Robust** | Highly stable, less responsive to tags | Consistency over expression |

**Recommendation for NEP**: Use **Natural** for parenting content (calm but responsive).

---

## Audio Tags

### Emotional/Delivery Tags
```
[happy] [sad] [excited] [angry] [annoyed] [appalled]
[thoughtful] [surprised] [curious] [sarcastic] [mischievously]
[whispers] [reassuring] [sympathetic] [professional] [warmly]
```

### Non-Verbal Tags
```
[laughs] [chuckles] [sighs] [exhales] [inhales deeply]
[clears throat] [short pause] [long pause] [crying] [snorts]
```

### Sound Effects (use sparingly)
```
[applause] [clapping] [swallows] [gulps]
```

---

## Punctuation Effects

| Punctuation | Effect |
|-------------|--------|
| `...` (ellipses) | Adds pauses and weight |
| `CAPITALIZATION` | Increases emphasis |
| `—` (em dash) | Natural speech interruption |
| `?` | Rising intonation |
| `!` | Emphasis/excitement |

---

## NEP-Specific Best Practices

### For Calm Parenting Content:
```text
[warmly] Take a breath, mama. [short pause] You're doing better than you think.

[reassuring] This moment feels impossible... [sighs] but it will pass.

[thoughtfully] When your child is dysregulated... [short pause] 
they need YOUR calm, not your correction.
```

### For Educational Content:
```text
[curious] Have you ever wondered... [short pause] 
why your child melts down at the WORST possible moments?

[thoughtfully] Here's what most parents don't realize... 
[exhales] it's not about control. It's about connection.
```

### For Guided Exercises:
```text
[softly] Close your eyes for a moment... [long pause]

[gently] Now, take a deep breath in... [inhales deeply] 
and slowly let it out... [exhales]

[warmly] Notice how your shoulders drop... [short pause] 
That's the calm your child needs to borrow from you.
```

---

## Script Structure Template

```text
[OPENING - Hook with emotion]
[warmly/curious/thoughtfully] Opening line that connects emotionally...

[BODY - Key insights with pauses]
[short pause] Main content with strategic pauses...
[sighs/exhales] Emotional beats where appropriate...

[CLOSING - Reassurance]
[reassuring/warmly] Closing affirmation...
[short pause] Final thought.
```

---

## Common Mistakes to AVOID

❌ Using tags that contradict the voice's character
❌ Overusing tags (every sentence)
❌ Tags for visual things: `[smiling]`, `[nodding]`, `[standing]`
❌ Very short prompts (< 250 characters)
❌ Expecting a calm voice to shout convincingly

---

## Quality Checklist Before Generation

- [ ] Script is > 250 characters
- [ ] Tags match voice character (calm, warm)
- [ ] Natural punctuation for pacing
- [ ] Strategic CAPITALIZATION for emphasis
- [ ] Emotional arc (opening → insight → resolution)
- [ ] Pauses placed at meaningful moments
- [ ] No contradictory tags (e.g., `[shouts]` on calm voice)

---

## Example: Complete NEP Audio Script

```text
[warmly] Hey mama... [short pause] I need you to hear something.

[thoughtfully] That moment today... when everything fell apart? 
[sighs] When your child was screaming and you felt like you were failing?

[reassuring] You weren't failing. [short pause] 
You were doing the HARDEST job in the world... 
without a manual, without enough sleep, without enough support.

[gently] Here's what I want you to remember... [exhales]

Your child's big emotions are not a reflection of your parenting. 
[short pause] They're a reflection of a developing brain... 
still learning to handle a world that feels TOO big, TOO loud, TOO much.

[warmly] And you? [short pause] 
You're the safe place they fall apart in... 
BECAUSE they trust you to catch them.

[softly] So tonight... [long pause] 
be gentle with yourself. 
You're doing better than you know.
```

---

## Voice Settings for NEP Content

| Parameter | Value | Reason |
|-----------|-------|--------|
| Model | eleven_v3 | Latest, most expressive |
| Stability | Natural (50-60%) | Balanced calm + responsive |
| Speed | 0.85-0.90 | Slightly slower for reflection |
| Voice | Hope/Sarah | Warm, maternal, calm |

---

*Last updated: December 2025*
*Reference: ElevenLabs V3 Alpha Documentation*
