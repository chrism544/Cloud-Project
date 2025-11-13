"use client";
import { useNode } from "@craftjs/core";
import { VideoSettings } from "../../settings/VideoSettings";
import { dragDebugger } from "../../utils/dragDebug";

interface VideoProps {
  videoUrl?: string;
  width?: string;
  height?: string;
  autoplay?: boolean;
  controls?: boolean;
  muted?: boolean;
  loop?: boolean;
  align?: "left" | "center" | "right";
  margin?: { top?: string; right?: string; bottom?: string; left?: string };
  className?: string;
}

const getVideoEmbedUrl = (url: string): string => {
  // YouTube URL parsing
  if (url.includes("youtube.com") || url.includes("youtu.be")) {
    let videoId = "";
    if (url.includes("youtube.com/watch?v=")) {
      videoId = url.split("v=")[1]?.split("&")[0] || "";
    } else if (url.includes("youtu.be/")) {
      videoId = url.split("youtu.be/")[1]?.split("?")[0] || "";
    }
    return `https://www.youtube.com/embed/${videoId}`;
  }
  // Vimeo URL parsing
  if (url.includes("vimeo.com")) {
    const videoId = url.split("/").pop()?.split("?")[0] || "";
    return `https://player.vimeo.com/video/${videoId}`;
  }
  return url;
};

export const Video = ({
  videoUrl = "https://www.youtube.com/embed/dQw4w9WgXcQ",
  width = "100%",
  height = "500px",
  autoplay = false,
  controls = true,
  muted = false,
  loop = false,
  align = "center",
  margin = {},
  className = "",
}: VideoProps) => {
  const {
    connectors: { connect, drag },
    id,
  } = useNode();

  const marginStyle = `${margin.top || "0px"} ${margin.right || "0px"} ${margin.bottom || "0px"} ${margin.left || "0px"}`;

  const containerStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: align === "center" ? "center" : align === "right" ? "flex-end" : "flex-start",
    margin: marginStyle,
  };

  const isEmbedUrl =
    videoUrl.includes("youtube.com/embed") ||
    videoUrl.includes("player.vimeo.com") ||
    videoUrl.includes("youtu.be") ||
    videoUrl.includes("youtube.com") ||
    videoUrl.includes("vimeo.com");

  const embeddedUrl = isEmbedUrl ? getVideoEmbedUrl(videoUrl) : videoUrl;

  return (
    <div
      ref={(ref) => {
        if (ref) {
          drag(ref);
        }
      }}
      style={containerStyle}
      className={`craft-video ${className}`}
    >
      {isEmbedUrl ? (
        <iframe
          src={`${embeddedUrl}${autoplay ? "?autoplay=1" : ""}`}
          width={width}
          height={height}
          style={{
            border: "none",
            borderRadius: "8px",
          }}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title="Embedded Video"
        />
      ) : (
        <video
          src={videoUrl}
          width={width}
          height={height}
          autoPlay={autoplay}
          controls={controls}
          muted={muted}
          loop={loop}
          style={{
            borderRadius: "8px",
            objectFit: "cover",
          }}
        />
      )}
    </div>
  );
};

Video.craft = {
  displayName: "Video",
  props: {
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    width: "100%",
    height: "500px",
    autoplay: false,
    controls: true,
    muted: false,
    loop: false,
    align: "center",
    margin: {},
  },
  related: {
    settings: VideoSettings,
  },
  rules: {
    canMoveIn: () => false,
    canMoveOut: () => true,
  },
};
