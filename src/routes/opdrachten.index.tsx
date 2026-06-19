import { createFileRoute } from "@tanstack/react-router";
import { JobsList } from "./opdrachten";

export const Route = createFileRoute("/opdrachten/")({
  component: JobsList,
});