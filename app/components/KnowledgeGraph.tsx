"use client";

import { useEffect, useRef, useCallback } from "react";
import * as d3 from "d3";
import { useRouter } from "next/navigation";

// ─────────────────────────────────────────────────────────────────────────────
// Types (match data/indexes/graph.json schema)
// ─────────────────────────────────────────────────────────────────────────────

export interface GraphNode {
  id: string;
  type: "topic" | "source" | "course";
  label?: string;
  slug?: string;
  topic_slug?: string;
  source_count?: number;
  tweet_url?: string;
  // D3 adds these at runtime:
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
  fx?: number | null;
  fy?: number | null;
}

export interface GraphLink {
  source: string | GraphNode;
  target: string | GraphNode;
  type: string;
}

export interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
  node_count?: number;
  edge_count?: number;
}

interface Props {
  data: GraphData;
  width?: number;
  height?: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

// Palette is read from the live Nocturne CSS tokens (see buildPalette) so the
// graph re-skins with the theme instead of using fixed hexes.
function readVar(css: CSSStyleDeclaration, name: string, fallback: string): string {
  return css.getPropertyValue(name).trim() || fallback;
}

function buildPalette() {
  const css = getComputedStyle(document.documentElement);
  return {
    node: {
      topic:  readVar(css, "--rose", "#f2789f"),
      source: readVar(css, "--blue", "#6ea8ff"),
      course: readVar(css, "--gold", "#f3c14b"),
    } as Record<string, string>,
    nodeFallback: readVar(css, "--muted", "#8990ad"),
    link: {
      belongs_to: readVar(css, "--border-strong", "#38405c"),
      tagged:     readVar(css, "--border", "#262c40"),
      wiki_link:  readVar(css, "--rose", "#f2789f"),
      cites:      readVar(css, "--green", "#56d6a0"),
    } as Record<string, string>,
    linkFallback: readVar(css, "--border-strong", "#38405c"),
    stroke: readVar(css, "--bg", "#0a0c14"),
    labelFill: readVar(css, "--text", "#eceefb"),
    labelHalo: readVar(css, "--bg", "#0a0c14"),
  };
}

function nodeRadius(node: GraphNode): number {
  if (node.type === "topic") return 10 + Math.min((node.source_count ?? 0) * 1.5, 18);
  return 5;
}

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

export default function KnowledgeGraph({ data, width = 900, height = 600 }: Props) {
  const svgRef  = useRef<SVGSVGElement>(null);
  const router  = useRouter();

  const navigate = useCallback((node: GraphNode) => {
    if (node.type === "topic" && node.slug) {
      router.push(`/wiki/${node.slug}`);
    } else if (node.type === "source" && node.tweet_url) {
      window.open(node.tweet_url, "_blank", "noopener,noreferrer");
    }
  }, [router]);

  useEffect(() => {
    if (!svgRef.current || !data?.nodes?.length) return;

    const palette = buildPalette();

    // Deep clone nodes/links so D3 can mutate them safely
    const nodes: GraphNode[] = data.nodes.map((n) => ({ ...n }));
    const nodeIds = new Set(nodes.map((n) => n.id));
    const links: GraphLink[] = data.links
      .map((l) => ({
        source: typeof l.source === "string" ? l.source : (l.source as GraphNode).id,
        target: typeof l.target === "string" ? l.target : (l.target as GraphNode).id,
        type: l.type,
      }))
      // Filter out edges whose endpoints don't exist in the node list
      .filter((l) => nodeIds.has(l.source as string) && nodeIds.has(l.target as string));

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    // Zoom container
    const container = svg.append("g");

    svg.call(
      d3.zoom<SVGSVGElement, unknown>()
        .scaleExtent([0.2, 4])
        .on("zoom", (event) => {
          container.attr("transform", event.transform);
        })
    );

    // ── Simulation ────────────────────────────────────────────────────────
    const simulation = d3.forceSimulation<GraphNode>(nodes)
      .force("link", d3.forceLink<GraphNode, GraphLink>(links)
        .id((d) => d.id)
        .distance((l) => (l.type === "wiki_link" ? 80 : 120))
        .strength(0.6)
      )
      .force("charge", d3.forceManyBody().strength(-200))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide<GraphNode>().radius((d) => nodeRadius(d) + 6));

    // ── Links ─────────────────────────────────────────────────────────────
    const linkSel = container.append("g")
      .attr("stroke-opacity", 0.45)
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke", (d) => palette.link[d.type] ?? palette.linkFallback)
      .attr("stroke-width", (d) => d.type === "wiki_link" ? 1.5 : 1);

    // ── Nodes ─────────────────────────────────────────────────────────────
    const nodeSel = container.append("g")
      .selectAll<SVGCircleElement, GraphNode>("circle")
      .data(nodes)
      .join("circle")
      .attr("r", nodeRadius)
      .attr("fill", (d) => palette.node[d.type] ?? palette.nodeFallback)
      .attr("stroke", palette.stroke)
      .attr("stroke-width", 1.5)
      .attr("cursor", (d) => d.type === "topic" || d.tweet_url ? "pointer" : "default")
      .call(
        d3.drag<SVGCircleElement, GraphNode>()
          .on("start", (event, d) => {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x; d.fy = d.y;
          })
          .on("drag", (event, d) => { d.fx = event.x; d.fy = event.y; })
          .on("end", (event, d) => {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null; d.fy = null;
          })
      )
      .on("click", (_event, d) => navigate(d));

    // ── Labels (only for topic nodes) ─────────────────────────────────────
    const labelSel = container.append("g")
      .selectAll<SVGTextElement, GraphNode>("text")
      .data(nodes.filter((n) => n.type === "topic"))
      .join("text")
      .text((d) => d.label ?? d.slug ?? d.id)
      .attr("font-size", "11px")
      .attr("fill", palette.labelFill)
      .attr("stroke", palette.labelHalo)
      .attr("stroke-width", "2.5")
      .attr("paint-order", "stroke")
      .attr("pointer-events", "none")
      .attr("text-anchor", "middle")
      .attr("dy", (d) => -(nodeRadius(d) + 4));

    // ── Tooltips ──────────────────────────────────────────────────────────
    nodeSel.append("title").text((d) => {
      const parts = [d.label ?? d.id, `Type: ${d.type}`];
      if (d.source_count) parts.push(`Sources: ${d.source_count}`);
      return parts.join("\n");
    });

    // ── Tick ──────────────────────────────────────────────────────────────
    simulation.on("tick", () => {
      linkSel
        .attr("x1", (d) => (d.source as GraphNode).x ?? 0)
        .attr("y1", (d) => (d.source as GraphNode).y ?? 0)
        .attr("x2", (d) => (d.target as GraphNode).x ?? 0)
        .attr("y2", (d) => (d.target as GraphNode).y ?? 0);

      nodeSel
        .attr("cx", (d) => d.x ?? 0)
        .attr("cy", (d) => d.y ?? 0);

      labelSel
        .attr("x", (d) => d.x ?? 0)
        .attr("y", (d) => d.y ?? 0);
    });

    return () => { simulation.stop(); };
  }, [data, width, height, navigate]);

  return (
    <svg
      ref={svgRef}
      width={width}
      height={height}
      style={{
        background: "var(--bg, #0d1117)",
        borderRadius: "12px",
        border: "1px solid var(--border, #21262d)",
        display: "block",
        width: "100%",
      }}
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="xMidYMid meet"
    />
  );
}
