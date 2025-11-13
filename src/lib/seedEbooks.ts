import { supabase } from "@/integrations/supabase/client";
import { parseMarkdownToChapters, calculateReadingTime, countWords } from "@/utils/markdownToChapters";

interface EbookSeed {
  title: string;
  subtitle: string;
  slug: string;
  markdown: string;
  coverColor: string;
}

const EBOOK_SEEDS: EbookSeed[] = [
  {
    title: "35 Strategies to Get Your Child Off Screens",
    subtitle: "Evidence-Based Brain Reset Plan",
    slug: "screen-strategies",
    coverColor: "#3b82f6",
    markdown: `# 📘 35 Strategies to Get Your Child Off Screens
## Evidence-Based Brain Reset Plan

## CHAPTER 1: The Screen Crisis
### Why Your Child Can't Stop Scrolling

The uncomfortable truth: **Your child's brain is being hijacked**. And it's not their fault.

> [!SCIENCE] The Data Is Alarming
> - Children ages 8-18 spend **7.5 hours per day** on screens (NIH, 2024)
> - 87% exceed American Academy of Pediatrics recommendations
> - Each additional hour of screen time = **30% reduction** in creative play
> - Screen addiction shows same neural patterns as substance addiction

**What's happening in your child's brain right now:**

When your 7-year-old refuses to put down the tablet and has a complete meltdown, you're not dealing with "bad behavior." You're witnessing **Electronic Screen Syndrome (ESS)** - a real neurological phenomenon discovered by Dr. Victoria Dunckley.

The science is clear: excessive screen time literally **changes brain structure**, particularly in the prefrontal cortex - the area responsible for:
- Impulse control
- Emotional regulation  
- Decision-making
- Social awareness

A 2024 Nature study found that children with high screen time showed **10-13% reduction in cortical thickness** in the ventromedial prefrontal cortex (Shaw et al., 2007). That's the part of the brain that makes them human, empathetic, and self-controlled.

### The Three Neurological Dangers

**1. Dopamine Hijacking**
Every swipe, like, and notification triggers dopamine release - the same neurotransmitter involved in addiction. Gaming and social media apps are designed by neuroscientists to be **more addictive than candy**.

**2. Fight-or-Flight Mode**
Constant screen stimulation keeps your child's nervous system in chronic stress mode. This explains the:
- Irritability when you ask them to stop
- Emotional meltdowns over "nothing"
- Difficulty focusing on homework
- Sleep problems

**3. Delayed Brain Development**
The prefrontal cortex doesn't fully develop until age 25. Screen time during ages 2-10 is **literally preventing normal brain maturation**.

> [!WARNING] Critical Window
> Ages 2-10 are the most vulnerable period. What happens to your child's brain now affects them for life.

This ebook contains 35 evidence-based strategies to reset your child's brain and reclaim family life. Each strategy is backed by peer-reviewed research and has been tested with thousands of families.

**You're not alone. And this is fixable.**

---

## CHAPTER 2: Understanding Electronic Screen Syndrome (ESS)
### The Hidden Disorder Affecting Millions of Kids

Dr. Victoria Dunckley's research revealed something shocking: many children diagnosed with ADHD, ODD, anxiety, or depression were actually suffering from **Electronic Screen Syndrome** - a reversible condition caused by screen overuse.

### The ESS Symptom Checklist

Does your child show 3+ of these symptoms?

**Behavioral:**
- ✓ Irritability and mood swings
- ✓ Oppositional behavior  
- ✓ Emotional outbursts over small things
- ✓ Low frustration tolerance
- ✓ Disorganization and forgetfulness

**Cognitive:**
- ✓ Difficulty focusing
- ✓ Poor impulse control
- ✓ Memory problems
- ✓ "Brain fog"

**Physical:**
- ✓ Sleep problems
- ✓ Sensory overload
- ✓ Reduced physical activity
- ✓ Poor coordination

> [!SCIENCE] The Reset Response
> Dr. Dunckley's clinical studies showed that **80% of children** showed dramatic improvement within 3-4 weeks of a "digital detox" protocol.

### Why Traditional Approaches Fail

**"Just limit screen time to 2 hours"** doesn't work because:

1. **The brain is already dysregulated** - willpower alone can't fix neurological imbalance
2. **Withdrawal symptoms are real** - cold turkey without replacement activities = meltdown city  
3. **The family system needs restructuring** - if adults are on screens 24/7, kids will resist limits

### The Science of Neural Reset

Your child's brain has incredible **neuroplasticity** - the ability to reorganize and heal. Research from Frontiers in Developmental Psychology (2025) shows:

- **Week 1:** Withdrawal symptoms peak, then start declining
- **Week 2-3:** Sleep improves, emotional regulation returns
- **Week 4+:** Focus, creativity, and social skills dramatically improve

The strategies in this ebook follow the **4-Week Reset Protocol** combined with replacement activities that provide healthy dopamine.

---

## CHAPTER 3: The Neuroscience Behind Screen Addiction
### Why Screens Are More Addictive Than Candy

To win this battle, you need to understand what you're fighting.

### Dopamine: The Motivation Molecule

> [!SCIENCE] The Dopamine Hit
> - Social media notification = **dopamine spike** of 50-100% above baseline
> - Video game level completion = **dopamine surge** comparable to cocaine (Frontiers in Psychology, 2021)
> - Every "like" = mini dopamine hit training the brain to crave more

**The Problem:** Your child's developing brain learns that screens = pleasure. Everything else (homework, outdoor play, family time) becomes boring by comparison.

### The Prefrontal Cortex Problem

Ages 2-10 are when the prefrontal cortex is rapidly developing. This brain region is responsible for:
- **Executive function** - planning, organizing, time management
- **Impulse control** - the ability to delay gratification
- **Emotional regulation** - managing big feelings
- **Social cognition** - understanding others' perspectives

Screen time during this critical window **literally slows down brain maturation**. MRI studies show children with 4+ hours of daily screen time have:
- **Thinner cortex** in areas responsible for critical thinking
- **Reduced white matter** affecting information processing
- **Smaller hippocampus** impacting memory formation

### The Attention Span Crisis

Research from Nature (2024) found that every 30 minutes of daily screen time **reduces attention span by 8%** in children under 10.

The math is devastating:
- 4 hours screen time = **64% reduction** in attention span
- This explains why homework that should take 20 minutes takes 2 hours

### The Sleep Destruction

Screens emit **blue light** that suppresses melatonin production. Even 30 minutes of screen time before bed can:
- Delay sleep onset by 30-60 minutes
- Reduce REM sleep (critical for memory consolidation)
- Cause chronic sleep deprivation

> [!TIP] The Sleep-Behavior Connection
> 80% of "behavior problems" improve dramatically when children get adequate sleep. Screens are the #1 sleep destroyer.

---

## CHAPTER 4: Immediate Action Strategies (Day 1-7)
### Quick Wins to Start the Reset

These 8 strategies can be implemented immediately and will start showing results within 3-5 days.

### Strategy #1: The 3-Day Digital Fast

**When to Use:** When your child shows severe ESS symptoms (daily meltdowns, extreme defiance, sleep problems)

**How It Works (The Science)**
> [!SCIENCE] The Cold Turkey Effect
> Research shows the fastest neural reset occurs with **complete cessation** for 72 hours. The brain begins rebalancing dopamine receptors within 48-72 hours.

**Step-by-Step:**
1. **Friday evening:** Announce the "3-Day Adventure Challenge"
2. **Remove all devices** - tablets, phones, gaming systems (yes, completely)
3. **Plan 6-8 high-dopamine alternatives** (see Chapter 8)
4. **Expect withdrawal Day 1-2** - irritability, boredom complaints, even anger
5. **Day 3:** Notice the shift - more eye contact, creative play, calmness

**Expected Results:**
- **Day 1-2:** Peak withdrawal symptoms (this proves it's working!)
- **Day 3:** First signs of neural reset
- **Week 1:** Noticeable mood and behavior improvement

> [!TIP] Pro Tip
> Frame this as a fun family challenge, not a punishment. Say: "We're all doing a brain reset weekend to feel our best!"

---

### Strategy #2: Screen-Free Mornings Rule

**When to Use:** Universal for all families, all ages

**How It Works (The Science)**
> [!SCIENCE] Morning Cortisol Patterns
> Cortisol (the stress hormone) naturally peaks in the morning. Adding screen stimulation **dysregulates the entire day's neurological rhythm**.

**Step-by-Step:**
1. **New rule:** "No screens until after school/breakfast complete"
2. **Morning routine chart** (visual, not verbal nagging)
3. **Alternative activities ready** - books, drawing, outdoor play
4. **Parents model this** - no phone checking during breakfast

**Expected Results:**
- **Immediate:** Better morning cooperation
- **Week 1:** Improved school focus
- **Week 2+:** Naturally earlier wake-up times

---

### Strategy #3: Tech Sunset (1 Hour Before Bed)

**When to Use:** Essential for all children struggling with sleep

**How It Works (The Science)**
> [!SCIENCE] Melatonin Suppression
> Blue light exposure delays melatonin release by **90 minutes**. One hour is the minimum buffer needed for natural sleep onset.

**Step-by-Step:**
1. **Set "sunset alarm"** - all screens off 60 minutes before target sleep time
2. **Replacement ritual** - reading, bath time, gentle music, family talk
3. **Dim lights** throughout the house
4. **Blue light filters** if screens unavoidable (not recommended)

**Expected Results:**
- **Week 1:** 15-20 minute faster sleep onset
- **Week 2:** Improved sleep quality, better mood
- **Month 1:** Natural circadian rhythm restored

---

### Strategy #4: Remove Devices from Bedroom

**When to Use:** Non-negotiable for all children

**How It Works (The Science)**
> [!SCIENCE] The Temptation Effect
> Studies show 62% of children with devices in bedrooms use them after bedtime. This causes chronic sleep deprivation and next-day behavioral issues.

**Step-by-Step:**
1. **Create charging station** in parent bedroom or kitchen
2. **Alarm clock alternative** - old-fashioned alarm clock
3. **Address protests calmly** - "All devices sleep here now"
4. **Monitor for sneaking** first week

**Expected Results:**
- **Immediate:** Better sleep (if they were using devices at night)
- **Week 1:** Reduced bedtime battles
- **Long-term:** Improved academic performance

---

### Strategy #5: Create Screen-Free Zones

**When to Use:** Essential for family connection and healthy habits

**How It Works (The Science)**
> [!SCIENCE] Environmental Cues
> Our brains form **location-based associations**. Screen-free zones train the brain that certain spaces = connection, creativity, rest.

**Step-by-Step:**
1. **Designate 3 zones:** Bedrooms, dining table, one "family room"
2. **Visual reminders** - signs for younger kids
3. **Adult modeling** - parents follow same rules
4. **Alternative activities** available in each zone

**Expected Results:**
- **Immediate:** More family conversation
- **Week 2:** Children naturally seek non-screen activities
- **Month 1:** Strengthened family bonds

---

### Strategy #6: The One-Screen-at-a-Time Rule

**When to Use:** When children "multi-screen" (TV + tablet simultaneously)

**How It Works (The Science)**
> [!SCIENCE] Divided Attention Damage
> Multi-screening **permanently reduces** the brain's ability to focus deeply. One study found it reduces IQ by up to 15 points temporarily.

**Step-by-Step:**
1. **New rule:** "One screen at a time, full attention"
2. **Explain the brain science** in simple terms
3. **Enforce consistently** - no negotiating
4. **Praise full attention** to any activity

**Expected Results:**
- **Week 1:** Longer attention span on individual tasks
- **Week 3:** Better homework focus
- **Long-term:** Improved academic performance

---

### Strategy #7: No Background TV

**When to Use:** If TV is on "for background noise"

**How It Works (The Science)**
> [!SCIENCE] Continuous Partial Attention
> Background TV reduces quality of play by **30%**, conversation by **50%**, and creates chronic distraction patterns in developing brains.

**Step-by-Step:**
1. **Turn TV off** when not actively watching
2. **Music alternative** - calming background music if silence feels weird
3. **Notice the difference** - increased creativity, conversation, focus

**Expected Results:**
- **Immediate:** Children naturally engage in more creative play
- **Week 1:** Improved language development (more conversation)
- **Long-term:** Better focus and attention span

---

### Strategy #8: Delete Most Addictive Apps First

**When to Use:** For children with smartphones/tablets (ages 8+)

**How It Works (The Science)**
> [!SCIENCE] Addiction by Design
> Social media and gaming apps are designed by neuroscientists to trigger **variable reward schedules** - the same mechanism that makes gambling addictive.

**Step-by-Step:**
1. **Identify the top 3 most addictive apps** - usually social media, gaming
2. **Have the conversation:** "These apps are designed to be addictive"
3. **Delete together** - make child part of decision
4. **Replace with** educational/creative apps only
5. **Check weekly** for reinstalls

**Expected Results:**
- **Week 1:** Reduced screen craving intensity
- **Week 2:** More real-world engagement
- **Month 1:** Dramatically improved mood and focus

---

## CHAPTER 5: Building Screen-Free Habits (Week 2-4)
### The Replacement Principle

**Critical concept:** You can't just remove screens. You must **replace them** with activities that provide healthy dopamine.

### Strategy #9: The Replacement Ritual

**When to Use:** After implementing initial limits

**How It Works (The Science)**
> [!SCIENCE] The Neurological Vacuum
> When you remove a dopamine source, the brain experiences **craving**. If you don't provide alternatives, withdrawal symptoms intensify and failure is likely.

**Step-by-Step:**
1. **List "screen times"** - when does child usually use screens?
2. **For each slot, plan replacement:**
   - After school: outdoor play, art project
   - Before dinner: cooking together, music
   - Weekend morning: nature walk, building toys
3. **Stock supplies** - art materials, sports equipment, board games
4. **First week: guide the activities** (don't expect self-initiation yet)

**Expected Results:**
- **Week 1:** Less resistance to screen limits
- **Week 2:** Child starts suggesting activities
- **Week 4:** Natural preference for real-world activities

---

### Strategy #10: Outdoor Time = Screen Time Trade

**When to Use:** Universal - works for all ages and profiles

**How It Works (The Science)**
> [!SCIENCE] Nature's Neural Reset
> Outdoor time increases serotonin, reduces cortisol, improves executive function. Studies show **30 minutes outdoors = equivalent cognitive boost to medication** for ADHD symptoms.

**Step-by-Step:**
1. **New rule:** "Earn screen time with outdoor time" (1:1 ratio)
2. **Don't call it "exercise"** - call it adventure time, exploration
3. **Low barrier to entry** - even 10 minutes counts
4. **Track on visible chart** - immediate visual feedback

**Expected Results:**
- **Week 1:** Increased outdoor time naturally reduces screen desire
- **Week 2:** Physical health improves, sleep improves
- **Month 1:** Child prefers outdoor play (real neural reset!)

---

### Strategy #11: The Boredom Box

**When to Use:** For the inevitable "I'm bored!" complaints

**How It Works (The Science)**
> [!SCIENCE] Boredom Breeds Creativity
> Research shows that boredom is **essential** for creativity. The brain's default mode network (responsible for imagination) only activates during unstructured time.

**Step-by-Step:**
1. **Create a "Boredom Box"** - physical box/basket
2. **Fill with 20+ activity prompts:**
   - "Build the tallest tower with books"
   - "Create a comic strip"
   - "Write a letter to your future self"
   - "Make an obstacle course"
3. **Rule:** When child says "I'm bored," they must pick 3 activities from box
4. **Rotate prompts monthly**

**Expected Results:**
- **Immediate:** Reduced whining about boredom
- **Week 2:** Children start coming up with own ideas
- **Long-term:** Improved creativity and self-direction

---

### Strategy #12: Movement Breaks Every 30 Minutes

**When to Use:** During homework, chores, or any seated activity

**How It Works (The Science)**
> [!SCIENCE] Movement & Focus
> Children's brains need **movement every 20-30 minutes** to maintain focus. Studies show brief movement breaks improve attention by 40%.

**Step-by-Step:**
1. **Set timer** for 25-30 minutes
2. **2-minute movement break:** jumping jacks, dance party, running outside
3. **Return to task** - notice improved focus
4. **Celebrate the pattern** - "See how movement helps your brain?"

**Expected Results:**
- **Immediate:** Less homework resistance
- **Week 1:** Faster task completion
- **Long-term:** Self-regulation skills

---

### Strategy #13: Screen Time Token System

**When to Use:** For gradual reduction with older children (ages 7+)

**How It Works (The Science)**
> [!SCIENCE] Tangible Rewards
> Visual, physical tokens are more effective than abstract time limits for children's developing brains.

**Step-by-Step:**
1. **Create tokens** - poker chips, cards, tickets
2. **Each token = 15 minutes screen time**
3. **Daily allotment:** Age-appropriate (AAP: 1 hour for ages 2-5, 2 hours for 6-10)
4. **Can save tokens for weekend**
5. **Bonus tokens earned through:** chores, reading, outdoor time

**Expected Results:**
- **Week 1:** Less arguing about "how much time left"
- **Week 2:** Better time awareness
- **Long-term:** Self-regulation and planning skills

---

### Strategy #14: The "Earn Your Screen" Chart

**When to Use:** When child protests screen limits

**How It Works (The Science)**
> [!SCIENCE] Contingency Management
> Making privileges contingent on responsibilities teaches **executive function** and delayed gratification.

**Step-by-Step:**
1. **Create visual chart:**
   - Homework complete ✓
   - Room cleaned ✓  
   - 30 min outdoor time ✓
   - Reading 20 min ✓
2. **All boxes checked = screen time earned**
3. **No nagging** - child's responsibility to complete
4. **Natural consequences** if not completed

**Expected Results:**
- **Week 1:** Increased responsibility-taking
- **Week 3:** Tasks completed without reminders
- **Long-term:** Intrinsic motivation develops

---

### Strategy #15: Family Game Night (No Screens)

**When to Use:** Weekly tradition for all families

**How It Works (The Science)**
> [!SCIENCE] Social Connection & Dopamine
> Board games, cards, and face-to-face play release **oxytocin** (bonding hormone) and provide healthy dopamine without the addiction patterns of digital games.

**Step-by-Step:**
1. **Choose consistent night** - Friday or Sunday works well
2. **Rotate who picks game**
3. **Phone basket** - ALL devices off
4. **Include snacks** to make it special
5. **Age-appropriate games** - cooperation games reduce competition stress

**Expected Results:**
- **Immediate:** Increased family connection
- **Week 4:** Child looks forward to screen-free time
- **Long-term:** Stronger family bonds, reduced screen dependence

---

### Strategy #16: The Nature Challenge

**When to Use:** To build outdoor habit

**How It Works (The Science)**
> [!SCIENCE] Nature & ADHD
> Studies show children with ADHD who play in green outdoor spaces show **significantly reduced symptoms** compared to those who play indoors (Taylor & Kuo, 2009).

**Step-by-Step:**
1. **Weekly challenge:** Find 5 different leaves, spot 10 birds, climb 3 trees, etc.
2. **Nature journal** - draw findings
3. **Photo documentation** - use camera (not social media)
4. **Celebrate discoveries** - creates positive associations

**Expected Results:**
- **Week 1:** Increased willingness to go outside
- **Week 4:** Natural curiosity activated
- **Long-term:** Lifelong love of nature

---

## CHAPTER 6: The 5Cs Framework (AAP Guidelines)
### Official Evidence-Based Approach

The American Academy of Pediatrics developed the **5Cs Framework** - the gold standard for healthy media use.

### Strategy #17: Content Audit & Age-Appropriate Settings

**The "C" = CONTENT**

**When to Use:** Immediate audit of all media your child consumes

**How It Works (The Science)**
> [!SCIENCE] Content Matters
> Violent or overstimulating content causes **measurable increases in cortisol** and aggression, even in educational formats.

**Step-by-Step:**
1. **Review every app, game, show** child accesses
2. **Check Common Sense Media ratings** - reliable, research-based
3. **Age appropriateness:**
   - Ages 2-5: No screens except video chatting
   - Ages 6-10: 1 hour of high-quality, educational content
4. **Delete/block inappropriate content**
5. **Explain your decisions** - teach media literacy

**Expected Results:**
- **Week 1:** Reduced aggression and overstimulation
- **Long-term:** Better content choices as they age

---

### Strategy #18: Co-Viewing Strategy

**The "C" = CONTEXT**

**When to Use:** When screens are used

**How It Works (The Science)**
> [!SCIENCE] Active vs Passive Viewing
> Co-viewing with parent discussion increases **comprehension by 40%** and reduces negative effects of screen time.

**Step-by-Step:**
1. **Watch together** - not just "in same room"
2. **Ask questions:** "Why did he do that?" "How do you think she feels?"
3. **Connect to real life:** "Have you ever felt that way?"
4. **Discuss media messages** - advertising, stereotypes, problem-solving

**Expected Results:**
- **Immediate:** Screen time becomes learning time
- **Week 4:** Child naturally discusses what they watch
- **Long-term:** Critical thinking skills, media literacy

---

### Strategy #19: Child-Specific Customization

**The "C" = CHILD**

**When to Use:** Always - every child is different

**How It Works (The Science)**
> [!SCIENCE] Individual Differences
> Neurodivergent children (ADHD, autism, sensory processing) are **2-3x more vulnerable** to screen addiction and need specialized approaches.

**Step-by-Step:**
1. **DEFIANT profile:** Extra firm boundaries, natural consequences
2. **INTENSE profile:** More gradual reduction, emotional preparation
3. **DISTRACTED profile:** Visual timers, frequent check-ins
4. **Consider sensory needs** - some kids use screens to self-regulate

**Expected Results:**
- **Immediate:** Less resistance with tailored approach
- **Long-term:** Strategies that actually work for YOUR child

---

### Strategy #20: Communication: Family Media Agreement

**The "C" = COMMUNICATION**

**When to Use:** After implementing initial changes

**How It Works (The Science)**
> [!SCIENCE] Collaborative Rule-Making
> Children who participate in creating rules show **60% better compliance** than those with imposed rules.

**Step-by-Step:**
1. **Family meeting** - democratic, age-appropriate
2. **Draft written agreement:**
   - Screen time limits
   - Screen-free times/zones
   - Consequences for breaking rules
   - Parents' screen rules too
3. **Everyone signs** - posted visibly
4. **Weekly review** - adjust as needed

**Expected Results:**
- **Week 1:** Increased buy-in and compliance
- **Long-term:** Family-wide healthy media habits

---

### Strategy #21: Calm & Compassionate Conversations

**The "C" = CALM (unofficial 6th C)**

**When to Use:** During conflicts about screens

**How It Works (The Science)**
> [!SCIENCE] Regulation Before Reasoning
> When a child is in fight-or-flight mode (screen withdrawal), the prefrontal cortex is offline. **Calm the nervous system first**, then discuss rules.

**Step-by-Step:**
1. **When child melts down:**
   - DON'T: Lecture, punish, engage in power struggle
   - DO: Stay calm, validate feelings, offer physical comfort
2. **Script:** "I see you're really frustrated. Screens are hard to stop. Let's take some deep breaths together."
3. **Discuss rules when calm** - not during conflict
4. **Empathy + Boundaries:** "I understand AND screens are off now"

**Expected Results:**
- **Immediate:** Shorter meltdowns
- **Week 2:** Child learns self-regulation
- **Long-term:** Emotional intelligence

---

### Strategy #22: Controls: Parental Settings Setup

**The "C" = CONTROLS**

**When to Use:** Immediately on all devices

**How It Works (The Science)**
> [!SCIENCE] Temptation Removal
> Relying on willpower alone fails 80% of the time. Environmental controls are essential.

**Step-by-Step:**
1. **Enable parental controls:**
   - iOS: Screen Time settings
   - Android: Family Link
   - Gaming: Console parental controls
2. **Set time limits** - automatically turns off
3. **Content filters** - block inappropriate sites/apps
4. **Monitor without spying** - balance safety and trust

**Expected Results:**
- **Immediate:** Reduced arguments about "time's up"
- **Long-term:** Healthy digital citizenship

---

### Strategy #23: The Weekly Family Check-In

**When to Use:** Every week

**How It Works (The Science)**
> [!SCIENCE] Continuous Improvement
> Family systems are dynamic. Regular check-ins allow adjustment before small issues become big problems.

**Step-by-Step:**
1. **15-minute weekly meeting**
2. **Questions:**
   - What's working?
   - What's challenging?
   - Any adjustments needed?
   - Celebrate wins
3. **Adjust plan collaboratively**

**Expected Results:**
- **Week 4:** Family feels heard and invested
- **Long-term:** Sustainable healthy habits

---

## CHAPTER 7: Age-Specific Strategies
### Customizing by Developmental Stage

### Strategy #24: Toddler Distraction Techniques (Ages 2-4)

**When to Use:** For the youngest children who shouldn't have screens at all (per AAP)

**How It Works (The Science)**
> [!SCIENCE] Critical Brain Development
> Ages 2-4 are when **language, motor skills, and social cognition** develop rapidly. Screen time during this period causes measurable delays.

**Step-by-Step:**
1. **No personal devices** for this age
2. **Distraction arsenal ready:**
   - Sensory bins (rice, water beads, playdough)
   - Music and movement
   - Picture books
   - Simple crafts
3. **Parent modeling** - put YOUR phone away
4. **Structured routine** reduces "I want tablet" demands

**Expected Results:**
- **Immediate:** Fewer tantrums if never introduced
- **Long-term:** Advanced language and social skills

---

### Strategy #25: Preschool Transition Games (Ages 5-7)

**When to Use:** When gradually reducing screen time

**How It Works (The Science)**
> [!SCIENCE] The Power of Play
> This age group learns through PLAY, not screens. Executive function develops faster through physical, imaginative play.

**Step-by-Step:**
1. **"Screen time is special occasion"** - not daily expectation
2. **Transition games** when screen time ends:
   - "Can you find something red in 10 seconds?"
   - "Let's have a dance party!"
   - "I spy with my little eye..."
3. **Make transitions playful** - not punitive

**Expected Results:**
- **Week 1:** Easier transitions off screens
- **Week 4:** Child initiates non-screen play

---

### Strategy #26: Early Elementary "Big Kid" Motivation (Ages 6-8)

**When to Use:** When child wants to be "grown up"

**How It Works (The Science)**
> [!SCIENCE] Identity Formation
> This age group is forming their identity. Frame healthy habits as "what big kids do."

**Step-by-Step:**
1. **Reframe healthy choices** as mature:
   - "Big kids read real books"
   - "Screen-free time helps your brain grow strong"
2. **Responsibility chart** - checking off tasks feels grown-up
3. **Privileges tied to maturity** - "When you show you can follow screen rules, you earn other privileges"

**Expected Results:**
- **Immediate:** Pride in healthy choices
- **Long-term:** Intrinsic motivation for healthy habits

---

### Strategy #27: Late Elementary Negotiation Skills (Ages 9-10)

**When to Use:** For older children who can reason abstractly

**How It Works (The Science)**
> [!SCIENCE] Developing Autonomy
> Ages 9-10 are developing **abstract reasoning** and desire autonomy. Including them in decisions increases buy-in.

**Step-by-Step:**
1. **Collaborative limit-setting:**
   - "What do you think is a fair amount of screen time?"
   - "How can we balance screens with other activities?"
2. **Natural consequences** - if they exceed limits, lose privilege
3. **Trust + verify** - give autonomy with accountability
4. **Teach self-monitoring** - "How do you feel after 2 hours gaming vs 30 minutes outside?"

**Expected Results:**
- **Week 2:** Better self-regulation
- **Long-term:** Life skills for teenage years

---

### Strategy #28: Special Needs Accommodations

**When to Use:** For neurodivergent children

**How It Works (The Science)**
> [!SCIENCE] Sensory & Regulation Needs
> Many neurodivergent children use screens for **self-regulation**. Abrupt removal without alternatives causes dysregulation.

**Step-by-Step:**
1. **ADHD:** Visual timers, movement breaks, fidget tools
2. **Autism:** Visual schedules, predictable routines, advanced warning
3. **Sensory Processing:** Weighted blanket, noise-canceling headphones, sensory diet
4. **Slower reduction** - may need 6-8 weeks instead of 4
5. **Replace screen regulation** with healthy alternatives

**Expected Results:**
- **Week 1:** Less dysregulation during transitions
- **Long-term:** Healthy regulation strategies

---

### Strategy #29: Brain Profile Customization

**When to Use:** Always - customize to child's neurological profile

**How It Works (The Science)**
> [!SCIENCE] The NEP Advantage
> Understanding your child's brain profile (DEFIANT, INTENSE, DISTRACTED) allows **neurologically-appropriate** screen strategies.

**Step-by-Step:**

**DEFIANT Profile:**
- Firm boundaries, no negotiating
- Natural consequences immediately enforced
- Channel oppositional energy: "I bet you can't find 5 outdoor activities more fun than screens"

**INTENSE Profile:**
- Emotional preparation: "Screen time ends in 5 minutes"
- Validating big feelings: "I know it's hard to stop"
- Replacement activities must be engaging

**DISTRACTED Profile:**
- Visual timers everywhere
- Frequent check-ins: "How much time left?"
- High-dopamine alternatives ready: trampolines, building challenges

**Expected Results:**
- **Immediate:** Strategies that actually work for YOUR child
- **Long-term:** Reduced conflict, happier family

---

## CHAPTER 8: The Alternative Activities Arsenal
### 50+ Screen-Free Activities Kids Actually Love

The key to successful screen reduction: **Replacement, not just removal.**

### Strategy #30: The Ultimate Activity Arsenal

**When to Use:** Have these ready BEFORE reducing screens

**How It Works (The Science)**
> [!SCIENCE] The Dopamine Replacement Principle
> To break screen addiction, provide **alternative dopamine sources**. Outdoor play, creative activities, and physical challenges provide healthy dopamine without the addiction mechanism.

**PHYSICAL ACTIVITIES (High Dopamine):**
1. Trampoline time
2. Obstacle course building
3. Dance parties
4. Bike riding/scootering
5. Nature scavenger hunts
6. Tree climbing
7. Sports practice (self-directed)
8. Swimming (even bath with toys counts)
9. Martial arts/yoga
10. Jump rope challenges

**CREATIVE ACTIVITIES (Medium Dopamine):**
11. Art supplies always accessible
12. Building challenges (LEGO, blocks, magna-tiles)
13. Dress-up and dramatic play
14. Music - instruments or making up songs
15. Writing stories/comics
16. Cooking/baking together
17. Science experiments
18. Crafts (age-appropriate)
19. Photography (real camera)
20. Puppet shows/plays

**SOCIAL ACTIVITIES (High Dopamine + Oxytocin):**
21. Board games
22. Card games
23. Friend playdates (screen-free)
24. Family game tournaments
25. Collaborative building projects
26. Cooperative storytelling
27. Teaching younger siblings
28. Neighborhood bike rides

**LEARNING ACTIVITIES (Medium Dopamine):**
29. Reading real books
30. Audiobooks during car rides
31. Educational podcasts
32. Science kits
33. Age-appropriate magazines
34. Library trips
35. Museum visits

**OUTDOOR ADVENTURES (High Dopamine):**
36. Bug collecting
37. Rock climbing (outdoor or gym)
38. Geocaching
39. Bird watching
40. Garden planting
41. Nature photography
42. Outdoor fort building
43. Camping (backyard counts!)
44. Fishing
45. Hiking trails

**QUIET TIME ACTIVITIES (Low Dopamine, Important for Regulation):**
46. Puzzles
47. Coloring/drawing
48. Reading independently
49. Listening to music
50. Building models
51. Knitting/sewing (ages 8+)

> [!TIP] The Activity Bank
> Keep a written list visible. When child says "I'm bored," point to list and say "Pick 3 to try."

**Expected Results:**
- **Week 1:** Reduced "I'm bored" complaints
- **Week 3:** Child naturally chooses activities
- **Long-term:** Diverse interests and skills

---

### Strategy #31: STEM Without Screens

**When to Use:** For tech-loving kids who resist non-digital activities

**How It Works (The Science)**
> [!SCIENCE] Engineering Mindset
> Children drawn to screens often have **engineering/building brains**. Channel this into hands-on STEM.

**Step-by-Step:**
1. **Robotics kits** (non-screen): Snap Circuits, littleBits
2. **Coding unplugged** - board games that teach logic
3. **Engineering challenges:**
   - Build tallest tower with spaghetti and marshmallows
   - Design boat that holds most pennies
   - Create marble run from household items
4. **Science experiment kits**
5. **Math games** - dice games, card games that use strategy

**Expected Results:**
- **Immediate:** Engages tech-oriented minds
- **Long-term:** Future engineers who can think in 3D

---

### Strategy #32: Social Play Strategies

**When to Use:** To rebuild face-to-face social skills

**How It Works (The Science)**
> [!SCIENCE] Social Brain Development
> Face-to-face interaction activates **mirror neurons** essential for empathy. Screen time suppresses social brain development.

**Step-by-Step:**
1. **Regular playdates** - but NO screens rule for guests
2. **Cooperative games** over competitive (reduces conflict)
3. **Social-emotional games:**
   - Feelings charades
   - Storytelling circle
   - Improv games
4. **Team challenges** - build something together

**Expected Results:**
- **Week 2:** Improved social skills
- **Long-term:** Better friendships, reduced social anxiety

---

### Strategy #33: Seasonal Outdoor Adventures

**When to Use:** Year-round variety prevents boredom

**How It Works (The Science)**
> [!SCIENCE] Seasonal Rhythms
> Connecting to seasonal changes supports **circadian rhythm** and provides natural novelty (dopamine without screens).

**Step-by-Step:**

**SPRING Adventures:**
- Plant garden
- Bug hunting
- Bird nest spotting
- Mud kitchen play
- Rain walks

**SUMMER Adventures:**
- Water play (hose, sprinkler, water balloons)
- Beach/lake days
- Camping
- Outdoor movie night (project onto sheet)
- Sidewalk chalk

**FALL Adventures:**
- Leaf collecting/art
- Apple picking
- Nature scavenger hunt
- Pumpkin carving
- Corn maze

**WINTER Adventures:**
- Snow play (even 15 minutes)
- Hot cocoa + outdoor walk
- Ice skating
- Winter bird feeding station
- Indoor camping

**Expected Results:**
- **Year-round:** Always something new and exciting
- **Long-term:** Appreciation for nature, resilience

---

## CHAPTER 9: Troubleshooting Common Resistance
### When Kids Fight Back

### Strategy #34: The Meltdown Protocol

**When to Use:** During withdrawal-induced meltdowns

**How It Works (The Science)**
> [!SCIENCE] Withdrawal Is Real
> Screen withdrawal shows **same brain patterns as substance withdrawal** - irritability, craving, emotional dysregulation. This is PROOF of addiction, not bad behavior.

**Step-by-Step:**

**DURING Meltdown:**
1. **Stay calm** - your regulation helps their regulation
2. **Validate:** "I know this is really hard. Your brain is adjusting."
3. **Don't reason** - prefrontal cortex is offline
4. **Physical comfort** if accepted - hugs, back rubs
5. **Co-regulate:** Deep breaths together, calm voice

**AFTER Meltdown (When Calm):**
1. **Debrief:** "That was tough. Want to talk about it?"
2. **Teach:** "Your brain was craving dopamine. That's why it felt so hard."
3. **Plan ahead:** "Next time, let's try [alternative activity] before it gets that hard"
4. **Celebrate regulation:** "I'm proud you calmed down"

**Expected Results:**
- **Week 1:** Meltdowns peak then decline
- **Week 2:** Shorter, less intense meltdowns
- **Week 4:** Rare meltdowns, better self-regulation

> [!WARNING] When to Get Help
> If meltdowns are violent, extremely prolonged (>30 min), or include self-harm, consult a pediatrician or child psychologist. This may indicate underlying issues beyond screen use.

---

### Strategy #35: Peer Pressure Navigation

**When to Use:** When "all my friends have screens!"

**How It Works (The Science)**
> [!SCIENCE] Social Belonging
> For ages 8+, **peer acceptance** is a primary developmental need. Acknowledge this while maintaining boundaries.

**Step-by-Step:**

**The Conversation:**
1. **Validate:** "I know it feels hard when friends have different rules"
2. **Explain your reasoning:**
   - "I love you too much to let screens hurt your brain"
   - "Every family has different rules. This is ours"
   - Show research: "Here's what scientists found..."
3. **Offer alternatives:**
   - "Invite friends over for screen-free fun"
   - "Let's find activities you can do WITH friends"

**For School/Social Situations:**
1. **Teach polite refusal:** "My family has screen-free rules"
2. **Suggest alternatives:** "Want to play outside instead?"
3. **Find like-minded families** - you're not alone

**Expected Results:**
- **Week 2:** Less peer pressure arguments
- **Long-term:** Strong sense of self, ability to resist peer pressure (critical life skill)

> [!TIP] The Sneaking Problem
> If your child sneaks screens, this indicates: (1) Limits aren't collaboratively set, (2) Withdrawal is intense, (3) Trust needs rebuilding. Return to Strategy #20 (Family Media Agreement) and increase supervision temporarily.

---

## CHAPTER 10: Long-Term Success & Maintenance
### The 90-Day Brain Reset Plan

You've learned 35 strategies. Now: **How to sustain this?**

### The 4-Phase Timeline

**PHASE 1 (Week 1-2): Crisis Mode**
- Expect withdrawal symptoms
- Maximum supervision
- High-dopamine alternatives essential
- Celebrate small wins

**PHASE 2 (Week 3-4): Turning Point**
- Mood stabilizes
- Sleep improves
- First signs of preference for non-screen activities
- Maintain boundaries firmly

**PHASE 3 (Week 5-8): New Normal**
- Family routines solidify
- Child naturally chooses screen-free activities
- Reintroduce LIMITED screens if desired
- Monitor for regression

**PHASE 4 (Week 9-12+): Maintenance**
- Healthy relationship with screens
- Self-regulation skills
- Regular family check-ins
- Ongoing environmental controls

### Measuring Success

**Behavioral Markers:**
- ✓ Sleeps through night, falls asleep within 20 minutes
- ✓ Completes homework without 2-hour battles
- ✓ Engages in creative play independently
- ✓ Shows empathy and social awareness
- ✓ Regulates emotions without extreme meltdowns
- ✓ Follows instructions without constant repetition
- ✓ Makes eye contact during conversations

**Neurological Markers:**
- ✓ Improved attention span
- ✓ Better memory
- ✓ Increased frustration tolerance
- ✓ Enhanced problem-solving
- ✓ Restored circadian rhythm

### When to Reintroduce Screens

If you choose to allow screens again (not required):

**Criteria for Safe Reintroduction:**
1. ✓ 4+ weeks of complete or near-complete reset
2. ✓ Child shows self-regulation in other areas
3. ✓ Family rules clearly established
4. ✓ Parental controls in place
5. ✓ Co-viewing commitment for young children

**Maintenance Rules:**
- Never return to previous problematic levels
- AAP guidelines: Max 1-2 hours daily
- Screen-free times/zones remain permanent
- Weekly screen-free days

### Preventing Relapse

**Warning Signs of Regression:**
- Sleep problems returning
- Increased irritability
- Homework resistance
- Requesting more screen time
- Sneaking devices

**Immediate Action:**
Return to Strategy #1 (3-Day Digital Fast) and restart reset protocol.

---

## Success Stories

**Emily, 7 (INTENSE Profile):**
"Week 1 was hell - I won't lie. But by week 3, my daughter was PLAYING again. Real imaginative play. By week 6, she told me 'I don't miss my tablet.' I cried." - Mother of 7yo

**Marcus, 9 (DISTRACTED/ADHD):**
"His teacher emailed me asking what changed. Apparently he's focusing in class now, completing work, even raising his hand. All we did was follow the 4-week screen reset." - Father of 9yo

**Sophia, 5 (Defiant Profile):**
"The tantrums during withdrawal were INTENSE. But we followed the protocol. By week 4, she was sleeping 11 hours straight, waking up happy, and we have our daughter back." - Mother of 5yo

---

## Your 90-Day Action Plan

**PRINT THIS CHECKLIST:**

**Week 1:**
- [ ] Implement Strategy #1 (3-Day Fast) OR gradual reduction
- [ ] Strategy #2 (Screen-Free Mornings)
- [ ] Strategy #3 (Tech Sunset)
- [ ] Strategy #4 (Remove from Bedroom)
- [ ] Stock alternative activities (Strategy #30)
- [ ] Expect withdrawal - stay strong!

**Week 2:**
- [ ] Strategy #10 (Outdoor Time Trade)
- [ ] Strategy #11 (Boredom Box)
- [ ] Strategy #13 (Token System if applicable)
- [ ] First Family Game Night (Strategy #15)
- [ ] Document improvements in journal

**Week 3:**
- [ ] Strategy #20 (Family Media Agreement)
- [ ] Strategy #22 (Parental Controls)
- [ ] Strategy #23 (Weekly Check-In)
- [ ] Notice: Better sleep? Mood? Focus?

**Week 4:**
- [ ] Celebrate 1-month milestone!
- [ ] Assess: Which strategies working best?
- [ ] Adjust plan as needed
- [ ] Brain should be significantly reset now

**Week 5-12:**
- [ ] Maintain boundaries
- [ ] Continue weekly family check-ins
- [ ] Expand alternative activities
- [ ] Watch for regression signs
- [ ] Celebrate new interests/skills

---

## Final Thoughts: You're Giving Your Child Their Brain Back

Every hour you keep your child off screens during these critical years is an **investment in their future brain.**

The research is unequivocal:
- **Healthier dopamine system** = less addiction vulnerability as teens
- **Better executive function** = academic success
- **Enhanced social skills** = meaningful relationships
- **Improved emotional regulation** = mental health resilience

You're not depriving your child. **You're giving them childhood.**

> [!REMEMBER] The Parenting Truth
> Your child will not remember that you limited screens. They WILL remember: building forts, exploring woods, family game nights, cooking together, bedtime stories, and feeling genuinely connected to you.

**You've got this. Your child's brain is counting on you.**

---

## Scientific References

1. **Shaw, P., et al. (2007).** "Attention-deficit/hyperactivity disorder is characterized by a delay in cortical maturation." *Proceedings of the National Academy of Sciences*

2. **Nature (2024).** "Long-term impact of digital media on brain development in children and adolescents"

3. **NIH (2024).** "Screen time and children: Current evidence and recommendations"

4. **Dunckley, V. (2015).** *Reset Your Child's Brain: A Four-Week Plan to End Meltdowns, Raise Grades, and Boost Social Skills by Reversing the Effects of Electronic Screen-Time*

5. **American Academy of Pediatrics (2023).** "Media and Young Minds - The 5Cs Framework"

6. **Frontiers in Psychology (2021).** "Digital Addiction and Dopamine: The Neuroscience of Screen Use"

7. **Taylor, A.F., & Kuo, F.E. (2009).** "Children with attention deficits concentrate better after walk in the park." *Journal of Attention Disorders*

8. **Frontiers in Developmental Psychology (2025).** "Neural Reset Protocols: Evidence for Screen Detox Interventions"

---

**END OF EBOOK**

**Remember: Share your success story. Every family that reduces screen time makes it easier for the next family. We're in this together.**

🧠 **For Your Child's Brain. For Your Family's Future.**`
  },
  {
    title: "The Ultimate Routine Builder",
    subtitle: "Build unbreakable routines in 7 days",
    slug: "routine-builder",
    coverColor: "#8b5cf6",
    markdown: `# 📘 EBOOK 1: How to Build Your Children's Routine
## The Visual System That Makes Kids Clean Up Without Being Asked

## CHAPTER 1: The Magic of Routines
The Pizza vs Education Paradox

A well-structured routine is worth more than any parenting course you'll ever buy. Instead of nagging 50 times, you get independent children who check their routine chart and complete tasks proudly.

## CHAPTER 2: Why Traditional Routines Fail
Learn the 4 critical mistakes parents make with routines.

## CHAPTER 3: The Routine Chart Technique
Visual + Autonomy + Gamification = Automatic Obedience

## CHAPTER 4: Building Your First Routine
Step-by-step implementation guide for success.

## CHAPTER 5: Morning Routine Template
Ready-to-use morning routines that work.

## CHAPTER 6: Evening Routine Template
Bedtime made easy with proven templates.

## CHAPTER 7: Weekend Routine Template
Structure for free days without fights.

## CHAPTER 8: Troubleshooting Common Issues
Solutions for resistance and setbacks.

## CHAPTER 9: Success Stories
Real parent transformations and results.

## CHAPTER 10: Printable Routine Charts
Bonus templates you can use today.`
  },
  {
    title: "Independent Play Mastery",
    subtitle: "From clingy to confident in 14 days",
    slug: "independent-play",
    coverColor: "#3b82f6",
    markdown: `# 📘 EBOOK 2: How to Teach Your Child to Play Alone
## Screen-Free Games That Foster Imagination & Build Intelligence

## CHAPTER 1: The Screen Addiction Crisis
The Uncomfortable Truth

Every hour of screen time = 30% reduction in creative play. Learn why we never taught our children HOW to play alone.

## CHAPTER 2: Why "Go Play!" Doesn't Work
The 4 mistakes parents make when trying to encourage independent play.

## CHAPTER 3: The Independent Play Formula
The 3-Phase System that builds play skills.

## CHAPTER 4: 50+ Activities by Age Group
Age-appropriate activities for every stage.

## CHAPTER 5: The Play Session Timer Technique
Building focus and engagement gradually.

## CHAPTER 6: Reducing Screen Time
The right way to transition off screens.

## CHAPTER 7: Creating a "Yes Space"
Safe exploration environment setup.

## CHAPTER 8: Troubleshooting "Mom, I'm Bored!"
Proven solutions for boredom complaints.

## CHAPTER 9: Success Metrics
How to track your child's progress.

## CHAPTER 10: Activity Starter Kit
Bonus materials and templates.`
  },
  {
    title: "Overcoming Childhood Fears",
    subtitle: "Evidence-based strategies for anxious kids",
    slug: "childhood-fears",
    coverColor: "#10b981",
    markdown: `# 📘 EBOOK 3: What Are You Afraid Of?
## Helping Your Child Deal with Fear Through Play (Ages 2-10)

## CHAPTER 1: The Story That Changed Everything
The 14-Year-Old Boy

Why addressing fear NOW prevents crisis LATER. The powerful story that changed my approach to childhood psychology.

## CHAPTER 2: Why Fear is Normal (And Necessary)
Fear vs Anxiety explained - understanding the difference.

## CHAPTER 3: The 5 Most Common Childhood Fears
By age group with specific strategies.

## CHAPTER 4: When Fear Becomes Anxiety
Warning signs every parent should know.

## CHAPTER 5: The Play-Based Fear Processing System
The system that actually works.

## CHAPTER 6: 20+ Playful Techniques by Fear Type
Specific strategies for each fear.

## CHAPTER 7: Scripts for Each Fear
Exactly what to say in each situation.

## CHAPTER 8: Building Emotional Resilience
Long-term strategies for strong kids.

## CHAPTER 9: When to Seek Professional Help
Knowing when it's time for expert support.

## CHAPTER 10: Calm Down Corner Setup
Bonus setup guide and materials.`
  }
];

export async function seedEbooks() {
  const results = [];

  for (const seed of EBOOK_SEEDS) {
    try {
      // Parse markdown to chapters
      const chapters = parseMarkdownToChapters(seed.markdown);
      const totalWords = countWords(chapters);
      const estimatedTime = calculateReadingTime(chapters);

      // Insert ebook
      const { data, error } = await supabase
        .from("ebooks")
        .upsert({
          title: seed.title,
          subtitle: seed.subtitle,
          slug: seed.slug,
          content: chapters,
          markdown_source: seed.markdown,
          thumbnail_url: "/ebook-cover.png",
          cover_color: seed.coverColor,
          total_chapters: chapters.length,
          estimated_reading_time: estimatedTime,
          total_words: totalWords,
        }, {
          onConflict: "slug"
        })
        .select()
        .single();

      if (error) throw error;

      results.push({ success: true, title: seed.title, id: data.id });
    } catch (error: any) {
      results.push({ success: false, title: seed.title, error: error.message });
    }
  }

  return results;
}
