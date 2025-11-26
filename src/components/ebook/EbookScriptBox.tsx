interface ScriptSection {
  heading: string;
  content?: string;
  whatToSay?: string[];
}

interface EbookScriptBoxProps {
  title: string;
  sections: ScriptSection[];
}

const renderContent = (content: string): JSX.Element => {
  const elements: JSX.Element[] = [];
  let currentIndex = 0;
  let elementKey = 0;

  while (currentIndex < content.length) {
    // Check for code
    if (content[currentIndex] === '`') {
      const endIndex = content.indexOf('`', currentIndex + 1);
      if (endIndex !== -1) {
        const codeText = content.slice(currentIndex + 1, endIndex);
        elements.push(
          <code key={elementKey++} className="px-2 py-1 bg-muted/50 rounded font-mono text-sm">
            {codeText}
          </code>
        );
        currentIndex = endIndex + 1;
        continue;
      }
    }

    // Check for bold
    if (content[currentIndex] === '*' && content[currentIndex + 1] === '*') {
      const endIndex = content.indexOf('**', currentIndex + 2);
      if (endIndex !== -1) {
        const boldText = content.slice(currentIndex + 2, endIndex);
        elements.push(
          <strong key={elementKey++} className="font-bold text-foreground">
            {boldText}
          </strong>
        );
        currentIndex = endIndex + 2;
        continue;
      }
    }

    // Check for italic
    if (content[currentIndex] === '*') {
      const endIndex = content.indexOf('*', currentIndex + 1);
      if (endIndex !== -1) {
        const italicText = content.slice(currentIndex + 1, endIndex);
        elements.push(
          <em key={elementKey++} className="italic">
            {italicText}
          </em>
        );
        currentIndex = endIndex + 1;
        continue;
      }
    }

    // Regular text
    let nextSpecial = content.length;
    const nextBacktick = content.indexOf('`', currentIndex);
    const nextAsterisk = content.indexOf('*', currentIndex);

    if (nextBacktick !== -1) nextSpecial = Math.min(nextSpecial, nextBacktick);
    if (nextAsterisk !== -1) nextSpecial = Math.min(nextSpecial, nextAsterisk);

    const text = content.slice(currentIndex, nextSpecial);
    if (text.length > 0) {
      elements.push(<span key={elementKey++}>{text}</span>);
    }
    currentIndex = nextSpecial;

    if (currentIndex === nextSpecial && nextSpecial === content.length) {
      break;
    }
    if (currentIndex < content.length && nextSpecial === content.length) {
      currentIndex++;
    }
  }

  return <>{elements}</>;
};

const getSectionStyle = (heading: string) => {
  const lower = heading.toLowerCase();
  
  if (lower.includes('not') || lower.includes('traditional')) {
    return 'text-destructive';
  }
  if (lower.includes('what to say') || lower.includes('cvc response')) {
    return 'text-green-600 dark:text-green-400';
  }
  if (lower.includes('follow')) {
    return 'text-blue-600 dark:text-blue-400';
  }
  return 'text-foreground';
};

const getSectionIcon = (heading: string) => {
  const lower = heading.toLowerCase();
  
  if (lower.includes('not') || lower.includes('traditional')) {
    return '❌';
  }
  if (lower.includes('what to say') || lower.includes('cvc response')) {
    return '✅';
  }
  if (lower.includes('follow')) {
    return '📝';
  }
  return '🎯';
};

export const EbookScriptBox = ({ title, sections }: EbookScriptBoxProps) => {
  return (
    <div className="my-8 p-6 bg-accent/10 border-l-4 border-accent rounded-lg">
      <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
        <span className="text-2xl">📋</span>
        {title}
      </h3>

      <div className="space-y-6">
        {sections.map((section, index) => (
          <div key={index} className="space-y-3">
            <h4 className={`font-bold text-base flex items-center gap-2 ${getSectionStyle(section.heading)}`}>
              <span>{getSectionIcon(section.heading)}</span>
              {section.heading}
            </h4>

            {section.content && (
              <p className="text-base leading-relaxed text-foreground/90 ml-7 whitespace-pre-line">
                {renderContent(section.content)}
              </p>
            )}

            {section.whatToSay && section.whatToSay.length > 0 && (
              <ul className="space-y-2 ml-7">
                {section.whatToSay.map((phrase, phraseIndex) => (
                  <li key={phraseIndex} className="text-base leading-relaxed text-foreground/90 flex gap-2">
                    <span className="text-accent mt-1 flex-shrink-0">•</span>
                    <span className="whitespace-pre-line">{renderContent(phrase)}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
