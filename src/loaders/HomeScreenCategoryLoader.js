import React from "react";
import ContentLoader, {Rect} from 'react-content-loader/native'

function HomeScreenCategoryLoader(){
    return (
       
        <ContentLoader speed={0.35}>
          <Rect x="0" y="17" rx="4" ry="4" width="120" height="50" />
          <Rect x="130" y="17" rx="4" ry="4" width="120" height="50" />
          <Rect x="260" y="17" rx="4" ry="4" width="120" height="50" />
          </ContentLoader>
      )
}

export default HomeScreenCategoryLoader;