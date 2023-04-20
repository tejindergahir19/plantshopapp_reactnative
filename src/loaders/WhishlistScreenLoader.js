import React from "react";
import ContentLoader, { Rect } from "react-content-loader/native";

function WhishlistScreenLoader() {
  return (
    <ContentLoader speed={0.35}>
      <Rect x="0" y="17" rx="4" ry="4" width="400" height="80" />

      <Rect x="0" y="107" rx="4" ry="4" width="400" height="80" />
      <Rect x="0" y="197" rx="4" ry="4" width="400" height="80" />
      <Rect x="0" y="287" rx="4" ry="4" width="400" height="80" />
      <Rect x="0" y="377" rx="4" ry="4" width="400" height="80" />
      <Rect x="0" y="467" rx="4" ry="4" width="400" height="80" />
      <Rect x="0" y="557" rx="4" ry="4" width="400" height="80" />
    </ContentLoader>
  );
}

export default WhishlistScreenLoader;
