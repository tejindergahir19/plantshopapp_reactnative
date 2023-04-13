import React from "react";


import ContentLoader, {Rect} from 'react-content-loader/native'

function HomeScreenItemLoader(){
    return (
       
        <ContentLoader speed={0.5}>
          <Rect x="10" y="17" rx="4" ry="4" width="160" height="120" />
          <Rect x="180" y="17" rx="4" ry="4" width="160" height="120" />
          <Rect x="10" y="145" rx="4" ry="4" width="160" height="15" />
          <Rect x="180" y="145" rx="4" ry="4" width="160" height="15" />
          <Rect x="10" y="165" rx="4" ry="4" width="160" height="15" />
          <Rect x="180" y="165" rx="4" ry="4" width="160" height="15" />
          <Rect x="10" y="185" rx="4" ry="4" width="160" height="15" />
          <Rect x="180" y="185" rx="4" ry="4" width="160" height="15" />
          <Rect x="10" y="205" rx="4" ry="4" width="160" height="15" />
          <Rect x="180" y="205" rx="4" ry="4" width="160" height="15" />
          <Rect x="10" y="225" rx="4" ry="4" width="160" height="15" />
          <Rect x="180" y="225" rx="4" ry="4" width="160" height="15" />
      
          <Rect x="10" y="267" rx="4" ry="4" width="160" height="120" />
          <Rect x="180" y="267" rx="4" ry="4" width="160" height="120" />
          <Rect x="10" y="400" rx="4" ry="4" width="160" height="15" />
          <Rect x="180" y="400" rx="4" ry="4" width="160" height="15" />
          <Rect x="10" y="420" rx="4" ry="4" width="160" height="15" />
          <Rect x="180" y="420" rx="4" ry="4" width="160" height="15" />
          <Rect x="10" y="440" rx="4" ry="4" width="160" height="15" />
          <Rect x="180" y="440" rx="4" ry="4" width="160" height="15" />
          <Rect x="10" y="460" rx="4" ry="4" width="160" height="15" />
          <Rect x="180" y="460" rx="4" ry="4" width="160" height="15" />
          <Rect x="10" y="480" rx="4" ry="4" width="160" height="15" />
          <Rect x="180" y="480" rx="4" ry="4" width="160" height="15" />
      
          {/* <Rect x="10" y="510" rx="4" ry="4" width="160" height="120" />
          <Rect x="180" y="510" rx="4" ry="4" width="160" height="120" />
          <Rect x="10" y="510" rx="4" ry="4" width="160" height="15" />
          <Rect x="180" y="510" rx="4" ry="4" width="160" height="15" /> */}
        </ContentLoader>
      )
}

export default HomeScreenItemLoader;