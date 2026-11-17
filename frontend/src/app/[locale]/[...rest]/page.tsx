import { createMetadata } from "@/utils/createMetadata";
import { notFound } from "next/navigation";

export const instant = false;

export async function generateMetadata() {
  return createMetadata({
    namespace: "common.not_found",
  });
}
export default function CatchAll() {
  notFound();
}
