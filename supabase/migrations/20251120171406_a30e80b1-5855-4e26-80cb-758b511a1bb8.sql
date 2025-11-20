INSERT INTO scripts (
  title,
  category,
  profile,
  age_min,
  age_max,
  difficulty,
  duration_minutes,
  the_situation,
  what_doesnt_work,
  strategy_steps,
  why_this_works,
  what_to_expect,
  common_variations,
  parent_state_needed,
  tags,
  emergency_suitable
) VALUES (
  'Siblings argument escalates into rage attack',
  'Tantrums',
  'INTENSE',
  4,
  11,
  'Hard',
  45,
  
  $$Your children are playing. A small disagreement starts—who gets the toy, who had it first. Your INTENSE child's voice rises. Within **seconds**, it escalates: screaming, **physical aggression** (hitting, pushing, grabbing), complete **emotional deregulation**.

The INTENSE brain experiences **perceived injustice as a threat**—when they feel wronged by a sibling, their amygdala **floods** with cortisol and adrenaline. This isn't manipulation; it's a **neurological crisis**. By the time you intervene, they're in **full fight-or-flight**, unable to hear reason, possibly violent.$$,
  
  $$❌ **Immediately punishing the INTENSE child or sending them to their room**
→ They're in amygdala hijack—punishment **before** regulation just teaches "my feelings are wrong." They'll internalize shame, not learn conflict resolution.

❌ **Forcing an apology while they're still dysregulated**
→ A coerced "sorry" while their nervous system is in crisis is meaningless. They can't access the prefrontal cortex needed for genuine remorse yet.

❌ **Trying to adjudicate who's "right" during the meltdown**
→ The INTENSE brain hears this as "you don't believe me" and **escalates further**. Justice-seeking can wait until regulation happens.

**Why these backfire:** The INTENSE brain's **threat detection system is hypersensitive**. During sibling conflict, they genuinely perceive existential-level injustice. Logic, punishment, or fairness debates **before** co-regulation just increase cortisol.$$,
  
  $$[
    {
      "step_number": 1,
      "step_title": "Separate and regulate FIRST",
      "step_explanation": "Your immediate job is **nervous system safety**, not conflict resolution.\n\n**Your move:** Physically separate them if needed (calmly but firmly). Get the INTENSE child to a different space—**not as punishment**, as a **regulation zone**. Say it neutrally.\n\n**The shift:** You're teaching their brain that **regulation comes before resolution**. The other child can wait 10 minutes; the INTENSE child's nervous system can't.",
      "what_to_say_examples": [
        "I can see you're really upset. Let's go to the quiet space together so you can calm down.",
        "Your body needs a break right now. We'll talk about what happened after you feel better."
      ]
    },
    {
      "step_number": 2,
      "step_title": "Co-regulate without fixing",
      "step_explanation": "Sit with them. **Do NOT immediately ask what happened** or try to solve it. Their brain is still in fight-or-flight.\n\n**Do NOT:** Minimize their feelings (\"It's not a big deal\") or defend the sibling (\"They didn't mean to\"). To the INTENSE brain, this feels like **betrayal**.\n\n**Important:** Use **deep breathing, physical touch (if they allow it), or silent presence**. Wait for **body cues** that regulation is happening: breathing slows, fists unclench, eye contact returns. This can take **10-20 minutes**. Your patience **is** the intervention.",
      "what_to_say_examples": [
        "I'm right here. You're safe. Let's breathe together.",
        "I can see your body is really upset. I'm going to sit here with you until it feels better."
      ]
    },
    {
      "step_number": 3,
      "step_title": "Teach conflict skills when regulated",
      "step_explanation": "**Only after** they're calm, now you can address the conflict. Ask what happened from their perspective **without judgment**.\n\n**The regulation message:** Validate the feeling, **then** teach the skill. \"You felt like [sibling] was unfair. That makes sense. **Next time**, what could you do before screaming?\"\n\n**Why it matters:** The INTENSE brain needs to learn that **feelings are valid AND there are better strategies**. You're building the neural pathway: **conflict → regulation → resolution**, not **conflict → explosion → punishment**.",
      "what_to_say_examples": [
        "You were really angry when he took your toy. That's okay to feel. What could you do next time before it gets so big?",
        "I hear you—it felt unfair. Let's practice what you can say to him when you feel that way, so your body doesn't get so upset."
      ]
    }
  ]$$::jsonb,
  
  $$**The INTENSE brain's sense of justice is wired to their threat detection system.**

By **separating and regulating first** (step 1), you're teaching their amygdala that **physical safety comes before being "right."** By **co-regulating without fixing** (step 2), you're building the neural pathway that **big feelings don't require immediate action**. By **teaching conflict skills when regulated** (step 3), you're wiring the prefrontal cortex to **override the amygdala next time**.

**The first 3 weeks will be exhausting.** They'll rage **harder** before they regulate faster (extinction burst). But by **week 4**, most INTENSE kids start **pausing before attacking** because they've learned: **"Mom helps me calm down, then we solve it."**$$,
  
  $$
  {
    "first_5_minutes": "Expect **resistance to separation**. They may scream \"It's not fair!\" or try to go back to the sibling. **Hold the boundary calmly**—this is regulation, not punishment.",
    "by_10_minutes": "Watch for the **extinction burst**: they may escalate (louder crying, accusations) to test if you'll cave. **Stay present and calm**. This is their nervous system **learning to down-regulate**.",
    "by_week_2": "You'll notice **faster regulation**—from 20 minutes to 10, then to 5. They'll start **seeking you out** before the explosion instead of after. This is massive progress.",
    "dont_expect": [
      "Immediate sibling harmony — the INTENSE brain will still perceive injustice intensely; you're just teaching them better tools",
      "No more sibling fights — conflict is normal; **regulated responses** to conflict is the goal"
    ],
    "this_is_success": "Success = they come to you **before** hitting and say \"I'm really mad at [sibling].\" Or they take **3 deep breaths** before screaming. These micro-skills are **neural rewiring** in action."
  }
  $$::jsonb,
  
  $$[
    {
      "variation_scenario": "They refuse to leave the room/separate from the sibling",
      "variation_response": "**Stay calm but firm.** \"I can see you want to stay, but your body needs space right now. I'm going to help you.\" Physically guide them if needed (gently). Non-negotiable boundaries **during dysregulation** teach safety."
    },
    {
      "variation_scenario": "The sibling WAS genuinely wrong/started it",
      "variation_response": "**Validate later, regulate now.** After the INTENSE child is calm, address the sibling's behavior separately. During crisis, **both kids need to know**: feelings first, fairness second."
    },
    {
      "variation_scenario": "You're triggered by the screaming and feel like yelling yourself",
      "variation_response": "**This is so common.** Take your own deep breath before engaging. Say out loud: \"I need a second\" and step away briefly if needed. You cannot co-regulate while dysregulated yourself."
    },
    {
      "variation_scenario": "They hit you during the rage attack",
      "variation_response": "**Block calmly without anger.** \"I won't let you hurt me. I'm going to keep us both safe.\" Hold their hands gently if needed. After regulation, address: \"Your body was really upset. Hitting isn't okay. What can we do next time?\""
    }
  ]$$::jsonb,
  
  'Calm, **sturdy**, non-reactive. You must be **the regulator**—not scared, not angry, just **grounded**. The INTENSE child needs to feel your nervous system is **bigger than their storm**.',
  
  ARRAY['tantrums', 'intense', 'siblings', 'aggression', 'conflict', 'regulation', 'violence'],
  
  false
);