import { useMemo } from "react";
import { Streamdown } from "streamdown";
import { mermaid } from "@streamdown/mermaid";

interface Props {
  text: string;
}

const quoteMermaidLabel = (value: string) => {
  const label = value.trim();

  if (label.startsWith('"') && label.endsWith('"')) {
    return label;
  }

  return `"${label.replaceAll('"', "&quot;")}"`;
};

const normalizeMermaid = (chart: string) => {
  // flowchart / graph 以外の Mermaid 構文には手を加えない
  if (!/^\s*(flowchart|graph)\b/im.test(chart)) {
    return chart;
  }

  let normalized = chart;

  // エッジラベル:
  // A -->|即時応答(202)| B
  // → A -->|"即時応答(202)"| B
  normalized = normalized.replace(
    /((?:-->|-.->|==>|---)\s*)\|([^|\r\n]+)\|/g,
    (_all, arrow: string, label: string) => `${arrow}|${quoteMermaidLabel(label)}|`
  );

  // サブグラフ:
  // subgraph group [表示名]
  // → subgraph group["表示名"]
  normalized = normalized.replace(
    /^(\s*subgraph\s+)([A-Za-z_]\w*)\s+\[([^\]\r\n]+)\]\s*$/gm,
    (_all, prefix: string, id: string, label: string) =>
      `${prefix}${id}[${quoteMermaidLabel(label)}]`
  );

  // DBなどの円筒形:
  // DB[(PostgreSQL RDS)]
  // → DB[("PostgreSQL RDS")]
  normalized = normalized.replace(
    /\b([A-Za-z_]\w*)\[\(([^()\r\n]*)\)\]/g,
    (_all, id: string, label: string) => `${id}[(${quoteMermaidLabel(label)})]`
  );

  // 通常の四角形ノード:
  // Worker1[ワーカー1 (Spring)]
  // → Worker1["ワーカー1 (Spring)"]
  normalized = normalized.replace(
    /\b([A-Za-z_]\w*)\[([^\\[\]\r\n]+)\]/g,
    (all, id: string, label: string) => {
      const trimmed = label.trim();

      // 円筒形 `[(...)]` は上で処理済みなので保持する
      if (trimmed.startsWith("(") && trimmed.endsWith(")")) {
        return all;
      }

      return `${id}[${quoteMermaidLabel(label)}]`;
    }
  );

  return normalized;
};

const normalizeMarkdownMermaid = (markdown: string) =>
  markdown.replace(
    /```mermaid\s*\r?\n([\s\S]*?)```/g,
    (_, chart: string) => `\`\`\`mermaid\n${normalizeMermaid(chart)}\n\`\`\``
  );

export const MarkdownViewerV2 = ({ text }: Props) => {
  const normalizedText = useMemo(() => normalizeMarkdownMermaid(text), [text]);

  return (
    <div className="custom-markdown">
      <Streamdown mode="static" plugins={{ mermaid }}>
        {normalizedText}
      </Streamdown>
    </div>
  );
};
