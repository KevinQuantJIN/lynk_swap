"use client";
import dynamic from "next/dynamic";

export default function AppPage() {
  const WidgetPage = dynamic(
    async () => {
      return (await import("../components/lifiwidget")).WidgetPage;
    },
    {
      ssr: false,
    }
  );
  return <WidgetPage />;
}
