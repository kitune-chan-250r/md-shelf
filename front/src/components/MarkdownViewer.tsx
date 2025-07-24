import { Fragment, useCallback, useEffect, useState } from "react";
import Markdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";

const CodeBlock = ({ inline, className, children }: any) => {
  if (inline) {
    return <code className={className}>{children}</code>;
  }

  const match = /language-(\w+)/.exec(className || "");
  if (!match) {
    return <code className={className}>{children}</code>;
  }

  const lang = match && match[1] ? match[1] : "";

  return (
    <SyntaxHighlighter style={atomDark} language={lang}>
      {String(children).replace(/\n$/, "")}
    </SyntaxHighlighter>
  );
};

const AnchorTag = ({ node, children, ...props }: any) => {
  try {
    new URL(props.href ?? "");
    props.target = "_blank";
    props.rel = "noopener noreferrer";
  } catch (e) {}
  return <a {...props}>{children}</a>;
};

export const MarkdownViewer = () => {
  const [markdownText, setMarkdownText] = useState("");

  const fetchMarkDown = useCallback(async (filename: string) => {
    const response = await fetch(`/${filename}`);
    if (response.ok) {
      setMarkdownText(await response.text());
    } else {
      console.warn("fetchMarkDown faild");
    }
  }, []);

  useEffect(() => {
    void (async () => {
      await fetchMarkDown("actix-web-module-structure.md");
    })();
  }, [fetchMarkDown]);

  return (
    <Fragment>
      <Markdown components={{ a: AnchorTag, code: CodeBlock }}>{markdownText}</Markdown>
      <div style={{ paddingBottom: 150 }}></div>
    </Fragment>
  );
};
