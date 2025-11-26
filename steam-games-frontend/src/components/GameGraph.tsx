import { useMemo, useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { GameDetail } from "../types";
import ForceGraph2D from "react-force-graph-2d";

interface Props {
  game: GameDetail;
}

const GROUP_COLORS: { [key: string]: string } = {
  game: "#422ad5",
  publisher: "#00d3bb",
  genre: "#e0e7ff",
  tag: "#f43098",
};

export default function GameGraph({ game }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [hoveredNode, setHoveredNode] = useState<any>(null);
  const navigate = useNavigate();

  const handlePublisherClick = (publisher: string) => {
    navigate(`/publishers/${encodeURIComponent(publisher)}`);
  };

  const handleCategoryClick = (category: string) => {
    navigate(`/categories/${encodeURIComponent(category)}`);
  };

  useEffect(() => {
    if (containerRef.current) {
      setDimensions({
        width: containerRef.current.clientWidth,
        height: containerRef.current.clientHeight,
      });
    }
  }, [containerRef]);

  const graphData = useMemo(() => {
    const nodes: any[] = [];
    const links: any[] = [];

    nodes.push({ id: game.name, group: "game", color: GROUP_COLORS.game });

    game.publishers.forEach((pub) => {
      nodes.push({
        id: pub,
        group: "publisher",
        color: GROUP_COLORS.publisher,
      });
      links.push({ source: game.name, target: pub });
    });

    game.genres.forEach((genre) => {
      nodes.push({ id: genre, group: "genre", color: GROUP_COLORS.genre });
      links.push({ source: game.name, target: genre });
    });

    game.tags.forEach((tag) => {
      nodes.push({ id: tag, group: "tag", color: GROUP_COLORS.tag });
      links.push({ source: game.name, target: tag });
    });

    return {
      nodes: Array.from(new Map(nodes.map((n) => [n.id, n])).values()),
      links,
    };
  }, [game]);

  if (dimensions.width === 0 || dimensions.height === 0) {
    return (
      <div ref={containerRef} className="w-full h-full">
        Loading Graph...
      </div>
    );
  }

  return (
    <div ref={containerRef} className="w-full h-full shadow-md bg-base-200">
      <ForceGraph2D
        width={dimensions.width}
        height={dimensions.height}
        graphData={graphData}
        nodeRelSize={8}
        nodeCanvasObjectMode={() => "after"}
        linkColor={() => "#999"}
        linkDirectionalArrowLength={3}
        linkDirectionalArrowRelPos={1}
        enableNodeDrag={true}
        enableZoomInteraction={true}
        enablePanInteraction={false}
        onNodeClick={(node: any) => {
          switch (node.group) {
            case "publisher":
              handlePublisherClick(node.id);
              break;
            case "tag":
              handleCategoryClick(node.id);
              break;
            case "genre":
            case "game":
              break;
          }
        }}
        onNodeHover={(node) => {
          setHoveredNode(node);
          document.body.style.cursor = node ? "pointer" : "default";
        }}
        nodeCanvasObject={(node: any, ctx, globalScale) => {
          const isHovered = node === hoveredNode;
          const r = (node.size || 6) * (isHovered ? 1.6 : 1);

          ctx.beginPath();
          ctx.arc(node.x, node.y, r, 0, 2 * Math.PI, false);
          ctx.fillStyle = node.color;
          ctx.fill();

          const fontSize = 12 / globalScale;
          ctx.font = `${fontSize}px Sans-Serif`;
          ctx.fillStyle = "black";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(node.id, node.x, node.y);
        }}
      />
    </div>
  );
}
