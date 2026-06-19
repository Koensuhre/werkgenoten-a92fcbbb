import { createFileRoute } from "@tanstack/react-router";
import { ProsList } from "./vakmensen";

export const Route = createFileRoute("/vakmensen/")({
  component: ProsList,
});