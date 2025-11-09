import { Render, Data } from "@measured/puck";
import { config } from "@/lib/puck/config";

type PageRendererProps = {
  data: Data;
};

export default function PageRenderer({ data }: PageRendererProps) {
  return <Render config={config} data={data} />;
}
