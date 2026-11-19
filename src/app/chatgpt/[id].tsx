import React from "react";
import { Redirect, useLocalSearchParams } from "expo-router";
export default function LegacyImageRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <Redirect href={{ pathname: "/cover/[id]", params: { id } }} />;
}
