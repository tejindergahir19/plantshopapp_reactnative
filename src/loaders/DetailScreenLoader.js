import React from "react";
import ContentLoader, {Rect} from 'react-content-loader/native'

function DetailScreenLoader(){
    return (
       
        <ContentLoader speed={0.35}>
          <Rect x="0" y="17" rx="4" ry="4" width="120" height="50" />
          <Rect x="300" y="17" rx="4" ry="4" width="60" height="50" />

          <Rect x="0" y="80" rx="4" ry="4" width="390" height="350" />
          <Rect x="0" y="450" rx="4" ry="4" width="390" height="30" />
          <Rect x="0" y="500" rx="4" ry="4" width="280" height="30" />
          <Rect x="0" y="550" rx="4" ry="4" width="390" height="30" />
          <Rect x="0" y="600" rx="4" ry="4" width="280" height="30" />
          <Rect x="0" y="650" rx="4" ry="4" width="390" height="30" />
          <Rect x="0" y="700" rx="4" ry="4" width="280" height="30" />
          </ContentLoader>
      )
}

export default DetailScreenLoader;