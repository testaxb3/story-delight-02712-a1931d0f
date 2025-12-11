-- Insert Lesson 1: Understand Your Triggers
INSERT INTO public.lessons (day_number, title, content, summary, estimated_minutes)
VALUES (
  1,
  'Understand Your Triggers',
  '<h2>Why We Yell</h2>
<p>As a parent, you probably know what it''s like to feel powerless when your kid doesn''t listen to you. It''s in these moments of frustration and hopelessness that you might resort to yelling.</p>
<p>This outburst can happen anywhere, but the stakes may feel higher in public because of the added pressure. It compels you to resolve the situation quickly, and you may resort to raising your voice, making threats, or delivering impromptu lectures.</p>
<p>Your emotional state causes you to lose sight of rational, productive, and constructive responses.</p>

<h2>Recognize Your Triggers</h2>
<p>The first step in overcoming this challenge is to learn to stay calm and collected in stressful situations. This entails recognizing your triggers.</p>
<p>Have you ever wondered why you feel calmer about your child''s tantrums on some days, but not on others? This difference is often in specific internal and external triggers that push you towards anger.</p>

<h3>Internal Triggers</h3>
<ul>
<li><strong>Feeling tired or sick:</strong> When your energy is low, your patience runs thin.</li>
<li><strong>Unrealistic expectations of your child:</strong> Expecting too much from your child can set both of you up for frustration.</li>
<li><strong>Stress or anxiety:</strong> The weight of everyday stress and anxiety can make even minor issues feel overwhelming.</li>
<li><strong>Not knowing what to do:</strong> Uncertainty can amplify your frustration and make you feel out of control.</li>
<li><strong>Your child reminding you of someone you dislike:</strong> Personal associations can trigger strong emotional reactions.</li>
</ul>

<h3>External Triggers</h3>
<ul>
<li><strong>Other people''s expectations:</strong> The pressure to meet societal or familial expectations can be overwhelming.</li>
<li><strong>Comparing yourself with other parents:</strong> Seeing other parents who appear to have it all together can make you feel inadequate.</li>
<li><strong>Your child misbehaving in public:</strong> Public misbehavior can add the stress of judgment from others to an already challenging situation.</li>
</ul>

<h3>Deeper Emotional Triggers</h3>
<ul>
<li><strong>Feeling unheard:</strong> Daily experiences where you feel your concerns or needs are ignored can intensify frustration.</li>
<li><strong>Unequal parenting load:</strong> Feeling like you''re handling more than your partner can lead to resentment.</li>
<li><strong>Influence of upbringing:</strong> Your parents'' parenting style can affect your reactions today.</li>
<li><strong>Burnout:</strong> Persistent exhaustion from parenting demands can erode your patience.</li>
<li><strong>Isolation:</strong> Feeling disconnected from friends or community can increase stress.</li>
</ul>

<h2>Understand Your Triggers</h2>
<p>To overcome the pattern of yelling, you must identify your triggers and understand them. You can do this by using the Diary, noting down examples of situations that provoke your outbursts. Afterward, review these entries to identify any recurring patterns.</p>

<h3>Reflection Template</h3>
<ul>
<li><strong>Situation:</strong> Describe the situations that made you angry</li>
<li><strong>Thought:</strong> What did you think right before the outburst?</li>
<li><strong>Emotion:</strong> How did the outburst make you feel?</li>
<li><strong>Bodily Sensations:</strong> How did you feel physically?</li>
<li><strong>My Reaction:</strong> Is this your normal reaction?</li>
<li><strong>Appropriate Reaction:</strong> How can you avoid such outbursts in the future?</li>
</ul>

<h2>Triggers from the Past</h2>
<p>While yelling at your children, you might be unknowingly passing down negative patterns you adopted from your own parents. To nurture a more caring and healthy family bond, you need to break this cycle.</p>

<h3>Steps to Break the Cycle</h3>
<ol>
<li><strong>Look Back at Your Upbringing:</strong> Reflect on how your parents raised you. Did they do something you wish you could change?</li>
<li><strong>Notice Your Emotions:</strong> What is your immediate reaction to your child''s misbehaviors? Is there a chance this reaction is caused by your experiences with your parents?</li>
<li><strong>Understand Your Emotions:</strong> If you notice strong emotions when your child behaves a certain way, take a pause and think about it.</li>
</ol>

<h2>Today''s Action</h2>
<p>Pinpoint the things that often make you lose your cool and end up shouting. Figuring out these triggers is the first step to handling them.</p>
<p><strong>Tomorrow:</strong> You''ll discover what studies say about yelling and how it impacts your child''s development.</p>',
  'Learn to identify your internal, external, and emotional triggers that lead to yelling. Recognize patterns from your past and use reflection techniques to break the cycle.',
  8
)
ON CONFLICT (day_number) DO UPDATE SET
  title = EXCLUDED.title,
  content = EXCLUDED.content,
  summary = EXCLUDED.summary,
  estimated_minutes = EXCLUDED.estimated_minutes,
  updated_at = NOW();